import { body } from 'express-validator';
import { bodyBoolean, bodyInt, mongoIdBody } from './common.js';

const currentYear = new Date().getFullYear() + 5;

const optionalString = (field, max = 5000) =>
  body(field).optional({ values: ['', null] }).trim().isLength({ max }).withMessage(`${field} is too long`);

const requiredString = (field, min = 1, max = 500) =>
  body(field).trim().notEmpty().withMessage(`${field} is required`).isLength({ min, max });

export const createTeacherValidator = [
  requiredString('name', 2, 200),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone is required').matches(/^[\d\s\-\+\(\)]+$/),
  requiredString('city', 1, 200),
  requiredString('schoolName', 1, 300),
  bodyInt('schoolGraduationYear', { min: 1950, max: currentYear }),
  requiredString('bachelorUniversity', 1, 300),
  bodyInt('bachelorGraduationYear', { min: 1950, max: currentYear }),
  optionalString('masterCountry', 100),
  optionalString('masterUniversity', 300),
  optionalString('masterThesis', 1000),
  bodyInt('masterGraduationYear', { optional: true, min: 1950, max: currentYear }),
  optionalString('phdCountry', 100),
  optionalString('phdUniversity', 300),
  optionalString('phdThesis', 1000),
  bodyInt('phdGraduationYear', { optional: true, min: 1950, max: currentYear }),
  optionalString('bio', 5000),
  optionalString('whatsapp', 50),
  mongoIdBody('departmentId', { optional: true }),
  mongoIdBody('academicRankId', { optional: true }),
  bodyBoolean('isActive', { optional: true }),
];

export const updateTeacherValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 200 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('phone').optional().trim().matches(/^[\d\s\-\+\(\)]+$/),
  optionalString('city', 200),
  optionalString('schoolName', 300),
  bodyInt('schoolGraduationYear', { optional: true, min: 1950, max: currentYear }),
  optionalString('bachelorUniversity', 300),
  bodyInt('bachelorGraduationYear', { optional: true, min: 1950, max: currentYear }),
  optionalString('masterCountry', 100),
  optionalString('masterUniversity', 300),
  optionalString('masterThesis', 1000),
  bodyInt('masterGraduationYear', { optional: true, min: 1950, max: currentYear }),
  optionalString('phdCountry', 100),
  optionalString('phdUniversity', 300),
  optionalString('phdThesis', 1000),
  optionalString('bio', 5000),
  optionalString('whatsapp', 50),
  mongoIdBody('departmentId', { optional: true }),
  mongoIdBody('academicRankId', { optional: true }),
  bodyBoolean('isActive', { optional: true }),
];

export const addPublicationValidator = [
  body('title').trim().notEmpty().isLength({ max: 500 }),
  body('authors').isArray({ min: 1 }),
  body('year').notEmpty().isInt({ min: 1950, max: currentYear }).toInt(),
  body('journal').optional({ values: ['', null] }).trim(),
  body('doi').optional({ values: ['', null] }).trim(),
  body('url').optional({ values: ['', null] }).trim().isURL(),
];

export const addAwardValidator = [
  body('title').trim().notEmpty().isLength({ max: 300 }),
  body('organization').optional({ values: ['', null] }).trim(),
  body('year').notEmpty().isInt({ min: 1950, max: currentYear }).toInt(),
  body('description').optional({ values: ['', null] }).trim().isLength({ max: 1000 }),
];

export default {
  createTeacherValidator,
  updateTeacherValidator,
  addPublicationValidator,
  addAwardValidator,
};
