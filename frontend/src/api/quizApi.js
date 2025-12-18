import axios from 'axios';

// Create axios instance with baseURL from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Get all published quizzes
export const getPublishedQuizzes = async () => {
    try {
        const response = await api.get('/quizzes');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get quiz by ID
export const getQuizById = async (id) => {
    try {
        const response = await api.get(`/quizzes/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Start quiz with user info
export const startQuiz = async (userInfo, quizId) => {
    try {
        const response = await api.post('/submissions/start', {
            quizId,
            ...userInfo
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Submit quiz answers
export const finishQuiz = async (submissionId, answers) => {
    try {
        const response = await api.post('/submissions/finish', {
            submissionId,
            answers
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;