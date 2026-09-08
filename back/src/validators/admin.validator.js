import { body, param } from 'express-validator';

/**
 * Validation rules for Admin operations
 */

export const createAdminValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    .toLowerCase(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character'),

  body('role')
    .optional()
    .trim()
    .isIn(['superadmin', 'admin', 'editor', 'viewer']).withMessage('Invalid role. Must be superadmin, admin, editor, or viewer'),

  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),

  body('department')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export const updateAdminValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    .toLowerCase(),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('role')
    .optional()
    .trim()
    .isIn(['superadmin', 'admin', 'editor', 'viewer']).withMessage('Invalid role'),

  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),

  body('department')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export const changePasswordValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .trim()
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('New password must contain at least one number')
    .matches(/[@$!%*?&#]/).withMessage('New password must contain at least one special character')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),

  body('confirmPassword')
    .trim()
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

export const adminIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export default {
  createAdminValidator,
  updateAdminValidator,
  changePasswordValidator,
  adminIdValidator
};
