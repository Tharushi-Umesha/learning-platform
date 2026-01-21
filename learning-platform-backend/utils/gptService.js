const OpenAI = require('openai');


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


let apiRequestCount = 0;
const MAX_API_REQUESTS = 250;


const getCourseRecommendations = async (userPrompt, availableCourses) => {
    try {

        if (apiRequestCount >= MAX_API_REQUESTS) {
            throw new Error('API request limit reached (250 requests)');
        }


        const coursesInfo = availableCourses.map((course, index) =>
            `${index + 1}. ${course.title} - ${course.description} (Level: ${course.level}, Category: ${course.category})`
        ).join('\n');

        const inputPrompt = `You are a helpful course recommendation assistant for an online learning platform.

User's request: "${userPrompt}"

Available courses:
${coursesInfo}

Based on the user's career goals or learning interests, recommend the top 3-5 most relevant courses from the available list above.

Return ONLY a JSON object with this exact structure (no extra text):
{
  "recommendations": [
    {
      "courseTitle": "Course Name",
      "reason": "Why this course is recommended"
    }
  ],
  "explanation": "Brief explanation of the recommendation strategy"
}`;


        apiRequestCount++;
        console.log(`GPT API Request #${apiRequestCount} of ${MAX_API_REQUESTS}`);

        const completion = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: inputPrompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const responseContent = completion.choices[0].message.content;


        let parsedResponse;
        try {

            const cleanContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            parsedResponse = JSON.parse(cleanContent);
        } catch (parseError) {

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


const getChatResponse = async (userMessage) => {
    try {

        if (apiRequestCount >= MAX_API_REQUESTS) {
            throw new Error('API request limit reached (250 requests)');
        }

        apiRequestCount++;
        console.log(`GPT API Request #${apiRequestCount} of ${MAX_API_REQUESTS}`);

        const completion = await client.chat.completions.create({
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