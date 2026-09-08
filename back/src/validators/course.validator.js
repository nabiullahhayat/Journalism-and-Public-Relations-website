import { body } from 'express-validator';
import { bodyBoolean, bodyInt, mongoIdBody } from './common.js';

const LEVELS = ['bachelor', 'master', 'phd'];
const TYPES = ['required', 'elective'];

export const createCourseValidator = [
  body('name').trim().notEmpty().withMessage('Course name is required').isLength({ min: 3, max: 200 }),
  body('code')
    .optional({ values: ['', null] })
    .trim()
    .isLength({ min: 2, max: 20 })
    .matches(/^[A-Z0-9-]+$/i)
    .withMessage('Course code can only contain letters, numbers, and hyphens')
    .toUpperCase(),
  body('description').optional({ values: ['', null] }).trim().isLength({ max: 5000 }),
  body('details').optional({ values: ['', null] }).trim().isLength({ max: 10000 }),
  body('level').optional({ values: ['', null] }).isIn(LEVELS).withMessage('Invalid level'),
  bodyInt('semester', { optional: true, min: 1, max: 12 }),
  bodyInt('credits', { optional: true, min: 1, max: 30 }),
  body('type').optional({ values: ['', null] }).isIn(TYPES).withMessage('Invalid course type'),
  mongoIdBody('departmentId', { optional: true }),
  mongoIdBody('teacherId', { optional: true }),
  bodyInt('time', { optional: true, min: 1, max: 1000 }),
  bodyBoolean('isActive', { optional: true }),
];

export const updateCourseValidator = [
  body('name').optional().trim().isLength({ min: 3, max: 200 }),
  body('code')
    .optional({ values: ['', null] })
    .trim()
    .isLength({ min: 2, max: 20 })
    .matches(/^[A-Z0-9-]+$/i)
    .toUpperCase(),
  body('description').optional({ values: ['', null] }).trim().isLength({ max: 5000 }),
  body('details').optional({ values: ['', null] }).trim().isLength({ max: 10000 }),
  body('level').optional({ values: ['', null] }).isIn(LEVELS),
  bodyInt('semester', { optional: true, min: 1, max: 12 }),
  bodyInt('credits', { optional: true, min: 1, max: 30 }),
  body('type').optional({ values: ['', null] }).isIn(TYPES),
  mongoIdBody('departmentId', { optional: true }),
  mongoIdBody('teacherId', { optional: true }),
  bodyInt('time', { optional: true, min: 1, max: 1000 }),
  bodyBoolean('isActive', { optional: true }),
];

export const addInstructorValidator = [
  mongoIdBody('instructorId'),
];

export default {
  createCourseValidator,
  updateCourseValidator,
  addInstructorValidator,
};
