import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './NotFound.scss'

function NotFound() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="notfound">
      <div className="notfound__container">
        <div className="notfound__number">
          <span>4</span>
          <div className="notfound__flag">
            <span /><span /><span />
          </div>
          <span>4</span>
        </div>

        <div className="notfound__eyebrow">
          <span className="notfound__dot" />
          Page not found
        </div>

        <h1 className="notfound__title">
          This page took<br />
          <em>an unexpected turn.</em>
        </h1>

        <p className="notfound__message">
          The page you were looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="notfound__actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-solid">
              <i className="bx bx-home-alt" />
              Back to dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn-solid">
              <i className="bx bx-log-in" />
              Go to sign in
            </Link>
          )}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-ghost"
          >
            <i className="bx bx-arrow-back" />
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound