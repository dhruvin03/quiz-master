const express = require('express');
const quizController = require('../controller/quizController');
const { protect } = require('../controller/adminController');

const router = express.Router();

// Admin Routes (must come before /:id route) - Protected with auth middleware
router.get('/admin/all', protect, quizController.getAllQuizzes);
router.get('/admin/:id', protect, quizController.getQuizByIdAdmin);
router.post('/', protect, quizController.createQuiz);
router.put('/:id', protect, quizController.updateQuiz);
router.delete('/:id', protect, quizController.deleteQuiz);
router.patch('/:id/publish', protect, quizController.publishQuiz);
router.patch('/:id/unpublish', protect, quizController.unpublishQuiz);

// Public Routes
router.get('/', quizController.getPublishedQuizzes);
router.get('/:id', quizController.getQuizById);

module.exports = router;
