import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loader from './components/Loader'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRedirect from './components/AdminRedirect'
import './App.css'

// Lazy load components
const QuizList = lazy(() => import('./components/QuizList'))
const QuizStart = lazy(() => import('./components/QuizStart'))
const Quiz = lazy(() => import('./components/Quiz'))
const Results = lazy(() => import('./components/Results'))
const AdminLogin = lazy(() => import('./admin/AdminLogin'))
const AdminQuizList = lazy(() => import('./admin/AdminQuizList'))
const AdminCreateQuiz = lazy(() => import('./admin/AdminCreateQuiz'))
const AdminEditQuiz = lazy(() => import('./admin/AdminEditQuiz'))

function App() {
  return (
    <Router>
      <div className="app">
        <Suspense fallback={<Loader message="Loading page..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<QuizList />} />
            <Route path="/quiz/:id/start" element={<QuizStart />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/result" element={<Results />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRedirect />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/quizzes" 
              element={
                <ProtectedRoute>
                  <AdminQuizList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/create-quiz" 
              element={
                <ProtectedRoute>
                  <AdminCreateQuiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/edit-quiz/:id" 
              element={
                <ProtectedRoute>
                  <AdminEditQuiz />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
