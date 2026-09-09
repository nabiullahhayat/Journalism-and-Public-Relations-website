export const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const delay = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

export const slugify = (title) =>
  String(title || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const success = (message, data = null, meta = null) => ({
  success: true,
  message,
  data,
  ...(meta ? { meta } : {}),
});

export const paginate = (items, { page = 1, limit = 10, search = '', searchFields = ['name'] } = {}) => {
  let filtered = [...items];

  if (search && String(search).trim()) {
    const q = String(search).trim().toLowerCase();
    filtered = filtered.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        if (val == null) return false;
        if (Array.isArray(val)) return val.some((v) => String(v).toLowerCase().includes(q));
        return String(val).toLowerCase().includes(q);
      })
    );
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limitNum));
  const start = (pageNum - 1) * limitNum;

  return {
    data: filtered.slice(start, start + limitNum),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

export const parseBool = (value) => {
  if (value === true || value === false) return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return Boolean(value);
};

export const parseIntOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const parseFormData = async (input) => {
  if (!(input instanceof FormData)) return input;

  const data = {};
  for (const [key, value] of input.entries()) {
    if (value instanceof File && value.size > 0) {
      const base64 = await fileToBase64(value);
      if (key === 'image') {
        data.profileImage = base64;
        data.image = base64;
      } else {
        data[key] = base64;
      }
    } else if (typeof value === 'string') {
      data[key] = value;
    }
  }

  ['isActive', 'featured', 'isPublished'].forEach((field) => {
    if (data[field] !== undefined) data[field] = parseBool(data[field]);
  });

  ['schoolGraduationYear', 'bachelorGraduationYear', 'masterGraduationYear', 'phdGraduationYear', 'year', 'semester', 'credits', 'time', 'pages'].forEach((field) => {
    if (data[field] !== undefined && data[field] !== '') {
      const n = parseInt(data[field], 10);
      if (!Number.isNaN(n)) data[field] = n;
    }
  });

  if (data.departmentId === '') data.departmentId = null;
  if (data.teacherId === '') data.teacherId = null;
  if (data.academicRankId === '') data.academicRankId = null;

  return data;
};

export const stripPassword = (admin) => {
  if (!admin) return admin;
  const { password, ...safe } = admin;
  return safe;
};
