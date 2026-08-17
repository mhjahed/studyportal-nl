import React from 'react'
import { Link } from 'react-router-dom'
import './RecentNotifications.scss'

function timeAgo(dateStr) {
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

const ICON_MAP = {
  interview: 'bx-calendar-event',
  result: 'bx-award',
  document: 'bx-file',
  update: 'bx-news',
}

function RecentNotifications({ notifications }) {
  return (
    <div className="d-card notif-card">
      <div className="d-card__head">
        <div>
          <div className="d-card__eyebrow">Recent</div>
          <h3 className="d-card__title">Notifications</h3>
        </div>
        <Link to="/notifications" className="d-card__link">
          View all
          <i className="bx bx-right-arrow-alt" />
        </Link>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-inline">
          <i className="bx bx-bell-off" />
          <p>You are all caught up.</p>
        </div>
      ) : (
        <ul className="notif-list">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={[
                'notif-list__item',
                !n.isRead && 'notif-list__item--unread',
              ].filter(Boolean).join(' ')}
            >
              <div className="notif-list__icon">
                <i className={`bx ${ICON_MAP[n.category] || 'bx-bell'}`} />
              </div>
              <div className="notif-list__body">
                <div className="notif-list__title">{n.title}</div>
                <div className="notif-list__time">{timeAgo(n.createdAt)}</div>
              </div>
              {!n.isRead && <div className="notif-list__dot" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RecentNotifications