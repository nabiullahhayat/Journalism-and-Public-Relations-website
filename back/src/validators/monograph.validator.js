import { body, param } from 'express-validator';
import { bodyBoolean, bodyInt, mongoIdBody } from './common.js';

const DEGREES = ['bachelor', 'master', 'phd'];
const currentYear = new Date().getFullYear() + 5;

export const createMonographValidator = [
  body('studentName').trim().notEmpty().withMessage('Student name is required').isLength({ min: 2, max: 200 }),
  body('supervisor').trim().notEmpty().withMessage('Supervisor is required').isLength({ max: 200 }),
  body('issue').trim().notEmpty().withMessage('Issue is required').isLength({ max: 2000 }),
  bodyInt('year', { min: 1950, max: currentYear }),
  body('title').optional({ values: ['', null] }).trim().isLength({ max: 500 }),
  body('abstract').optional({ values: ['', null] }).trim().isLength({ max: 5000 }),
  body('documentUrl').optional({ values: ['', null] }).trim(),
  bodyInt('pages', { optional: true, min: 1, max: 10000 }),
  body('grade').optional({ values: ['', null] }).isIn(['A', 'B', 'C', 'D', 'F']),
  body('degree').optional({ values: ['', null] }).isIn(DEGREES),
  mongoIdBody('departmentId', { optional: true }),
  bodyBoolean('isPublished', { optional: true }),
];

export const updateMonographValidator = [
  body('studentName').optional().trim().isLength({ min: 2, max: 200 }),
  body('supervisor').optional().trim().isLength({ max: 200 }),
  body('issue').optional().trim().isLength({ max: 2000 }),
  bodyInt('year', { optional: true, min: 1950, max: currentYear }),
  body('title').optional({ values: ['', null] }).trim().isLength({ max: 500 }),
  body('abstract').optional({ values: ['', null] }).trim().isLength({ max: 5000 }),
  body('documentUrl').optional({ values: ['', null] }).trim(),
  bodyInt('pages', { optional: true, min: 1, max: 10000 }),
  body('grade').optional({ values: ['', null] }).isIn(['A', 'B', 'C', 'D', 'F']),
  body('degree').optional({ values: ['', null] }).isIn(DEGREES),
  mongoIdBody('departmentId', { optional: true }),
  bodyBoolean('isPublished', { optional: true }),
];

export const monographYearValidator = [
  param('year').isInt({ min: 1950, max: currentYear }).toInt(),
];

export default {
  createMonographValidator,
  updateMonographValidator,
  monographYearValidator,
};
