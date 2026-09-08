import express from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import departmentRoutes from './department.routes.js';
import courseRoutes from './course.routes.js';
import teacherRoutes from './teacher.routes.js';
import newsRoutes from './news.routes.js';
import monographRoutes from './monograph.routes.js';
import contactRoutes from './contact.routes.js';
import aboutRoutes from './about.routes.js';
import publicRoutes from './public.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = express.Router();

/**
 * API Version 1 Routes
 * Base URL: /api/v1
 */

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/admins', adminRoutes);
router.use('/departments', departmentRoutes);
router.use('/courses', courseRoutes);
router.use('/teachers', teacherRoutes);
router.use('/news', newsRoutes);
router.use('/monographs', monographRoutes);
router.use('/contact', contactRoutes);
router.use('/about', aboutRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/public', publicRoutes);

// API Documentation route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Faculty Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      admins: '/api/v1/admins',
      departments: '/api/v1/departments',
      courses: '/api/v1/courses',
      teachers: '/api/v1/teachers',
      news: '/api/v1/news',
      monographs: '/api/v1/monographs',
      contact: '/api/v1/contact',
      about: '/api/v1/about',
      dashboard: '/api/v1/dashboard/summary',
      health: '/api/v1/health'
    },
    documentation: 'API documentation will be available soon'
  });
});

export default router;
