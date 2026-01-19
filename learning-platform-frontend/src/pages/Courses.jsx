import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/courseService';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        level: '',
    });

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await courseService.getAllCourses(filters);
            setCourses(data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-primary mb-8">Available Courses</h1>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search courses..."
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Level
                        </label>
                        <select
                            name="level"
                            value={filters.level}
                            onChange={handleFilterChange}
                            className="input-field"
                        >
                            <option value="">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            placeholder="e.g., Programming"
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No courses found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="card flex flex-col justify-between"
                        >
                            {/* Header */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {course.title}
                                </h3>

                                <p className="text-gray-600 line-clamp-3">
                                    {course.description}
                                </p>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs bg-primary-light text-white px-3 py-1 rounded-full">
                                    {course.level}
                                </span>

                                <span className="text-sm text-accent-dark">
                                    {course.duration}
                                </span>
                            </div>

                            {/* Instructor */}
                            <p className="text-sm text-gray-600 mt-3">
                                Instructor:{" "}
                                <span className="font-medium">
                                    {course.instructor?.fullName || course.instructor?.username}
                                </span>
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-6">
                                <span className="text-2xl font-bold text-primary">
                                    ${course.price}
                                </span>

                                <Link
                                    to={`/courses/${course._id}`}
                                    className="btn-primary"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default Courses;