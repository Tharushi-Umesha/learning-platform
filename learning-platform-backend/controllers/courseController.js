const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { validationResult } = require('express-validator');

// Create new course (Instructor only)
const createCourse = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, content, duration, level, category, price, thumbnail } = req.body;

        const course = new Course({
            title,
            description,
            content,
            instructor: req.userId,
            duration,
            level,
            category,
            price,
            thumbnail
        });

        await course.save();
        await course.populate('instructor', 'username email fullName');

        res.status(201).json({
            message: 'Course created successfully',
            course
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ message: 'Server error creating course', error: error.message });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const { category, level, search } = req.query;

        let query = { isPublished: true };

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by level
        if (level) {
            query.level = level;
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await Course.find(query)
            .populate('instructor', 'username email fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: courses.length,
            courses
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ message: 'Server error fetching courses', error: error.message });
    }
};

// Get single course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'username email fullName');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ course });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ message: 'Server error fetching course', error: error.message });
    }
};

// Get courses created by instructor
const getInstructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.userId })
            .populate('instructor', 'username email fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: courses.length,
            courses
        });
    } catch (error) {
        console.error('Get instructor courses error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update course (Instructor only - their own courses)
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the instructor of this course
        if (course.instructor.toString() !== req.userId) {
            return res.status(403).json({ message: 'You can only update your own courses' });
        }

        const { title, description, content, duration, level, category, price, thumbnail, isPublished } = req.body;

        // Update fields
        if (title) course.title = title;
        if (description) course.description = description;
        if (content) course.content = content;
        if (duration) course.duration = duration;
        if (level) course.level = level;
        if (category) course.category = category;
        if (price !== undefined) course.price = price;
        if (thumbnail) course.thumbnail = thumbnail;
        if (isPublished !== undefined) course.isPublished = isPublished;

        await course.save();
        await course.populate('instructor', 'username email fullName');

        res.status(200).json({
            message: 'Course updated successfully',
            course
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ message: 'Server error updating course', error: error.message });
    }
};

// Delete course (Instructor only - their own courses)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the instructor of this course
        if (course.instructor.toString() !== req.userId) {
            return res.status(403).json({ message: 'You can only delete your own courses' });
        }

        // Delete all enrollments for this course
        await Enrollment.deleteMany({ course: req.params.id });

        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ message: 'Server error deleting course', error: error.message });
    }
};

// Get enrolled students for a course (Instructor only)
const getEnrolledStudents = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the instructor of this course
        if (course.instructor.toString() !== req.userId) {
            return res.status(403).json({ message: 'You can only view students of your own courses' });
        }

        const enrollments = await Enrollment.find({ course: req.params.id })
            .populate('student', 'username email fullName')
            .sort({ enrolledAt: -1 });

        const students = enrollments.map(enrollment => ({
            id: enrollment.student._id,
            username: enrollment.student.username,
            email: enrollment.student.email,
            fullName: enrollment.student.fullName,
            enrolledAt: enrollment.enrolledAt,
            status: enrollment.status,
            progress: enrollment.progress
        }));

        res.status(200).json({
            courseTitle: course.title,
            totalStudents: students.length,
            students
        });
    } catch (error) {
        console.error('Get enrolled students error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    getInstructorCourses,
    updateCourse,
    deleteCourse,
    getEnrolledStudents
};