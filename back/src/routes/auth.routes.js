import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyToken, verifyRefreshToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { 
  loginValidator, 
  registerValidator, 
  forgotPasswordValidator, 
  resetPasswordValidator,
  updateProfileValidator 
} from '../validators/auth.validator.js';
import { authLimiter, createAccountLimiter, passwordResetLimiter } from '../middlewares/security.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new admin
 * @access  Public (Restricted in production)
 */
router.post(
  '/register',
  createAccountLimiter,
  registerValidator,
  validate,
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login admin
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  loginValidator,
  validate,
  authController.login
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout admin
 * @access  Private
 */
router.post('/logout', verifyToken, authController.logout);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public (requires refresh token)
 */
router.post('/refresh-token', verifyRefreshToken, authController.refreshAccessToken);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current admin profile
 * @access  Private
 */
router.get('/me', verifyToken, authController.getProfile);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current admin profile (alias for /me)
 * @access  Private
 */
router.get('/profile', verifyToken, authController.getProfile);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update admin profile
 * @access  Private
 */
router.put(
  '/profile',
  verifyToken,
  updateProfileValidator,
  validate,
  authController.updateProfile
);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.put('/change-password', verifyToken, authController.changePassword);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password (alias for PUT)
 * @access  Private
 */
router.post('/change-password', verifyToken, authController.changePassword);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Forgot password
 * @access  Public
 */
router.post(
  '/forgot-password',
  passwordResetLimiter,
  forgotPasswordValidator,
  validate,
  authController.forgotPassword
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  passwordResetLimiter,
  resetPasswordValidator,
  validate,
  authController.resetPassword
);

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verify email with token
 * @access  Public
 */
router.get('/verify-email/:token', authController.verifyEmail);

/**
 * @route   GET /api/v1/auth/check
 * @desc    Check authentication status
 * @access  Public
 */
router.get('/check', authController.checkAuth);

/**
 * @route   GET /api/v1/auth/check-auth
 * @desc    Check authentication status (alias for /check)
 * @access  Public
 */
router.get('/check-auth', authController.checkAuth);

export default router;
