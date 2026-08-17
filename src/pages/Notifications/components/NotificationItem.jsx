import React from 'react'
import './NotificationItem.scss'

const CATEGORY_META = {
  interview: {
    icon: 'bx-calendar-event',
    color: '#1a3a6b',
    bg: 'rgba(26, 58, 107, 0.08)',
    label: 'Interview',
  },
  result: {
    icon: 'bx-award',
    color: '#1d7a47',
    bg: 'rgba(29, 122, 71, 0.08)',
    label: 'Result',
  },
  document: {
    icon: 'bx-file',
    color: '#e8820c',
    bg: 'rgba(232, 130, 12, 0.08)',
    label: 'Document',
  },
  update: {
    icon: 'bx-news',
    color: '#8a5aad',
    bg: 'rgba(138, 90, 173, 0.08)',
    label: 'Update',
  },
}

function timeOf(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  })
}

function timeAgo(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function NotificationItem({ notification, onOpen, onMarkRead }) {
  const meta = CATEGORY_META[notification.category] || CATEGORY_META.update

  const handleMarkRead = (e) => {
    e.stopPropagation()
    onMarkRead()
  }

  return (
    <article
      className={[
        'notif-item',
        !notification.isRead && 'notif-item--unread',
      ].filter(Boolean).join(' ')}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      {/* Icon (left) */}
      <div
        className="notif-item__icon"
        style={{ background: meta.bg, color: meta.color }}
      >
        <i className={`bx ${meta.icon}`} />
      </div>

      {/* Body (centre) */}
      <div className="notif-item__body">
        <div className="notif-item__head">
          <span className="notif-item__category" style={{ color: meta.color }}>
            {meta.label}
          </span>
          <span className="notif-item__time">
            {timeOf(notification.createdAt)}
            <span className="notif-item__time-sep">·</span>
            {timeAgo(notification.createdAt)}
          </span>
          {!notification.isRead && (
            <span className="notif-item__unread-pill">
              <span className="notif-item__unread-pill-dot" />
              Unread
            </span>
          )}
        </div>

        <h3 className="notif-item__title">{notification.title}</h3>
        <p className="notif-item__message">{notification.message}</p>

        {notification.actionLabel && (
          <div className="notif-item__action-hint">
            <i className="bx bx-right-arrow-alt" />
            {notification.actionLabel}
          </div>
        )}
      </div>

      {/* Actions (right) */}
      {!notification.isRead && (
        <div className="notif-item__actions">
          <button
            type="button"
            className="notif-item__mark-btn"
            onClick={handleMarkRead}
            title="Mark as read"
            aria-label="Mark as read"
          >
            <i className="bx bx-check" />
          </button>
        </div>
      )}
    </article>
  )
}

export default NotificationItem