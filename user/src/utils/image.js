const API_PUBLIC_URL = import.meta.env.VITE_API_PUBLIC_URL
  || import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1\/?$/, '')
  || 'http://localhost:3001';

/**
 * Resolve image path from API (supports full URLs and /uploads/... paths)
 */
export const getImageUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }
  if (value.startsWith('/')) return `${API_PUBLIC_URL}${value}`;
  return `${API_PUBLIC_URL}/${value}`;
};

export default getImageUrl;
