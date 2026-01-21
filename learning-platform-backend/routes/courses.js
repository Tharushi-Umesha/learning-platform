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


router.get('/', getAllCourses);


router.get('/:id', getCourseById);


router.post('/', auth, isInstructor, courseValidation, createCourse);


router.get('/instructor/my-courses', auth, isInstructor, getInstructorCourses);


router.get('/:id/students', auth, isInstructor, getEnrolledStudents);


router.put('/:id', auth, isInstructor, updateCourse);


router.delete('/:id', auth, isInstructor, deleteCourse);

module.exports = router;