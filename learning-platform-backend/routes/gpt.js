const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getRecommendations, chatWithGPT } = require('../controllers/gptController');
const auth = require('../middleware/auth');
const { getApiRequestCount } = require('../utils/gptService');

// Validation rules
const recommendationValidation = [
    body('prompt')
        .trim()
        .notEmpty()
        .withMessage('Prompt is required')
        .isLength({ min: 5 })
        .withMessage('Prompt must be at least 5 characters long')
];

const chatValidation = [
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
];

// Routes (require authentication)

// POST /api/gpt/recommendations - Get course recommendations
router.post('/recommendations', auth, recommendationValidation, getRecommendations);

// POST /api/gpt/chat - Chat with GPT
router.post('/chat', auth, chatValidation, chatWithGPT);

// GET /api/gpt/usage - Get API usage statistics
router.get('/usage', auth, (req, res) => {
    const usage = getApiRequestCount();
    res.status(200).json(usage);
});

module.exports = router;