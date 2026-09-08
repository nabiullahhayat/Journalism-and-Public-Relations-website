import express from 'express';
import AdminRouter from './admin.router/admin.router.js';
import DepartamentRouter  from './departamnets/departaments.router.js';
import CoursesRouter from './courses/courses.router.js'

const router = express.Router();

// Admin APIs
router.use('/api/v1/admin', AdminRouter)

// Departaments APIs
router.use('/api/v1/departaments', DepartamentRouter)

// Courses APIs
router.use('/api/v1/courses', CoursesRouter)


export default router;


