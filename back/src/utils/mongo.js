import mongoose from 'mongoose';

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const buildSearchFilter = (fields, search) => {
  if (!search) return {};
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    })),
  };
};

export const paginateOptions = (page = 1, limit = 10) => {
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
};

export const toPlain = (doc) => {
  if (!doc) return null;
  if (Array.isArray(doc)) return doc.map((item) => toPlain(item));
  return doc.toJSON ? doc.toJSON() : doc;
};
