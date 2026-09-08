import axios from 'axios';
import useAuthStore, { getAccessToken, getRefreshToken, syncAuthToStorage } from '../../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

const API_DEBUG = import.meta.env.VITE_DEBUG_API === 'true';

const isAdminAppRoute = () => {
  const path = window.location.pathname;
  return path.startsWith('/admin') && path !== '/admin/login';
};

const clearAuthStorage = () => {
  useAuthStore.getState().logout();
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
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data?.data || {};
    if (!accessToken) {
      throw new Error('Refresh response missing access token');
    }

    const state = useAuthStore.getState();
    useAuthStore.setState({
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
      isAuthenticated: true,
      user: state.user,
    });
    syncAuthToStorage(useAuthStore.getState());

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
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    if (API_DEBUG) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
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
      if (requestUrl.includes('/auth/refresh-token') || requestUrl.includes('/auth/login')) {
        clearAuthStorage();
        if (isAdminAppRoute()) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (getRefreshToken()) {
        try {
          const accessToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          clearAuthStorage();
          if (isAdminAppRoute()) {
            window.location.href = '/admin/login';
          }
          return Promise.reject(refreshError);
        }
      }

      clearAuthStorage();
      if (isAdminAppRoute()) {
        window.location.href = '/admin/login';
      }
    }

    if (status === 403) {
      console.error('Access forbidden - insufficient permissions');
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
