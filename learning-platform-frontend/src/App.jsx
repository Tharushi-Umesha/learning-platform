import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import MyEnrollments from './pages/MyEnrollments';
import Recommendations from './pages/Recommendations';
import InstructorCourses from './pages/InstructorCourses';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import CourseStudents from './pages/CourseStudents';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary-dark">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - All Users */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />

          {/* Student Only Routes */}
          <Route
            path="/my-enrollments"
            element={
              <ProtectedRoute requiredRole="student">
                <MyEnrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute requiredRole="student">
                <Recommendations />
              </ProtectedRoute>
            }
          />

          {/* Instructor Only Routes */}
          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/create-course"
            element={
              <ProtectedRoute requiredRole="instructor">
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/edit-course/:id"
            element={
              <ProtectedRoute requiredRole="instructor">
                <EditCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/course-students/:id"
            element={
              <ProtectedRoute requiredRole="instructor">
                <CourseStudents />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;