import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Home = () => {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Welcome to LearnHub
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Your gateway to personalized online learning. Discover courses,
                        enroll in programs, and get AI-powered recommendations tailored to your goals.
                    </p>
                    {!isAuthenticated ? (
                        <div className="flex gap-4 justify-center">
                            <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                Get Started
                            </Link>
                            <Link to="/courses" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                                Browse Courses
                            </Link>
                        </div>
                    ) : (
                        <Link to="/courses" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                            Explore Courses
                        </Link>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Why Choose LearnHub?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card text-center">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Wide Range of Courses
                        </h3>
                        <p className="text-gray-600">
                            Access hundreds of courses across various categories from expert instructors.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            AI-Powered Recommendations
                        </h3>
                        <p className="text-gray-600">
                            Get personalized course suggestions based on your career goals using advanced AI.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-4">🎓</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Learn at Your Pace
                        </h3>
                        <p className="text-gray-600">
                            Track your progress and learn according to your schedule with flexible access.
                        </p>
                    </div>
                </div>
            </div>

            {/* For Instructors Section */}
            <div className="bg-accent-light bg-opacity-20 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Are You an Instructor?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Share your knowledge with students worldwide. Create and manage courses,
                            track student progress, and make an impact in education.
                        </p>
                        {!isAuthenticated ? (
                            <Link to="/register" className="btn-primary">
                                Start Teaching Today
                            </Link>
                        ) : user?.role === 'instructor' ? (
                            <Link to="/instructor/create-course" className="btn-primary">
                                Create Your First Course
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!isAuthenticated && (
                <div className="bg-primary text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of learners who are already transforming their careers with LearnHub.
                        </p>
                        <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                            Sign Up Now
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;