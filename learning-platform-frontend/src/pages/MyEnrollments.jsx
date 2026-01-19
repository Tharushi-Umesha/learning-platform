import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import enrollmentService from '../services/enrollmentService';

const MyEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const data = await enrollmentService.getMyEnrollments();
            setEnrollments(data.enrollments);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-primary mb-8">My Enrolled Courses</h1>

            {enrollments.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-4">
                        You haven't enrolled in any courses yet
                    </p>
                    <Link to="/courses" className="btn-primary">
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment._id} className="card">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {enrollment.course.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                                {enrollment.course.description}
                            </p>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">
                                    Instructor: {enrollment.course.instructor?.fullName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{enrollment.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `${enrollment.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-sm px-3 py-1 rounded-full ${enrollment.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {enrollment.status}
                                </span>
                                <Link
                                    to={`/courses/${enrollment.course._id}`}
                                    className="btn-primary"
                                >
                                    View Course
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEnrollments;