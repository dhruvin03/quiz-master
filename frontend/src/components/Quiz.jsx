import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getQuizById, finishQuiz } from '../api/quizApi';
import Loader from './Loader';

const Quiz = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const submissionId = location.state?.submissionId;

    useEffect(() => {
        // Check if submissionId exists
        if (!submissionId) {
            navigate(`/quiz/${id}/start`);
            return;
        }
        fetchQuiz();
    }, [id, submissionId, navigate]);

    const fetchQuiz = async () => {
        try {
            setLoading(true);
            const data = await getQuizById(id);
            setQuiz(data.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch quiz');
            console.error('Error fetching quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (e) => {
        setCurrentAnswer(e.target.value);
    };

    const handleNext = async () => {
        const currentQuestion = quiz.questions[currentQuestionIndex];
        
        // Store the answer
        const answerObj = {
            questionId: currentQuestion._id,
            answer: currentAnswer
        };
        
        const updatedAnswers = [...answers, answerObj];
        setAnswers(updatedAnswers);

        // Check if this is the last question
        if (currentQuestionIndex === quiz.questions.length - 1) {
            // Submit quiz
            await submitQuiz(updatedAnswers);
        } else {
            // Move to next question
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentAnswer('');
        }
    };

    const submitQuiz = async (finalAnswers) => {
        try {
            setSubmitting(true);
            const result = await finishQuiz(submissionId, finalAnswers);
            
            // Redirect to results page with score
            navigate('/result', { 
                state: { 
                    score: result.score,
                    totalQuestions: result.totalQuestions
                } 
            });
        } catch (err) {
            setError(err.message || 'Failed to submit quiz');
            console.error('Error submitting quiz:', err);
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader message="Loading quiz..." />;
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>Error: {error}</div>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    <i className="bi bi-house-fill me-2"></i>Back to Quiz List
                </button>
            </div>
        );
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                    <h2 className="mt-3">No Questions Available</h2>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                        <i className="bi bi-house-fill me-2"></i>Back to Quiz List
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">
                                <i className="bi bi-journal-text me-2"></i>
                                {quiz.title}
                            </h2>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">
                                        <i className="bi bi-list-ol me-1"></i>
                                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                                    </span>
                                    <span className="badge bg-primary">{Math.round(progress)}%</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div 
                                        className="progress-bar progress-bar-striped progress-bar-animated" 
                                        role="progressbar"
                                        style={{ width: `${progress}%` }}
                                        aria-valuenow={progress}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="fw-bold mb-4">
                                    <i className="bi bi-question-circle text-primary me-2"></i>
                                    {currentQuestion.question}
                                </h3>
                                
                                {currentQuestion.type === 'MCQ' && (
                                    <div className="d-grid gap-3">
                                        {currentQuestion.options.map((option, index) => (
                                            <div key={index} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="answer"
                                                    id={`option-${index}`}
                                                    value={option}
                                                    checked={currentAnswer === option}
                                                    onChange={handleAnswerChange}
                                                    disabled={submitting}
                                                />
                                                <label 
                                                    className="form-check-label w-100 p-3 border rounded" 
                                                    htmlFor={`option-${index}`}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <i className="bi bi-circle me-2"></i>
                                                    {option}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.type === 'TRUE_FALSE' && (
                                    <div className="d-grid gap-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="answer"
                                                id="true-option"
                                                value="true"
                                                checked={currentAnswer === 'true'}
                                                onChange={handleAnswerChange}
                                                disabled={submitting}
                                            />
                                            <label 
                                                className="form-check-label w-100 p-3 border rounded" 
                                                htmlFor="true-option"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className="bi bi-check-circle text-success me-2"></i>
                                                True
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="answer"
                                                id="false-option"
                                                value="false"
                                                checked={currentAnswer === 'false'}
                                                onChange={handleAnswerChange}
                                                disabled={submitting}
                                            />
                                            <label 
                                                className="form-check-label w-100 p-3 border rounded" 
                                                htmlFor="false-option"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className="bi bi-x-circle text-danger me-2"></i>
                                                False
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {currentQuestion.type === 'TEXT' && (
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            value={currentAnswer}
                                            onChange={handleAnswerChange}
                                            placeholder="Type your answer here"
                                            disabled={submitting}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="d-grid">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleNext}
                                    disabled={!currentAnswer || submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Submitting...
                                        </>
                                    ) : isLastQuestion ? (
                                        <>
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            Submit Quiz
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-arrow-right-circle-fill me-2"></i>
                                            Next Question
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;