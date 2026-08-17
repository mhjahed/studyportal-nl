import React from 'react'
import './DocumentsHero.scss'

function DocumentsHero({ overallProgress, currentUser }) {
  const { pct, ready, effective, preparing, notStarted, total, notApplicable } = overallProgress

  const statusText =
    pct === 100 ? 'All required documents ready.' :
    pct >= 75 ? 'You are close to finishing.' :
    pct >= 50 ? 'Halfway there — keep going.' :
    pct >= 25 ? 'You have made a good start.' :
    'Begin your preparation.'

  return (
    <section className="dh">
      <div className="dh__image">
        <img
          src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1600&h=500&fit=crop&q=80"
          alt="Passport, documents, and travel preparation"
        />
        <div className="dh__overlay" />
      </div>

      <div className="dh__content">
        <div className="dh__left">
          <div className="dh__eyebrow">
            <span className="dh__eyebrow-dot" />
            Document checklist
          </div>
          <h1 className="dh__title">
            Your <em>preparation</em> tracker
          </h1>
          <p className="dh__lede">
            {statusText} Track every document across university admission, IND,
            embassy and travel stages in one place.
          </p>

          <div className="dh__stats">
            <div className="dh__stat">
              <div className="dh__stat-num">{ready}</div>
              <div className="dh__stat-label">Ready</div>
            </div>
            <div className="dh__stat">
              <div className="dh__stat-num">{preparing}</div>
              <div className="dh__stat-label">Preparing</div>
            </div>
            <div className="dh__stat">
              <div className="dh__stat-num">{notStarted}</div>
              <div className="dh__stat-label">Not started</div>
            </div>
            {notApplicable > 0 && (
              <div className="dh__stat">
                <div className="dh__stat-num">{notApplicable}</div>
                <div className="dh__stat-label">Not applicable</div>
              </div>
            )}
          </div>
        </div>

        {/* Right progress ring */}
        <div className="dh__right">
          <div className="dh__ring-wrap">
            <svg viewBox="0 0 120 120" className="dh__ring">
              <circle cx="60" cy="60" r="52" fill="none"
                stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none"
                stroke="#f3c896"
                strokeWidth="10"
                strokeDasharray={`${pct * 3.267} 326.7`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="dh__ring-content">
              <div className="dh__ring-val">{pct}<span>%</span></div>
            </div>
          </div>

          <div className="dh__ring-info">
            <div className="dh__ring-label">Overall ready</div>
            <div className="dh__ring-fraction">
              {ready} of {effective} required
            </div>
            {notApplicable > 0 && (
              <div className="dh__ring-note">
                {notApplicable} marked N/A
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DocumentsHero