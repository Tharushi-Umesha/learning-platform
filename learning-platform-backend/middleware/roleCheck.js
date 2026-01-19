// Middleware to check if user has required role
const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied. You do not have permission to perform this action',
                requiredRole: roles,
                userRole: req.user.role
            });
        }

        next();
    };
};

// Specific role checkers
const isInstructor = checkRole('instructor');
const isStudent = checkRole('student');
const isStudentOrInstructor = checkRole('student', 'instructor');

module.exports = {
    checkRole,
    isInstructor,
    isStudent,
    isStudentOrInstructor
};