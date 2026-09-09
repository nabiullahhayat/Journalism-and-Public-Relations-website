import { STORAGE_KEYS, getCollection, getSingleton } from '../storage/db.js';
import { delay, success } from '../storage/helpers.js';
import { newsAPI } from './news.js';
import { teachersAPI } from './teachers.js';

export const publicAPI = {
  getHomeSummary: async () => {
    await delay();

    const departments = getCollection(STORAGE_KEYS.DEPARTMENTS);
    const courses = getCollection(STORAGE_KEYS.COURSES);
    const teachers = getCollection(STORAGE_KEYS.TEACHERS);
    const news = getCollection(STORAGE_KEYS.NEWS).filter((n) => (n.status || 'published') === 'published');
    const about = getSingleton(STORAGE_KEYS.ABOUT);

    const featuredNewsRes = await newsAPI.getFeatured(5);
    const featuredTeachersRes = await teachersAPI.getFeatured(4);

    return success('Home summary retrieved', {
      about,
      stats: {
        departments: departments.length,
        courses: courses.length,
        teachers: teachers.length,
        news: news.length,
      },
      featuredNews: featuredNewsRes.data || [],
      featuredTeachers: featuredTeachersRes.data || [],
    });
  },
};
