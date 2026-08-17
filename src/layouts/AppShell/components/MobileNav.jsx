import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { dataService } from '../../../services/dataService'
import { NAV_ITEMS } from '../navConfig'
import './MobileNav.scss'

function MobileNav() {
  const { currentUser } = useAuth()
  const unreadCount = currentUser
    ? dataService.getUnreadCount(currentUser.id)
    : 0

  // Show 5 most important on mobile
  const items = NAV_ITEMS.mobile.map((item) => ({
    ...item,
    badge: item.to === '/notifications' && unreadCount > 0 ? unreadCount : null,
  }))

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <ul className="mobile-nav__list">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                [
                  'mobile-nav__link',
                  isActive && 'mobile-nav__link--active',
                ].filter(Boolean).join(' ')
              }
            >
              <div className="mobile-nav__icon-wrap">
                <i className={`bx ${item.icon}`} />
                {item.badge && (
                  <span className="mobile-nav__badge">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="mobile-nav__label">{item.mobileLabel || item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MobileNav