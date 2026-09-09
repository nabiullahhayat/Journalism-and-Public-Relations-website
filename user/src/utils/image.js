/**
 * Resolve image path (supports full URLs, data URLs, and legacy /uploads paths)
 */
export const getImageUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }
  return value;
};

export default getImageUrl;
