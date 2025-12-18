import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../api/quizApi';

const AdminCreateQuiz = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addQuestion = () => {
        const newQuestion = {
            type: 'MCQ',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, field, value) => {
        setQuestions(questions.map((q, i) => {
            if (i === index) {
                return { ...q, [field]: value };
            }
            return q;
        }));
    };

    const updateQuestionType = (index, newType) => {
        setQuestions(questions.map((q, i) => {
            if (i === index) {
                const updated = { ...q, type: newType };
                
                // Reset options and correct answer based on type
                if (newType === 'MCQ') {
                    updated.options = ['', '', '', ''];
                    updated.correctAnswer = '';
                } else if (newType === 'TRUE_FALSE') {
                    updated.options = undefined;
                    updated.correctAnswer = '';
                } else if (newType === 'TEXT') {
                    updated.options = undefined;
                    updated.correctAnswer = '';
                }
                
                return updated;
            }
            return q;
        }));
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        setQuestions(questions.map((q, i) => {
            if (i === questionIndex) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const addOption = (questionIndex) => {
        setQuestions(questions.map((q, i) => {
            if (i === questionIndex) {
                return { ...q, options: [...q.options, ''] };
            }
            return q;
        }));
    };

    const removeOption = (questionIndex, optionIndex) => {
        setQuestions(questions.map((q, i) => {
            if (i === questionIndex && q.options.length > 2) {
                const newOptions = q.options.filter((_, index) => index !== optionIndex);
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Quiz title is required');
            return false;
        }

        if (questions.length === 0) {
            setError('At least one question is required');
            return false;
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            
            if (!q.question.trim()) {
                setError(`Question ${i + 1}: Question text is required`);
                return false;
            }

            if (!q.correctAnswer.trim()) {
                setError(`Question ${i + 1}: Correct answer is required`);
                return false;
            }

            if (q.type === 'MCQ') {
                if (q.options.some(opt => !opt.trim())) {
                    setError(`Question ${i + 1}: All options must be filled`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Format questions for API
            const formattedQuestions = questions.map(q => {
                const questionData = {
                    type: q.type,
                    question: q.question,
                    correctAnswer: q.correctAnswer
                };

                if (q.type === 'MCQ') {
                    questionData.options = q.options;
                }

                return questionData;
            });

            const quizData = {
                title: formData.title,
                description: formData.description,
                questions: formattedQuestions
            };

            await createQuiz(quizData);
            
            // Redirect to admin quiz list
            navigate('/admin/quizzes');
        } catch (err) {
            setError(err.message || 'Failed to create quiz');
            console.error('Error creating quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="display-5 fw-bold">
                            <i className="bi bi-plus-circle-fill text-primary me-3"></i>
                            Create New Quiz
                        </h1>
                        <button 
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/admin/quizzes')}
                            disabled={loading}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Quizzes
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setError(null)}
                            ></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Quiz Basic Info */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Quiz Information
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label fw-bold">
                                        <i className="bi bi-journal-text me-2"></i>Quiz Title *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter quiz title"
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label fw-bold">
                                        <i className="bi bi-card-text me-2"></i>Description (Optional)
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter quiz description"
                                        rows="3"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Questions Section */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <i className="bi bi-question-circle me-2"></i>
                                    Questions ({questions.length})
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-light btn-sm"
                                    onClick={addQuestion}
                                    disabled={loading}
                                >
                                    <i className="bi bi-plus-lg me-1"></i>
                                    Add Question
                                </button>
                            </div>
                            <div className="card-body">
                                {questions.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                                        <p className="mt-3">No questions added yet. Click "Add Question" to get started.</p>
                                    </div>
                                ) : (
                                    <div className="accordion" id="questionsAccordion">
                                        {questions.map((question, index) => (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header">
                                                    <button
                                                        className="accordion-button"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#question-${index}`}
                                                    >
                                                        <strong>Question {index + 1}</strong>
                                                        <span className="badge bg-info ms-3">{question.type}</span>
                                                    </button>
                                                </h2>
                                                <div
                                                    id={`question-${index}`}
                                                    className="accordion-collapse collapse show"
                                                >
                                                    <div className="accordion-body">
                                                        {/* Question Type */}
                                                        <div className="mb-3">
                                                            <label className="form-label fw-bold">
                                                                <i className="bi bi-list-ul me-2"></i>Question Type
                                                            </label>
                                                            <select
                                                                className="form-select"
                                                                value={question.type}
                                                                onChange={(e) => updateQuestionType(index, e.target.value)}
                                                                disabled={loading}
                                                            >
                                                                <option value="MCQ">Multiple Choice (MCQ)</option>
                                                                <option value="TRUE_FALSE">True/False</option>
                                                                <option value="TEXT">Text Answer</option>
                                                            </select>
                                                        </div>

                                                        {/* Question Text */}
                                                        <div className="mb-3">
                                                            <label className="form-label fw-bold">
                                                                <i className="bi bi-question-circle me-2"></i>Question *
                                                            </label>
                                                            <textarea
                                                                className="form-control"
                                                                value={question.question}
                                                                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                                                placeholder="Enter your question"
                                                                rows="2"
                                                                disabled={loading}
                                                                required
                                                            />
                                                        </div>

                                                        {/* Options for MCQ */}
                                                        {question.type === 'MCQ' && (
                                                            <div className="mb-3">
                                                                <label className="form-label fw-bold">
                                                                    <i className="bi bi-list-check me-2"></i>Options *
                                                                </label>
                                                                {question.options.map((option, optIndex) => (
                                                                    <div key={optIndex} className="input-group mb-2">
                                                                        <span className="input-group-text">{optIndex + 1}</span>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={option}
                                                                            onChange={(e) => updateOption(index, optIndex, e.target.value)}
                                                                            placeholder={`Option ${optIndex + 1}`}
                                                                            disabled={loading}
                                                                            required
                                                                        />
                                                                        {question.options.length > 2 && (
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-outline-danger"
                                                                                onClick={() => removeOption(index, optIndex)}
                                                                                disabled={loading}
                                                                            >
                                                                                <i className="bi bi-trash"></i>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => addOption(index)}
                                                                    disabled={loading}
                                                                >
                                                                    <i className="bi bi-plus me-1"></i>
                                                                    Add Option
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Correct Answer */}
                                                        <div className="mb-3">
                                                            <label className="form-label fw-bold">
                                                                <i className="bi bi-check-circle me-2"></i>Correct Answer *
                                                            </label>
                                                            {question.type === 'MCQ' ? (
                                                                <select
                                                                    className="form-select"
                                                                    value={question.correctAnswer}
                                                                    onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                                                                    disabled={loading}
                                                                    required
                                                                >
                                                                    <option value="">Select correct answer</option>
                                                                    {question.options.map((option, idx) => (
                                                                        <option key={idx} value={option}>
                                                                            {option || `Option ${idx + 1}`}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            ) : question.type === 'TRUE_FALSE' ? (
                                                                <select
                                                                    className="form-select"
                                                                    value={question.correctAnswer}
                                                                    onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                                                                    disabled={loading}
                                                                    required
                                                                >
                                                                    <option value="">Select correct answer</option>
                                                                    <option value="true">True</option>
                                                                    <option value="false">False</option>
                                                                </select>
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={question.correctAnswer}
                                                                    onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                                                                    placeholder="Enter correct answer"
                                                                    disabled={loading}
                                                                    required
                                                                />
                                                            )}
                                                        </div>

                                                        {/* Remove Question Button */}
                                                        <div className="text-end">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => removeQuestion(index)}
                                                                disabled={loading}
                                                            >
                                                                <i className="bi bi-trash me-1"></i>
                                                                Remove Question
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/admin/quizzes')}
                                disabled={loading}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || questions.length === 0}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creating Quiz...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save me-2"></i>
                                        Create Quiz
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateQuiz;