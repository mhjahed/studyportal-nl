import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './UpcomingInterviewCard.scss'

function useCountdown(targetDateTime) {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (!targetDateTime) return

    const compute = () => {
      const now = new Date()
      const target = new Date(targetDateTime)
      const diff = target - now

      if (diff <= 0) return { expired: true }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      return { days, hours, minutes, expired: false }
    }

    setRemaining(compute())
    const timer = setInterval(() => setRemaining(compute()), 60000)
    return () => clearInterval(timer)
  }, [targetDateTime])

  return remaining
}

function UpcomingInterviewCard({ interview }) {
  const countdown = useCountdown(
    interview ? `${interview.date}T${interview.time}:00` : null
  )

  if (!interview) {
    return (
      <div className="d-card">
        <div className="d-card__head">
          <div>
            <div className="d-card__eyebrow">Next interview</div>
            <h3 className="d-card__title">Nothing scheduled</h3>
          </div>
        </div>
        <div className="empty-inline">
          <i className="bx bx-calendar-x" />
          <p>You have no upcoming interviews at the moment.</p>
          <Link to="/register-interview" className="btn-inline">
            Book an interview
            <i className="bx bx-right-arrow-alt" />
          </Link>
        </div>
      </div>
    )
  }

  const dateObj = new Date(`${interview.date}T${interview.time}:00`)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleDateString('en-GB', { month: 'short' })
  const weekday = dateObj.toLocaleDateString('en-GB', { weekday: 'long' })
  const fullDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="d-card upcoming-card">
      <div className="d-card__head">
        <div>
          <div className="d-card__eyebrow">Next interview</div>
          <h3 className="d-card__title">
            {interview.typeLabel}
          </h3>
        </div>
        <Link to="/upcoming-interviews" className="d-card__link">
          All interviews
          <i className="bx bx-right-arrow-alt" />
        </Link>
      </div>

      <div className="upcoming-card__body">
        {/* Date block */}
        <div className="upcoming-date">
          <div className="upcoming-date__month">{month}</div>
          <div className="upcoming-date__day">{day}</div>
          <div className="upcoming-date__weekday">{weekday}</div>
        </div>

        {/* Details */}
        <div className="upcoming-card__details">
          <div className="upcoming-card__row">
            <i className="bx bx-time-five" />
            <div>
              <span className="upcoming-card__row-label">Time</span>
              <span className="upcoming-card__row-value">
                {interview.time} <span className="upcoming-card__tz">Amsterdam time</span>
              </span>
            </div>
          </div>

          <div className="upcoming-card__row">
            <i className="bx bx-buildings" />
            <div>
              <span className="upcoming-card__row-label">University</span>
              <span className="upcoming-card__row-value">{interview.university}</span>
            </div>
          </div>

          <div className="upcoming-card__row">
            <i className="bx bx-user-voice" />
            <div>
              <span className="upcoming-card__row-label">Interviewer</span>
              <span className="upcoming-card__row-value">{interview.interviewerName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown */}
      {countdown && !countdown.expired && (
        <div className="upcoming-countdown">
          <div className="upcoming-countdown__label">Starts in</div>
          <div className="upcoming-countdown__values">
            {countdown.days > 0 && (
              <div className="upcoming-countdown__block">
                <span className="upcoming-countdown__num">{countdown.days}</span>
                <span className="upcoming-countdown__unit">
                  {countdown.days === 1 ? 'day' : 'days'}
                </span>
              </div>
            )}
            <div className="upcoming-countdown__block">
              <span className="upcoming-countdown__num">{countdown.hours}</span>
              <span className="upcoming-countdown__unit">
                {countdown.hours === 1 ? 'hour' : 'hours'}
              </span>
            </div>
            <div className="upcoming-countdown__block">
              <span className="upcoming-countdown__num">{countdown.minutes}</span>
              <span className="upcoming-countdown__unit">
                {countdown.minutes === 1 ? 'minute' : 'minutes'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="upcoming-card__actions">
        <a
          href={interview.meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-solid"
        >
          <i className="bx bx-video" />
          Join Google Meet
        </a>
        <Link to="/upcoming-interviews" className="btn-ghost">
          View details
        </Link>
      </div>
    </div>
  )
}

export default UpcomingInterviewCard