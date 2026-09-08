import apiClient from './client';

export const coursesAPI = {
  // Get all courses (public)
  getAll: async (params = {}) => {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  // Get course by ID (public)
  getById: async (id) => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  // Get course by code (public)
  getByCode: async (code) => {
    const response = await apiClient.get(`/courses/code/${code}`);
    return response.data;
  },

  // Get courses by department (public)
  getByDepartment: async (departmentId, params = {}) => {
    const response = await apiClient.get(`/courses/department/${departmentId}`, { params });
    return response.data;
  },

  // Get courses by level (public)
  getByLevel: async (level, params = {}) => {
    const response = await apiClient.get(`/courses/level/${level}`, { params });
    return response.data;
  },

  // Create course (admin)
  create: async (data) => {
    const response = await apiClient.post('/courses', data);
    return response.data;
  },

  // Update course (admin)
  update: async (id, data) => {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course (admin)
  delete: async (id) => {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  },

  // Add instructor (admin)
  addInstructor: async (id, teacherId) => {
    const response = await apiClient.post(`/courses/${id}/instructors`, { teacherId });
    return response.data;
  },

  // Remove instructor (admin)
  removeInstructor: async (id, teacherId) => {
    const response = await apiClient.delete(`/courses/${id}/instructors/${teacherId}`);
    return response.data;
  },
};
