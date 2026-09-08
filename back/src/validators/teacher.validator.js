import { body, param } from 'express-validator';

/**
 * Validation rules for Teacher operations
 */

export const createTeacherValidator = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Full name must be between 2 and 200 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),

  body('department')
    .notEmpty().withMessage('Department is required')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Position cannot exceed 100 characters'),

  body('academicRank')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('specialization')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Specialization cannot exceed 500 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Bio cannot exceed 5000 characters'),

  body('officeLocation')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Office location cannot exceed 200 characters'),

  body('officeHours')
    .optional()
    .isArray().withMessage('Office hours must be an array'),

  body('officeHours.*.day')
    .optional()
    .trim()
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).withMessage('Invalid day'),

  body('officeHours.*.startTime')
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),

  body('officeHours.*.endTime')
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),

  body('education')
    .optional()
    .isArray().withMessage('Education must be an array'),

  body('education.*.degree')
    .optional()
    .trim()
    .notEmpty().withMessage('Degree is required')
    .isIn(['Bachelor', 'Master', 'PhD', 'PostDoc', 'Certificate', 'Diploma']).withMessage('Invalid degree type'),

  body('education.*.field')
    .optional()
    .trim()
    .notEmpty().withMessage('Field of study is required')
    .isLength({ max: 200 }).withMessage('Field cannot exceed 200 characters'),

  body('education.*.institution')
    .optional()
    .trim()
    .notEmpty().withMessage('Institution is required')
    .isLength({ max: 300 }).withMessage('Institution cannot exceed 300 characters'),

  body('education.*.year')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 5 }).withMessage('Invalid year')
    .toInt(),

  body('education.*.country')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Country cannot exceed 100 characters'),

  body('experience')
    .optional()
    .isArray().withMessage('Experience must be an array'),

  body('experience.*.position')
    .optional()
    .trim()
    .notEmpty().withMessage('Position is required'),

  body('experience.*.institution')
    .optional()
    .trim()
    .notEmpty().withMessage('Institution is required'),

  body('experience.*.startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format')
    .toDate(),

  body('experience.*.endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format')
    .toDate(),

  body('experience.*.current')
    .optional()
    .isBoolean().withMessage('Current must be a boolean'),

  body('researchInterests')
    .optional()
    .isArray().withMessage('Research interests must be an array'),

  body('researchInterests.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Each research interest must be between 1 and 200 characters'),

  body('publications')
    .optional()
    .isArray().withMessage('Publications must be an array'),

  body('publications.*.title')
    .optional()
    .trim()
    .notEmpty().withMessage('Publication title is required'),

  body('publications.*.authors')
    .optional()
    .isArray().withMessage('Authors must be an array'),

  body('publications.*.journal')
    .optional()
    .trim(),

  body('publications.*.year')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 }).withMessage('Invalid year')
    .toInt(),

  body('publications.*.doi')
    .optional()
    .trim(),

  body('publications.*.url')
    .optional()
    .trim()
    .isURL().withMessage('Invalid URL'),

  body('awards')
    .optional()
    .isArray().withMessage('Awards must be an array'),

  body('awards.*.title')
    .optional()
    .trim()
    .notEmpty().withMessage('Award title is required'),

  body('awards.*.organization')
    .optional()
    .trim(),

  body('awards.*.year')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 }).withMessage('Invalid year')
    .toInt(),

  body('socialLinks')
    .optional()
    .isObject().withMessage('Social links must be an object'),

  body('socialLinks.website')
    .optional()
    .trim()
    .isURL().withMessage('Invalid website URL'),

  body('socialLinks.linkedin')
    .optional()
    .trim()
    .isURL().withMessage('Invalid LinkedIn URL'),

  body('socialLinks.researchGate')
    .optional()
    .trim()
    .isURL().withMessage('Invalid ResearchGate URL'),

  body('socialLinks.googleScholar')
    .optional()
    .trim()
    .isURL().withMessage('Invalid Google Scholar URL'),

  body('socialLinks.orcid')
    .optional()
    .trim(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),

  body('hireDate')
    .optional()
    .isISO8601().withMessage('Invalid hire date format')
    .toDate()
];

export const updateTeacherValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Full name must be between 2 and 200 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),

  body('department')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Position cannot exceed 100 characters'),

  body('academicRank')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('specialization')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Specialization cannot exceed 500 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Bio cannot exceed 5000 characters'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean')
];

export const teacherIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export const addPublicationValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('title')
    .trim()
    .notEmpty().withMessage('Publication title is required')
    .isLength({ max: 500 }).withMessage('Title cannot exceed 500 characters'),

  body('authors')
    .isArray({ min: 1 }).withMessage('At least one author is required'),

  body('authors.*')
    .trim()
    .notEmpty().withMessage('Author name cannot be empty'),

  body('journal')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Journal name cannot exceed 300 characters'),

  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 }).withMessage('Invalid year')
    .toInt(),

  body('doi')
    .optional()
    .trim(),

  body('url')
    .optional()
    .trim()
    .isURL().withMessage('Invalid URL')
];

export const addAwardValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('title')
    .trim()
    .notEmpty().withMessage('Award title is required')
    .isLength({ max: 300 }).withMessage('Title cannot exceed 300 characters'),

  body('organization')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Organization cannot exceed 300 characters'),

  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 }).withMessage('Invalid year')
    .toInt(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters')
];

export default {
  createTeacherValidator,
  updateTeacherValidator,
  teacherIdValidator,
  addPublicationValidator,
  addAwardValidator
};
