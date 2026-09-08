import { body } from 'express-validator';

export const updateAboutValidator = [
  body('facultyDescription')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Faculty description must be between 10 and 5000 characters'),

  body('facultyVision')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Faculty vision must be between 10 and 2000 characters'),

  body('facultyMission')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Faculty mission must be between 10 and 2000 characters'),

  body('requirements')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === 'string') return true;
      throw new Error('Requirements must be a string or array');
    }),
];

export default {
  updateAboutValidator,
};
