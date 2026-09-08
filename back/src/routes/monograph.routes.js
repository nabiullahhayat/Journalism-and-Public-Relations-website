import express from 'express';
import * as monographController from '../controllers/monograph.controller.js';
import { verifyToken, isEditor } from '../middlewares/auth.js';
import { validate, validateObjectId } from '../middlewares/validate.js';
import { 
  createMonographValidator, 
  updateMonographValidator,
  monographYearValidator 
} from '../validators/monograph.validator.js';

const router = express.Router();

/**
 * @route   GET /api/v1/monographs/year/:year
 * @desc    Get monographs by year
 * @access  Public
 */
router.get('/year/:year', monographYearValidator, validate, monographController.getMonographsByYear);

/**
 * @route   GET /api/v1/monographs
 * @desc    Get all monographs
 * @access  Public
 */
router.get('/', monographController.getAllMonographs);

/**
 * @route   GET /api/v1/monographs/:id
 * @desc    Get single monograph
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), monographController.getMonographById);

/**
 * @route   POST /api/v1/monographs
 * @desc    Create new monograph
 * @access  Private (Admin/Superadmin)
 */
router.post(
  '/',
  verifyToken,
  isEditor,
  createMonographValidator,
  validate,
  monographController.createMonograph
);

/**
 * @route   PUT /api/v1/monographs/:id
 * @desc    Update monograph
 * @access  Private (Admin/Superadmin)
 */
router.put(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  updateMonographValidator,
  validate,
  monographController.updateMonograph
);

/**
 * @route   DELETE /api/v1/monographs/:id
 * @desc    Delete monograph
 * @access  Private (Superadmin)
 */
router.delete(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  monographController.deleteMonograph
);

export default router;
