import express from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get(
  '/summary',
  verifyToken,
  authorize('superadmin', 'admin', 'editor', 'viewer'),
  dashboardController.getDashboardSummary
);

export default router;
