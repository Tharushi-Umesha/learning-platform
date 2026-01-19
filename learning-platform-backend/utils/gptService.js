const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Track API request count
let apiRequestCount = 0;
const MAX_API_REQUESTS = 250;

// Get course recommendations based on user prompt
const getCourseRecommendations = async (userPrompt, availableCourses) => {
    try {
        // Check API request limit
        if (apiRequestCount >= MAX_API_REQUESTS) {
            throw new Error('API request limit reached (250 requests)');
        }

        // Format courses for GPT
        const coursesInfo = availableCourses.map((course, index) =>
            `${index + 1}. ${course.title} - ${course.description} (Level: ${course.level}, Category: ${course.category})`
        ).join('\n');

        const systemPrompt = `You are a helpful course recommendation assistant for an online learning platform. 
Based on the user's career goals or learning interests, recommend the most relevant courses from the available list.
Provide your response in JSON format with the following structure:
{
  "recommendations": [
    {
      "courseTitle": "Course Name",
      "reason": "Why this course is recommended"
    }
  ],
  "explanation": "Brief explanation of the recommendation strategy"
}`;

        const userMessage = `User's request: "${userPrompt}"

Available courses:
${coursesInfo}

Please recommend the top 3-5 most relevant courses with explanations.`;

        // Make API call
        apiRequestCount++;
        console.log(`GPT API Request #${apiRequestCount} of ${MAX_API_REQUESTS}`);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const responseContent = completion.choices[0].message.content;

        // Parse JSON response
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseContent);
        } catch (parseError) {
            // If JSON parsing fails, create a structured response
            parsedResponse = {
                recommendations: [{
                    courseTitle: "Multiple Courses",
                    reason: responseContent
                }],
                explanation: "Recommendations based on your learning goals"
            };
        }

        return parsedResponse;
    } catch (error) {
        console.error('GPT Service Error:', error);
        throw error;
    }
};

// General chat with GPT
const getChatResponse = async (userMessage) => {
    try {
        // Check API request limit
        if (apiRequestCount >= MAX_API_REQUESTS) {
            throw new Error('API request limit reached (250 requests)');
        }

        apiRequestCount++;
        console.log(`GPT API Request #${apiRequestCount} of ${MAX_API_REQUESTS}`);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant for an online learning platform. Help users with their learning and course-related questions."
                },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 300
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('GPT Chat Error:', error);
        throw error;
    }
};

// Get current API request count
const getApiRequestCount = () => {
    return {
        count: apiRequestCount,
        limit: MAX_API_REQUESTS,
        remaining: MAX_API_REQUESTS - apiRequestCount
    };
};

module.exports = {
    getCourseRecommendations,
    getChatResponse,
    getApiRequestCount
};