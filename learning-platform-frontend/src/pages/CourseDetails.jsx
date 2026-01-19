import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import authService from '../services/authService';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [message, setMessage] = useState('');
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchCourseDetails();
        if (user?.role === 'student') {
            checkEnrollmentStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const data = await courseService.getCourseById(id);
            setCourse(data.course);
        } catch (error) {
            console.error('Error fetching course:', error);
            setMessage('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollmentStatus = async () => {
        try {
            const data = await enrollmentService.checkEnrollmentStatus(id);
            setIsEnrolled(data.isEnrolled);
        } catch (error) {
            console.error('Error checking enrollment:', error);
        }
    };

    const handleEnroll = async () => {
        try {
            setEnrolling(true);
            await enrollmentService.enrollInCourse(id);
            setMessage('Successfully enrolled in the course!');
            setIsEnrolled(true);
            setTimeout(() => {
                navigate('/my-enrollments');
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-xl text-gray-600">Course not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {message && (
                <div className={`mb-4 p-4 rounded-lg ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">

                <div className="p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {course.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-primary-light text-white px-4 py-2 rounded-full">
                            {course.level}
                        </span>
                        <span className="bg-accent-light text-gray-700 px-4 py-2 rounded-full">
                            {course.category}
                        </span>
                        <span className="text-accent-dark">
                            {course.duration}
                        </span>
                    </div>

                    <p className="text-gray-700 text-lg mb-6">{course.description}</p>

                    <div className="border-t border-gray-200 pt-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
                        <div className="prose max-w-none">
                            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                {course.content}
                            </pre>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Instructor</h3>
                        <p className="text-gray-700">
                            {course.instructor?.fullName || course.instructor?.username}
                        </p>
                        <p className="text-gray-600">{course.instructor?.email}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-bold text-primary">
                            ${course.price}
                        </span>

                        {user?.role === 'student' && (
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling || isEnrolled}
                                className="btn-primary disabled:opacity-50"
                            >
                                {isEnrolled ? 'Already Enrolled' : enrolling ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;