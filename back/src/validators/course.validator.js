import { body, param } from 'express-validator';

/**
 * Validation rules for Course operations
 */

export const createCourseValidator = [
  body('code')
    .trim()
    .notEmpty().withMessage('Course code is required')
    .isLength({ min: 2, max: 20 }).withMessage('Course code must be between 2 and 20 characters')
    .matches(/^[A-Z0-9-]+$/i).withMessage('Course code can only contain letters, numbers, and hyphens')
    .toUpperCase(),

  body('name')
    .trim()
    .notEmpty().withMessage('Course name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Course name must be between 3 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('department')
    .notEmpty().withMessage('Department is required')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('credits')
    .notEmpty().withMessage('Credits is required')
    .isInt({ min: 1, max: 20 }).withMessage('Credits must be between 1 and 20')
    .toInt(),

  body('level')
    .optional()
    .trim()
    .isIn(['100', '200', '300', '400', '500', 'Graduate']).withMessage('Invalid level'),

  body('semester')
    .optional()
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8')
    .toInt(),

  body('type')
    .optional()
    .trim()
    .isIn(['Core', 'Elective', 'Required', 'Optional']).withMessage('Invalid course type'),

  body('prerequisites')
    .optional()
    .isArray().withMessage('Prerequisites must be an array'),

  body('prerequisites.*')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('syllabus')
    .optional()
    .trim()
    .isLength({ max: 10000 }).withMessage('Syllabus cannot exceed 10000 characters'),

  body('objectives')
    .optional()
    .isArray().withMessage('Objectives must be an array'),

  body('objectives.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('Each objective must be between 1 and 500 characters'),

  body('outcomes')
    .optional()
    .isArray().withMessage('Outcomes must be an array'),

  body('outcomes.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('Each outcome must be between 1 and 500 characters'),

  body('textbooks')
    .optional()
    .isArray().withMessage('Textbooks must be an array'),

  body('textbooks.*.title')
    .optional()
    .trim()
    .notEmpty().withMessage('Textbook title is required'),

  body('textbooks.*.author')
    .optional()
    .trim()
    .notEmpty().withMessage('Textbook author is required'),

  body('textbooks.*.isbn')
    .optional()
    .trim(),

  body('textbooks.*.year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year')
    .toInt(),

  body('references')
    .optional()
    .isArray().withMessage('References must be an array'),

  body('references.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('Each reference must be between 1 and 500 characters'),

  body('assessment')
    .optional()
    .isObject().withMessage('Assessment must be an object'),

  body('assessment.attendance')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Attendance percentage must be between 0 and 100')
    .toInt(),

  body('assessment.assignments')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Assignments percentage must be between 0 and 100')
    .toInt(),

  body('assessment.midterm')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Midterm percentage must be between 0 and 100')
    .toInt(),

  body('assessment.final')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Final percentage must be between 0 and 100')
    .toInt(),

  body('assessment.projects')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Projects percentage must be between 0 and 100')
    .toInt(),

  body('assessment.participation')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Participation percentage must be between 0 and 100')
    .toInt(),

  body('schedule')
    .optional()
    .isArray().withMessage('Schedule must be an array'),

  body('schedule.*.day')
    .optional()
    .trim()
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).withMessage('Invalid day'),

  body('schedule.*.startTime')
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),

  body('schedule.*.endTime')
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),

  body('schedule.*.room')
    .optional()
    .trim(),

  body('instructors')
    .optional()
    .isArray().withMessage('Instructors must be an array'),

  body('instructors.*')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('maxStudents')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Max students must be between 1 and 1000')
    .toInt(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean')
];

export const updateCourseValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('code')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 }).withMessage('Course code must be between 2 and 20 characters')
    .matches(/^[A-Z0-9-]+$/i).withMessage('Course code can only contain letters, numbers, and hyphens')
    .toUpperCase(),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Course name must be between 3 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('department')
    .optional()
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('credits')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Credits must be between 1 and 20')
    .toInt(),

  body('level')
    .optional()
    .trim()
    .isIn(['100', '200', '300', '400', '500', 'Graduate']).withMessage('Invalid level'),

  body('semester')
    .optional()
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8')
    .toInt(),

  body('type')
    .optional()
    .trim()
    .isIn(['Core', 'Elective', 'Required', 'Optional']).withMessage('Invalid course type'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean')
];

export const courseIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export const addInstructorValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  body('instructorId')
    .notEmpty().withMessage('Instructor ID is required')
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export const removeInstructorValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage("Must be a valid ID"),

  param('instructorId')
    .isInt({ min: 1 }).withMessage("Must be a valid ID")
];

export default {
  createCourseValidator,
  updateCourseValidator,
  courseIdValidator,
  addInstructorValidator,
  removeInstructorValidator
};
