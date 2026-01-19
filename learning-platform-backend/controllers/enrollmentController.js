const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Enroll in a course (Student only)
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: req.userId,
      course: courseId
    });

    await enrollment.save();

    // Add student to course's enrolledStudents array
    course.enrolledStudents.push(req.userId);
    await course.save();

    await enrollment.populate('course', 'title description instructor');
    await enrollment.populate('student', 'username email');

    res.status(201).json({
      message: 'Successfully enrolled in the course',
      enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error during enrollment', error: error.message });
  }
};

// Get all enrollments for current student
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.userId })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'username email fullName' }
      })
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single enrollment details
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('course')
      .populate('student', 'username email fullName');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if the enrollment belongs to the current user
    if (enrollment.student._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ enrollment });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update enrollment progress
const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if the enrollment belongs to the current user
    if (enrollment.student.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    enrollment.progress = progress;

    // Mark as completed if progress is 100
    if (progress >= 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    await enrollment.populate('course', 'title description');

    res.status(200).json({
      message: 'Progress updated successfully',
      enrollment
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Unenroll from course
const unenrollCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if the enrollment belongs to the current user
    if (enrollment.student.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove student from course's enrolledStudents array
    await Course.findByIdAndUpdate(
      enrollment.course,
      { $pull: { enrolledStudents: req.userId } }
    );

    await Enrollment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Successfully unenrolled from the course' });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if student is enrolled in a course
const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.userId,
      course: courseId
    });

    res.status(200).json({
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  getEnrollmentById,
  updateProgress,
  unenrollCourse,
  checkEnrollment
};