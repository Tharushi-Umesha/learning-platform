const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createCourse,
    getAllCourses,
    getCourseById,
    getInstructorCourses,
    updateCourse,
    deleteCourse,
    getEnrolledStudents
} = require('../controllers/courseController');
const auth = require('../middleware/auth');
const { isInstructor } = require('../middleware/roleCheck');

// Validation rules
const courseValidation = [
    body('title')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long'),
    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
];

// Public routes
// GET /api/courses - Get all courses
router.get('/', getAllCourses);

// GET /api/courses/:id - Get single course by ID
router.get('/:id', getCourseById);

// Protected routes (require authentication)
// POST /api/courses - Create new course (Instructor only)
router.post('/', auth, isInstructor, courseValidation, createCourse);

// GET /api/courses/instructor/my-courses - Get instructor's courses
router.get('/instructor/my-courses', auth, isInstructor, getInstructorCourses);

// GET /api/courses/:id/students - Get enrolled students (Instructor only)
router.get('/:id/students', auth, isInstructor, getEnrolledStudents);

// PUT /api/courses/:id - Update course (Instructor only)
router.put('/:id', auth, isInstructor, updateCourse);

// DELETE /api/courses/:id - Delete course (Instructor only)
router.delete('/:id', auth, isInstructor, deleteCourse);

module.exports = router;