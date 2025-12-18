import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/quizApi';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await adminLogin(formData.email, formData.password);
            
            if (response.success) {
                // Store login status in localStorage
                localStorage.setItem('isAdminLoggedIn', 'true');
                
                // Redirect to admin quizzes page
                navigate('/admin/quizzes');
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: '4rem' }}></i>
                                <h1 className="mt-3 fw-bold">Admin Login</h1>
                                <p className="text-muted">Sign in to manage quizzes</p>
                            </div>
                            
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <div>{error}</div>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <i className="bi bi-envelope-fill me-2"></i>Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="admin@example.com"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">
                                        <i className="bi bi-lock-fill me-2"></i>Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                        disabled={loading}
                                    />
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
                                                Logging in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Login
                                            </>
                                        )}
                                    </button>
                                    
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/')}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-house-fill me-2"></i>
                                        Back to Home
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

export default AdminLogin;