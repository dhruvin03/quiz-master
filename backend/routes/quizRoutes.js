const express = require('express');
const quizController = require('../controller/quizController');

const router = express.Router();

// Admin Routes (must come before /:id route)
router.get('/admin/all', quizController.getAllQuizzes);
router.get('/admin/:id', quizController.getQuizByIdAdmin);
router.post('/', quizController.createQuiz);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);
router.patch('/:id/publish', quizController.publishQuiz);
router.patch('/:id/unpublish', quizController.unpublishQuiz);

// Public Routes
router.get('/', quizController.getPublishedQuizzes);
router.get('/:id', quizController.getQuizById);

module.exports = router;
