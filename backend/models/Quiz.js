const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    questions: [{
        type: {
            type: String,
            enum: ["MCQ", "TRUE_FALSE", "TEXT"],
            required: true
        },
        question: {
            type: String,
            required: true
        },
        options: {
            type: [String],
            required: function() {
                return this.type === "MCQ";
            }
        },
        correctAnswer: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);