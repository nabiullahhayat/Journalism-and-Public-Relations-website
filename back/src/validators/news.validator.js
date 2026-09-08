import { body, param } from 'express-validator';

export const createNewsValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 300 }).withMessage('Title must be between 3 and 300 characters'),

  body('description')
    .optional()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('content')
    .optional()
    .isLength({ min: 1 }).withMessage('Content cannot be empty'),

  body('excerpt')
    .optional()
    .isLength({ max: 1000 }).withMessage('Excerpt cannot exceed 1000 characters'),

  body('category')
    .optional()
    .isIn(['announcement', 'event', 'achievement', 'research', 'general', 'academic'])
    .withMessage('Invalid category'),

  body('tags')
    .optional(),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),

  body('featured')
    .optional(),
];

export const updateNewsValidator = [
  param('id')
    .notEmpty().withMessage('News ID is required'),

  body('title')
    .optional()
    .isLength({ min: 3, max: 300 }).withMessage('Title must be between 3 and 300 characters'),

  body('description')
    .optional()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('content')
    .optional()
    .isLength({ min: 1 }).withMessage('Content cannot be empty'),

  body('excerpt')
    .optional()
    .isLength({ max: 1000 }).withMessage('Excerpt cannot exceed 1000 characters'),

  body('category')
    .optional()
    .isIn(['announcement', 'event', 'achievement', 'research', 'general', 'academic'])
    .withMessage('Invalid category'),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),

  body('featured')
    .optional(),
];

export const newsIdValidator = [
  param('id').notEmpty().withMessage('News ID is required'),
];

export const newsCategoryValidator = [
  param('category')
    .isIn(['announcement', 'event', 'achievement', 'research', 'general', 'academic'])
    .withMessage('Invalid category'),
];

export const newsSlugValidator = [
  param('slug')
    .notEmpty().withMessage('Slug is required'),
];

export default {
  createNewsValidator,
  updateNewsValidator,
  newsIdValidator,
  newsCategoryValidator,
  newsSlugValidator,
};
