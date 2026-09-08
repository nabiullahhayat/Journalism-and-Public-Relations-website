import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import useAuthStore, { getAccessToken, getRefreshToken } from '../store/authStore';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    user,
    isAuthenticated,
    isLoading,
    setAuth,
    setUser,
    logout: clearAuth,
    setLoading,
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isAdmin,
  } = useAuthStore();

  // Initialize auth only for admin routes (skip API calls on public pages)
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      const refreshToken = getRefreshToken();
      const storedUser = localStorage.getItem('user');

      if (!token && !refreshToken && !storedUser) {
        setIsInitialized(true);
        return;
      }

      try {
        setLoading(true);

        const status = await authAPI.checkAuth();
        if (!status.authenticated) {
          if (refreshToken) {
            const refreshed = await authAPI.refreshToken(refreshToken);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshed.data;
            let parsedUser = null;
            try {
              parsedUser = storedUser ? JSON.parse(storedUser) : null;
            } catch {
              parsedUser = null;
            }
            setAuth(parsedUser, newAccessToken, newRefreshToken || refreshToken);
          } else {
            clearAuth();
            setIsInitialized(true);
            return;
          }
        }

        const profile = await authAPI.getProfile();
        setAuth(profile.data, getAccessToken(), getRefreshToken());
      } catch (error) {
        console.error('Token validation failed:', error);
        clearAuth();
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    if (!location.pathname.startsWith('/admin')) {
      setIsInitialized(true);
      return;
    }

    initAuth();
  }, [location.pathname]);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { admin, accessToken, refreshToken } = response.data || {};

      if (!accessToken) {
        throw new Error('Login succeeded but no access token was returned');
      }

      setAuth(admin, accessToken, refreshToken);
      
      toast.success('Login successful!');
      navigate('/admin/dashboard');
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      
      toast.success('Registration successful! Please login.');
      navigate('/admin/login');
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      // Even if API call fails, clear local state
      clearAuth();
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(data);
      setUser(response.data);
      toast.success('Profile updated successfully');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwords) => {
    try {
      setLoading(true);
      await authAPI.changePassword(passwords);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await authAPI.forgotPassword(email);
      toast.success('Password reset link sent to your email');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to send reset link';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await authAPI.resetPassword(token, newPassword);
      toast.success('Password reset successful! Please login.');
      navigate('/admin/login');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
