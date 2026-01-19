const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Validation rules
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['student', 'instructor'])
        .withMessage('Role must be either student or instructor')
];

const loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username or email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Routes
// POST /api/auth/register - Register new user
router.post('/register', ...registerValidation, register);

// POST /api/auth/login - Login user
router.post('/login', ...loginValidation, login);

// GET /api/auth/profile - Get current user profile (Protected)
router.get('/profile', auth, getProfile);

module.exports = router;