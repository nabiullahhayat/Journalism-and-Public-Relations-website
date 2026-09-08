import apiClient from './client';

export const contactAPI = {
  // Get contact information (public)
  get: async () => {
    const response = await apiClient.get('/contact');
    return response.data;
  },

  // Update contact information (admin)
  update: async (data) => {
    const response = await apiClient.put('/contact', data);
    return response.data;
  },

  // Send contact message (public)
  sendMessage: async (message) => {
    const response = await apiClient.post('/contact/message', message);
    return response.data;
  },
};
