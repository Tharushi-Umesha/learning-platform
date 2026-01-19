const express = require('express');
const router = express.Router();
const {
    enrollCourse,
    getMyEnrollments,
    getEnrollmentById,
    updateProgress,
    unenrollCourse,
    checkEnrollment
} = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');
const { isStudent } = require('../middleware/roleCheck');

// All routes require authentication

// POST /api/enrollments - Enroll in a course (Student only)
router.post('/', auth, isStudent, enrollCourse);

// GET /api/enrollments - Get all enrollments for current student
router.get('/', auth, isStudent, getMyEnrollments);

// GET /api/enrollments/check/:courseId - Check if enrolled in a course
router.get('/check/:courseId', auth, isStudent, checkEnrollment);

// GET /api/enrollments/:id - Get single enrollment details
router.get('/:id', auth, isStudent, getEnrollmentById);

// PUT /api/enrollments/:id/progress - Update enrollment progress
router.put('/:id/progress', auth, isStudent, updateProgress);

// DELETE /api/enrollments/:id - Unenroll from course
router.delete('/:id', auth, isStudent, unenrollCourse);

module.exports = router;