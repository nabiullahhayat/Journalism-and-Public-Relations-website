import apiClient from './client';

export const departmentsAPI = {
  // Get all departments (public)
  getAll: async (params = {}) => {
    const response = await apiClient.get('/departments', { params });
    return response.data;
  },

  // Get department by ID (public)
  getById: async (id) => {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data;
  },

  // Get department list (minimal data for dropdowns)
  getList: async () => {
    const response = await apiClient.get('/departments/list');
    return response.data;
  },

  // Get department statistics (admin)
  getStats: async (id) => {
    const response = await apiClient.get(`/departments/${id}/stats`);
    return response.data;
  },

  // Create department (admin)
  create: async (data) => {
    const response = await apiClient.post('/departments', data);
    return response.data;
  },

  // Update department (admin)
  update: async (id, data) => {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response.data;
  },

  // Delete department (admin)
  delete: async (id) => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  },

  // Add teacher to department (admin)
  addTeacher: async (id, teacherId) => {
    const response = await apiClient.post(`/departments/${id}/teachers`, { teacherId });
    return response.data;
  },

  // Remove teacher from department (admin)
  removeTeacher: async (id, teacherId) => {
    const response = await apiClient.delete(`/departments/${id}/teachers/${teacherId}`);
    return response.data;
  },

  // Set department head (admin)
  setHead: async (id, teacherId) => {
    const response = await apiClient.patch(`/departments/${id}/head`, { teacherId });
    return response.data;
  },
};
