import express from 'express';
import * as departmentController from '../controllers/department.controller.js';
import { verifyToken, isEditor, optionalAuth } from '../middlewares/auth.js';
import { validate, validateObjectId } from '../middlewares/validate.js';
import { 
  createDepartmentValidator, 
  updateDepartmentValidator,
  addTeacherToDepartmentValidator,
} from '../validators/department.validator.js';

const router = express.Router();

/**
 * @route   GET /api/v1/departments/list
 * @desc    Get simple list of departments
 * @access  Public
 */
router.get('/list', departmentController.getDepartmentsList);

/**
 * @route   GET /api/v1/departments
 * @desc    Get all departments
 * @access  Public
 */
router.get('/', departmentController.getAllDepartments);

/**
 * @route   GET /api/v1/departments/:id
 * @desc    Get single department
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), departmentController.getDepartmentById);

/**
 * @route   GET /api/v1/departments/:id/stats
 * @desc    Get department statistics
 * @access  Public
 */
router.get('/:id/stats', validateObjectId('id'), departmentController.getDepartmentStats);

/**
 * @route   POST /api/v1/departments
 * @desc    Create new department
 * @access  Private (Admin/Superadmin)
 */
router.post(
  '/',
  verifyToken,
  isEditor,
  createDepartmentValidator,
  validate,
  departmentController.createDepartment
);

/**
 * @route   PUT /api/v1/departments/:id
 * @desc    Update department
 * @access  Private (Admin/Superadmin)
 */
router.put(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  updateDepartmentValidator,
  validate,
  departmentController.updateDepartment
);

/**
 * @route   DELETE /api/v1/departments/:id
 * @desc    Delete department
 * @access  Private (Superadmin)
 */
router.delete(
  '/:id',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  departmentController.deleteDepartment
);

/**
 * @route   POST /api/v1/departments/:id/teachers
 * @desc    Add teacher to department
 * @access  Private (Admin/Superadmin)
 */
router.post(
  '/:id/teachers',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  addTeacherToDepartmentValidator,
  validate,
  departmentController.addTeacherToDepartment
);

/**
 * @route   DELETE /api/v1/departments/:id/teachers/:teacherId
 * @desc    Remove teacher from department
 * @access  Private (Admin/Superadmin)
 */
router.delete(
  '/:id/teachers/:teacherId',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  validateObjectId('teacherId'),
  departmentController.removeTeacherFromDepartment
);

/**
 * @route   PATCH /api/v1/departments/:id/head
 * @desc    Set department head
 * @access  Private (Admin/Superadmin)
 */
router.patch(
  '/:id/head',
  verifyToken,
  isEditor,
  validateObjectId('id'),
  departmentController.setDepartmentHead
);

export default router;
