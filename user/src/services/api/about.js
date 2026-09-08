import apiClient from './client';

export const aboutAPI = {
  // Get about page content (public)
  get: async () => {
    const response = await apiClient.get('/about');
    return response.data;
  },

  // Update about page content (admin)
  update: async (data) => {
    const response = await apiClient.put('/about', data);
    return response.data;
  },
};
