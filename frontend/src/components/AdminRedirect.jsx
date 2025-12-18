import { Navigate } from 'react-router-dom';

const AdminRedirect = () => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    
    if (isAdminLoggedIn === 'true') {
        return <Navigate to="/admin/quizzes" replace />;
    }
    
    return <Navigate to="/admin/login" replace />;
};

export default AdminRedirect;
