import React from 'react'
import './DashboardHero.scss'

function DashboardHero({ user, upcomingCount }) {
  const hour = new Date().getHours()
  const greeting =
    hour < 5 ? 'Good evening' :
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' : 'Good evening'

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className="d-hero">
      <div className="d-hero__image">
        <img
          src="https://w0.peakpx.com/wallpaper/133/176/HD-wallpaper-amsterdam-on-a-sunny-october-day-autumn-city-bridges-sunrise-nature-trees-sky-ships-lake-water.jpg"
          alt="View of Amsterdam canals at golden hour"
        />
      </div>

      <div className="d-hero__overlay">
        <div className="d-hero__content">
          <div className="d-hero__eyebrow">
            <span className="d-hero__eyebrow-dot" />
            {greeting} · {today}
          </div>

          <h1 className="d-hero__title">
            Welcome back, <em>{user.firstName}</em>.
          </h1>

          <p className="d-hero__lede">
            Here is your Netherlands study preparation overview.
            {upcomingCount > 0 && (
              <> You have <strong>{upcomingCount} scheduled interview{upcomingCount !== 1 ? 's' : ''}</strong> ahead.</>
            )}
          </p>
        </div>

        <div className="d-hero__meta">
          <div className="d-hero__meta-item">
            <span className="d-hero__meta-label">ISO Code</span>
            <span className="d-hero__meta-value">{user.isoCode}</span>
          </div>
          <div className="d-hero__meta-divider" />
          <div className="d-hero__meta-item">
            <span className="d-hero__meta-label">University</span>
            <span className="d-hero__meta-value d-hero__meta-value--wrap">
              {user.university}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardHero