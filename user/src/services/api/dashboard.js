import { STORAGE_KEYS, getCollection } from '../storage/db.js';
import { delay, success } from '../storage/helpers.js';

export const dashboardAPI = {
  getSummary: async () => {
    await delay();

    const latestNews = getCollection(STORAGE_KEYS.NEWS)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
      .slice(0, 5);

    return success('Dashboard summary retrieved successfully', {
      stats: {
        departments: getCollection(STORAGE_KEYS.DEPARTMENTS).length,
        courses: getCollection(STORAGE_KEYS.COURSES).length,
        teachers: getCollection(STORAGE_KEYS.TEACHERS).length,
        news: getCollection(STORAGE_KEYS.NEWS).length,
        monographs: getCollection(STORAGE_KEYS.MONOGRAPHS).length,
      },
      latestNews,
    });
  },
};
