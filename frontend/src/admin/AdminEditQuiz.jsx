import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizByIdAdmin, updateQuiz } from '../api/quizApi';
import Loader from '../components/Loader';

const AdminEditQuiz = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuiz();
    }, [id]);

    const fetchQuiz = async () => {
        try {
            setLoading(true);
            const response = await getQuizByIdAdmin(id);
            const quiz = response.data;
            
            setFormData({
                title: quiz.title,
                description: quiz.description || ''
            });
            
            setQuestions(quiz.questions.map(q => ({
                type: q.type,
                question: q.question,
                options: q.options || [],
                correctAnswer: q.correctAnswer
            })));
            
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch quiz');
            console.error('Error fetching quiz:', err);
        } finally {
            setLoading(false);
        }
    };

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
            return 'Please enter a quiz title';
        }

        if (questions.length === 0) {
            return 'Please add at least one question';
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            
            if (!q.question.trim()) {
                return `Please enter question text for Question ${i + 1}`;
            }

            if (q.type === 'MCQ') {
                if (!q.options || q.options.length < 2) {
                    return `Question ${i + 1}: Please provide at least 2 options`;
                }
                
                const filledOptions = q.options.filter(opt => opt.trim());
                if (filledOptions.length < 2) {
                    return `Question ${i + 1}: Please fill in at least 2 options`;
                }

                if (!q.correctAnswer.trim()) {
                    return `Question ${i + 1}: Please enter the correct answer`;
                }

                if (!q.options.some(opt => opt.trim() === q.correctAnswer.trim())) {
                    return `Question ${i + 1}: Correct answer must match one of the options`;
                }
            } else if (q.type === 'TRUE_FALSE') {
                if (!q.correctAnswer) {
                    return `Question ${i + 1}: Please select True or False`;
                }
            } else if (q.type === 'TEXT') {
                if (!q.correctAnswer.trim()) {
                    return `Question ${i + 1}: Please enter the correct answer`;
                }
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            alert(validationError);
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const quizData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                questions: questions.map(q => {
                    const question = {
                        type: q.type,
                        question: q.question.trim(),
                        correctAnswer: q.correctAnswer.trim()
                    };

                    if (q.type === 'MCQ') {
                        question.options = q.options.filter(opt => opt.trim());
                    }

                    return question;
                })
            };

            await updateQuiz(id, quizData);
            alert('Quiz updated successfully!');
            navigate('/admin/quizzes');
        } catch (err) {
            setError(err.message || 'Failed to update quiz');
            alert(err.message || 'Failed to update quiz');
            console.error('Error updating quiz:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loader message="Loading quiz..." />;
    }

    if (error && !formData.title) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>Error: {error}</div>
                </div>
                <button className="btn btn-primary" onClick={fetchQuiz}>
                    <i className="bi bi-arrow-clockwise me-2"></i>Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="mb-4">
                <button 
                    className="btn btn-outline-secondary mb-3"
                    onClick={() => navigate('/admin/quizzes')}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Quiz List
                </button>
                <h1 className="display-5 fw-bold">
                    <i className="bi bi-pencil-square text-primary me-3"></i>
                    Edit Quiz
                </h1>
                <p className="text-muted">Update quiz details and questions</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="card-title mb-3">
                            <i className="bi bi-info-circle text-primary me-2"></i>
                            Quiz Information
                        </h5>
                        
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                Quiz Title <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter quiz title"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Enter quiz description (optional)"
                            />
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-question-circle text-primary me-2"></i>
                                Questions
                            </h5>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addQuestion}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Add Question
                            </button>
                        </div>

                        {questions.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                                <p className="mt-2">No questions yet. Click "Add Question" to start.</p>
                            </div>
                        ) : (
                            <div className="accordion" id="questionsAccordion">
                                {questions.map((question, qIndex) => (
                                    <div className="accordion-item" key={qIndex}>
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#question-${qIndex}`}
                                                aria-expanded="true"
                                            >
                                                <strong>Question {qIndex + 1}</strong>
                                                {question.question && (
                                                    <span className="ms-2 text-muted">
                                                        - {question.question.substring(0, 50)}
                                                        {question.question.length > 50 ? '...' : ''}
                                                    </span>
                                                )}
                                            </button>
                                        </h2>
                                        <div
                                            id={`question-${qIndex}`}
                                            className="accordion-collapse collapse show"
                                            data-bs-parent="#questionsAccordion"
                                        >
                                            <div className="accordion-body">
                                                <div className="mb-3">
                                                    <label className="form-label">Question Type</label>
                                                    <select
                                                        className="form-select"
                                                        value={question.type}
                                                        onChange={(e) => updateQuestionType(qIndex, e.target.value)}
                                                    >
                                                        <option value="MCQ">Multiple Choice</option>
                                                        <option value="TRUE_FALSE">True/False</option>
                                                        <option value="TEXT">Text Answer</option>
                                                    </select>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        Question Text <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={question.question}
                                                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                        placeholder="Enter your question"
                                                        required
                                                    />
                                                </div>

                                                {question.type === 'MCQ' && (
                                                    <>
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                Options <span className="text-danger">*</span>
                                                            </label>
                                                            {question.options.map((option, oIndex) => (
                                                                <div key={oIndex} className="input-group mb-2">
                                                                    <span className="input-group-text">
                                                                        {String.fromCharCode(65 + oIndex)}
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={option}
                                                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                        placeholder={`Option ${oIndex + 1}`}
                                                                        required
                                                                    />
                                                                    {question.options.length > 2 && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-danger"
                                                                            onClick={() => removeOption(qIndex, oIndex)}
                                                                        >
                                                                            <i className="bi bi-trash"></i>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary mt-2"
                                                                onClick={() => addOption(qIndex)}
                                                            >
                                                                <i className="bi bi-plus-circle me-1"></i>
                                                                Add Option
                                                            </button>
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                Correct Answer <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={question.correctAnswer}
                                                                onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                                                placeholder="Enter the exact correct option"
                                                                required
                                                            />
                                                            <div className="form-text">
                                                                Must match one of the options exactly
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {question.type === 'TRUE_FALSE' && (
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Correct Answer <span className="text-danger">*</span>
                                                        </label>
                                                        <div className="btn-group w-100" role="group">
                                                            <input
                                                                type="radio"
                                                                className="btn-check"
                                                                name={`tf-${qIndex}`}
                                                                id={`tf-true-${qIndex}`}
                                                                checked={question.correctAnswer === 'true'}
                                                                onChange={() => updateQuestion(qIndex, 'correctAnswer', 'true')}
                                                            />
                                                            <label className="btn btn-outline-success" htmlFor={`tf-true-${qIndex}`}>
                                                                <i className="bi bi-check-circle me-2"></i>
                                                                True
                                                            </label>

                                                            <input
                                                                type="radio"
                                                                className="btn-check"
                                                                name={`tf-${qIndex}`}
                                                                id={`tf-false-${qIndex}`}
                                                                checked={question.correctAnswer === 'false'}
                                                                onChange={() => updateQuestion(qIndex, 'correctAnswer', 'false')}
                                                            />
                                                            <label className="btn btn-outline-danger" htmlFor={`tf-false-${qIndex}`}>
                                                                <i className="bi bi-x-circle me-2"></i>
                                                                False
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}

                                                {question.type === 'TEXT' && (
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Correct Answer <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={question.correctAnswer}
                                                            onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                                            placeholder="Enter the correct answer"
                                                            required
                                                        />
                                                        <div className="form-text">
                                                            Comparison will be case-insensitive
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => removeQuestion(qIndex)}
                                                    >
                                                        <i className="bi bi-trash me-2"></i>
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

                {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>{error}</div>
                    </div>
                )}

                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Updating Quiz...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle me-2"></i>
                                Update Quiz
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() => navigate('/admin/quizzes')}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditQuiz;
