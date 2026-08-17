import React from 'react'
import { Link } from 'react-router-dom'
import './NotificationsEmpty.scss'

const MESSAGES = {
  none: {
    icon: 'bx-bell-off',
    title: 'No notifications yet',
    text: 'When your interviews are scheduled, results are published, or documents need attention — you\'ll find those updates here.',
    ctaLabel: 'Book your first interview',
    ctaTo: '/register-interview',
  },
  all: {
    icon: 'bx-inbox',
    title: 'Nothing to show',
    text: 'There are no notifications in this view.',
    ctaLabel: null,
  },
  unread: {
    icon: 'bx-check-double',
    title: 'You\'re all caught up',
    text: 'You have read every notification. Come back when there\'s something new.',
    ctaLabel: null,
  },
  interview: {
    icon: 'bx-calendar-x',
    title: 'No interview notifications',
    text: 'You have no notifications about interviews at the moment.',
    ctaLabel: null,
  },
  result: {
    icon: 'bx-award',
    title: 'No result notifications',
    text: 'You have no notifications about results at the moment.',
    ctaLabel: null,
  },
  document: {
    icon: 'bx-file',
    title: 'No document reminders',
    text: 'You have no document reminders at the moment.',
    ctaLabel: null,
  },
  update: {
    icon: 'bx-news',
    title: 'No study updates',
    text: 'No study update notifications yet — check the Study updates page for the latest articles.',
    ctaLabel: 'Browse study updates',
    ctaTo: '/visa-updates',
  },
}

function NotificationsEmpty({ filter }) {
  const msg = MESSAGES[filter] || MESSAGES.all

  return (
    <div className="notif-empty">
      <div className="notif-empty__icon">
        <i className={`bx ${msg.icon}`} />
      </div>
      <h3 className="notif-empty__title">{msg.title}</h3>
      <p className="notif-empty__text">{msg.text}</p>
      {msg.ctaLabel && (
        <Link to={msg.ctaTo} className="btn-solid">
          {msg.ctaLabel}
          <i className="bx bx-right-arrow-alt" />
        </Link>
      )}
    </div>
  )
}

export default NotificationsEmpty