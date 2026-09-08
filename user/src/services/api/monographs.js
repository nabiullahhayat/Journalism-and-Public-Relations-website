import apiClient from './client';

export const monographsAPI = {
  // Get all monographs (public)
  getAll: async (params = {}) => {
    const response = await apiClient.get('/monographs', { params });
    return response.data;
  },

  // Get monograph by ID (public)
  getById: async (id) => {
    const response = await apiClient.get(`/monographs/${id}`);
    return response.data;
  },

  // Get monographs by year (public)
  getByYear: async (year, params = {}) => {
    const response = await apiClient.get(`/monographs/year/${year}`, { params });
    return response.data;
  },

  // Create monograph (admin)
  create: async (data) => {
    const response = await apiClient.post('/monographs', data);
    return response.data;
  },

  // Update monograph (admin)
  update: async (id, data) => {
    const response = await apiClient.put(`/monographs/${id}`, data);
    return response.data;
  },

  // Delete monograph (admin)
  delete: async (id) => {
    const response = await apiClient.delete(`/monographs/${id}`);
    return response.data;
  },
};
