import React, { useState, useEffect } from 'react';
import gptService from '../services/gptService';
import Loader from '../components/Loader';

const Recommendations = () => {
    const [prompt, setPrompt] = useState('');
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [usage, setUsage] = useState(null);

    useEffect(() => {
        fetchUsage();
    }, []);

    const fetchUsage = async () => {
        try {
            const data = await gptService.getUsageStats();
            setUsage(data);
        } catch (error) {
            console.error('Error fetching usage:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await gptService.getRecommendations(prompt);
            setRecommendations(data);
            fetchUsage();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get recommendations');
        } finally {
            setLoading(false);
        }
    };

    const examplePrompts = [
        "I want to be a full-stack web developer, what courses should I follow?",
        "I'm interested in data science and machine learning",
        "Help me become a mobile app developer",
        "What courses do I need for cybersecurity?"
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
                AI Course Recommendations
            </h1>
            <p className="text-gray-600 mb-8">
                Tell us your career goals and get personalized course recommendations powered by AI
            </p>

            {usage && (
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <p className="text-sm text-gray-600">
                        API Usage: {usage.count} / {usage.limit} requests ({usage.remaining} remaining)
                    </p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <form onSubmit={handleSubmit} className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        What are your learning goals?
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., I want to be a software engineer, what courses should I follow?"
                        className="input-field min-h-32"
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary mt-4 disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Getting Recommendations...</span>
                            </>
                        ) : (
                            'Get Recommendations'
                        )}
                    </button>
                </form>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Try these example prompts:
                    </h3>
                    <div className="space-y-2">
                        {examplePrompts.map((example, index) => (
                            <button
                                key={index}
                                onClick={() => setPrompt(example)}
                                disabled={loading}
                                className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors disabled:opacity-50"
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {recommendations && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">
                        Your Personalized Recommendations
                    </h2>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Your Goal:
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                            {recommendations.prompt}
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Recommended Courses:
                        </h3>
                        <div className="space-y-4">
                            {recommendations.recommendations.map((rec, index) => (
                                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                                    <h4 className="font-semibold text-gray-900">
                                        {index + 1}. {rec.courseTitle}
                                    </h4>
                                    <p className="text-gray-600">{rec.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {recommendations.explanation && (
                        <div className="bg-primary-light bg-opacity-10 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Explanation:
                            </h3>
                            <p className="text-gray-700">{recommendations.explanation}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Recommendations;