import { body, param } from 'express-validator';

/**
 * Validation rules for Monograph operations
 */

export const createMonographValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 500 }).withMessage('Title must be between 5 and 500 characters'),

  body('studentName')
    .trim()
    .notEmpty().withMessage('Student name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Student name must be between 2 and 200 characters'),

  body('studentId')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Student ID cannot exceed 50 characters'),

  body('supervisor')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('department')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('abstract')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Abstract cannot exceed 5000 characters'),

  body('keywords')
    .optional()
    .isArray().withMessage('Keywords must be an array'),

  body('keywords.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Each keyword must be between 1 and 50 characters'),

  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1950, max: new Date().getFullYear() + 5 }).withMessage('Invalid year')
    .toInt(),

  body('degree')
    .optional()
    .trim()
    .isIn(['Bachelor', 'Master', 'PhD']).withMessage('Invalid degree type'),

  body('pages')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Pages must be between 1 and 10000')
    .toInt(),

  body('language')
    .optional()
    .trim()
    .isIn(['English', 'Arabic', 'French', 'Kurdish', 'Turkish']).withMessage('Invalid language'),

  body('status')
    .optional()
    .trim()
    .isIn(['pending', 'approved', 'published']).withMessage('Invalid status'),

  body('publishDate')
    .optional()
    .isISO8601().withMessage('Invalid publish date format')
    .toDate(),

  body('isbn')
    .optional()
    .trim()
    .matches(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/i).withMessage('Invalid ISBN format'),

  body('doi')
    .optional()
    .trim(),

  body('downloadUrl')
    .optional()
    .trim()
    .isURL().withMessage('Invalid download URL'),

  body('available')
    .optional()
    .isBoolean().withMessage('Available must be a boolean')
];

export const updateMonographValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 }).withMessage('Title must be between 5 and 500 characters'),

  body('studentName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Student name must be between 2 and 200 characters'),

  body('studentId')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Student ID cannot exceed 50 characters'),

  body('supervisor')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('department')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('abstract')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Abstract cannot exceed 5000 characters'),

  body('year')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 5 }).withMessage('Invalid year')
    .toInt(),

  body('degree')
    .optional()
    .trim()
    .isIn(['Bachelor', 'Master', 'PhD']).withMessage('Invalid degree type'),

  body('status')
    .optional()
    .trim()
    .isIn(['pending', 'approved', 'published']).withMessage('Invalid status'),

  body('available')
    .optional()
    .isBoolean().withMessage('Available must be a boolean')
];

export const monographIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export const monographYearValidator = [
  param('year')
    .isInt({ min: 1950, max: new Date().getFullYear() + 5 }).withMessage('Invalid year')
    .toInt()
];

export const monographDegreeValidator = [
  param('degree')
    .trim()
    .isIn(['Bachelor', 'Master', 'PhD']).withMessage('Invalid degree type')
];

export default {
  createMonographValidator,
  updateMonographValidator,
  monographIdValidator,
  monographYearValidator,
  monographDegreeValidator
};
