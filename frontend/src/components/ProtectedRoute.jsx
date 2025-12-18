import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuth } from '../api/quizApi';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        verifyAuth();
    }, []);

    const verifyAuth = async () => {
        try {
            const response = await checkAuth();
            setIsAuthenticated(response.isAuthenticated);
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader message="Verifying authentication..." />;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
