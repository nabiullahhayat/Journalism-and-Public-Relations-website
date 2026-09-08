import express from 'express';
import * as teacherController from '../controllers/teacher.controller.js';
import { verifyToken, isEditor } from '../middlewares/auth.js';
import { validate, validateObjectId } from '../middlewares/validate.js';
import { uploadTeacherImage, handleUploadError } from '../utils/upload.js';
import { 
  createTeacherValidator, 
  updateTeacherValidator,
  addPublicationValidator,
  addAwardValidator 
} from '../validators/teacher.validator.js';

const router = express.Router();

/**
 * @route   GET /api/v1/teachers/featured
 * @desc    Get featured teachers
 * @access  Public
 */
router.get('/featured', teacherController.getFeaturedTeachers);

/**
 * @route   GET /api/v1/teachers/department/:departmentId
 * @desc    Get teachers by department
 * @access  Public
 */
router.get(
  '/department/:departmentId',
  validateObjectId('departmentId'),
  teacherController.getTeachersByDepartment
);

/**
 * @route   GET /api/v1/teachers
 * @desc    Get all teachers
 * @access  Public
 */
router.get('/', teacherController.getAllTeachers);

/**
 * @route   GET /api/v1/teachers/:id
 * @desc    Get single teacher
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), teacherController.getTeacherById);

/**
 * @route   POST /api/v1/teachers
 * @desc    Create new teacher
 * @access  Private (Admin/Superadmin)
 */
router.post(
  '/',
  verifyToken,
  isEditor,
  uploadTeacherImage,
  handleUploadError,
  createTeacherValidator,
  validate,
  teacherController.createTeacher
);

/**
 * @route   PUT /api/v1/teachers/:id
 * @desc    Update teacher
 * @access  Private (Admin/Superadmin)
 */
router.put(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  uploadTeacherImage,
  handleUploadError,
  updateTeacherValidator,
  validate,
  teacherController.updateTeacher
);

/**
 * @route   DELETE /api/v1/teachers/:id
 * @desc    Delete teacher
 * @access  Private (Superadmin)
 */
router.delete(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  teacherController.deleteTeacher
);

/**
 * @route   POST /api/v1/teachers/:id/publications
 * @desc    Add publication to teacher
 * @access  Private (Admin/Editor/Superadmin)
 */
router.post(
  '/:id/publications',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  addPublicationValidator,
  validate,
  teacherController.addPublication
);

/**
 * @route   DELETE /api/v1/teachers/:id/publications/:publicationId
 * @desc    Remove publication from teacher
 * @access  Private (Admin/Editor/Superadmin)
 */
router.delete(
  '/:id/publications/:publicationId',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  teacherController.removePublication
);

/**
 * @route   POST /api/v1/teachers/:id/awards
 * @desc    Add award to teacher
 * @access  Private (Admin/Editor/Superadmin)
 */
router.post(
  '/:id/awards',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  addAwardValidator,
  validate,
  teacherController.addAward
);

/**
 * @route   DELETE /api/v1/teachers/:id/awards/:awardId
 * @desc    Remove award from teacher
 * @access  Private (Admin/Editor/Superadmin)
 */
router.delete(
  '/:id/awards/:awardId',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  teacherController.removeAward
);

export default router;
