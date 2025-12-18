import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublishedQuizzes } from '../api/quizApi';
import Loader from './Loader';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const data = await getPublishedQuizzes();
            setQuizzes(data.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch quizzes');
            console.error('Error fetching quizzes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = (quizId) => {
        navigate(`/quiz/${quizId}/start`);
    };

    if (loading) {
        return <Loader message="Loading quizzes..." />;
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>Error: {error}</div>
                </div>
                <button className="btn btn-primary" onClick={fetchQuizzes}>
                    <i className="bi bi-arrow-clockwise me-2"></i>Retry
                </button>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                    <h2 className="mt-3">No Quizzes Available</h2>
                    <p className="text-muted">Check back later for new quizzes.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold">
                    <i className="bi bi-mortarboard-fill text-primary me-3"></i>
                    Available Quizzes
                </h1>
                <p className="lead text-muted">Choose a quiz to test your knowledge</p>
            </div>
            
            <div className="row g-4">
                {quizzes.map((quiz) => (
                    <div key={quiz._id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm hover-shadow">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title fw-bold">
                                    <i className="bi bi-journal-text text-primary me-2"></i>
                                    {quiz.title}
                                </h5>
                                {quiz.description && (
                                    <p className="card-text text-muted flex-grow-1">
                                        {quiz.description}
                                    </p>
                                )}
                                <div className="d-flex align-items-center mb-3">
                                    <span className="badge bg-primary">
                                        <i className="bi bi-question-circle me-1"></i>
                                        {quiz.questions?.length || 0} Questions
                                    </span>
                                </div>
                                <button 
                                    className="btn btn-primary w-100"
                                    onClick={() => handleStartQuiz(quiz._id)}
                                >
                                    <i className="bi bi-play-circle me-2"></i>
                                    Start Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizList;