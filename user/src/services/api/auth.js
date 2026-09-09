import {
  STORAGE_KEYS,
  getCollection,
  findById,
  createItem,
  updateItem,
  deleteItem,
  formatAdmin,
} from '../storage/db.js';
import { delay, success, paginate, stripPassword } from '../storage/helpers.js';

export const authAPI = {
  login: async (credentials) => {
    await delay();
    const { username, password } = credentials || {};
    const admins = getCollection(STORAGE_KEYS.ADMINS);
    const admin = admins.find(
      (a) =>
        (a.username === username || a.email === username) &&
        a.password === password &&
        a.isActive !== false
    );

    if (!admin) {
      throw { message: 'Invalid username or password' };
    }

    const safe = formatAdmin(admin);
    return success('Login successful', {
      admin: safe,
      accessToken: `local-token-${admin.id}`,
      refreshToken: `local-refresh-${admin.id}`,
    });
  },

  register: async () => {
    await delay();
    return success('Registration is disabled in offline mode');
  },

  logout: async () => {
    await delay();
    return success('Logged out successfully');
  },

  refreshToken: async () => {
    await delay();
    const token = `local-token-${Date.now()}`;
    return success('Token refreshed', { accessToken: token, refreshToken: token });
  },

  getProfile: async () => {
    await delay();
    const userId = localStorage.getItem('faculty_current_user_id');
    if (!userId) throw { message: 'Not authenticated' };
    const admin = findById(STORAGE_KEYS.ADMINS, userId);
    if (!admin) throw { message: 'User not found' };
    return success('Profile retrieved', formatAdmin(admin));
  },

  updateProfile: async (data) => {
    await delay();
    const userId = localStorage.getItem('faculty_current_user_id');
    if (!userId) throw { message: 'Not authenticated' };

    const admins = getCollection(STORAGE_KEYS.ADMINS);
    const existing = admins.find(
      (a) => a.id !== userId && (a.email === data.email || a.username === data.username)
    );
    if (existing) throw { message: 'Username or email already in use' };

    const updated = updateItem(STORAGE_KEYS.ADMINS, userId, {
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
    });

    return success('Profile updated', formatAdmin(updated));
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    await delay();
    const userId = localStorage.getItem('faculty_current_user_id');
    if (!userId) throw { message: 'Not authenticated' };

    const admin = findById(STORAGE_KEYS.ADMINS, userId);
    if (!admin || admin.password !== currentPassword) {
      throw { message: 'Current password is incorrect' };
    }

    updateItem(STORAGE_KEYS.ADMINS, userId, { password: newPassword });
    return success('Password changed successfully');
  },

  forgotPassword: async () => {
    await delay();
    return success('Password reset is not available in offline mode');
  },

  resetPassword: async () => {
    await delay();
    return success('Password reset is not available in offline mode');
  },

  checkAuth: async () => {
    await delay();
    const userId = localStorage.getItem('faculty_current_user_id');
    if (!userId) return success('Not authenticated', null);
    const admin = findById(STORAGE_KEYS.ADMINS, userId);
    return success('Authenticated', formatAdmin(admin));
  },
};

export const setCurrentUserId = (userId) => {
  if (userId) localStorage.setItem('faculty_current_user_id', userId);
  else localStorage.removeItem('faculty_current_user_id');
};

export const getAdmins = () => getCollection(STORAGE_KEYS.ADMINS).map(stripPassword);
