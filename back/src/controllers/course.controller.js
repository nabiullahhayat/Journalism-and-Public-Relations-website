import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import Course from '../models/Course.js';
import { buildSearchFilter, paginateOptions, toPlain } from '../utils/mongo.js';

const coursePopulate = [
  { path: 'departmentId', select: 'name code' },
  { path: 'teacherId', select: 'name email' },
];

const formatCourse = (course) => {
  const plain = toPlain(course);
  if (plain.departmentId && typeof plain.departmentId === 'object') {
    plain.department = plain.departmentId;
    plain.departmentId = plain.department.id;
  }
  if (plain.teacherId && typeof plain.teacherId === 'object') {
    plain.teacher = plain.teacherId;
    plain.teacherId = plain.teacher.id;
  }
  return plain;
};

export const getAllCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, department, level, semester, type, isActive } = req.query;
  const { skip, page: pageNum, limit: limitNum } = paginateOptions(page, limit);

  const filter = { ...buildSearchFilter(['name', 'code', 'description'], search) };
  if (department) filter.departmentId = department;
  if (level) filter.level = level;
  if (semester) filter.semester = parseInt(semester, 10);
  if (type) filter.type = type;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [courses, total] = await Promise.all([
    Course.find(filter).populate(coursePopulate).sort({ name: 1 }).skip(skip).limit(limitNum),
    Course.countDocuments(filter),
  ]);

  return sendPaginated(res, courses.map(formatCourse), pageNum, limitNum, total, 'Courses retrieved successfully');
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(coursePopulate);
  if (!course) return sendError(res, 404, 'Course not found');
  return sendSuccess(res, 200, 'Course retrieved successfully', formatCourse(course));
});

export const getCourseByCode = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ code: req.params.code.toUpperCase() }).populate(coursePopulate);
  if (!course) return sendError(res, 404, 'Course not found');
  return sendSuccess(res, 200, 'Course retrieved successfully', formatCourse(course));
});

export const createCourse = asyncHandler(async (req, res) => {
  const data = req.body;
  if (data.code) data.code = data.code.toUpperCase();

  if (data.code) {
    const existing = await Course.findOne({ code: data.code });
    if (existing) return sendError(res, 409, 'Course with this code already exists');
  }

  const course = await Course.create({
    name: data.name,
    code: data.code || null,
    description: data.description || null,
    details: data.details || null,
    level: data.level || null,
    semester: data.semester ? parseInt(data.semester, 10) : null,
    credits: data.credits ? parseInt(data.credits, 10) : null,
    type: data.type || null,
    time: data.time ? parseInt(data.time, 10) : null,
    date: data.date ? new Date(data.date) : null,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    departmentId: data.departmentId || null,
    teacherId: data.teacherId || null,
  });

  await course.populate(coursePopulate);
  return sendSuccess(res, 201, 'Course created successfully', formatCourse(course));
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const course = await Course.findById(id);
  if (!course) return sendError(res, 404, 'Course not found');

  if (data.code) {
    data.code = data.code.toUpperCase();
    if (data.code !== course.code) {
      const conflict = await Course.findOne({ code: data.code, _id: { $ne: id } });
      if (conflict) return sendError(res, 409, 'Course with this code already exists');
    }
  }

  const updateData = {};
  ['name', 'code', 'description', 'details', 'level', 'type'].forEach((f) => {
    if (data[f] !== undefined) updateData[f] = data[f];
  });
  ['semester', 'credits', 'time'].forEach((f) => {
    if (data[f] !== undefined) updateData[f] = data[f] ? parseInt(data[f], 10) : null;
  });
  ['departmentId', 'teacherId'].forEach((f) => {
    if (data[f] !== undefined) updateData[f] = data[f] || null;
  });
  if (data.date !== undefined) updateData.date = data.date ? new Date(data.date) : null;
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  const updated = await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(coursePopulate);
  return sendSuccess(res, 200, 'Course updated successfully', formatCourse(updated));
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return sendError(res, 404, 'Course not found');

  await Course.findByIdAndDelete(req.params.id);
  return sendSuccess(res, 200, 'Course deleted successfully');
});

export const getCoursesByDepartment = asyncHandler(async (req, res) => {
  const courses = await Course.find({
    departmentId: req.params.departmentId,
    isActive: true,
  }).populate(coursePopulate).sort({ name: 1 });

  return sendSuccess(res, 200, 'Courses retrieved successfully', courses.map(formatCourse));
});

export const addInstructor = asyncHandler(async (req, res) => {
  const teacherId = req.body.instructorId || req.body.teacherId;
  const course = await Course.findById(req.params.id);
  if (!course) return sendError(res, 404, 'Course not found');
  if (String(course.teacherId) === String(teacherId)) {
    return sendError(res, 400, 'Instructor already assigned');
  }

  course.teacherId = teacherId;
  await course.save();
  await course.populate(coursePopulate);
  return sendSuccess(res, 200, 'Instructor added to course successfully', formatCourse(course));
});

export const removeInstructor = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return sendError(res, 404, 'Course not found');

  course.teacherId = null;
  await course.save();
  await course.populate(coursePopulate);
  return sendSuccess(res, 200, 'Instructor removed from course successfully', formatCourse(course));
});

export const getCoursesByLevel = asyncHandler(async (req, res) => {
  const courses = await Course.find({ level: req.params.level, isActive: true })
    .populate(coursePopulate)
    .sort({ name: 1 });

  return sendSuccess(res, 200, 'Courses retrieved successfully', courses.map(formatCourse));
});

export default {
  getAllCourses, getCourseById, getCourseByCode, createCourse, updateCourse, deleteCourse,
  getCoursesByDepartment, addInstructor, removeInstructor, getCoursesByLevel,
};
