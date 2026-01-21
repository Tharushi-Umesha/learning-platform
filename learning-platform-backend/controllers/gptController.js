const Course = require('../models/Course');
const { getCourseRecommendations } = require('../utils/gptService');


const getRecommendations = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ message: 'Please provide a prompt' });
        }


        const courses = await Course.find({ isPublished: true })
            .populate('instructor', 'username fullName')
            .select('title description category level duration');

        if (courses.length === 0) {
            return res.status(404).json({
                message: 'No courses available for recommendations',
                recommendations: []
            });
        }


        const gptResponse = await getCourseRecommendations(prompt, courses);

        res.status(200).json({
            message: 'Recommendations generated successfully',
            prompt,
            recommendations: gptResponse.recommendations,
            explanation: gptResponse.explanation
        });
    } catch (error) {
        console.error('GPT recommendation error:', error);

        if (error.message.includes('API key')) {
            return res.status(500).json({
                message: 'OpenAI API configuration error',
                error: error.message
            });
        }

        if (error.message.includes('rate limit')) {
            return res.status(429).json({
                message: 'API rate limit exceeded. Please try again later.',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Error generating recommendations',
            error: error.message
        });
    }
};


const chatWithGPT = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: 'Please provide a message' });
        }

        const { getChatResponse } = require('../utils/gptService');
        const response = await getChatResponse(message);

        res.status(200).json({
            message: 'Response generated successfully',
            userMessage: message,
            gptResponse: response
        });
    } catch (error) {
        console.error('GPT chat error:', error);
        res.status(500).json({
            message: 'Error communicating with GPT',
            error: error.message
        });
    }
};

module.exports = {
    getRecommendations,
    chatWithGPT
};