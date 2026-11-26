import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'

function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    const titles = { '/': 'Find. Compare. Book.', '/login': 'Login', '/register': 'Create an account', '/dashboard': 'Dashboard', '/dashboard/preview': 'Dashboard preview' }
    document.title = `${titles[pathname] || 'Page not found'} | BB LaundryLink`
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/preview" element={<DashboardPage preview />} />
      <Route path="*" element={
        <main id="main-content" tabIndex={-1} className="empty">
          <h1>Page not found</h1>
          <p>The page you requested does not exist.</p>
          <Link to="/">Back to home</Link>
        </main>
      } />
    </Routes>
    </>
  )
}

export default App
