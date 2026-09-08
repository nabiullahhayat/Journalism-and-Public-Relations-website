import apiClient from './client';

export const adminsAPI = {
  // Get all admins (superadmin/admin only)
  getAll: async (params = {}) => {
    const response = await apiClient.get('/admins', { params });
    return response.data;
  },

  // Get admin by ID (superadmin/admin only)
  getById: async (id) => {
    const response = await apiClient.get(`/admins/${id}`);
    return response.data;
  },

  // Get admin statistics (superadmin only)
  getStats: async () => {
    const response = await apiClient.get('/admins/stats');
    return response.data;
  },

  // Create admin (superadmin only)
  create: async (data) => {
    const response = await apiClient.post('/admins', data);
    return response.data;
  },

  // Update admin (superadmin/admin - own account)
  update: async (id, data) => {
    const response = await apiClient.put(`/admins/${id}`, data);
    return response.data;
  },

  // Delete admin (superadmin only)
  delete: async (id) => {
    const response = await apiClient.delete(`/admins/${id}`);
    return response.data;
  },

  // Change admin password (superadmin only)
  changePassword: async (id, passwords) => {
    const response = await apiClient.put(`/admins/${id}/change-password`, passwords);
    return response.data;
  },

  // Toggle admin status (superadmin only)
  toggleStatus: async (id) => {
    const response = await apiClient.patch(`/admins/${id}/toggle-status`);
    return response.data;
  },
};
