import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import Monograph from '../models/Monograph.js';
import { buildSearchFilter, paginateOptions, toPlain } from '../utils/mongo.js';

const monoPopulate = { path: 'departmentId', select: 'name code' };

const formatMono = (mono) => {
  const plain = toPlain(mono);
  if (plain.departmentId && typeof plain.departmentId === 'object') {
    plain.department = plain.departmentId;
    plain.departmentId = plain.department.id;
  }
  return plain;
};

export const getAllMonographs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, department, year, degree } = req.query;
  const { skip, page: pageNum, limit: limitNum } = paginateOptions(page, limit);

  const filter = { ...buildSearchFilter(['title', 'studentName', 'supervisor'], search) };
  if (department) filter.departmentId = department;
  if (year) filter.year = parseInt(year, 10);
  if (degree) filter.degree = degree;

  const [monographs, total] = await Promise.all([
    Monograph.find(filter).populate(monoPopulate).sort({ year: -1 }).skip(skip).limit(limitNum),
    Monograph.countDocuments(filter),
  ]);

  return sendPaginated(res, monographs.map(formatMono), pageNum, limitNum, total, 'Monographs retrieved successfully');
});

export const getMonographById = asyncHandler(async (req, res) => {
  const mono = await Monograph.findById(req.params.id).populate(monoPopulate);
  if (!mono) return sendError(res, 404, 'Monograph not found');

  mono.downloads += 1;
  await mono.save();
  return sendSuccess(res, 200, 'Monograph retrieved successfully', formatMono(mono));
});

export const createMonograph = asyncHandler(async (req, res) => {
  const data = req.body;
  const mono = await Monograph.create({
    studentName: data.studentName,
    supervisor: data.supervisor,
    year: parseInt(data.year, 10),
    issue: data.issue,
    title: data.title || null,
    abstract: data.abstract || null,
    documentUrl: data.documentUrl || null,
    pages: data.pages ? parseInt(data.pages, 10) : null,
    grade: data.grade || null,
    degree: data.degree || null,
    isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    departmentId: data.departmentId || null,
    createdById: req.user?.id || null,
  });

  await mono.populate(monoPopulate);
  return sendSuccess(res, 201, 'Monograph created successfully', formatMono(mono));
});

export const updateMonograph = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mono = await Monograph.findById(id);
  if (!mono) return sendError(res, 404, 'Monograph not found');

  const data = req.body;
  const updateData = {};
  ['studentName', 'supervisor', 'issue', 'title', 'abstract', 'documentUrl', 'grade', 'degree'].forEach((f) => {
    if (data[f] !== undefined) updateData[f] = data[f];
  });
  if (data.year !== undefined) updateData.year = parseInt(data.year, 10);
  if (data.pages !== undefined) updateData.pages = data.pages ? parseInt(data.pages, 10) : null;
  if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);
  if (data.keywords !== undefined) updateData.keywords = Array.isArray(data.keywords) ? data.keywords : data.keywords;
  if (data.departmentId !== undefined) updateData.departmentId = data.departmentId || null;

  const updated = await Monograph.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(monoPopulate);
  return sendSuccess(res, 200, 'Monograph updated successfully', formatMono(updated));
});

export const deleteMonograph = asyncHandler(async (req, res) => {
  const mono = await Monograph.findById(req.params.id);
  if (!mono) return sendError(res, 404, 'Monograph not found');

  await Monograph.findByIdAndDelete(req.params.id);
  return sendSuccess(res, 200, 'Monograph deleted successfully');
});

export const getMonographsByYear = asyncHandler(async (req, res) => {
  const monographs = await Monograph.find({
    year: parseInt(req.params.year, 10),
    isPublished: true,
  }).populate(monoPopulate).sort({ studentName: 1 });

  return sendSuccess(res, 200, 'Monographs retrieved successfully', monographs.map(formatMono));
});

export default {
  getAllMonographs, getMonographById, createMonograph, updateMonograph, deleteMonograph, getMonographsByYear,
};
