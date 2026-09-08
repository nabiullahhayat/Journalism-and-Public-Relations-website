import express from 'express';
import * as contactController from '../controllers/contact.controller.js';
import { verifyToken, isEditor } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { updateContactValidator, contactMessageValidator } from '../validators/contact.validator.js';
import { publicLimiter } from '../middlewares/security.js';

const router = express.Router();

/**
 * @route   GET /api/v1/contact
 * @desc    Get contact information
 * @access  Public
 */
router.get('/', contactController.getContact);

/**
 * @route   PUT /api/v1/contact
 * @desc    Update contact information
 * @access  Private (Admin/Superadmin)
 */
router.put(
  '/',
  verifyToken,
  isEditor,
  updateContactValidator,
  validate,
  contactController.updateContact
);

/**
 * @route   POST /api/v1/contact/message
 * @desc    Send contact message
 * @access  Public (Rate limited)
 */
router.post(
  '/message',
  publicLimiter,
  contactMessageValidator,
  validate,
  contactController.sendContactMessage
);

export default router;
