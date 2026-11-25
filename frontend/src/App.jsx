import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={
        <main className="empty">
          <h1>Page not found</h1>
          <p>The page you requested does not exist.</p>
          <Link to="/">Back to home</Link>
        </main>
      } />
    </Routes>
  )
}

export default App
