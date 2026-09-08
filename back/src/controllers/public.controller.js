import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { toPlain } from '../utils/mongo.js';
import About from '../models/About.js';
import Department from '../models/Department.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import News from '../models/News.js';

const teacherPopulate = [
  { path: 'departmentId', select: 'name code' },
  { path: 'academicRankId', select: 'name level' },
];

const formatTeacher = (teacher) => {
  const plain = toPlain(teacher);
  if (plain.departmentId && typeof plain.departmentId === 'object') {
    plain.department = plain.departmentId;
    plain.departmentId = plain.department.id;
  }
  if (plain.academicRankId && typeof plain.academicRankId === 'object') {
    plain.academicRank = plain.academicRankId;
    plain.academicRankId = plain.academicRank.id;
  }
  return plain;
};

export const getHomeSummary = asyncHandler(async (req, res) => {
  const [
    about,
    departmentCount,
    teacherCount,
    courseCount,
    newsCount,
    featuredNews,
    featuredTeachers,
  ] = await Promise.all([
    About.findOne().lean(),
    Department.countDocuments({ isActive: true }),
    Teacher.countDocuments({ isActive: true }),
    Course.countDocuments({ isActive: true }),
    News.countDocuments({ status: 'published' }),
    News.find({ featured: true, status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean(),
    Teacher.find({ isActive: true })
      .populate(teacherPopulate)
      .sort({ createdAt: -1 })
      .limit(4),
  ]);

  return sendSuccess(res, 200, 'Home summary retrieved successfully', {
    about: about ? toPlain(about) : null,
    stats: {
      departments: departmentCount,
      teachers: teacherCount,
      courses: courseCount,
      news: newsCount,
    },
    featuredNews: featuredNews.map((n) => toPlain(n)),
    featuredTeachers: featuredTeachers.map(formatTeacher),
  });
});

export default { getHomeSummary };
