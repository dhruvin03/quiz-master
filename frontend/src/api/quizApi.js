import axios from 'axios';

// Create axios instance with baseURL from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Important for cookies
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

// Admin: Login
export const adminLogin = async (email, password) => {
    try {
        const response = await api.post('/admin/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Admin: Get all quizzes (published + unpublished)
export const getAllQuizzes = async () => {
    try {
        const response = await api.get('/quizzes/admin/all');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Admin: Get quiz by ID (with correct answers for editing)
export const getQuizByIdAdmin = async (quizId) => {
    try {
        const response = await api.get(`/quizzes/admin/${quizId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Admin: Create quiz
export const createQuiz = async (quizData) => {
    try {
        const response = await api.post('/quizzes', quizData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Admin: Update quiz
export const updateQuiz = async (quizId, quizData) => {
    try {
        const response = await api.put(`/quizzes/${quizId}`, quizData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Admin: Delete quiz
export const deleteQuiz = async (quizId) => {
    try {
        const response = await api.delete(`/quizzes/${quizId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Admin: Publish quiz
export const publishQuiz = async (quizId) => {
    try {
        const response = await api.patch(`/quizzes/${quizId}/publish`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Admin: Unpublish quiz
export const unpublishQuiz = async (quizId) => {
    try {
        const response = await api.patch(`/quizzes/${quizId}/unpublish`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;