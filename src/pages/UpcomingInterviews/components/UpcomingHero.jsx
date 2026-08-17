import React, { useState, useEffect } from 'react'
import './UpcomingHero.scss'

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
      const seconds = Math.floor((diff / 1000) % 60)
      return { days, hours, minutes, seconds, expired: false }
    }

    setRemaining(compute())
    const timer = setInterval(() => setRemaining(compute()), 1000)
    return () => clearInterval(timer)
  }, [targetDateTime])

  return remaining
}

function UpcomingHero({ nextInterview, totalUpcoming, totalCompleted }) {
  const countdown = useCountdown(
    nextInterview ? `${nextInterview.date}T${nextInterview.time}:00` : null
  )

  return (
    <section className="uh">
      <div className="uh__image">
        <img
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&h=500&fit=crop&q=80"
          alt="Video call interview preparation"
        />
        <div className="uh__overlay" />
      </div>

      <div className="uh__content">
        <div className="uh__eyebrow">
          <span className="uh__eyebrow-dot" />
          Practice interviews
        </div>
        <h1 className="uh__title">
          Your <em>scheduled</em> interviews
        </h1>
        <p className="uh__lede">
          Every practice session is a step closer to your Dutch university.
          Join with confidence.
        </p>

        <div className="uh__stats">
          <div className="uh__stat">
            <div className="uh__stat-num">{totalUpcoming}</div>
            <div className="uh__stat-label">Upcoming</div>
          </div>
          <div className="uh__stat">
            <div className="uh__stat-num">{totalCompleted}</div>
            <div className="uh__stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Countdown panel */}
      {nextInterview && countdown && !countdown.expired && (
        <div className="uh__countdown">
          <div className="uh__countdown-head">
            <div className="uh__countdown-label">Next interview in</div>
            <div className="uh__countdown-type">{nextInterview.typeLabel}</div>
          </div>
          <div className="uh__countdown-values">
            <div className="uh__countdown-block">
              <span className="uh__countdown-num">{countdown.days}</span>
              <span className="uh__countdown-unit">
                {countdown.days === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="uh__countdown-block">
              <span className="uh__countdown-num">{countdown.hours}</span>
              <span className="uh__countdown-unit">
                {countdown.hours === 1 ? 'hour' : 'hours'}
              </span>
            </div>
            <div className="uh__countdown-block">
              <span className="uh__countdown-num">{countdown.minutes}</span>
              <span className="uh__countdown-unit">
                {countdown.minutes === 1 ? 'minute' : 'minutes'}
              </span>
            </div>
            <div className="uh__countdown-block uh__countdown-block--seconds">
              <span className="uh__countdown-num">{countdown.seconds}</span>
              <span className="uh__countdown-unit">sec</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default UpcomingHero