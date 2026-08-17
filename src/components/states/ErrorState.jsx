import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ErrorState.scss'

function ErrorState({
  variant = 'default',
  title = 'Something went wrong',
  message,
  onRetry,
  onGoHome,          // ← new optional prop for parent-controlled navigation
  showHome = true,
  errorDetails,
}) {
  const navigate = useNavigate()

  const iconMap = {
    default: 'bx-error-circle',
    network: 'bx-wifi-off',
    session: 'bx-lock-alt',
    notfound: 'bx-search-alt',
  }

  const defaultMessages = {
    default: 'An unexpected error occurred. Please try again.',
    network: 'Unable to reach our servers. Check your internet connection.',
    session: 'Your session has expired. Please sign in again.',
    notfound: 'The page you\'re looking for doesn\'t exist.',
  }

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome()
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className={['error-state', `error-state--${variant}`].join(' ')}>
      <div className="error-state__icon">
        <i className={`bx ${iconMap[variant]}`} />
      </div>

      <h2 className="error-state__title">{title}</h2>
      <p className="error-state__message">
        {message || defaultMessages[variant]}
      </p>

      {errorDetails && (
        <details className="error-state__details">
          <summary>Technical details</summary>
          <pre>{errorDetails}</pre>
        </details>
      )}

      <div className="error-state__actions">
        {variant === 'session' ? (
          <Link to="/login" className="btn-solid">
            <i className="bx bx-log-in" />
            Sign in
          </Link>
        ) : (
          <>
            {onRetry && (
              <button type="button" onClick={onRetry} className="btn-solid">
                <i className="bx bx-refresh" />
                Try again
              </button>
            )}
            {showHome && (
              <button
                type="button"
                onClick={handleGoHome}
                className="btn-ghost"
              >
                Back to dashboard
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ErrorState