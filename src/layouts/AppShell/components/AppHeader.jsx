import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { dataService } from '../../../services/dataService'
import DigitalClock from './DigitalClock'
import PortalDropdown from '../../../components/PortalDropdown'
import ConfirmModal from '../../../pages/Notifications/components/ConfirmModal'
import './AppHeader.scss'

function AppHeader({ onMenuClick }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notifMenuOpen, setNotifMenuOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const profileBtnRef = useRef(null)
  const notifBtnRef = useRef(null)

  const notifications = currentUser
    ? dataService.getNotificationsByUserId(currentUser.id)
    : []
  const unreadCount = currentUser
    ? dataService.getUnreadCount(currentUser.id)
    : 0

  const requestLogout = () => {
    setProfileMenuOpen(false)
    setConfirmLogout(true)
  }

const doLogout = () => {
  setConfirmLogout(false)         // ← close modal FIRST
  setTimeout(() => {
    logout()
    navigate('/login', { replace: true })
  }, 50)
}
  const formatNotifTime = (dateStr) => {
    const now = new Date()
    const then = new Date(dateStr)
    const diffMs = now - then
    const diffMin = Math.floor(diffMs / 60000)
    const diffHr = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)

    if (diffMin < 1) return 'just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    if (diffDay < 7) return `${diffDay}d ago`
    return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const toggleNotif = () => {
    setNotifMenuOpen((s) => !s)
    setProfileMenuOpen(false)
  }

  const toggleProfile = () => {
    setProfileMenuOpen((s) => !s)
    setNotifMenuOpen(false)
  }

  return (
    <header className="app-header">
      <button
        type="button"
        className="app-header__menu-btn"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <i className="bx bx-menu" />
      </button>

      <div className="app-header__mobile-brand">
        <div className="app-header__mobile-flag">
          <span /><span /><span />
        </div>
        <div className="app-header__mobile-name">Bachelors Portal</div>
      </div>

      <div className="app-header__clock-wrap">
        <DigitalClock />
      </div>

      <div className="app-header__right">
        <button
          ref={notifBtnRef}
          type="button"
          className="app-header__icon-btn"
          onClick={toggleNotif}
          aria-label={`Notifications (${unreadCount} unread)`}
          aria-expanded={notifMenuOpen}
        >
          <i className="bx bx-bell" />
          {unreadCount > 0 && (
            <span className="app-header__notif-badge">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <PortalDropdown
          anchorRef={notifBtnRef}
          isOpen={notifMenuOpen}
          onClose={() => setNotifMenuOpen(false)}
          width={380}
          align="right"
        >
          <div className="dropdown-panel">
            <div className="dropdown-panel__header">
              <div>
                <div className="dropdown-panel__eyebrow">Notifications</div>
                <div className="dropdown-panel__title">Recent activity</div>
              </div>
              {unreadCount > 0 && (
                <span className="dropdown-panel__count">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="dropdown-panel__body">
              {notifications.length === 0 ? (
                <div className="dropdown-panel__empty">
                  <i className="bx bx-bell-off" />
                  <span>You are all caught up.</span>
                </div>
              ) : (
                <ul className="dropdown-panel__list">
                  {notifications.slice(0, 5).map((n) => (
                    <li
                      key={n.id}
                      className={[
                        'dropdown-panel__item',
                        !n.isRead && 'dropdown-panel__item--unread',
                      ].filter(Boolean).join(' ')}
                    >
                      <div className="dropdown-panel__item-marker" />
                      <div className="dropdown-panel__item-body">
                        <div className="dropdown-panel__item-title">{n.title}</div>
                        <div className="dropdown-panel__item-text">{n.message}</div>
                        <div className="dropdown-panel__item-time">
                          {formatNotifTime(n.createdAt)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="dropdown-panel__footer">
              <Link to="/notifications" onClick={() => setNotifMenuOpen(false)}>
                View all notifications
                <i className="bx bx-right-arrow-alt" />
              </Link>
            </div>
          </div>
        </PortalDropdown>

        <button
          ref={profileBtnRef}
          type="button"
          className="app-header__profile-btn"
          onClick={toggleProfile}
          aria-label="Profile menu"
          aria-expanded={profileMenuOpen}
        >
          <img
            src={currentUser?.profileImage}
            alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
            className="app-header__profile-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${currentUser?.firstName}+${currentUser?.lastName}&background=1a3a6b&color=fff&size=60`
            }}
          />
          <div className="app-header__profile-info">
            <div className="app-header__profile-name">
              {currentUser?.firstName}
            </div>
            <div className="app-header__profile-role">Student</div>
          </div>
          <i
            className={`bx bx-chevron-down app-header__profile-chevron ${
              profileMenuOpen ? 'app-header__profile-chevron--open' : ''
            }`}
          />
        </button>

        <PortalDropdown
          anchorRef={profileBtnRef}
          isOpen={profileMenuOpen}
          onClose={() => setProfileMenuOpen(false)}
          width={300}
          align="right"
        >
          <div className="dropdown-panel">
            <div className="dropdown-panel__profile-head">
              <img
                src={currentUser?.profileImage}
                alt=""
                className="dropdown-panel__profile-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${currentUser?.firstName}+${currentUser?.lastName}&background=1a3a6b&color=fff&size=100`
                }}
              />
              <div>
                <div className="dropdown-panel__profile-name">
                  {currentUser?.firstName} {currentUser?.lastName}
                </div>
                <div className="dropdown-panel__profile-iso">
                  {currentUser?.isoCode}
                </div>
              </div>
            </div>

            <div className="dropdown-panel__profile-meta">
              <div className="dropdown-panel__profile-meta-item">
                <span>University</span>
                <strong>{currentUser?.university}</strong>
              </div>
              <div className="dropdown-panel__profile-meta-item">
                <span>Course</span>
                <strong>{currentUser?.course}</strong>
              </div>
            </div>

            <div className="dropdown-panel__profile-actions">
              <Link
                to="/profile"
                className="dropdown-panel__profile-link"
                onClick={() => setProfileMenuOpen(false)}
              >
                <i className="bx bx-user" />
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                className="dropdown-panel__profile-link"
                onClick={() => setProfileMenuOpen(false)}
              >
                <i className="bx bx-cog" />
                <span>Settings</span>
              </Link>
            </div>

            <div className="dropdown-panel__profile-footer">
              <button
                type="button"
                onClick={requestLogout}
                className="dropdown-panel__profile-logout"
              >
                <i className="bx bx-log-out" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </PortalDropdown>
      </div>

      {confirmLogout && (
        <ConfirmModal
          title="Sign out of the portal?"
          message="You will need to sign in again to access your dashboard, interviews and documents."
          confirmLabel="Sign out"
          cancelLabel="Stay signed in"
          variant="warning"
          icon="bx-log-out"
          onConfirm={doLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
    </header>
  )
}

export default AppHeader