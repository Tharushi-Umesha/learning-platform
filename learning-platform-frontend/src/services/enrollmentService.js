import api from '../utils/api';

class EnrollmentService {
    async enrollInCourse(courseId) {
        const response = await api.post('/enrollments', { courseId });
        return response.data;
    }

    async getMyEnrollments() {
        const response = await api.get('/enrollments');
        return response.data;
    }

    async checkEnrollmentStatus(courseId) {
        const response = await api.get(`/enrollments/check/${courseId}`);
        return response.data;
    }

    async updateProgress(enrollmentId, progress) {
        const response = await api.put(`/enrollments/${enrollmentId}/progress`, { progress });
        return response.data;
    }

    async unenroll(enrollmentId) {
        const response = await api.delete(`/enrollments/${enrollmentId}`);
        return response.data;
    }
}

export default new EnrollmentService();