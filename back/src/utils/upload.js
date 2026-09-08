import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { logInfo } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOADS_ROOT = path.join(__dirname, '../../uploads');

export const UPLOAD_FOLDERS = {
  news: 'news',
  teachers: 'teachers',
  banners: 'banners',
  general: 'general',
};

const ensureUploadFolders = () => {
  Object.values(UPLOAD_FOLDERS).forEach((folder) => {
    fs.mkdirSync(path.join(UPLOADS_ROOT, folder), { recursive: true });
  });
};

ensureUploadFolders();

export const getApiBaseUrl = () => {
  const port = process.env.PORT || 3000;
  return process.env.API_PUBLIC_URL || `http://localhost:${port}`;
};

/**
 * Build a public URL for a file stored under /uploads/{folder}/{filename}
 */
export const buildImageUrl = (folder, filename) => {
  const safeFolder = UPLOAD_FOLDERS[folder] || folder;
  return `${getApiBaseUrl()}/uploads/${safeFolder}/${filename}`;
};

/**
 * Resolve a stored image value to a public URL (handles legacy Cloudinary URLs too)
 */
export const resolveImageUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/uploads/')) return `${getApiBaseUrl()}${value}`;
  return `${getApiBaseUrl()}/uploads/${value}`;
};

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|octet-stream)|text\/plain/.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only document files are allowed (pdf, doc, docx, txt)'));
  }
};

const createDiskStorage = (folderKey) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const folderName = UPLOAD_FOLDERS[folderKey] || folderKey;
      const destination = path.join(UPLOADS_ROOT, folderName);
      fs.mkdirSync(destination, { recursive: true });
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '-').slice(0, 40);
      cb(null, `${Date.now()}-${base}${ext}`);
    },
  });

const createImageUpload = (folderKey) =>
  multer({
    storage: createDiskStorage(folderKey),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single('image');

export const uploadNewsImage = createImageUpload('news');
export const uploadTeacherImage = createImageUpload('teachers');
export const uploadBannerImage = createImageUpload('banners');
export const uploadGeneralImage = createImageUpload('general');

/** @deprecated Use uploadNewsImage or uploadTeacherImage */
export const uploadSingleImage = uploadGeneralImage;

export const uploadMultipleImages = multer({
  storage: createDiskStorage('general'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
}).array('images', 5);

export const uploadSingleDocument = multer({
  storage: createDiskStorage('general'),
  fileFilter: documentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('document');

/**
 * Get public URL from multer file object
 */
export const fileToPublicUrl = (file, folderKey) => {
  if (!file) return null;
  const folderName = UPLOAD_FOLDERS[folderKey] || folderKey;
  return buildImageUrl(folderName, file.filename);
};

/**
 * Get relative path stored in DB for deletion (/uploads/news/file.jpg)
 */
export const fileToRelativePath = (file, folderKey) => {
  if (!file) return null;
  const folderName = UPLOAD_FOLDERS[folderKey] || folderKey;
  return `/uploads/${folderName}/${file.filename}`;
};

/**
 * Delete a locally stored image by URL or relative path
 */
export const deleteLocalImage = async (imageRef) => {
  if (!imageRef) return;

  try {
    let relativePath = imageRef;

    if (imageRef.startsWith('http://') || imageRef.startsWith('https://')) {
      const url = new URL(imageRef);
      relativePath = url.pathname;
    }

    if (!relativePath.startsWith('/uploads/')) return;

    const absolutePath = path.join(UPLOADS_ROOT, relativePath.replace(/^\/uploads\//, ''));

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      logInfo(`Deleted local image: ${relativePath}`);
    }
  } catch (error) {
    logInfo(`Could not delete image ${imageRef}: ${error.message}`);
  }
};

/** Backward-compatible aliases (no longer use Cloudinary) */
export const uploadImageToCloudinary = async (fileBuffer, folder = 'general', fileName = 'image.jpg') => {
  const folderKey = folder.includes('news') ? 'news' : folder.includes('teachers') ? 'teachers' : 'general';
  const folderName = UPLOAD_FOLDERS[folderKey];
  const ext = path.extname(fileName) || '.jpg';
  const base = path.basename(fileName, ext).replace(/[^a-z0-9-_]/gi, '-').slice(0, 40);
  const filename = `${Date.now()}-${base}${ext}`;
  const destination = path.join(UPLOADS_ROOT, folderName);

  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, filename), fileBuffer);

  return {
    success: true,
    url: buildImageUrl(folderName, filename),
    publicId: `/uploads/${folderName}/${filename}`,
    public_id: `/uploads/${folderName}/${filename}`,
  };
};

export const deleteImageFromCloudinary = deleteLocalImage;

export const extractPublicIdFromUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/uploads/')) return url;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith('/uploads/')) return parsed.pathname;
  } catch {
    return null;
  }
  return null;
};

export const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }

  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedImageTypes.includes(file.mimetype)) {
    errors.push('File type not allowed. Allowed types: JPEG, JPG, PNG, GIF, WEBP');
  }

  if (file.size > maxSize) {
    errors.push(`File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
  }

  return { isValid: errors.length === 0, errors };
};

export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, message: 'Too many files. Maximum is 5 files' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ success: false, message: 'Unexpected field name' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err) {
    return res.status(400).json({ success: false, message: err.message || 'File upload error' });
  }

  next();
};

export const getOptimizedImageUrl = (imagePath) => resolveImageUrl(imagePath);
