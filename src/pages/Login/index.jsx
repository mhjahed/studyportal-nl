import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { dataService } from '../../services/dataService'
import WelcomeOverlay from './components/WelcomeOverlay'
import './Login.scss'

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [welcomeUser, setWelcomeUser] = useState(null)
  const isSubmittingRef = useRef(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (generalError) setGeneralError('')
  }
// Session expiry notice
const [sessionNotice, setSessionNotice] = useState(
  location.state?.reason === 'session_expired'
)

useEffect(() => {
  if (sessionNotice) {
    // Clear the state so it doesn't reappear on refresh
    window.history.replaceState({}, document.title)
  }
}, [sessionNotice])

  const validate = () => {
    const errs = {}
    if (!formData.username.trim()) errs.username = 'Username is required.'
    if (!formData.password) errs.password = 'Password is required.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setIsSubmitting(true)
    setGeneralError('')

    // Simulate brief network delay
    await new Promise((r) => setTimeout(r, 500))

    const user = dataService.findUserByCredentials(
      formData.username.trim(),
      formData.password
    )

    if (!user) {
      // Check if account exists but is not active
      const existingUser = dataService.findUserByUsername(formData.username.trim())
      if (existingUser && existingUser.accountStatus !== 'active') {
        setGeneralError(
          'Your account is not yet active. Please wait for approval or contact support.'
        )
      } else {
        setGeneralError(
          'The username or password you entered is incorrect. Please try again.'
        )
      }
      setIsSubmitting(false)
      isSubmittingRef.current = false
      return
    }

    // Show welcome overlay
    setWelcomeUser(user)

    // After the welcome animation, complete login
    setTimeout(() => {
      login(user)
      navigate(from, { replace: true })
    }, 2600)
  }



  return (
    <>
      {welcomeUser && <WelcomeOverlay user={welcomeUser} />}

      <div className="login">
        {/* ─── Editorial Photo Column ─────────────────────────────── */}
        <aside className="login__editorial">
          <div className="login__editorial-image">
            <img
              src="https://images.unsplash.com/photo-1584285405429-136bf988919c?w=1200&h=1800&fit=crop&q=80"
              alt="Bicycles on a bridge in Utrecht, Netherlands"
            />
          </div>

          <div className="login__editorial-overlay">
            {/* Top: brand */}
            <header className="login__brand-row">
              <Link to="/register" className="login__brand-link">
                <div className="login__brand">
                  <div className="login__brand-flag">
                    <span /><span /><span />
                  </div>
                  <div className="login__brand-text">
                    <div className="login__brand-name">Bachelors Portal</div>
                    <div className="login__brand-sub">Netherlands</div>
                  </div>
                </div>
              </Link>
              <div className="login__brand-year">EST · 2024</div>
            </header>

            {/* Middle: editorial */}
            <div className="login__editorial-content">
              <div className="login__kicker">
                <span className="login__kicker-dot" />
                Student portal
              </div>

              <h1 className="login__display">
                Welcome back<br />
                <em>to your journey.</em>
              </h1>

              <p className="login__lede">
                Sign in to view your upcoming interviews, track your document
                preparation and continue toward your Dutch Bachelor's degree.
              </p>
            </div>

            {/* Bottom: pull-quote */}
            <footer className="login__editorial-footer">
              <blockquote className="login__quote">
                <div className="login__quote-mark">"</div>
                <p>
                  The Netherlands hosts more than 122,000 international students
                  each year — the highest proportion in continental Europe.
                </p>
                <cite>
                  <strong>Nuffic</strong> · Dutch Organisation for
                  Internationalisation in Education
                </cite>
              </blockquote>
            </footer>
          </div>
        </aside>

        {/* ─── Form Column ────────────────────────────────────────── */}
        <main className="login__form-col">
          {/* Mobile compact brand */}
          <div className="login__mobile-header">
            <Link to="/register" className="login__brand-link">
              <div className="login__brand">
                <div className="login__brand-flag">
                  <span /><span /><span />
                </div>
                <div className="login__brand-text">
                  <div className="login__brand-name">Bachelors Portal Netherlands</div>
                  <div className="login__brand-sub">Student sign in</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="login__form-inner">
            <div className="login__section-head">
              <div className="login__section-eyebrow">Portal access</div>
              <h2 className="login__section-title">Sign in</h2>
              <p className="login__section-desc">
                Enter the credentials that were sent to you after your registration
                was approved.
              </p>
            </div>
            {sessionNotice && (
              <div className="notice notice--warning login__session-notice">
                <i className="bx bx-time" />
                <div>
                  <strong>Your session has expired.</strong>
                  <span>Please sign in again to continue where you left off.</span>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate className="login__form">
              {/* Username */}
              <div className="field">
                <label className="field__label" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. john doe"
                  autoComplete="username"
                  disabled={isSubmitting}
                  className={[
                    'field__input',
                    errors.username ? 'field__input--error' : '',
                  ].filter(Boolean).join(' ')}
                />
                {errors.username && (
                  <div className="field__error">{errors.username}</div>
                )}
              </div>

              {/* Password */}
              <div className="field">
                <label className="field__label field__label--row" htmlFor="password">
                  <span>Password</span>
                  <button
                    type="button"
                    className="field__toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    disabled={isSubmitting}
                    tabIndex={-1}
                  >
                    <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`} />
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className={[
                    'field__input',
                    errors.password ? 'field__input--error' : '',
                  ].filter(Boolean).join(' ')}
                />
                {errors.password && (
                  <div className="field__error">{errors.password}</div>
                )}
              </div>

              {/* Options */}
              <div className="login__options">
                <label className="login__checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isSubmitting}
                  />
                  <span className="login__checkbox-mark">
                    {rememberMe && <i className="bx bx-check" />}
                  </span>
                  <span>Keep me signed in</span>
                </label>

                <a href="mailto:infogicuofficial@gmail.com" className="login__forgot">
                  Need help?
                </a>
              </div>

              {/* Error */}
              {generalError && (
                <div className="notice notice--danger login__general-error">
                  <i className="bx bx-error-circle" />
                  <div>
                    <strong>{generalError}</strong>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn-solid btn-solid--full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="bpn-spinner bpn-spinner--white bpn-spinner--sm" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in to portal
                    <i className="bx bx-right-arrow-alt" />
                  </>
                )}
              </button>
            </form>

            

            {/* Footer */}
            <div className="login__existing">
              <span>Not yet registered?</span>
              <Link to="/register">Submit a registration request →</Link>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Login