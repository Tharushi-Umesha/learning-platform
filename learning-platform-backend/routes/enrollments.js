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


router.post('/', auth, isStudent, enrollCourse);


router.get('/', auth, isStudent, getMyEnrollments);


router.get('/check/:courseId', auth, isStudent, checkEnrollment);


router.get('/:id', auth, isStudent, getEnrollmentById);


router.put('/:id/progress', auth, isStudent, updateProgress);


router.delete('/:id', auth, isStudent, unenrollCourse);

module.exports = router;