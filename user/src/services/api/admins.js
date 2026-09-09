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

export const adminsAPI = {
  getAll: async (params = {}) => {
    await delay();
    const items = getCollection(STORAGE_KEYS.ADMINS).map(formatAdmin);
    const { data, pagination } = paginate(items, {
      ...params,
      searchFields: ['username', 'email', 'fullName'],
    });
    return success('Admins retrieved successfully', data, { pagination });
  },

  getById: async (id) => {
    await delay();
    const admin = findById(STORAGE_KEYS.ADMINS, id);
    if (!admin) throw { message: 'Admin not found', status: 404 };
    return success('Admin retrieved successfully', formatAdmin(admin));
  },

  getStats: async () => {
    await delay();
    const admins = getCollection(STORAGE_KEYS.ADMINS);
    return success('Admin stats retrieved', {
      total: admins.length,
      active: admins.filter((a) => a.isActive !== false).length,
      byRole: admins.reduce((acc, a) => {
        acc[a.role] = (acc[a.role] || 0) + 1;
        return acc;
      }, {}),
    });
  },

  create: async (data) => {
    await delay();
    const admins = getCollection(STORAGE_KEYS.ADMINS);
    const existing = admins.find((a) => a.email === data.email || a.username === data.username);
    if (existing) throw { message: `Admin with this ${existing.email === data.email ? 'email' : 'username'} already exists` };

    if (!data.password) throw { message: 'Password is required' };

    const admin = createItem(STORAGE_KEYS.ADMINS, {
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName || null,
      role: data.role || 'admin',
      phone: data.phone || null,
      departmentId: data.departmentId || null,
      isActive: data.isActive !== false,
    });

    return success('Admin created successfully', formatAdmin(admin));
  },

  update: async (id, data) => {
    await delay();
    const admin = findById(STORAGE_KEYS.ADMINS, id);
    if (!admin) throw { message: 'Admin not found', status: 404 };

    const payload = { ...data };
    delete payload.password;

    if (payload.email && payload.email !== admin.email) {
      const conflict = getCollection(STORAGE_KEYS.ADMINS).find((a) => a.email === payload.email && a.id !== id);
      if (conflict) throw { message: 'Email already in use' };
    }

    const updated = updateItem(STORAGE_KEYS.ADMINS, id, payload);
    return success('Admin updated successfully', formatAdmin(updated));
  },

  delete: async (id) => {
    await delay();
    const admin = findById(STORAGE_KEYS.ADMINS, id);
    if (!admin) throw { message: 'Admin not found', status: 404 };
    if (admin.role === 'superadmin') {
      const superCount = getCollection(STORAGE_KEYS.ADMINS).filter((a) => a.role === 'superadmin').length;
      if (superCount <= 1) throw { message: 'Cannot delete the last superadmin' };
    }
    deleteItem(STORAGE_KEYS.ADMINS, id);
    return success('Admin deleted successfully');
  },

  changePassword: async (id, passwords) => {
    await delay();
    const admin = findById(STORAGE_KEYS.ADMINS, id);
    if (!admin) throw { message: 'Admin not found', status: 404 };
    updateItem(STORAGE_KEYS.ADMINS, id, { password: passwords.newPassword });
    return success('Password changed successfully');
  },

  toggleStatus: async (id) => {
    await delay();
    const admin = findById(STORAGE_KEYS.ADMINS, id);
    if (!admin) throw { message: 'Admin not found', status: 404 };
    const updated = updateItem(STORAGE_KEYS.ADMINS, id, { isActive: !admin.isActive });
    return success('Status updated', formatAdmin(updated));
  },
};
