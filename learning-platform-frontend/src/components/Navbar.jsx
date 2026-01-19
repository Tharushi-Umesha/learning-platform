import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        LearnHub
                    </Link>

                    <div className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/courses" className="text-accent-dark hover:text-primary">
                                    Courses
                                </Link>

                                {user?.role === 'student' && (
                                    <>
                                        <Link to="/my-enrollments" className="text-accent-dark hover:text-primary">
                                            My Courses
                                        </Link>
                                        <Link to="/recommendations" className="text-accent-dark hover:text-primary">
                                            AI Recommendations
                                        </Link>
                                    </>
                                )}

                                {user?.role === 'instructor' && (
                                    <>
                                        <Link to="/instructor/courses" className="text-accent-dark hover:text-primary">
                                            My Courses
                                        </Link>
                                        <Link to="/instructor/create-course" className="text-accent-dark hover:text-primary">
                                            Create Course
                                        </Link>
                                    </>
                                )}

                                <span className="text-accent-dark">
                                    Welcome, {user?.fullName}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn-secondary"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-accent-dark hover:text-primary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;