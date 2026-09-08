import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { fileToPublicUrl, deleteLocalImage } from '../utils/upload.js';
import Teacher from '../models/Teacher.js';
import { buildSearchFilter, paginateOptions, toPlain } from '../utils/mongo.js';

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

export const getAllTeachers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, department, academicRank, isActive } = req.query;
  const { skip, page: pageNum, limit: limitNum } = paginateOptions(page, limit);

  const filter = { ...buildSearchFilter(['name', 'email', 'city'], search) };
  if (department) filter.departmentId = department;
  if (academicRank) filter.academicRankId = academicRank;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const [teachers, total] = await Promise.all([
    Teacher.find(filter).populate(teacherPopulate).sort({ name: 1 }).skip(skip).limit(limitNum),
    Teacher.countDocuments(filter),
  ]);

  return sendPaginated(res, teachers.map(formatTeacher), pageNum, limitNum, total, 'Teachers retrieved successfully');
});

export const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate(teacherPopulate);
  if (!teacher) return sendError(res, 404, 'Teacher not found');
  return sendSuccess(res, 200, 'Teacher retrieved successfully', formatTeacher(teacher));
});

export const createTeacher = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (data.email) {
    const existing = await Teacher.findOne({ email: data.email });
    if (existing) return sendError(res, 409, 'Teacher with this email already exists');
  }

  if (req.file) {
    data.profileImage = fileToPublicUrl(req.file, 'teachers');
  }

  const teacher = await Teacher.create({
    name: data.name,
    phone: data.phone,
    email: data.email,
    city: data.city,
    schoolName: data.schoolName,
    schoolGraduationYear: parseInt(data.schoolGraduationYear, 10),
    bachelorUniversity: data.bachelorUniversity,
    bachelorGraduationYear: parseInt(data.bachelorGraduationYear, 10),
    masterCountry: data.masterCountry || null,
    masterUniversity: data.masterUniversity || null,
    masterGraduationYear: data.masterGraduationYear ? parseInt(data.masterGraduationYear, 10) : null,
    masterThesis: data.masterThesis || null,
    phdCountry: data.phdCountry || null,
    phdUniversity: data.phdUniversity || null,
    phdGraduationYear: data.phdGraduationYear ? parseInt(data.phdGraduationYear, 10) : null,
    phdThesis: data.phdThesis || null,
    bio: data.bio || null,
    whatsapp: data.whatsapp || null,
    profileImage: data.profileImage || null,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    researchPapers: Array.isArray(data.researchPapers) ? data.researchPapers : [],
    professionalCertificates: Array.isArray(data.professionalCertificates) ? data.professionalCertificates : [],
    classes: Array.isArray(data.classes) ? data.classes : [],
    departmentId: data.departmentId || null,
    academicRankId: data.academicRankId || null,
  });

  await teacher.populate(teacherPopulate);
  return sendSuccess(res, 201, 'Teacher created successfully', formatTeacher(teacher));
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id);
  if (!teacher) return sendError(res, 404, 'Teacher not found');

  const data = { ...req.body };

  if (data.email && data.email !== teacher.email) {
    const conflict = await Teacher.findOne({ email: data.email, _id: { $ne: id } });
    if (conflict) return sendError(res, 409, 'Teacher with this email already exists');
  }

  if (req.file) {
    if (teacher.profileImage) await deleteLocalImage(teacher.profileImage);
    data.profileImage = fileToPublicUrl(req.file, 'teachers');
  }

  const updateData = {};
  const stringFields = ['name', 'phone', 'email', 'city', 'schoolName', 'bachelorUniversity',
    'masterCountry', 'masterUniversity', 'masterThesis', 'phdCountry', 'phdUniversity', 'phdThesis', 'bio', 'whatsapp', 'profileImage'];
  const intFields = ['schoolGraduationYear', 'bachelorGraduationYear', 'masterGraduationYear', 'phdGraduationYear'];
  const refFields = ['departmentId', 'academicRankId'];
  const arrayFields = ['researchPapers', 'professionalCertificates', 'classes'];

  stringFields.forEach((f) => { if (data[f] !== undefined) updateData[f] = data[f]; });
  intFields.forEach((f) => { if (data[f] !== undefined) updateData[f] = data[f] ? parseInt(data[f], 10) : null; });
  refFields.forEach((f) => { if (data[f] !== undefined) updateData[f] = data[f] || null; });
  arrayFields.forEach((f) => { if (data[f] !== undefined) updateData[f] = Array.isArray(data[f]) ? data[f] : data[f]; });
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  const updated = await Teacher.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(teacherPopulate);
  return sendSuccess(res, 200, 'Teacher updated successfully', formatTeacher(updated));
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return sendError(res, 404, 'Teacher not found');

  if (teacher.profileImage) await deleteLocalImage(teacher.profileImage);

  await Teacher.findByIdAndDelete(req.params.id);
  return sendSuccess(res, 200, 'Teacher deleted successfully');
});

export const getTeachersByDepartment = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({
    departmentId: req.params.departmentId,
    isActive: true,
  }).populate(teacherPopulate).sort({ name: 1 });

  return sendSuccess(res, 200, 'Teachers retrieved successfully', teachers.map(formatTeacher));
});

export const getFeaturedTeachers = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  const teachers = await Teacher.find({ isActive: true })
    .populate(teacherPopulate)
    .sort({ createdAt: -1 })
    .limit(limit);

  return sendSuccess(res, 200, 'Featured teachers retrieved successfully', teachers.map(formatTeacher));
});

export const addPublication = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return sendError(res, 404, 'Teacher not found');

  teacher.researchPapers.push(req.body);
  await teacher.save();
  return sendSuccess(res, 200, 'Publication added successfully', teacher.researchPapers);
});

export const removePublication = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return sendError(res, 404, 'Teacher not found');

  teacher.researchPapers = teacher.researchPapers.filter((_, i) => String(i) !== req.params.publicationId);
  await teacher.save();
  return sendSuccess(res, 200, 'Publication removed successfully');
});

export const addAward = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return sendError(res, 404, 'Teacher not found');

  teacher.professionalCertificates.push(req.body);
  await teacher.save();
  return sendSuccess(res, 200, 'Award added successfully', teacher.professionalCertificates);
});

export const removeAward = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return sendError(res, 404, 'Teacher not found');

  teacher.professionalCertificates = teacher.professionalCertificates.filter((_, i) => String(i) !== req.params.awardId);
  await teacher.save();
  return sendSuccess(res, 200, 'Award removed successfully');
});

export default {
  getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher,
  getTeachersByDepartment, getFeaturedTeachers, addPublication, removePublication, addAward, removeAward,
};
