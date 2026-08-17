import React from 'react'
import { Link } from 'react-router-dom'
import './ProfileActivity.scss'

function ProfileActivity({ stats }) {
  const items = [
    {
      icon: 'bx-calendar-event',
      label: 'Upcoming interviews',
      value: stats.upcomingInterviews,
      to: '/upcoming-interviews',
      color: '#1a3a6b',
    },
    {
      icon: 'bx-check-circle',
      label: 'Completed interviews',
      value: stats.completedInterviews,
      to: '/upcoming-interviews',
      color: '#1d7a47',
    },
    {
      icon: 'bx-award',
      label: 'Published results',
      value: stats.publishedResults,
      to: '/results',
      color: '#e8820c',
    },
    {
      icon: 'bx-file',
      label: 'Documents ready',
      value: `${stats.readyDocs}/${stats.totalDocs}`,
      subtext: `${stats.docProgressPct}% complete`,
      to: '/documents',
      color: '#8a5aad',
    },
  ]

  return (
    <section className="pa-card">
      <header className="pa-card__header">
        <div>
          <div className="pa-card__eyebrow">Activity</div>
          <h2 className="pa-card__title">Portal snapshot</h2>
        </div>
      </header>

      <div className="pa-card__grid">
        {items.map((item) => (
          <Link key={item.label} to={item.to} className="pa-item">
            <div
              className="pa-item__icon"
              style={{ background: `${item.color}15`, color: item.color }}
            >
              <i className={`bx ${item.icon}`} />
            </div>
            <div className="pa-item__body">
              <div className="pa-item__value">{item.value}</div>
              <div className="pa-item__label">{item.label}</div>
              {item.subtext && (
                <div className="pa-item__subtext">{item.subtext}</div>
              )}
            </div>
            <i className="bx bx-right-arrow-alt pa-item__arrow" />
          </Link>
        ))}
      </div>

      {stats.pendingRequests > 0 && (
        <div className="pa-card__pending">
          <div className="pa-card__pending-icon">
            <i className="bx bx-time" />
          </div>
          <div>
            <div className="pa-card__pending-title">
              {stats.pendingRequests} pending interview request{stats.pendingRequests !== 1 ? 's' : ''}
            </div>
            <div className="pa-card__pending-text">
              Awaiting scheduling from our team.
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProfileActivity