import express from 'express'
import {createCourse, deleteCourse, updateCourse} from'../../controllers/courses.controller.js'

const CoursesRouter = express.Router()

// Create new Course
CoursesRouter.post('/create', createCourse)

// Update Course
CoursesRouter.put('/update/:id', updateCourse)

// Delete Course
CoursesRouter.delete('/delete/:id', deleteCourse)

// Get all Courses
// Get one Course

export default CoursesRouter;