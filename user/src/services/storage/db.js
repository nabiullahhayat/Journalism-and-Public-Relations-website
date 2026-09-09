import { STORAGE_KEYS, DATA_CHANGE_EVENT } from './keys.js';
import { createId } from './helpers.js';

export const notifyChange = (key) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATA_CHANGE_EVENT, { detail: { key } }));
  }
};

export const getCollection = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setCollection = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
  notifyChange(key);
};

export const getSingleton = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setSingleton = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  notifyChange(key);
  return value;
};

export const findById = (key, id) => {
  if (!id) return null;
  return getCollection(key).find((item) => item.id === id) || null;
};

export const createItem = (key, payload, extra = {}) => {
  const now = new Date().toISOString();
  const item = {
    id: createId(),
    ...payload,
    ...extra,
    createdAt: now,
    updatedAt: now,
  };
  const items = getCollection(key);
  items.push(item);
  setCollection(key, items);
  return item;
};

export const updateItem = (key, id, payload) => {
  const items = getCollection(key);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated = {
    ...items[index],
    ...payload,
    id: items[index].id,
    updatedAt: new Date().toISOString(),
  };
  items[index] = updated;
  setCollection(key, items);
  return updated;
};

export const deleteItem = (key, id) => {
  const items = getCollection(key);
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  setCollection(key, next);
  return true;
};

export const getDepartmentById = (id) => findById(STORAGE_KEYS.DEPARTMENTS, id);

export const getTeacherById = (id) => findById(STORAGE_KEYS.TEACHERS, id);

export const getRankById = (id) => findById(STORAGE_KEYS.ACADEMIC_RANKS, id);

export const formatDepartment = (dept) => {
  if (!dept) return null;
  const teachers = getCollection(STORAGE_KEYS.TEACHERS).filter(
    (t) => t.departmentId === dept.id && t.isActive !== false
  );
  const head = dept.headId ? getTeacherById(dept.headId) : null;
  return {
    ...dept,
    head: head ? { id: head.id, name: head.name, email: head.email, phone: head.phone } : null,
    teachers: teachers.map((t) => ({ id: t.id, name: t.name, email: t.email, departmentId: t.departmentId })),
    teacherCount: teachers.length,
  };
};

export const formatTeacher = (teacher) => {
  if (!teacher) return null;
  const dept = teacher.departmentId ? getDepartmentById(teacher.departmentId) : null;
  const rank = teacher.academicRankId ? getRankById(teacher.academicRankId) : null;
  return {
    ...teacher,
    department: dept ? { id: dept.id, name: dept.name, code: dept.code } : null,
    departmentId: teacher.departmentId,
    academicRank: rank ? { id: rank.id, name: rank.name, level: rank.level } : null,
    academicRankId: teacher.academicRankId,
  };
};

export const formatCourse = (course) => {
  if (!course) return null;
  const dept = course.departmentId ? getDepartmentById(course.departmentId) : null;
  const teacher = course.teacherId ? getTeacherById(course.teacherId) : null;
  return {
    ...course,
    department: dept ? { id: dept.id, name: dept.name, code: dept.code } : null,
    departmentId: course.departmentId,
    teacher: teacher ? { id: teacher.id, name: teacher.name, email: teacher.email } : null,
    teacherId: course.teacherId,
  };
};

export const formatMonograph = (mono) => {
  if (!mono) return null;
  const dept = mono.departmentId ? getDepartmentById(mono.departmentId) : null;
  return {
    ...mono,
    department: dept ? { id: dept.id, name: dept.name, code: dept.code } : null,
    departmentId: mono.departmentId,
  };
};

export const formatAdmin = (admin) => {
  if (!admin) return null;
  const dept = admin.departmentId ? getDepartmentById(admin.departmentId) : null;
  const { password, ...safe } = admin;
  return {
    ...safe,
    department: dept ? { id: dept.id, name: dept.name, code: dept.code } : null,
  };
};

export { STORAGE_KEYS };
