import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';

const InstructorCourses = () => {
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await courseService.getInstructorCourses();
            setCourses(data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await courseService.deleteCourse(courseId);
                fetchCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course');
            }
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-primary">My Courses</h1>
                <Link to="/instructor/create-course" className="btn-primary">
                    Create New Course
                </Link>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-4">
                        You haven't created any courses yet
                    </p>
                    <Link to="/instructor/create-course" className="btn-primary">
                        Create Your First Course
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course._id} className="card">
                            <img
                                src={course.thumbnail || 'https://via.placeholder.com/300x200'}
                                alt={course.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />

                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {course.title}
                            </h3>

                            <p className="text-gray-600 mb-4 line-clamp-2">
                                {course.description}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm bg-primary-light text-white px-3 py-1 rounded-full">
                                    {course.level}
                                </span>
                                <span className={`text-sm px-3 py-1 rounded-full ${course.isPublished
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {course.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Enrolled Students: {course.enrolledStudents?.length || 0}
                            </p>

                            <div className="flex gap-2">
                                <Link
                                    to={`/instructor/edit-course/${course._id}`}
                                    className="flex-1 text-center btn-primary"
                                >
                                    Edit
                                </Link>
                                <Link
                                    to={`/instructor/course-students/${course._id}`}
                                    className="flex-1 text-center btn-secondary"
                                >
                                    Students
                                </Link>
                                <button
                                    onClick={() => handleDelete(course._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorCourses;