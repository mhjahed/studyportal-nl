import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { NAV_ITEMS } from '../navConfig'
import ConfirmModal from '../../../pages/Notifications/components/ConfirmModal'
import './AppSidebar.scss'

function AppSidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [confirmLogout, setConfirmLogout] = useState(false)

const doLogout = () => {
  console.log('[DEBUG] doLogout called')
  setConfirmLogout(false)
  console.log('[DEBUG] modal closed, about to logout')
  logout()
  console.log('[DEBUG] logout() ran, navigating')
  navigate('/login', { replace: true })
  console.log('[DEBUG] navigate() called')
}
  return (
    <aside
      className={['sidebar', isOpen && 'sidebar--open'].filter(Boolean).join(' ')}
      aria-label="Portal navigation"
    >
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-flag">
          <span /><span /><span />
        </div>
        <div className="sidebar__brand-text">
          <div className="sidebar__brand-name">Bachelors Portal</div>
          <div className="sidebar__brand-sub">Netherlands</div>
        </div>

        <button
          type="button"
          className="sidebar__close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <i className="bx bx-x" />
        </button>
      </div>

      {/* User card */}
      <div className="sidebar__user">
        <img
          src={currentUser?.profileImage}
          alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
          className="sidebar__user-avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${currentUser?.firstName}+${currentUser?.lastName}&background=1a3a6b&color=fff&size=100`
          }}
        />
        <div className="sidebar__user-info">
          <div className="sidebar__user-name">
            {currentUser?.firstName} {currentUser?.lastName}
          </div>
          <div className="sidebar__user-iso">
            <i className="bx bx-id-card" />
            {currentUser?.isoCode}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav" aria-label="Main navigation">
        <div className="sidebar__nav-label">Portal</div>
        <ul className="sidebar__nav-list">
          {NAV_ITEMS.primary.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  ['sidebar__nav-link', isActive && 'sidebar__nav-link--active']
                    .filter(Boolean).join(' ')
                }
              >
                <i className={`bx ${item.icon}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="sidebar__nav-badge">{item.badge}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar__nav-label sidebar__nav-label--secondary">
          Preparation
        </div>
        <ul className="sidebar__nav-list">
          {NAV_ITEMS.secondary.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  ['sidebar__nav-link', isActive && 'sidebar__nav-link--active']
                    .filter(Boolean).join(' ')
                }
              >
                <i className={`bx ${item.icon}`} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar__nav-label sidebar__nav-label--secondary">
          Account
        </div>
        <ul className="sidebar__nav-list">
          {NAV_ITEMS.account.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  ['sidebar__nav-link', isActive && 'sidebar__nav-link--active']
                    .filter(Boolean).join(' ')
                }
              >
                <i className={`bx ${item.icon}`} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__logout"
          onClick={() => setConfirmLogout(true)}
        >
          <i className="bx bx-log-out" />
          <span>Sign out</span>
        </button>

        <div className="sidebar__version">
          <span>Portal v1.0</span>
          <span className="sidebar__version-dot">·</span>
          <span>Prototype</span>
        </div>
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
    </aside>
  )
}

export default AppSidebar