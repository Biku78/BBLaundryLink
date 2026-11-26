import { useEffect, useRef, useState } from 'react'
import UiIcon from '../components/UiIcon'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation } from '../services/api'
import { setCredentials } from '../features/auth/authSlice'
import './LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem('rememberedEmail') || '' } catch { return '' }
  })
  const [remember, setRemember] = useState(Boolean(email))
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [login, { isLoading }] = useLoginMutation()
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const messageRef = useRef(null)
  useEffect(() => { if (message) messageRef.current?.focus() }, [message])

  if (user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    if (isLoading) return
    setMessage('')
    try {
      const response = await login({ email: email.trim(), password }).unwrap()
      if (!response.data?.token || !response.data?.user) {
        setMessage('The server returned an unexpected response. Please try again.')
        return
      }
      try {
        if (remember) localStorage.setItem('rememberedEmail', email.trim())
        else localStorage.removeItem('rememberedEmail')
      } catch { /* Login must still work when browser storage is unavailable. */ }
      dispatch(setCredentials(response.data))
      setPassword('')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setMessage(error.status === 'FETCH_ERROR' || error.status === 'PARSING_ERROR' || Number(error.status) >= 500
        ? 'Unable to reach the login service. Please try again later.'
        : error.data?.message || 'Login failed. Check your email and password.')
    }
  }

  return <main id="main-content" tabIndex={-1} className="login-page">
    <section className="login-art" aria-label="Welcome back to BB LaundryLink. Find nearby laundry shops, compare prices, track orders, and manage bookings.">
      <Link to="/" className="login-home-link">← Back to home</Link>
    </section>
    <section className="login-side d-flex flex-column justify-content-center">
      <div className="login-panel">
        <div className="login-tabs d-flex" aria-label="Account type"><span><UiIcon name="user"/> Customer Login</span><button type="button" onClick={() => setMessage('Partner login is not available yet. This form is for existing customer accounts.')}><UiIcon name="shop"/> Partner Login</button></div>
        <h1>Login to BB Laundry<span>Link</span></h1>
        <p className="login-tagline">Find. Compare. Book.</p>
        {location.state?.registered && <p className="notice alert alert-success" role="status">Account created successfully! Sign in with your email and password.</p>}
        <form onSubmit={handleSubmit} aria-busy={isLoading}>
          <label className="login-field d-flex align-items-center"><UiIcon name="mail"/><span className="auth-input-group d-flex flex-column flex-grow-1"><span>Email address</span><input className="form-control" aria-label="Email address" type="email" name="email" autoComplete="username" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required maxLength={150} disabled={isLoading}/></span></label>
          <label className="login-field d-flex align-items-center"><UiIcon name="lock"/><span className="auth-input-group d-flex flex-column flex-grow-1"><span>Password</span><input className="form-control" aria-label="Password" type={visible ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isLoading}/></span><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}><UiIcon name={visible ? 'eyeOff' : 'eye'} size={20}/></button></label>
          <div className="login-options d-flex align-items-center justify-content-between flex-wrap"><label><input className="form-check-input" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/> Remember email</label><button type="button" onClick={() => setMessage('Password reset is not available yet. Please contact support@bblaundrylink.com for help.')}>Forgot Password?</button></div>
          {message && <p ref={messageRef} tabIndex={-1} className="login-message alert alert-warning" role="alert">{message}</p>}
          <button className="btn login-submit" disabled={isLoading} type="submit">{isLoading ? <><span className="spinner-border spinner-border-sm" aria-hidden="true"/> Signing in…</> : <><UiIcon name="login"/> Login</>}</button>
        </form>
        <div className="login-divider"><span>or</span></div>
        <button className="btn login-alternative" onClick={() => setMessage('Google sign-in is not connected yet. Please use your email and password.')}><b className="google-g" aria-hidden="true">G</b> Continue with Google</button>
        <button className="btn login-alternative" onClick={() => setMessage('OTP login is not available yet. Please use your email and password.')}><UiIcon name="phone"/> Continue with OTP</button>
        <p className="login-register">Don’t have an account? <Link to="/register">Register Now ❯</Link></p>
        <p className="login-footnote">Email/password login for existing accounts. For your security, signing in lasts until this page is refreshed.</p>
      </div>
      <p className="login-slogan">Laundry Made Easy...</p>
    </section>
  </main>
}
