import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllQuizzes, publishQuiz, unpublishQuiz, deleteQuiz, adminLogout } from '../api/quizApi';
import Loader from '../components/Loader';

const AdminQuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingQuizId, setUpdatingQuizId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const data = await getAllQuizzes();
            setQuizzes(data.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch quizzes');
            console.error('Error fetching quizzes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (quizId, isPublished) => {
        try {
            setUpdatingQuizId(quizId);
            
            if (isPublished) {
                await unpublishQuiz(quizId);
            } else {
                await publishQuiz(quizId);
            }
            
            // Refresh the quiz list
            await fetchQuizzes();
        } catch (err) {
            alert(err.message || 'Failed to update quiz status');
            console.error('Error updating quiz:', err);
        } finally {
            setUpdatingQuizId(null);
        }
    };

    const handleEdit = (quizId) => {
        navigate(`/admin/edit-quiz/${quizId}`);
    };

    const handleDelete = async (quizId, quizTitle) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${quizTitle}"?\n\nThis action cannot be undone.`
        );
        
        if (!confirmed) return;

        try {
            setUpdatingQuizId(quizId);
            await deleteQuiz(quizId);
            
            // Refresh the quiz list
            await fetchQuizzes();
            alert('Quiz deleted successfully!');
        } catch (err) {
            alert(err.message || 'Failed to delete quiz');
            console.error('Error deleting quiz:', err);
        } finally {
            setUpdatingQuizId(null);
        }
    };

    const handleLogout = async () => {
        try {
            await adminLogout();
            // Cookie is cleared by backend
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout error:', err);
            // Still navigate to login even if API fails
            navigate('/admin/login');
        }
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

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="display-5 fw-bold">
                        <i className="bi bi-gear-fill text-primary me-3"></i>
                        Admin Dashboard
                    </h1>
                    <p className="text-muted">Manage all quizzes</p>
                </div>
                <div>
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => navigate('/admin/create-quiz')}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Quiz
                    </button>
                    <button 
                        className="btn btn-outline-danger"
                        onClick={handleLogout}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </button>
                </div>
            </div>

            {quizzes.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                    <h2 className="mt-3">No Quizzes Yet</h2>
                    <p className="text-muted">Create your first quiz to get started.</p>
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/admin/create-quiz')}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Quiz
                    </button>
                </div>
            ) : (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">
                                            <i className="bi bi-journal-text me-2"></i>Title
                                        </th>
                                        <th scope="col">
                                            <i className="bi bi-question-circle me-2"></i>Questions
                                        </th>
                                        <th scope="col">
                                            <i className="bi bi-toggle-on me-2"></i>Status
                                        </th>
                                        <th scope="col">
                                            <i className="bi bi-calendar me-2"></i>Created
                                        </th>
                                        <th scope="col" className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quizzes.map((quiz, index) => (
                                        <tr key={quiz._id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                <strong>{quiz.title}</strong>
                                                {quiz.description && (
                                                    <div className="text-muted small">
                                                        {quiz.description.substring(0, 50)}
                                                        {quiz.description.length > 50 ? '...' : ''}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge bg-info">
                                                    {quiz.questions?.length || 0}
                                                </span>
                                            </td>
                                            <td>
                                                {quiz.isPublished ? (
                                                    <span className="badge bg-success">
                                                        <i className="bi bi-check-circle-fill me-1"></i>
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark">
                                                        <i className="bi bi-clock-fill me-1"></i>
                                                        Unpublished
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-muted small">
                                                {new Date(quiz.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleEdit(quiz._id)}
                                                        disabled={updatingQuizId === quiz._id}
                                                        title="Edit Quiz"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        className={`btn btn-sm ${quiz.isPublished ? 'btn-warning' : 'btn-success'}`}
                                                        onClick={() => handleTogglePublish(quiz._id, quiz.isPublished)}
                                                        disabled={updatingQuizId === quiz._id}
                                                        title={quiz.isPublished ? 'Unpublish' : 'Publish'}
                                                    >
                                                        {updatingQuizId === quiz._id ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : quiz.isPublished ? (
                                                            <i className="bi bi-x-circle"></i>
                                                        ) : (
                                                            <i className="bi bi-check-circle"></i>
                                                        )}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(quiz._id, quiz.title)}
                                                        disabled={updatingQuizId === quiz._id}
                                                        title="Delete Quiz"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminQuizList;