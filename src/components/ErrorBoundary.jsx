import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ErrorState from './states/ErrorState'

/**
 * Inner class-based ErrorBoundary.
 * Receives `location` as a prop so it can reset when the URL changes.
 */
class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info)
  }

  componentDidUpdate(prevProps) {
    // Auto-reset when the user navigates to a different route
    if (
      this.state.hasError &&
      prevProps.location?.pathname !== this.props.location?.pathname
    ) {
      this.setState({ hasError: false, error: null })
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    // Reset first, then navigate — order matters
    this.setState({ hasError: false, error: null }, () => {
      if (this.props.navigate) {
        this.props.navigate('/dashboard', { replace: true })
      }
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem 1.5rem',
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ErrorState
            variant="default"
            title="Something unexpected happened"
            message="We've encountered a problem. You can try again, or return to the dashboard."
            onRetry={this.handleReset}
            onGoHome={this.handleGoHome}
            errorDetails={
              this.state.error?.message
                ? `${this.state.error.name}: ${this.state.error.message}`
                : null
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Outer wrapper that provides `location` and `navigate` to the inner class.
 * Router hooks can only be used in functional components.
 */
function ErrorBoundary({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <ErrorBoundaryInner location={location} navigate={navigate}>
      {children}
    </ErrorBoundaryInner>
  )
}

export default ErrorBoundary