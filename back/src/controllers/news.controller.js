import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { fileToPublicUrl, fileToRelativePath, deleteLocalImage } from '../utils/upload.js';
import News from '../models/News.js';
import { buildSearchFilter, paginateOptions, toPlain } from '../utils/mongo.js';

const generateSlug = (title) => {
  const base = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `${base}-${Date.now()}`;
};

export const getAllNews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, status, featured } = req.query;
  const { skip, page: pageNum, limit: limitNum } = paginateOptions(page, limit);

  const filter = { ...buildSearchFilter(['title', 'description'], search) };
  if (category) filter.category = category;
  filter.status = status || 'published';
  if (featured !== undefined) filter.featured = featured === 'true';

  const [news, total] = await Promise.all([
    News.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limitNum),
    News.countDocuments(filter),
  ]);

  return sendPaginated(res, toPlain(news), pageNum, limitNum, total, 'News retrieved successfully');
});

export const getNewsById = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return sendError(res, 404, 'News not found');

  news.views += 1;
  await news.save();
  return sendSuccess(res, 200, 'News retrieved successfully', toPlain(news));
});

export const getNewsBySlug = asyncHandler(async (req, res) => {
  const news = await News.findOne({ slug: req.params.slug });
  if (!news) return sendError(res, 404, 'News not found');

  news.views += 1;
  await news.save();
  return sendSuccess(res, 200, 'News retrieved successfully', toPlain(news));
});

export const createNews = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.image = fileToPublicUrl(req.file, 'news');
    data.imagePublicId = fileToRelativePath(req.file, 'news');
  }

  if (!data.image && !data.imageUrl) {
    data.image = null;
  }

  const news = await News.create({
    title: data.title,
    description: data.description,
    content: data.content || null,
    excerpt: data.excerpt || null,
    image: data.image,
    imagePublicId: data.imagePublicId || null,
    category: data.category || 'general',
    author: data.author || 'Faculty Administration',
    isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    featured: data.featured !== undefined ? Boolean(data.featured) : false,
    status: data.status || 'published',
    tags: Array.isArray(data.tags) ? data.tags : [],
    slug: generateSlug(data.title),
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    createdById: req.user?.id || null,
  });

  return sendSuccess(res, 201, 'News created successfully', toPlain(news));
});

export const updateNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const news = await News.findById(id);
  if (!news) return sendError(res, 404, 'News not found');

  const data = { ...req.body };

  if (req.file) {
    if (news.imagePublicId) await deleteLocalImage(news.imagePublicId);
    else if (news.image) await deleteLocalImage(news.image);

    data.image = fileToPublicUrl(req.file, 'news');
    data.imagePublicId = fileToRelativePath(req.file, 'news');
  }

  const updateData = {};
  ['title', 'description', 'content', 'excerpt', 'image', 'imagePublicId', 'category', 'author', 'status'].forEach((f) => {
    if (data[f] !== undefined) updateData[f] = data[f];
  });
  if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);
  if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
  if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? data.tags : data.tags;
  if (data.publishedAt) updateData.publishedAt = new Date(data.publishedAt);
  if (data.title && data.title !== news.title) updateData.slug = generateSlug(data.title);

  const updated = await News.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  return sendSuccess(res, 200, 'News updated successfully', toPlain(updated));
});

export const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return sendError(res, 404, 'News not found');

  if (news.imagePublicId) await deleteLocalImage(news.imagePublicId);
  else if (news.image) await deleteLocalImage(news.image);

  await News.findByIdAndDelete(req.params.id);
  return sendSuccess(res, 200, 'News deleted successfully');
});

export const getNewsByCategory = asyncHandler(async (req, res) => {
  const news = await News.find({ category: req.params.category, status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(20);

  return sendSuccess(res, 200, 'News retrieved successfully', toPlain(news));
});

export const getFeaturedNews = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const news = await News.find({ featured: true, status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit);

  return sendSuccess(res, 200, 'Featured news retrieved successfully', toPlain(news));
});

export const getLatestNews = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const news = await News.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(parseInt(limit, 10));

  return sendSuccess(res, 200, 'Latest news retrieved successfully', toPlain(news));
});

export const toggleFeatured = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return sendError(res, 404, 'News not found');

  news.featured = !news.featured;
  await news.save();
  return sendSuccess(res, 200, `News ${news.featured ? 'featured' : 'unfeatured'} successfully`, { featured: news.featured });
});

export default {
  getAllNews, getNewsById, getNewsBySlug, createNews, updateNews, deleteNews,
  getNewsByCategory, getFeaturedNews, getLatestNews, toggleFeatured,
};
