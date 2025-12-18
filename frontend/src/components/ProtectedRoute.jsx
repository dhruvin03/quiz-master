import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    
    if (!isAdminLoggedIn || isAdminLoggedIn !== 'true') {
        return <Navigate to="/admin/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
