import {
  STORAGE_KEYS,
  getCollection,
  findById,
  createItem,
  updateItem,
  deleteItem,
  formatMonograph,
} from '../storage/db.js';
import { delay, success, paginate } from '../storage/helpers.js';

export const monographsAPI = {
  getAll: async (params = {}) => {
    await delay();
    let items = getCollection(STORAGE_KEYS.MONOGRAPHS).map(formatMonograph);

    if (params.department) items = items.filter((m) => m.departmentId === params.department);
    if (params.year) items = items.filter((m) => String(m.year) === String(params.year));
    if (params.degree) items = items.filter((m) => m.degree === params.degree);
    if (params.publishedOnly) items = items.filter((m) => m.isPublished !== false);

    items.sort((a, b) => (b.year || 0) - (a.year || 0));

    const { data, pagination } = paginate(items, {
      ...params,
      searchFields: ['studentName', 'supervisor', 'title', 'issue'],
    });
    return success('Monographs retrieved successfully', data, { pagination });
  },

  getById: async (id) => {
    await delay();
    const mono = findById(STORAGE_KEYS.MONOGRAPHS, id);
    if (!mono) throw { message: 'Monograph not found', status: 404 };
    updateItem(STORAGE_KEYS.MONOGRAPHS, id, { downloads: (mono.downloads || 0) + 1 });
    return success('Monograph retrieved successfully', formatMonograph({ ...mono, downloads: (mono.downloads || 0) + 1 }));
  },

  getByYear: async (year) => {
    await delay();
    const data = getCollection(STORAGE_KEYS.MONOGRAPHS)
      .filter((m) => m.year === parseInt(year, 10) && m.isPublished !== false)
      .map(formatMonograph);
    return success('Monographs retrieved successfully', data);
  },

  create: async (data) => {
    await delay();
    const mono = createItem(STORAGE_KEYS.MONOGRAPHS, {
      ...data,
      keywords: data.keywords || [],
      isPublished: data.isPublished !== false,
      downloads: 0,
    });
    return success('Monograph created successfully', formatMonograph(mono));
  },

  update: async (id, data) => {
    await delay();
    if (!findById(STORAGE_KEYS.MONOGRAPHS, id)) throw { message: 'Monograph not found', status: 404 };
    const updated = updateItem(STORAGE_KEYS.MONOGRAPHS, id, data);
    return success('Monograph updated successfully', formatMonograph(updated));
  },

  delete: async (id) => {
    await delay();
    if (!deleteItem(STORAGE_KEYS.MONOGRAPHS, id)) throw { message: 'Monograph not found', status: 404 };
    return success('Monograph deleted successfully');
  },
};
