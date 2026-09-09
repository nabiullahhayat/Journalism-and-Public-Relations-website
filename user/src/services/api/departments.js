import {
  STORAGE_KEYS,
  getCollection,
  findById,
  createItem,
  updateItem,
  deleteItem,
  formatDepartment,
} from '../storage/db.js';
import { delay, success, paginate } from '../storage/helpers.js';

export const departmentsAPI = {
  getAll: async (params = {}) => {
    await delay();
    const items = getCollection(STORAGE_KEYS.DEPARTMENTS).map(formatDepartment);
    const { data, pagination } = paginate(items, {
      ...params,
      searchFields: ['name', 'description', 'code'],
    });
    return success('Departments retrieved successfully', data, { pagination });
  },

  getById: async (id) => {
    await delay();
    const dept = findById(STORAGE_KEYS.DEPARTMENTS, id);
    if (!dept) throw { message: 'Department not found', status: 404 };
    return success('Department retrieved successfully', formatDepartment(dept));
  },

  getList: async () => {
    await delay();
    const data = getCollection(STORAGE_KEYS.DEPARTMENTS)
      .filter((d) => d.isActive !== false)
      .map((d) => ({ id: d.id, name: d.name, code: d.code }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return success('Department list retrieved', data);
  },

  getStats: async (id) => {
    await delay();
    const dept = formatDepartment(findById(STORAGE_KEYS.DEPARTMENTS, id));
    if (!dept) throw { message: 'Department not found', status: 404 };
    const courses = getCollection(STORAGE_KEYS.COURSES).filter((c) => c.departmentId === id).length;
    return success('Stats retrieved', {
      teachers: dept.teacherCount,
      courses,
    });
  },

  create: async (data) => {
    await delay();
    const existing = getCollection(STORAGE_KEYS.DEPARTMENTS).find((d) => d.name === data.name);
    if (existing) throw { message: 'Department with this name already exists' };

    const dept = createItem(STORAGE_KEYS.DEPARTMENTS, data);
    return success('Department created successfully', formatDepartment(dept));
  },

  update: async (id, data) => {
    await delay();
    const dept = findById(STORAGE_KEYS.DEPARTMENTS, id);
    if (!dept) throw { message: 'Department not found', status: 404 };

    if (data.name && data.name !== dept.name) {
      const conflict = getCollection(STORAGE_KEYS.DEPARTMENTS).find((d) => d.name === data.name && d.id !== id);
      if (conflict) throw { message: 'Department with this name already exists' };
    }

    const updated = updateItem(STORAGE_KEYS.DEPARTMENTS, id, data);
    return success('Department updated successfully', formatDepartment(updated));
  },

  delete: async (id) => {
    await delay();
    if (!deleteItem(STORAGE_KEYS.DEPARTMENTS, id)) throw { message: 'Department not found', status: 404 };
    return success('Department deleted successfully');
  },

  addTeacher: async (id, teacherId) => {
    await delay();
    updateItem(STORAGE_KEYS.TEACHERS, teacherId, { departmentId: id });
    return success('Teacher added to department');
  },

  removeTeacher: async (id, teacherId) => {
    await delay();
    const teacher = findById(STORAGE_KEYS.TEACHERS, teacherId);
    if (teacher?.departmentId === id) {
      updateItem(STORAGE_KEYS.TEACHERS, teacherId, { departmentId: null });
    }
    return success('Teacher removed from department');
  },

  setHead: async (id, teacherId) => {
    await delay();
    updateItem(STORAGE_KEYS.DEPARTMENTS, id, { headId: teacherId });
    return success('Department head updated');
  },
};
