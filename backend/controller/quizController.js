const Quiz = require('../models/Quiz');

// Admin: Create Quiz (Protected)
const createQuiz = async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        /* Validate if title and questions are present */
        if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ success: false, message: 'Title and questions are required, and questions must be a non-empty array.' });
        }
        
        const quiz = new Quiz({
            title,
            description,
            questions,
            isPublished: false
        });

        await quiz.save();
        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Publish Quiz (Protected)
const publishQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            { isPublished: true },
            { new: true }
        );

        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Public: Get Published Quizzes
const getPublishedQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isPublished: true })
            .select('-questions.correctAnswer');

        res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Public: Get Quiz by ID (without correct answers)
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .select('-questions.correctAnswer');

        if (!quiz || !quiz.isPublished) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createQuiz,
    publishQuiz,
    getPublishedQuizzes,
    getQuizById
};