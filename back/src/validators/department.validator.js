import { body } from 'express-validator';
import { bodyBoolean, mongoIdBody } from './common.js';

const optionalString = (field, max = 2000) =>
  body(field).optional({ values: ['', null] }).trim().isLength({ max });

export const createDepartmentValidator = [
  body('name').trim().notEmpty().withMessage('Department name is required').isLength({ min: 2, max: 200 }),
  body('code').optional({ values: ['', null] }).trim().isLength({ max: 20 }),
  optionalString('description', 2000),
  body('email').optional({ values: ['', null] }).trim().isEmail().normalizeEmail(),
  body('phone').optional({ values: ['', null] }).trim().matches(/^[\d\s\-\+\(\)]+$/),
  optionalString('location', 500),
  body('website').optional({ values: ['', null] }).trim(),
  optionalString('vision', 2000),
  optionalString('mission', 2000),
  mongoIdBody('headId', { optional: true }),
  bodyBoolean('isActive', { optional: true }),
];

export const updateDepartmentValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 200 }),
  body('code').optional({ values: ['', null] }).trim().isLength({ max: 20 }),
  optionalString('description', 2000),
  body('email').optional({ values: ['', null] }).trim().isEmail().normalizeEmail(),
  body('phone').optional({ values: ['', null] }).trim().matches(/^[\d\s\-\+\(\)]+$/),
  optionalString('location', 500),
  body('website').optional({ values: ['', null] }).trim(),
  optionalString('vision', 2000),
  optionalString('mission', 2000),
  mongoIdBody('headId', { optional: true }),
  bodyBoolean('isActive', { optional: true }),
];

export const addTeacherToDepartmentValidator = [
  mongoIdBody('teacherId'),
];

export default {
  createDepartmentValidator,
  updateDepartmentValidator,
  addTeacherToDepartmentValidator,
};
