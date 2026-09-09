import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI, setCurrentUserId } from '../services/api/auth';
import useAuthStore, { markRecentLogin, clearRecentLogin } from '../store/authStore';
import toast from 'react-hot-toast';
import { ADMIN_ROUTES, needsAuthInit } from '../config/routes';

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
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [isInitialized, setIsInitialized] = useState(() => !needsAuthInit(window.location.pathname));

  const {
    user,
    isAuthenticated,
    setAuth,
    setUser,
    logout: clearAuth,
    setLoading,
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isAdmin,
  } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!needsAuthInit(location.pathname)) {
      setIsInitialized(true);
      return;
    }

    if (user?.id) {
      setCurrentUserId(user.id);
    }

    setIsInitialized(true);
  }, [location.pathname, hasHydrated, user?.id]);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { admin, accessToken, refreshToken } = response.data || {};

    if (!accessToken || !admin) {
      throw new Error('Login succeeded but session data was incomplete');
    }

    markRecentLogin();
    setCurrentUserId(admin.id);
    setAuth(admin, accessToken, refreshToken);
    setIsInitialized(true);

    toast.success('Login successful!');
    navigate(ADMIN_ROUTES.dashboard, { replace: true });

    return { success: true, data: response.data };
  };

  const register = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      toast.success('Registration successful! Please login.');
      navigate(ADMIN_ROUTES.login);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    }

    clearRecentLogin();
    setCurrentUserId(null);
    clearAuth();
    setIsInitialized(true);
    toast.success('Logged out successfully');
    navigate(ADMIN_ROUTES.login, { replace: true });
  };

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

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await authAPI.forgotPassword(email);
      toast.success('Password reset is not available in offline mode');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to send reset link';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await authAPI.resetPassword(token, newPassword);
      toast.success('Password reset successful! Please login.');
      navigate(ADMIN_ROUTES.login);
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
    isLoading: !hasHydrated,
    isInitialized: isInitialized && hasHydrated,
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
