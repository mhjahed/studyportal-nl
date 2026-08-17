import React from 'react'
import './NotificationsToolbar.scss'

function NotificationsToolbar({
  filters,
  activeFilter,
  counts,
  onFilterChange,
  unreadCount,
  onMarkAllRead,
  visibleCount,
}) {
  return (
    <div className="notif-toolbar">
      <div className="notif-toolbar__left">
        <div className="notif-toolbar__label">Filter</div>
        <div className="notif-toolbar__filters">
          {filters.map((f) => {
            const count = counts[f.id] || 0
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFilterChange(f.id)}
                className={[
                  'notif-toolbar__filter',
                  activeFilter === f.id && 'notif-toolbar__filter--active',
                  f.id === 'unread' && count > 0 && 'notif-toolbar__filter--pulse',
                ].filter(Boolean).join(' ')}
              >
                <span>{f.label}</span>
                {count > 0 && (
                  <span className="notif-toolbar__count">{count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="notif-toolbar__right">
        <div className="notif-toolbar__count-text">
          {visibleCount} shown
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            className="notif-toolbar__mark-all"
            onClick={onMarkAllRead}
          >
            <i className="bx bx-check-double" />
            Mark all read
          </button>
        )}
      </div>
    </div>
  )
}

export default NotificationsToolbar