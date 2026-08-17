import React from 'react'
import { Link } from 'react-router-dom'
import './RecommendedActions.scss'

function RecommendedActions({ user, nextInterview, docProgress, unreadCount }) {
  const actions = []

  if (!nextInterview) {
    actions.push({
      icon: 'bx-calendar-plus',
      title: 'Book your next interview',
      desc: 'You have no scheduled interviews. Request one to continue.',
      to: '/register-interview',
      cta: 'Book interview',
      priority: 'high',
    })
  }

  if (docProgress < 100) {
    actions.push({
      icon: 'bx-file',
      title: `Complete your document checklist (${docProgress}%)`,
      desc: 'Prepare all required documents before your interviews.',
      to: '/documents',
      cta: 'Update checklist',
      priority: 'medium',
    })
  }

  if (unreadCount > 0) {
    actions.push({
      icon: 'bx-bell',
      title: `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`,
      desc: 'Review recent updates about your interviews and results.',
      to: '/notifications',
      cta: 'View notifications',
      priority: 'low',
    })
  }

  actions.push({
    icon: 'bx-news',
    title: 'Read latest study updates',
    desc: 'Stay informed about visa, IND and Netherlands study news.',
    to: '/visa-updates',
    cta: 'Browse updates',
    priority: 'low',
  })

  const visible = actions.slice(0, 3)

  return (
    <div className="d-card actions-card">
      <div className="d-card__head">
        <div>
          <div className="d-card__eyebrow">Recommended</div>
          <h3 className="d-card__title">Next actions</h3>
        </div>
      </div>

      <ul className="actions-list">
        {visible.map((action, i) => (
          <li
            key={i}
            className={[
              'action-item',
              `action-item--${action.priority}`,
            ].join(' ')}
          >
            <div className="action-item__number">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="action-item__icon">
              <i className={`bx ${action.icon}`} />
            </div>
            <div className="action-item__body">
              <div className="action-item__title">{action.title}</div>
              <div className="action-item__desc">{action.desc}</div>
            </div>
            <Link to={action.to} className="action-item__cta">
              <span>{action.cta}</span>
              <i className="bx bx-right-arrow-alt" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecommendedActions