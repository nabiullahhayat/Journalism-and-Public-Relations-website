import apiClient from './client';

const totalFrom = (response) => response?.meta?.pagination?.total ?? 0;

/** Load stats from public list endpoints (no auth required). */
const getSummaryFallback = async () => {
  const [departments, courses, teachers, news, monographs, latestNews] = await Promise.all([
    apiClient.get('/departments', { params: { limit: 1 } }),
    apiClient.get('/courses', { params: { limit: 1 } }),
    apiClient.get('/teachers', { params: { limit: 1 } }),
    apiClient.get('/news', { params: { limit: 1 } }),
    apiClient.get('/monographs', { params: { limit: 1 } }),
    apiClient.get('/news/latest', { params: { limit: 5 } }),
  ]);

  return {
    success: true,
    message: 'Dashboard summary (fallback)',
    data: {
      stats: {
        departments: totalFrom(departments.data),
        courses: totalFrom(courses.data),
        teachers: totalFrom(teachers.data),
        news: totalFrom(news.data),
        monographs: totalFrom(monographs.data),
      },
      latestNews: Array.isArray(latestNews.data?.data) ? latestNews.data.data : [],
    },
  };
};

export const dashboardAPI = {
  getSummary: async () => {
    try {
      const response = await apiClient.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      const status = error.status || error.response?.status;
      if (status === 404 || status === 401 || status === 403) {
        return getSummaryFallback();
      }
      throw error;
    }
  },
};
