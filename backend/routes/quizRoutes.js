const express = require('express');
const quizController = require('../controller/quizController');
const { protect } = require('../controller/adminController');

const router = express.Router();

// Public Routes
router.get('/', quizController.getPublishedQuizzes);
router.get('/:id', quizController.getQuizById);

// Protected Admin Routes
router.post('/', quizController.createQuiz);
router.patch('/:id/publish', quizController.publishQuiz);

module.exports = router;
