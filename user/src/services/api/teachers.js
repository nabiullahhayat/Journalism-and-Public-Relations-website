import apiClient from './client';

export const teachersAPI = {
  // Get all teachers (public)
  getAll: async (params = {}) => {
    const response = await apiClient.get('/teachers', { params });
    return response.data;
  },

  // Get teacher by ID (public)
  getById: async (id) => {
    const response = await apiClient.get(`/teachers/${id}`);
    return response.data;
  },

  // Get teachers by department (public)
  getByDepartment: async (departmentId, params = {}) => {
    const response = await apiClient.get(`/teachers/department/${departmentId}`, { params });
    return response.data;
  },

  // Get featured teachers (public)
  getFeatured: async (limit = 6) => {
    const response = await apiClient.get(`/teachers/featured?limit=${limit}`);
    return response.data;
  },

  // Create teacher (admin)
  create: async (formData) => {
    const response = await apiClient.post('/teachers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update teacher (admin)
  update: async (id, formData) => {
    const response = await apiClient.put(`/teachers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete teacher (admin)
  delete: async (id) => {
    const response = await apiClient.delete(`/teachers/${id}`);
    return response.data;
  },

  // Add publication (admin)
  addPublication: async (id, publication) => {
    const response = await apiClient.post(`/teachers/${id}/publications`, publication);
    return response.data;
  },

  // Remove publication (admin)
  removePublication: async (id, publicationId) => {
    const response = await apiClient.delete(`/teachers/${id}/publications/${publicationId}`);
    return response.data;
  },

  // Add award (admin)
  addAward: async (id, award) => {
    const response = await apiClient.post(`/teachers/${id}/awards`, award);
    return response.data;
  },

  // Remove award (admin)
  removeAward: async (id, awardId) => {
    const response = await apiClient.delete(`/teachers/${id}/awards/${awardId}`);
    return response.data;
  },

  // Toggle featured status (admin)
  toggleFeatured: async (id) => {
    const response = await apiClient.patch(`/teachers/${id}/featured`);
    return response.data;
  },
};
