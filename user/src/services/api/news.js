import {
  STORAGE_KEYS,
  getCollection,
  findById,
  createItem,
  updateItem,
  deleteItem,
} from '../storage/db.js';
import { delay, success, paginate, parseFormData, slugify } from '../storage/helpers.js';

const isPublished = (item) => (item.status || 'published') === 'published' || item.isPublished !== false;

export const newsAPI = {
  getAll: async (params = {}) => {
    await delay();
    let items = [...getCollection(STORAGE_KEYS.NEWS)];

    if (params.status === 'published') {
      items = items.filter(isPublished);
    }
    if (params.category) items = items.filter((n) => n.category === params.category);
    if (params.featured !== undefined) {
      items = items.filter((n) => n.featured === (params.featured === 'true' || params.featured === true));
    }

    items.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));

    const { data, pagination } = paginate(items, {
      ...params,
      searchFields: ['title', 'description', 'excerpt', 'content'],
    });
    return success('News retrieved successfully', data, { pagination });
  },

  getById: async (id) => {
    await delay();
    const news = findById(STORAGE_KEYS.NEWS, id);
    if (!news) throw { message: 'News not found', status: 404 };
    updateItem(STORAGE_KEYS.NEWS, id, { views: (news.views || 0) + 1 });
    return success('News retrieved successfully', { ...news, views: (news.views || 0) + 1 });
  },

  getBySlug: async (slug) => {
    await delay();
    const news = getCollection(STORAGE_KEYS.NEWS).find((n) => n.slug === slug);
    if (!news) throw { message: 'News not found', status: 404 };
    updateItem(STORAGE_KEYS.NEWS, news.id, { views: (news.views || 0) + 1 });
    return success('News retrieved successfully', { ...news, views: (news.views || 0) + 1 });
  },

  getByCategory: async (category, params = {}) => {
    await delay();
    return newsAPI.getAll({ ...params, category, status: 'published' });
  },

  getFeatured: async (limit = 6) => {
    await delay();
    const data = getCollection(STORAGE_KEYS.NEWS)
      .filter((n) => isPublished(n) && n.featured)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
      .slice(0, limit);
    return success('Featured news retrieved', data);
  },

  getLatest: async (limit = 10) => {
    await delay();
    const data = getCollection(STORAGE_KEYS.NEWS)
      .filter(isPublished)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
      .slice(0, limit);
    return success('Latest news retrieved', data);
  },

  create: async (formData) => {
    await delay();
    const data = await parseFormData(formData);
    const news = createItem(STORAGE_KEYS.NEWS, {
      title: data.title,
      description: data.description || data.excerpt || data.content || data.title,
      content: data.content || null,
      excerpt: data.excerpt || null,
      image: data.image || null,
      category: data.category || 'general',
      author: data.author || 'Faculty Administration',
      featured: data.featured || false,
      status: data.status || 'published',
      isPublished: true,
      tags: Array.isArray(data.tags) ? data.tags : [],
      slug: `${slugify(data.title)}-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      views: 0,
    });
    return success('News created successfully', news);
  },

  update: async (id, formData) => {
    await delay();
    const existing = findById(STORAGE_KEYS.NEWS, id);
    if (!existing) throw { message: 'News not found', status: 404 };

    const data = await parseFormData(formData);
    const payload = { ...data };
    if (payload.title && payload.title !== existing.title) {
      payload.slug = `${slugify(payload.title)}-${Date.now()}`;
    }
    if (payload.description === undefined && payload.excerpt) {
      payload.description = payload.excerpt;
    }

    const updated = updateItem(STORAGE_KEYS.NEWS, id, payload);
    return success('News updated successfully', updated);
  },

  delete: async (id) => {
    await delay();
    if (!deleteItem(STORAGE_KEYS.NEWS, id)) throw { message: 'News not found', status: 404 };
    return success('News deleted successfully');
  },

  toggleFeatured: async (id) => {
    await delay();
    const news = findById(STORAGE_KEYS.NEWS, id);
    if (!news) throw { message: 'News not found', status: 404 };
    const updated = updateItem(STORAGE_KEYS.NEWS, id, { featured: !news.featured });
    return success('Featured status updated', updated);
  },
};
