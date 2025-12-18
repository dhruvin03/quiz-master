import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loader from './components/Loader'
import './App.css'

// Lazy load components
const QuizList = lazy(() => import('./components/QuizList'))
const QuizStart = lazy(() => import('./components/QuizStart'))
const Quiz = lazy(() => import('./components/Quiz'))
const Results = lazy(() => import('./components/Results'))

function App() {
  return (
    <Router>
      <div className="app">
        <Suspense fallback={<Loader message="Loading page..." />}>
          <Routes>
            <Route path="/" element={<QuizList />} />
            <Route path="/quiz/:id/start" element={<QuizStart />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/result" element={<Results />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
