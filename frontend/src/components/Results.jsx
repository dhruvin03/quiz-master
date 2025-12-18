import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const score = location.state?.score;
    const totalQuestions = location.state?.totalQuestions;

    useEffect(() => {
        // Redirect to home if no score data is available
        if (score === undefined || totalQuestions === undefined) {
            navigate('/');
        }
    }, [score, totalQuestions, navigate]);

    if (score === undefined || totalQuestions === undefined) {
        return null;
    }

    const percentage = ((score / totalQuestions) * 100).toFixed(1);
    
    // Determine performance level and styling
    let performanceLevel = '';
    let performanceColor = '';
    let performanceIcon = '';
    
    if (percentage >= 80) {
        performanceLevel = 'Excellent!';
        performanceColor = 'success';
        performanceIcon = 'bi-trophy-fill';
    } else if (percentage >= 60) {
        performanceLevel = 'Good Job!';
        performanceColor = 'info';
        performanceIcon = 'bi-hand-thumbs-up-fill';
    } else if (percentage >= 40) {
        performanceLevel = 'Keep Practicing!';
        performanceColor = 'warning';
        performanceIcon = 'bi-lightbulb-fill';
    } else {
        performanceLevel = 'Try Again!';
        performanceColor = 'danger';
        performanceIcon = 'bi-arrow-repeat';
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg text-center">
                        <div className="card-body p-5">
                            <div className="mb-4">
                                <i className={`bi ${performanceIcon} text-${performanceColor}`} style={{ fontSize: '5rem' }}></i>
                            </div>
                            
                            <h1 className="display-4 fw-bold mb-3">Quiz Completed!</h1>
                            <h3 className={`text-${performanceColor} mb-4`}>{performanceLevel}</h3>
                            
                            <div className="my-5">
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <div 
                                        className={`rounded-circle bg-${performanceColor} bg-opacity-10 d-flex align-items-center justify-content-center`}
                                        style={{ width: '200px', height: '200px' }}
                                    >
                                        <div>
                                            <h2 className="display-3 fw-bold mb-0">
                                                <span className={`text-${performanceColor}`}>{score}</span>
                                                <span className="text-muted">/{totalQuestions}</span>
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="progress mb-3" style={{ height: '30px' }}>
                                    <div 
                                        className={`progress-bar bg-${performanceColor}`}
                                        role="progressbar" 
                                        style={{ width: `${percentage}%` }}
                                        aria-valuenow={percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <strong>{percentage}%</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="alert alert-light mb-4">
                                <i className="bi bi-chat-heart-fill text-primary me-2"></i>
                                <strong>Thank you for taking the quiz!</strong>
                                <p className="mb-0 mt-2">
                                    You answered <strong>{score}</strong> out of <strong>{totalQuestions}</strong> questions correctly.
                                </p>
                            </div>

                            <div className="d-grid gap-2">
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={() => navigate('/')}
                                >
                                    <i className="bi bi-house-fill me-2"></i>
                                    Back to Quiz List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;