const express = require('express');
const { startQuiz, finishQuiz } = require('../controller/submissionController');

const router = express.Router();

// POST /api/submissions/start - Start a new quiz submission
router.post('/start', startQuiz);

// POST /api/submissions/finish - Finish a quiz submission
router.post('/finish', finishQuiz);

module.exports = router;