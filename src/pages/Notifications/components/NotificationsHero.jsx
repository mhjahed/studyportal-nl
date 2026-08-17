import React from 'react'
import './NotificationsHero.scss'

function NotificationsHero({ totalNotifications, unreadCount, onMarkAllRead }) {
  const readCount = totalNotifications - unreadCount

  return (
    <section className="nh">
      <div className="nh__image">
        <img
          src="https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=1600&h=400&fit=crop&q=80"
          alt="Correspondence and mailbox"
        />
        <div className="nh__overlay" />
      </div>

      <div className="nh__content">
        <div className="nh__left">
          <div className="nh__eyebrow">
            <span className="nh__eyebrow-dot" />
            Notification centre
          </div>
          <h1 className="nh__title">
            Your <em>portal activity</em>
          </h1>
          <p className="nh__lede">
            Every scheduled interview, published result, document reminder and
            study update in one place. Read them in your own time.
          </p>
        </div>

        <div className="nh__right">
          {unreadCount > 0 ? (
            <>
              <div className="nh__unread">
                <div className="nh__unread-num">{unreadCount}</div>
                <div className="nh__unread-label">
                  Unread<br />notification{unreadCount !== 1 ? 's' : ''}
                </div>
              </div>
              <button
                type="button"
                className="nh__cta"
                onClick={onMarkAllRead}
              >
                <i className="bx bx-check-double" />
                Mark all as read
              </button>
            </>
          ) : totalNotifications > 0 ? (
            <div className="nh__caught-up">
              <div className="nh__caught-up-icon">
                <i className="bx bx-check-circle" />
              </div>
              <div>
                <div className="nh__caught-up-title">You're all caught up</div>
                <div className="nh__caught-up-text">
                  {readCount} notification{readCount !== 1 ? 's' : ''} · all read
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default NotificationsHero