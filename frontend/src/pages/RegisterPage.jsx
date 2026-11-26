import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useRegisterMutation } from '../services/api'
import { validateRegistration } from '../features/registration/validation'
import './LoginPage.css'
import './RegisterPage.css'

export default function RegisterPage() {
  const [values, setValues] = useState({ name: '', mobile: '', email: '', password: '', confirm_password: '', accept_terms: false })
  const [shown, setShown] = useState({})
  const [message, setMessage] = useState('')
  const [policy, setPolicy] = useState(null)
  const [register, { isLoading }] = useRegisterMutation()
  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()
  if (user) return <Navigate to="/" replace />

  async function submit(event) {
    event.preventDefault()
    if (isLoading) return
    const error = validateRegistration(values)
    setMessage(error)
    if (error) return
    try {
      await register({ ...values, name: values.name.trim(), email: values.email.trim().toLowerCase() }).unwrap()
      setValues({ name: '', mobile: '', email: '', password: '', confirm_password: '', accept_terms: false })
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (error) {
      setMessage(error.status === 'FETCH_ERROR' || error.status === 'PARSING_ERROR' || Number(error.status) >= 500
        ? 'Unable to create your account right now. Please try again later.'
        : error.data?.message || 'Registration failed. Please check your details.')
    }
  }
  const fields = [
    ['name', 'Full Name', 'Enter your name', 'text', 'name', '♟'],
    ['mobile', 'Mobile Number', 'Enter 10 digit mobile number', 'tel', 'tel-national', '☎'],
    ['email', 'Email Address', 'Enter your email address', 'email', 'email', '✉'],
    ['password', 'Password', 'Create a password (8+ characters)', 'password', 'new-password', '♙'],
    ['confirm_password', 'Confirm Password', 'Re-enter password', 'password', 'new-password', '♙'],
  ]
  return <main className="login-page register-page">
    <section className="login-art register-art" aria-label="BB LaundryLink. Clean clothes, happier you! Serving Bhubaneswar and beyond."><Link className="login-home-link" to="/">← Back to home</Link></section>
    <section className="login-side register-side"><div className="login-panel register-panel">
      <h1>Create Your Account</h1><p className="register-subtitle">Join BB LaundryLink and enjoy smart laundry services</p>
      <div className="register-types"><div className="current"><span aria-hidden="true">♟</span><div><strong>Customer</strong><small>Find & Book Services</small></div></div><button type="button" onClick={() => setMessage('Laundry partner onboarding is not available yet. This form creates a customer account.')}><span aria-hidden="true">▣</span><div><strong>Laundry Partner</strong><small>Register Your Shop</small></div></button></div>
      <form onSubmit={submit} aria-busy={isLoading}>
        <fieldset disabled={isLoading} className="register-fields">
          {fields.map(([name, label, placeholder, type, autoComplete, icon]) => <label className="register-field" key={name}><span className="register-icon" aria-hidden="true">{icon}</span><span className="register-field-content"><span>{label} <em>*</em></span><input name={name} type={type === 'password' && shown[name] ? 'text' : type} autoComplete={autoComplete} placeholder={placeholder} value={values[name]} onChange={e => setValues({ ...values, [name]: e.target.value })} required maxLength={name === 'mobile' ? 10 : name === 'name' ? 100 : name === 'email' ? 150 : undefined} inputMode={name === 'mobile' ? 'numeric' : undefined} pattern={name === 'mobile' ? '[0-9]{10}' : undefined}/></span>{type === 'password' && <button type="button" className="password-toggle" aria-label={`${shown[name] ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={Boolean(shown[name])} onClick={() => setShown({ ...shown, [name]: !shown[name] })}>{shown[name] ? 'Hide' : 'Show'}</button>}</label>)}
          <div className="register-consent"><input id="accept-terms" type="checkbox" checked={values.accept_terms} onChange={e => setValues({ ...values, accept_terms: e.target.checked })} required/><div><label htmlFor="accept-terms">I agree to the </label><button type="button" onClick={() => setPolicy('Terms & Conditions')}>Terms & Conditions</button> and <button type="button" onClick={() => setPolicy('Privacy Notice')}>Privacy Notice</button></div></div>
          {message && <p className="login-message" role="alert">{message}</p>}
          <button className="register-submit" type="submit">{isLoading ? 'Creating account…' : '♟  Register Now →'}</button>
        </fieldset>
      </form>
      <div className="login-divider"><span>Or Register with</span></div><div className="register-alternatives"><button onClick={() => setMessage('Google registration is not connected yet. Please use the form above.')}><b className="google-g">G</b> Continue with Google</button><button onClick={() => setMessage('OTP registration is not available yet. Please use the form above.')}>▯ Continue with OTP</button></div>
      <p className="login-register">Already have an account? <Link to="/login">Login Here ❯</Link></p>
    </div></section>
    {policy && <div className="modal-backdrop" onClick={() => setPolicy(null)}><section className="modal" role="dialog" aria-modal="true" aria-label={policy} onClick={e => e.stopPropagation()}><button autoFocus className="close" aria-label="Close" onClick={() => setPolicy(null)}>×</button><h2>{policy}</h2>{policy === 'Privacy Notice' ? <p>Registration stores your name, email, mobile number, and a hashed password to create your account. Your password is not stored as plain text. Contact support@bblaundrylink.com for account or data requests. Google and OTP sign-up are not connected.</p> : <p>Create an account using accurate details and keep your password private. This version provides customer account access; laundry listings are sample data and live booking is not available. Do not use this service for unlawful activity. Contact support@bblaundrylink.com for account help.</p>}<p className="notice">These are development notices. The service operator should review and publish final legal policies before public launch.</p></section></div>}
  </main>
}
