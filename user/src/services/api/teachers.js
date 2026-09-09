import {
  STORAGE_KEYS,
  getCollection,
  findById,
  createItem,
  updateItem,
  deleteItem,
  formatTeacher,
} from '../storage/db.js';
import { delay, success, paginate, parseFormData } from '../storage/helpers.js';

export const teachersAPI = {
  getAll: async (params = {}) => {
    await delay();
    let items = getCollection(STORAGE_KEYS.TEACHERS).map(formatTeacher);

    if (params.department) items = items.filter((t) => t.departmentId === params.department);
    if (params.isActive !== undefined) {
      items = items.filter((t) => t.isActive === (params.isActive === 'true' || params.isActive === true));
    }

    const { data, pagination } = paginate(items, {
      ...params,
      searchFields: ['name', 'email', 'city'],
    });
    return success('Teachers retrieved successfully', data, { pagination });
  },

  getById: async (id) => {
    await delay();
    const teacher = findById(STORAGE_KEYS.TEACHERS, id);
    if (!teacher) throw { message: 'Teacher not found', status: 404 };
    return success('Teacher retrieved successfully', formatTeacher(teacher));
  },

  getByDepartment: async (departmentId, params = {}) => {
    await delay();
    return teachersAPI.getAll({ ...params, department: departmentId });
  },

  getFeatured: async (limit = 6) => {
    await delay();
    const data = getCollection(STORAGE_KEYS.TEACHERS)
      .filter((t) => t.isActive !== false)
      .slice(0, limit)
      .map(formatTeacher);
    return success('Featured teachers retrieved', data);
  },

  create: async (formData) => {
    await delay();
    const data = await parseFormData(formData);

    if (data.email) {
      const existing = getCollection(STORAGE_KEYS.TEACHERS).find((t) => t.email === data.email);
      if (existing) throw { message: 'Teacher with this email already exists' };
    }

    const teacher = createItem(STORAGE_KEYS.TEACHERS, {
      ...data,
      researchPapers: data.researchPapers || [],
      professionalCertificates: data.professionalCertificates || [],
      classes: data.classes || [],
      isActive: data.isActive !== false,
    });

    return success('Teacher created successfully', formatTeacher(teacher));
  },

  update: async (id, formData) => {
    await delay();
    const teacher = findById(STORAGE_KEYS.TEACHERS, id);
    if (!teacher) throw { message: 'Teacher not found', status: 404 };

    const data = await parseFormData(formData);

    if (data.email && data.email !== teacher.email) {
      const conflict = getCollection(STORAGE_KEYS.TEACHERS).find((t) => t.email === data.email && t.id !== id);
      if (conflict) throw { message: 'Teacher with this email already exists' };
    }

    const updated = updateItem(STORAGE_KEYS.TEACHERS, id, data);
    return success('Teacher updated successfully', formatTeacher(updated));
  },

  delete: async (id) => {
    await delay();
    if (!deleteItem(STORAGE_KEYS.TEACHERS, id)) throw { message: 'Teacher not found', status: 404 };
    return success('Teacher deleted successfully');
  },

  addPublication: async (id, publication) => {
    await delay();
    const teacher = findById(STORAGE_KEYS.TEACHERS, id);
    const publications = [...(teacher.publications || []), { ...publication, id: crypto.randomUUID?.() || Date.now() }];
    updateItem(STORAGE_KEYS.TEACHERS, id, { publications });
    return success('Publication added');
  },

  removePublication: async (id, publicationId) => {
    await delay();
    const teacher = findById(STORAGE_KEYS.TEACHERS, id);
    const publications = (teacher.publications || []).filter((p) => p.id !== publicationId);
    updateItem(STORAGE_KEYS.TEACHERS, id, { publications });
    return success('Publication removed');
  },

  addAward: async (id, award) => {
    await delay();
    const teacher = findById(STORAGE_KEYS.TEACHERS, id);
    const awards = [...(teacher.awards || []), { ...award, id: crypto.randomUUID?.() || Date.now() }];
    updateItem(STORAGE_KEYS.TEACHERS, id, { awards });
    return success('Award added');
  },

  removeAward: async (id, awardId) => {
    await delay();
    const teacher = findById(STORAGE_KEYS.TEACHERS, id);
    const awards = (teacher.awards || []).filter((a) => a.id !== awardId);
    updateItem(STORAGE_KEYS.TEACHERS, id, { awards });
    return success('Award removed');
  },

  toggleFeatured: async () => {
    await delay();
    return success('Featured status updated');
  },
};
