import api from '../utils/api';

class GPTService {
    async getRecommendations(prompt) {
        const response = await api.post('/gpt/recommendations', { prompt });
        return response.data;
    }

    async chat(message) {
        const response = await api.post('/gpt/chat', { message });
        return response.data;
    }

    async getUsageStats() {
        const response = await api.get('/gpt/usage');
        return response.data;
    }
}

export default new GPTService();