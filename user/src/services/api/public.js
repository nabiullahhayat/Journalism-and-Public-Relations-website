import apiClient from './client';

export const publicAPI = {
  getHomeSummary: async () => {
    const response = await apiClient.get('/public/home');
    return response.data;
  },
};
