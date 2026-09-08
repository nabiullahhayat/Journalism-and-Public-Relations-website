import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { verifyToken, isSuperAdmin, isAdmin } from '../middlewares/auth.js';
import { validate, validateObjectId } from '../middlewares/validate.js';
import { 
  createAdminValidator, 
  updateAdminValidator, 
  changePasswordValidator,
} from '../validators/admin.validator.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/v1/admins/stats
 * @desc    Get admin statistics
 * @access  Private (Superadmin)
 */
router.get('/stats', isSuperAdmin, adminController.getAdminStats);

/**
 * @route   GET /api/v1/admins
 * @desc    Get all admins
 * @access  Private (Admin/Superadmin)
 */
router.get('/', isAdmin, adminController.getAllAdmins);

/**
 * @route   GET /api/v1/admins/:id
 * @desc    Get single admin by ID
 * @access  Private (Admin/Superadmin)
 */
router.get(
  '/:id',
  isAdmin,
  validateObjectId('id'),
  adminController.getAdminById
);

/**
 * @route   POST /api/v1/admins
 * @desc    Create new admin
 * @access  Private (Superadmin)
 */
router.post(
  '/',
  isSuperAdmin,
  createAdminValidator,
  validate,
  adminController.createAdmin
);

/**
 * @route   PUT /api/v1/admins/:id
 * @desc    Update admin
 * @access  Private (Superadmin or own account)
 */
router.put(
  '/:id',
  validateObjectId('id'),
  updateAdminValidator,
  validate,
  adminController.updateAdmin
);

/**
 * @route   DELETE /api/v1/admins/:id
 * @desc    Delete admin
 * @access  Private (Superadmin)
 */
router.delete(
  '/:id',
  isSuperAdmin,
  validateObjectId('id'),
  adminController.deleteAdmin
);

/**
 * @route   PUT /api/v1/admins/:id/change-password
 * @desc    Change admin password (by superadmin)
 * @access  Private (Superadmin)
 */
router.put(
  '/:id/change-password',
  isSuperAdmin,
  validateObjectId('id'),
  changePasswordValidator,
  validate,
  adminController.changeAdminPassword
);

/**
 * @route   PATCH /api/v1/admins/:id/toggle-status
 * @desc    Toggle admin active status
 * @access  Private (Superadmin)
 */
router.patch(
  '/:id/toggle-status',
  isSuperAdmin,
  validateObjectId('id'),
  adminController.toggleAdminStatus
);

export default router;
