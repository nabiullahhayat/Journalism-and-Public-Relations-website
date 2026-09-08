import express from 'express';
import * as newsController from '../controllers/news.controller.js';
import { verifyToken, isEditor } from '../middlewares/auth.js';
import { validate, validateObjectId } from '../middlewares/validate.js';
import { uploadNewsImage, handleUploadError } from '../utils/upload.js';
import { 
  createNewsValidator, 
  updateNewsValidator,
  newsIdValidator,
  newsSlugValidator 
} from '../validators/news.validator.js';

const router = express.Router();

/**
 * @route   GET /api/v1/news/featured
 * @desc    Get featured news
 * @access  Public
 */
router.get('/featured', newsController.getFeaturedNews);

/**
 * @route   GET /api/v1/news/latest
 * @desc    Get latest news
 * @access  Public
 */
router.get('/latest', newsController.getLatestNews);

/**
 * @route   GET /api/v1/news/category/:category
 * @desc    Get news by category
 * @access  Public
 */
router.get('/category/:category', newsController.getNewsByCategory);

/**
 * @route   GET /api/v1/news/slug/:slug
 * @desc    Get news by slug
 * @access  Public
 */
router.get('/slug/:slug', newsSlugValidator, validate, newsController.getNewsBySlug);

/**
 * @route   GET /api/v1/news
 * @desc    Get all news
 * @access  Public
 */
router.get('/', newsController.getAllNews);

/**
 * @route   GET /api/v1/news/:id
 * @desc    Get single news
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), newsController.getNewsById);

/**
 * @route   POST /api/v1/news
 * @desc    Create new news
 * @access  Private (Editor/Admin/Superadmin)
 */
router.post(
  '/',
  verifyToken,
  isEditor,
  uploadNewsImage,
  handleUploadError,
  createNewsValidator,
  validate,
  newsController.createNews
);

/**
 * @route   PUT /api/v1/news/:id
 * @desc    Update news
 * @access  Private (Editor/Admin/Superadmin)
 */
router.put(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  uploadNewsImage,
  handleUploadError,
  updateNewsValidator,
  validate,
  newsController.updateNews
);

/**
 * @route   DELETE /api/v1/news/:id
 * @desc    Delete news
 * @access  Private (Admin/Superadmin)
 */
router.delete(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  newsController.deleteNews
);

/**
 * @route   PATCH /api/v1/news/:id/toggle-featured
 * @desc    Toggle news featured status
 * @access  Private (Admin/Superadmin)
 */
router.patch(
  '/:id/toggle-featured',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  newsController.toggleFeatured
);

export default router;
