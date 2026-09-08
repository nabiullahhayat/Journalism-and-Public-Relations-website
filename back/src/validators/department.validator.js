import { body, param } from 'express-validator';

/**
 * Validation rules for Department operations
 */

export const createDepartmentValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Department name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Department name must be between 2 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('head')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('established')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .toDate(),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Location cannot exceed 500 characters'),

  body('website')
    .optional()
    .trim()
    .isURL().withMessage('Please enter a valid URL'),

  body('vision')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Vision cannot exceed 2000 characters'),

  body('mission')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Mission cannot exceed 2000 characters'),

  body('objectives')
    .optional()
    .isArray().withMessage('Objectives must be an array'),

  body('objectives.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('Each objective must be between 1 and 500 characters'),

  body('programs')
    .optional()
    .isArray().withMessage('Programs must be an array'),

  body('programs.*.name')
    .optional()
    .trim()
    .notEmpty().withMessage('Program name is required')
    .isLength({ max: 200 }).withMessage('Program name cannot exceed 200 characters'),

  body('programs.*.degree')
    .optional()
    .trim()
    .isIn(['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate']).withMessage('Invalid degree type'),

  body('programs.*.duration')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Duration must be between 1 and 10 years')
    .toInt(),

  body('socialLinks')
    .optional()
    .isObject().withMessage('Social links must be an object'),

  body('socialLinks.facebook')
    .optional()
    .trim()
    .isURL().withMessage('Invalid Facebook URL'),

  body('socialLinks.twitter')
    .optional()
    .trim()
    .isURL().withMessage('Invalid Twitter URL'),

  body('socialLinks.linkedin')
    .optional()
    .trim()
    .isURL().withMessage('Invalid LinkedIn URL'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean')
];

export const updateDepartmentValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  ...createDepartmentValidator.map(validator => {
    // Make all fields optional for update
    if (validator.builder.fields[0] !== 'id') {
      return validator.optional();
    }
    return validator;
  })
];

export const departmentIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export const addTeacherToDepartmentValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('teacherId')
    .notEmpty().withMessage('Teacher ID is required')
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export const removeTeacherFromDepartmentValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  param('teacherId')
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export default {
  createDepartmentValidator,
  updateDepartmentValidator,
  departmentIdValidator,
  addTeacherToDepartmentValidator,
  removeTeacherFromDepartmentValidator
};
