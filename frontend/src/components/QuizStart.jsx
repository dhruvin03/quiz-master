import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startQuiz } from '../api/quizApi';

const QuizStart = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        gender: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email) {
            setError('Name and email are required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const userInfo = {
                name: formData.name,
                email: formData.email,
                age: formData.age ? parseInt(formData.age) : undefined,
                gender: formData.gender || undefined
            };

            const response = await startQuiz(userInfo, id);
            
            // Redirect to quiz page with submissionId
            navigate(`/quiz/${id}`, { 
                state: { submissionId: response.submissionId } 
            });
        } catch (err) {
            setError(err.message || 'Failed to start quiz');
            console.error('Error starting quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#0d6efd' }}></i>
                                <h1 className="mt-3 fw-bold">Start Quiz</h1>
                                <p className="text-muted">Please fill in your details to begin</p>
                            </div>
                            
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <div>{error}</div>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        <i className="bi bi-person-fill me-2"></i>Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your name"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <i className="bi bi-envelope-fill me-2"></i>Email *
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="age" className="form-label">
                                        <i className="bi bi-calendar-event me-2"></i>Age
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-lg"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Enter your age"
                                        min="1"
                                        max="120"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="gender" className="form-label">
                                        <i className="bi bi-gender-ambiguous me-2"></i>Gender
                                    </label>
                                    <select
                                        className="form-select form-select-lg"
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Starting Quiz...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-play-circle-fill me-2"></i>
                                                Start Quiz
                                            </>
                                        )}
                                    </button>
                                    
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/')}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Quiz List
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizStart;