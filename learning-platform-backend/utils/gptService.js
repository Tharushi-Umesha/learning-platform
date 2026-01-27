const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

let apiRequestCount = 0;
const MAX_API_REQUESTS = 250;


const responseCache = new Map();
const CACHE_DURATION = 3600000;

const getCourseRecommendations = async (userPrompt, availableCourses) => {
    try {

        const cacheKey = userPrompt.toLowerCase().trim();
        const cached = responseCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('✓ Cache HIT - Instant response (<100ms)');
            return {
                ...cached.data,
                cached: true,
                responseTime: '<100ms'
            };
        }

        if (apiRequestCount >= MAX_API_REQUESTS) {
            throw new Error('API request limit reached (250 requests)');
        }

        // OPTIMIZATION 2: Reduce course context (fewer tokens = faster response)
        const coursesInfo = availableCourses.slice(0, 10).map((course, index) =>
            `${index + 1}. ${course.title} (${course.level}, ${course.category})`
        ).join('\n');

        // OPTIMIZATION 3: Shorter, more focused prompt
        const inputPrompt = `User wants: "${userPrompt}"

Courses available:
${coursesInfo}

Recommend top 3 relevant courses. Return JSON only:
{
  "recommendations": [{"courseTitle": "Name", "reason": "Brief reason (max 15 words)"}],
  "explanation": "One sentence summary"
}`;

        apiRequestCount++;
        const startTime = Date.now();
        console.log(`GPT API Request #${apiRequestCount}/${MAX_API_REQUESTS} - Starting...`);

        const completion = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: inputPrompt }],
            temperature: 0.5,
            max_tokens: 300
        });

        const responseTime = Date.now() - startTime;
        console.log(`✓ GPT responded in ${responseTime}ms`);

        const responseContent = completion.choices[0].message.content;

        let parsedResponse;
        try {
            const cleanContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            parsedResponse = JSON.parse(cleanContent);
        } catch (parseError) {
            parsedResponse = {
                recommendations: [{
                    courseTitle: "Multiple Courses",
                    reason: responseContent.substring(0, 100)
                }],
                explanation: "Recommendations based on your goals"
            };
        }


        parsedResponse.responseTime = `${responseTime}ms`;
        parsedResponse.cached = false;


        responseCache.set(cacheKey, {
            data: parsedResponse,
            timestamp: Date.now()
        });


        if (responseCache.size > 50) {
            const firstKey = responseCache.keys().next().value;
            responseCache.delete(firstKey);
            console.log('Cache cleaned (kept 50 most recent)');
        }

        return parsedResponse;

    } catch (error) {
        console.error('GPT Service Error:', error.message);
        throw error;
    }
};

const getChatResponse = async (userMessage) => {
    try {
        if (apiRequestCount >= MAX_API_REQUESTS) {
            throw new Error('API request limit reached (250 requests)');
        }

        apiRequestCount++;
        console.log(`GPT API Request #${apiRequestCount}/${MAX_API_REQUESTS}`);

        const completion = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful learning assistant. Keep responses brief and educational."
                },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 200
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('GPT Chat Error:', error.message);
        throw error;
    }
};

const getApiRequestCount = () => {
    return {
        count: apiRequestCount,
        limit: MAX_API_REQUESTS,
        remaining: MAX_API_REQUESTS - apiRequestCount,
        cacheSize: responseCache.size
    };
};

module.exports = {
    getCourseRecommendations,
    getChatResponse,
    getApiRequestCount
};