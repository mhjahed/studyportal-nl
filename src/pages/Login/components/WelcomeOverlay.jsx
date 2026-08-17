import React, { useState, useEffect } from 'react'
import './WelcomeOverlay.scss'

function WelcomeOverlay({ user }) {
  const [phase, setPhase] = useState('enter') // enter → hold → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 100)
    const t2 = setTimeout(() => setPhase('exit'), 2100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const hour = new Date().getHours()
  const greeting =
    hour < 5 ? 'Good evening' :
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className={`welcome welcome--${phase}`}>
      <div className="welcome__inner">
        {/* Portrait with ring */}
        <div className="welcome__portrait-wrap">
          <div className="welcome__portrait-ring" />
          <div className="welcome__portrait-ring welcome__portrait-ring--delay" />
          <img
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            className="welcome__portrait"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=1a3a6b&color=fff&size=200`
            }}
          />
        </div>

        {/* Text */}
        <div className="welcome__greeting">{greeting},</div>
        <h1 className="welcome__name">
          {user.firstName} <em>{user.lastName}</em>
        </h1>

        <div className="welcome__meta">
          <div className="welcome__meta-item">
            <span className="welcome__meta-label">ISO Code</span>
            <span className="welcome__meta-value">{user.isoCode}</span>
          </div>
          <div className="welcome__divider" />
          <div className="welcome__meta-item">
            <span className="welcome__meta-label">University</span>
            <span className="welcome__meta-value">{user.university}</span>
          </div>
        </div>

        <div className="welcome__loader">
          <div className="welcome__loader-track">
            <div className="welcome__loader-fill" />
          </div>
          <div className="welcome__loader-text">Preparing your portal…</div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeOverlay