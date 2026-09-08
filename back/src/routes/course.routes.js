import express from 'express';
import * as courseController from '../controllers/course.controller.js';
import { verifyToken, isEditor } from '../middlewares/auth.js';
import { validate, validateObjectId } from '../middlewares/validate.js';
import { 
  createCourseValidator, 
  updateCourseValidator,
  addInstructorValidator,
} from '../validators/course.validator.js';

const router = express.Router();

/**
 * @route   GET /api/v1/courses
 * @desc    Get all courses
 * @access  Public
 */
router.get('/', courseController.getAllCourses);

/**
 * @route   GET /api/v1/courses/code/:code
 * @desc    Get course by code
 * @access  Public
 */
router.get('/code/:code', courseController.getCourseByCode);

/**
 * @route   GET /api/v1/courses/department/:departmentId
 * @desc    Get courses by department
 * @access  Public
 */
router.get(
  '/department/:departmentId',
  validateObjectId('departmentId'),
  courseController.getCoursesByDepartment
);

/**
 * @route   GET /api/v1/courses/level/:level
 * @desc    Get courses by level
 * @access  Public
 */
router.get('/level/:level', courseController.getCoursesByLevel);

/**
 * @route   GET /api/v1/courses/:id
 * @desc    Get single course
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), courseController.getCourseById);

/**
 * @route   POST /api/v1/courses
 * @desc    Create new course
 * @access  Private (Admin/Superadmin)
 */
router.post(
  '/',
  verifyToken,
  isEditor,
  createCourseValidator,
  validate,
  courseController.createCourse
);

/**
 * @route   PUT /api/v1/courses/:id
 * @desc    Update course
 * @access  Private (Admin/Superadmin)
 */
router.put(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  updateCourseValidator,
  validate,
  courseController.updateCourse
);

/**
 * @route   DELETE /api/v1/courses/:id
 * @desc    Delete course
 * @access  Private (Superadmin)
 */
router.delete(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  courseController.deleteCourse
);

/**
 * @route   POST /api/v1/courses/:id/instructors
 * @desc    Add instructor to course
 * @access  Private (Admin/Superadmin)
 */
router.post(
  '/:id/instructors',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  addInstructorValidator,
  validate,
  courseController.addInstructor
);

/**
 * @route   DELETE /api/v1/courses/:id/instructors/:instructorId
 * @desc    Remove instructor from course
 * @access  Private (Admin/Superadmin)
 */
router.delete(
  '/:id/instructors/:instructorId',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  validateObjectId('instructorId'),
  courseController.removeInstructor
);

export default router;
