import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { toPlain } from '../utils/mongo.js';
import Department from '../models/Department.js';
import Course from '../models/Course.js';
import Teacher from '../models/Teacher.js';
import News from '../models/News.js';
import Monograph from '../models/Monograph.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [
    departments,
    courses,
    teachers,
    news,
    monographs,
    latestNews,
  ] = await Promise.all([
    Department.countDocuments(),
    Course.countDocuments(),
    Teacher.countDocuments(),
    News.countDocuments(),
    Monograph.countDocuments(),
    News.find()
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return sendSuccess(res, 200, 'Dashboard summary retrieved successfully', {
    stats: {
      departments,
      courses,
      teachers,
      news,
      monographs,
    },
    latestNews: latestNews.map((item) => {
      const plain = toPlain(item) || item;
      if (plain._id && !plain.id) {
        plain.id = String(plain._id);
      }
      return plain;
    }),
  });
});

export default { getDashboardSummary };
