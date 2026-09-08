import apiClient from './client';

export const newsAPI = {
  // Get all news (public)
  getAll: async (params = {}) => {
    const response = await apiClient.get('/news', { params });
    return response.data;
  },

  // Get news by ID (public)
  getById: async (id) => {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
  },

  // Get news by slug (public)
  getBySlug: async (slug) => {
    const response = await apiClient.get(`/news/slug/${slug}`);
    return response.data;
  },

  // Get news by category (public)
  getByCategory: async (category, params = {}) => {
    const response = await apiClient.get(`/news/category/${category}`, { params });
    return response.data;
  },

  // Get featured news (public)
  getFeatured: async (limit = 6) => {
    const response = await apiClient.get(`/news/featured?limit=${limit}`);
    return response.data;
  },

  // Get latest news (public)
  getLatest: async (limit = 10) => {
    const response = await apiClient.get(`/news/latest?limit=${limit}`);
    return response.data;
  },

  // Create news (admin)
  create: async (formData) => {
    const response = await apiClient.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update news (admin)
  update: async (id, formData) => {
    const response = await apiClient.put(`/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete news (admin)
  delete: async (id) => {
    const response = await apiClient.delete(`/news/${id}`);
    return response.data;
  },

  // Toggle featured status (admin)
  toggleFeatured: async (id) => {
    const response = await apiClient.patch(`/news/${id}/featured`);
    return response.data;
  },
};
