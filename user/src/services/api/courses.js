import {
  STORAGE_KEYS,
  getCollection,
  findById,
  createItem,
  updateItem,
  deleteItem,
  formatCourse,
} from '../storage/db.js';
import { delay, success, paginate } from '../storage/helpers.js';

export const coursesAPI = {
  getAll: async (params = {}) => {
    await delay();
    let items = getCollection(STORAGE_KEYS.COURSES).map(formatCourse);

    if (params.department) items = items.filter((c) => c.departmentId === params.department);
    if (params.level) items = items.filter((c) => c.level === params.level);
    if (params.isActive !== undefined) {
      items = items.filter((c) => c.isActive === (params.isActive === 'true' || params.isActive === true));
    }

    const { data, pagination } = paginate(items, {
      ...params,
      searchFields: ['name', 'code', 'description'],
    });
    return success('Courses retrieved successfully', data, { pagination });
  },

  getById: async (id) => {
    await delay();
    const course = findById(STORAGE_KEYS.COURSES, id);
    if (!course) throw { message: 'Course not found', status: 404 };
    return success('Course retrieved successfully', formatCourse(course));
  },

  getByCode: async (code) => {
    await delay();
    const course = getCollection(STORAGE_KEYS.COURSES).find(
      (c) => c.code?.toUpperCase() === String(code).toUpperCase()
    );
    if (!course) throw { message: 'Course not found', status: 404 };
    return success('Course retrieved successfully', formatCourse(course));
  },

  getByDepartment: async (departmentId, params = {}) => {
    await delay();
    return coursesAPI.getAll({ ...params, department: departmentId });
  },

  getByLevel: async (level, params = {}) => {
    await delay();
    return coursesAPI.getAll({ ...params, level });
  },

  create: async (data) => {
    await delay();
    const payload = { ...data };
    if (payload.code) payload.code = payload.code.toUpperCase();

    if (payload.code) {
      const existing = getCollection(STORAGE_KEYS.COURSES).find((c) => c.code === payload.code);
      if (existing) throw { message: 'Course with this code already exists' };
    }

    const course = createItem(STORAGE_KEYS.COURSES, payload);
    return success('Course created successfully', formatCourse(course));
  },

  update: async (id, data) => {
    await delay();
    const course = findById(STORAGE_KEYS.COURSES, id);
    if (!course) throw { message: 'Course not found', status: 404 };

    const payload = { ...data };
    if (payload.code) payload.code = payload.code.toUpperCase();

    if (payload.code && payload.code !== course.code) {
      const conflict = getCollection(STORAGE_KEYS.COURSES).find((c) => c.code === payload.code && c.id !== id);
      if (conflict) throw { message: 'Course with this code already exists' };
    }

    const updated = updateItem(STORAGE_KEYS.COURSES, id, payload);
    return success('Course updated successfully', formatCourse(updated));
  },

  delete: async (id) => {
    await delay();
    if (!deleteItem(STORAGE_KEYS.COURSES, id)) throw { message: 'Course not found', status: 404 };
    return success('Course deleted successfully');
  },

  addInstructor: async (id, instructorId) => {
    await delay();
    updateItem(STORAGE_KEYS.COURSES, id, { teacherId: instructorId });
    return success('Instructor added');
  },

  removeInstructor: async (id) => {
    await delay();
    updateItem(STORAGE_KEYS.COURSES, id, { teacherId: null });
    return success('Instructor removed');
  },
};
