const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');

// Start Quiz
const startQuiz = async (req, res) => {
    try {
        const { quizId, name, email, age, gender } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({ message: 'name, and email are required before starting quiz' });
        }

        // Check if quiz exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Create new submission
        const submission = new Submission({
            quizId,
            user: {
                name,
                email,
                age,
                gender
            },
            answers: [],
            score: 0
        });

        await submission.save();

        res.status(201).json({
            submissionId: submission._id,
            message: 'Quiz started successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Finish Quiz
const finishQuiz = async (req, res) => {
    try {
        const { submissionId, answers } = req.body;

        // Validation
        if (!submissionId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'submissionId and answers array are required' });
        }

        // Fetch submission
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Fetch related quiz
        const quiz = await Quiz.findById(submission.quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Calculate score
        let score = 0;
        const questionMap = {};

        // Create a map for quick question lookup
        quiz.questions.forEach(q => {
            questionMap[q._id.toString()] = q;
        });

        // Evaluate answers
        answers.forEach(ans => {
            const question = questionMap[ans.questionId];
            if (question) {
                let isCorrect = false;

                if (question.type === 'MCQ' || question.type === 'TRUE_FALSE') {
                    // Exact match
                    isCorrect = ans.answer === question.correctAnswer;
                } else if (question.type === 'TEXT') {
                    // Case-insensitive match
                    isCorrect = ans.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                }

                if (isCorrect) {
                    score++;
                }
            }
        });

        // Update submission
        submission.answers = answers;
        submission.score = score;
        await submission.save();

        res.status(200).json({
            score,
            totalQuestions: quiz.questions.length,
            message: 'Quiz submitted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    startQuiz,
    finishQuiz
};