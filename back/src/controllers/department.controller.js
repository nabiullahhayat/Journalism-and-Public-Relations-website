import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import Department from '../models/Department.js';
import Teacher from '../models/Teacher.js';
import { buildSearchFilter, paginateOptions, toPlain } from '../utils/mongo.js';

const headPopulate = { path: 'headId', select: 'name email phone' };

const formatDept = (dept, teachers = []) => ({
  ...toPlain(dept),
  head: dept.headId && typeof dept.headId === 'object' ? toPlain(dept.headId) : dept.head,
  teachers: toPlain(teachers),
  teacherCount: teachers.length,
});

export const getAllDepartments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isActive } = req.query;
  const { skip, page: pageNum, limit: limitNum } = paginateOptions(page, limit);

  const filter = { ...buildSearchFilter(['name', 'description'], search) };
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [departments, total] = await Promise.all([
    Department.find(filter).populate(headPopulate).sort({ name: 1 }).skip(skip).limit(limitNum),
    Department.countDocuments(filter),
  ]);

  const formatted = await Promise.all(
    departments.map(async (dept) => {
      const teachers = await Teacher.find({ departmentId: dept._id, isActive: true }).select('name email departmentId');
      return formatDept(dept, teachers);
    })
  );

  return sendPaginated(res, formatted, pageNum, limitNum, total, 'Departments retrieved successfully');
});

export const getDepartmentById = asyncHandler(async (req, res) => {
  const dept = await Department.findById(req.params.id).populate(headPopulate);
  if (!dept) return sendError(res, 404, 'Department not found');

  const teachers = await Teacher.find({ departmentId: dept._id, isActive: true }).select('name email departmentId');
  return sendSuccess(res, 200, 'Department retrieved successfully', formatDept(dept, teachers));
});

export const createDepartment = asyncHandler(async (req, res) => {
  const data = req.body;
  const existing = await Department.findOne({ name: data.name });
  if (existing) return sendError(res, 409, 'Department with this name already exists');

  const dept = await Department.create({
    name: data.name,
    code: data.code || null,
    description: data.description || null,
    email: data.email || null,
    phone: data.phone || null,
    location: data.location || null,
    website: data.website || null,
    vision: data.vision || null,
    mission: data.mission || null,
    established: data.established ? new Date(data.established) : null,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    objectives: Array.isArray(data.objectives) ? data.objectives : [],
    programs: Array.isArray(data.programs) ? data.programs : [],
    socialLinks: typeof data.socialLinks === 'object' ? data.socialLinks : {},
  });

  await dept.populate(headPopulate);
  return sendSuccess(res, 201, 'Department created successfully', formatDept(dept, []));
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const dept = await Department.findById(id);
  if (!dept) return sendError(res, 404, 'Department not found');

  if (data.name && data.name !== dept.name) {
    const conflict = await Department.findOne({ name: data.name, _id: { $ne: id } });
    if (conflict) return sendError(res, 409, 'Department with this name already exists');
  }

  const updateData = {};
  ['name', 'code', 'description', 'email', 'phone', 'location', 'website', 'vision', 'mission'].forEach((f) => {
    if (data[f] !== undefined) updateData[f] = data[f];
  });
  if (data.established) updateData.established = new Date(data.established);
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
  if (data.objectives !== undefined) updateData.objectives = Array.isArray(data.objectives) ? data.objectives : data.objectives;
  if (data.programs !== undefined) updateData.programs = Array.isArray(data.programs) ? data.programs : data.programs;
  if (data.socialLinks !== undefined) {
    updateData.socialLinks = typeof data.socialLinks === 'object' ? data.socialLinks : data.socialLinks;
  }
  if (data.headId !== undefined) updateData.headId = data.headId || null;

  const updated = await Department.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(headPopulate);
  const teachers = await Teacher.find({ departmentId: id, isActive: true }).select('name email departmentId');

  return sendSuccess(res, 200, 'Department updated successfully', formatDept(updated, teachers));
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dept = await Department.findById(id);
  if (!dept) return sendError(res, 404, 'Department not found');

  const teacherCount = await Teacher.countDocuments({ departmentId: id });
  if (teacherCount > 0) {
    return sendError(res, 400, 'Cannot delete department with assigned teachers. Reassign or remove teachers first');
  }

  await Department.findByIdAndDelete(id);
  return sendSuccess(res, 200, 'Department deleted successfully');
});

export const addTeacherToDepartment = asyncHandler(async (req, res) => {
  const deptId = req.params.id;
  const teacherId = req.body.teacherId;

  const [dept, teacher] = await Promise.all([
    Department.findById(deptId),
    Teacher.findById(teacherId),
  ]);
  if (!dept) return sendError(res, 404, 'Department not found');
  if (!teacher) return sendError(res, 404, 'Teacher not found');
  if (String(teacher.departmentId) === String(deptId)) {
    return sendError(res, 400, 'Teacher is already in this department');
  }

  teacher.departmentId = deptId;
  await teacher.save();
  return sendSuccess(res, 200, 'Teacher added to department successfully');
});

export const removeTeacherFromDepartment = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacherId);
  if (!teacher) return sendError(res, 404, 'Teacher not found');

  teacher.departmentId = null;
  await teacher.save();
  return sendSuccess(res, 200, 'Teacher removed from department successfully');
});

export const setDepartmentHead = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const headId = req.body.headId;

  const [dept, teacher] = await Promise.all([
    Department.findById(id),
    Teacher.findById(headId),
  ]);
  if (!dept) return sendError(res, 404, 'Department not found');
  if (!teacher) return sendError(res, 404, 'Teacher not found');
  if (String(teacher.departmentId) !== String(id)) {
    return sendError(res, 400, 'Teacher must be in this department to be head');
  }

  dept.headId = headId;
  await dept.save();
  return sendSuccess(res, 200, 'Department head set successfully');
});

export const getDepartmentStats = asyncHandler(async (req, res) => {
  const dept = await Department.findById(req.params.id);
  if (!dept) return sendError(res, 404, 'Department not found');

  const teacherCount = await Teacher.countDocuments({ departmentId: dept._id });
  return sendSuccess(res, 200, 'Department statistics retrieved successfully', {
    totalTeachers: teacherCount,
    totalPrograms: (dept.programs || []).length,
    totalObjectives: (dept.objectives || []).length,
    established: dept.established,
    isActive: dept.isActive,
  });
});

export const getDepartmentsList = asyncHandler(async (req, res) => {
  const departments = await Department.find({ isActive: true })
    .select('name code')
    .sort({ name: 1 });

  return sendSuccess(res, 200, 'Departments list retrieved successfully', toPlain(departments));
});

export default {
  getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment,
  addTeacherToDepartment, removeTeacherFromDepartment, setDepartmentHead, getDepartmentStats, getDepartmentsList,
};
