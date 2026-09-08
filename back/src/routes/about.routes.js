import express from 'express';
import * as aboutController from '../controllers/about.controller.js';
import { verifyToken, isEditor } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { updateAboutValidator } from '../validators/about.validator.js';

const router = express.Router();

/**
 * @route   GET /api/v1/about
 * @desc    Get about information
 * @access  Public
 */
router.get('/', aboutController.getAbout);

/**
 * @route   PUT /api/v1/about
 * @desc    Update about information
 * @access  Private (Admin/Superadmin)
 */
router.put(
  '/',
  verifyToken,
  isEditor,
  updateAboutValidator,
  validate,
  aboutController.updateAbout
);

export default router;
