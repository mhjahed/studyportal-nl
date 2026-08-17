import React from 'react'
import './InterviewCard.scss'

const TYPE_META = {
  university: {
    label: 'University Admission',
    icon: 'bx-book-open',
    color: '#1a3a6b',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=400&fit=crop&q=80',
  },
  ind: {
    label: 'IND Interview',
    icon: 'bx-shield-quarter',
    color: '#0f2444',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=400&fit=crop&q=80',
  },
  embassy: {
    label: 'Embassy Interview',
    icon: 'bx-buildings',
    color: '#1d7a47',
    image: 'https://images.unsplash.com/photo-1590845947676-fa2ae72f95d0?w=400&h=400&fit=crop&q=80',
  },
}

const STATUS_META = {
  upcoming: { label: 'Upcoming', color: '#1a3a6b', bg: 'rgba(26, 58, 107, 0.08)' },
  today: { label: 'Today', color: '#e8820c', bg: 'rgba(232, 130, 12, 0.1)' },
  completed: { label: 'Completed', color: '#1d7a47', bg: 'rgba(29, 122, 71, 0.1)' },
  cancelled: { label: 'Cancelled', color: '#ae1c28', bg: 'rgba(174, 28, 40, 0.08)' },
  rescheduled: { label: 'Rescheduled', color: '#b06b00', bg: 'rgba(176, 107, 0, 0.1)' },
}

function formatTimeLocal(date, time) {
  const dt = new Date(`${date}T${time}:00`)
  return dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function InterviewCard({ interview, isNext, index }) {
  const type = TYPE_META[interview.type] || TYPE_META.university
  const statusMeta = STATUS_META[interview.computedStatus] || STATUS_META.upcoming

  const dt = new Date(`${interview.date}T${interview.time}:00`)
  const day = dt.getDate()
  const month = dt.toLocaleDateString('en-GB', { month: 'short' })
  const weekday = dt.toLocaleDateString('en-GB', { weekday: 'long' })
  const fullDate = dt.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const canJoin =
    interview.meetLink &&
    ['upcoming', 'today'].includes(interview.computedStatus)

  return (
    <article
      className={[
        'iv-card',
        isNext && 'iv-card--next',
        `iv-card--${interview.computedStatus}`,
      ].filter(Boolean).join(' ')}
    >
      {/* Number + Date block (left) */}
      <div
        className="iv-card__date"
        style={{ background: type.color }}
      >
        {isNext && (
          <div className="iv-card__next-badge">
            <span className="iv-card__next-dot" />
            Next up
          </div>
        )}
        <div className="iv-card__date-month">{month}</div>
        <div className="iv-card__date-day">{day}</div>
        <div className="iv-card__date-weekday">{weekday}</div>
      </div>

      {/* Body */}
      <div className="iv-card__body">
        <div className="iv-card__header">
          <div>
            <div className="iv-card__type-row">
              <div className="iv-card__type">
                <i className={`bx ${type.icon}`} />
                {type.label}
              </div>
              <div
                className="iv-card__status"
                style={{ color: statusMeta.color, background: statusMeta.bg }}
              >
                {statusMeta.label}
              </div>
            </div>
            <h3 className="iv-card__title">
              Practice interview no. <span>{String(index + 1).padStart(2, '0')}</span>
            </h3>
          </div>
        </div>

        <div className="iv-card__grid">
          <div className="iv-card__grid-item">
            <span>Date</span>
            <strong>{fullDate}</strong>
          </div>
          <div className="iv-card__grid-item">
            <span>Time</span>
            <strong>
              {interview.time}
              <span className="iv-card__tz"> Amsterdam</span>
            </strong>
          </div>
          <div className="iv-card__grid-item">
            <span>Duration</span>
            <strong>{interview.duration} min</strong>
          </div>
          <div className="iv-card__grid-item">
            <span>Your time</span>
            <strong>{formatTimeLocal(interview.date, interview.time)}</strong>
          </div>
          <div className="iv-card__grid-item iv-card__grid-item--full">
            <span>University</span>
            <strong>{interview.university}</strong>
          </div>
          <div className="iv-card__grid-item iv-card__grid-item--full">
            <span>Interviewer</span>
            <strong>{interview.interviewerName}</strong>
          </div>
        </div>

        {interview.instructions && (
          <div className="iv-card__instructions">
            <div className="iv-card__instructions-label">
              <i className="bx bx-info-circle" />
              Interviewer's note
            </div>
            <p>{interview.instructions}</p>
          </div>
        )}

        <div className="iv-card__actions">
          {canJoin ? (
            <a
              href={interview.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid"
            >
              <i className="bx bx-video" />
              Join Google Meet
            </a>
          ) : interview.computedStatus === 'completed' ? (
            <div className="iv-card__completed-note">
              <i className="bx bx-check-circle" />
              Interview completed. Check results section for feedback.
            </div>
          ) : interview.computedStatus === 'cancelled' ? (
            <div className="iv-card__cancelled-note">
              <i className="bx bx-info-circle" />
              This interview was cancelled. Book a new one from the interview
              booking page.
            </div>
          ) : null}

          {interview.meetLink && canJoin && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigator.clipboard?.writeText(interview.meetLink)}
              title="Copy meeting link"
            >
              <i className="bx bx-copy" />
              Copy link
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default InterviewCard