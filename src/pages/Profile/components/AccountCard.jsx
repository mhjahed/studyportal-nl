import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import './AccountCard.scss'

const STATUS_META = {
  active: { label: 'Active', icon: 'bx-check-circle', color: '#1d7a47', bg: 'rgba(29, 122, 71, 0.1)' },
  pending: { label: 'Pending', icon: 'bx-time', color: '#e8820c', bg: 'rgba(232, 130, 12, 0.1)' },
  suspended: { label: 'Suspended', icon: 'bx-error-circle', color: '#ae1c28', bg: 'rgba(174, 28, 40, 0.1)' },
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function AccountCard({ user }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const status = STATUS_META[user.accountStatus] || STATUS_META.active

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <section className="acc-card">
      <header className="acc-card__header">
        <div>
          <div className="acc-card__eyebrow">Account</div>
          <h2 className="acc-card__title">Access & security</h2>
        </div>
      </header>

      {/* Status pill */}
      <div className="acc-status" style={{ background: status.bg, color: status.color }}>
        <i className={`bx ${status.icon}`} />
        <div>
          <div className="acc-status__label">Account status</div>
          <div className="acc-status__value">{status.label}</div>
        </div>
      </div>

      {/* Username + dates */}
      <dl className="acc-card__meta">
        <div className="acc-card__meta-row">
          <dt>Username</dt>
          <dd className="acc-card__meta-mono">{user.username}</dd>
        </div>
        <div className="acc-card__meta-row">
          <dt>Member since</dt>
          <dd>{formatDate(user.createdAt)}</dd>
        </div>
        {user.updatedAt && user.updatedAt !== user.createdAt && (
          <div className="acc-card__meta-row">
            <dt>Last updated</dt>
            <dd>{formatDate(user.updatedAt)}</dd>
          </div>
        )}
      </dl>

      {/* Actions */}
      <div className="acc-card__actions">
        <Link to="/settings" className="acc-card__action">
          <div className="acc-card__action-icon">
            <i className="bx bx-cog" />
          </div>
          <div className="acc-card__action-body">
            <div className="acc-card__action-title">Settings</div>
            <div className="acc-card__action-desc">Notifications, timezone, preferences</div>
          </div>
          <i className="bx bx-right-arrow-alt acc-card__action-arrow" />
        </Link>

        <button
          type="button"
          className="acc-card__action acc-card__action--danger"
          onClick={handleSignOut}
        >
          <div className="acc-card__action-icon acc-card__action-icon--danger">
            <i className="bx bx-log-out" />
          </div>
          <div className="acc-card__action-body">
            <div className="acc-card__action-title">Sign out</div>
            <div className="acc-card__action-desc">End your session on this device</div>
          </div>
          <i className="bx bx-right-arrow-alt acc-card__action-arrow" />
        </button>
      </div>
    </section>
  )
}

export default AccountCard