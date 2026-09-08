import axios from 'axios';
import useAuthStore, { getAccessToken, getRefreshToken, clearAuthStorage, isRecentLoginWindow } from '../../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

const API_DEBUG = import.meta.env.VITE_DEBUG_API === 'true';

const isPublicAuthRequest = (url = '') => {
  const path = url.replace(API_BASE_URL, '');
  return (
    path.includes('/auth/login') ||
    path.includes('/auth/register') ||
    path.includes('/auth/refresh-token')
  );
};

const setAuthHeader = (config, token) => {
  if (!token) {
    if (config.headers?.delete) {
      config.headers.delete('Authorization');
    } else {
      delete config.headers?.Authorization;
    }
    return;
  }

  const value = `Bearer ${token}`;
  if (config.headers?.set) {
    config.headers.set('Authorization', value);
  } else {
    config.headers = { ...config.headers, Authorization: value };
  }
};

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data?.data || {};
    if (!accessToken) {
      throw new Error('Refresh response missing access token');
    }

    useAuthStore.getState().setTokens(accessToken, newRefreshToken || refreshToken);
    return accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || '';

    if (!isPublicAuthRequest(url)) {
      setAuthHeader(config, getAccessToken());
    } else {
      setAuthHeader(config, null);
    }

    if (API_DEBUG) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (API_DEBUG) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';

    if (API_DEBUG || (status && status >= 500)) {
      console.error('[API Response Error]', {
        url: requestUrl,
        status,
        data: error.response?.data,
      });
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (isPublicAuthRequest(requestUrl)) {
        return Promise.reject({
          message: error.response?.data?.message || error.message || 'Authentication failed',
          status,
          data: error.response?.data,
          original: error,
        });
      }

      originalRequest._retry = true;

      if (getRefreshToken()) {
        try {
          const accessToken = await refreshAccessToken();
          setAuthHeader(originalRequest, accessToken);
          return apiClient(originalRequest);
        } catch (refreshError) {
          if (!isRecentLoginWindow()) {
            clearAuthStorage();
          }
          return Promise.reject({
            message: refreshError.message || 'Session expired',
            status: 401,
            original: refreshError,
          });
        }
      }

      if (!isRecentLoginWindow()) {
        clearAuthStorage();
      }
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status,
      data: error.response?.data,
      original: error,
    });
  }
);

export default apiClient;
