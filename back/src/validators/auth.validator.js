import { body } from 'express-validator';

export const loginValidator = [
  body('username')
    .notEmpty().withMessage('Username or email is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const registerValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
];

export const forgotPasswordValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
];

export const resetPasswordValidator = [
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('token')
    .notEmpty().withMessage('Reset token is required'),
];

export const updateProfileValidator = [
  body('email')
    .optional()
    .isEmail().withMessage('Please enter a valid email address'),
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
];
