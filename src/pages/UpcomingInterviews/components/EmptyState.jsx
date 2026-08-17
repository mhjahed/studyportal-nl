import React from 'react'
import { Link } from 'react-router-dom'
import './EmptyState.scss'

const MESSAGES = {
  all: {
    icon: 'bx-calendar-x',
    title: 'No interviews scheduled yet',
    text: 'Once your interview request is approved, your practice sessions will appear here.',
    cta: { label: 'Book your first interview', to: '/register-interview' },
  },
  upcoming: {
    icon: 'bx-calendar-event',
    title: 'No upcoming interviews',
    text: 'You have no scheduled practice interviews at the moment. Book one when ready.',
    cta: { label: 'Book an interview', to: '/register-interview' },
  },
  today: {
    icon: 'bx-calendar',
    title: 'No interviews today',
    text: 'You have no interviews scheduled for today.',
    cta: null,
  },
  completed: {
    icon: 'bx-check-circle',
    title: 'No completed interviews yet',
    text: 'Your completed interviews will appear here after each practice session.',
    cta: null,
  },
  cancelled: {
    icon: 'bx-x-circle',
    title: 'No cancelled interviews',
    text: 'You have no cancelled interviews.',
    cta: null,
  },
}

function EmptyState({ filter }) {
  const msg = MESSAGES[filter] || MESSAGES.all

  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <i className={`bx ${msg.icon}`} />
      </div>
      <h3 className="empty-state__title">{msg.title}</h3>
      <p className="empty-state__text">{msg.text}</p>
      {msg.cta && (
        <Link to={msg.cta.to} className="btn-solid">
          {msg.cta.label}
          <i className="bx bx-right-arrow-alt" />
        </Link>
      )}
    </div>
  )
}

export default EmptyState