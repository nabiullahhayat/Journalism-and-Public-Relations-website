import { body } from 'express-validator';
import { bodyBoolean, mongoIdBody } from './common.js';

export const createAdminValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .toLowerCase(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail()
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/\d/)
    .matches(/[@$!%*?&#]/),

  body('role')
    .optional()
    .trim()
    .isIn(['superadmin', 'admin', 'editor', 'viewer']),

  body('fullName')
    .optional({ values: ['', null] })
    .trim()
    .isLength({ min: 2, max: 100 }),

  body('phone')
    .optional({ values: ['', null] })
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/),

  mongoIdBody('departmentId', { optional: true }),
];

export const updateAdminValidator = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .toLowerCase(),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail(),

  body('role')
    .optional()
    .trim()
    .isIn(['superadmin', 'admin', 'editor', 'viewer']),

  body('fullName')
    .optional({ values: ['', null] })
    .trim()
    .isLength({ min: 2, max: 100 }),

  body('phone')
    .optional({ values: ['', null] })
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/),

  bodyBoolean('isActive', { optional: true }),
  mongoIdBody('departmentId', { optional: true }),
];

export const changePasswordValidator = [
  body('currentPassword').trim().notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/\d/)
    .matches(/[@$!%*?&#]/)
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

export default {
  createAdminValidator,
  updateAdminValidator,
  changePasswordValidator,
};
