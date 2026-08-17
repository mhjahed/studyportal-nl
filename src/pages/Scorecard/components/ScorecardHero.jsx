import React from 'react'
import './ScorecardHero.scss'

function scoreColor(pct) {
  if (pct >= 80) return '#1d7a47'
  if (pct >= 60) return '#e8820c'
  return '#ae1c28'
}

function ScorecardHero({ totalScorecards, averageOverall, criteriaCount }) {
  return (
    <section className="sh">
      <div className="sh__image">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=500&fit=crop&q=80"
          alt="Analytics and performance data"
        />
        <div className="sh__overlay" />
      </div>

      <div className="sh__content">
        <div className="sh__eyebrow">
          <span className="sh__eyebrow-dot" />
          Performance scorecards
        </div>
        <h1 className="sh__title">
          Your <em>detailed</em> performance
        </h1>
        <p className="sh__lede">
          Every scorecard is a professional assessment across the criteria that
          matter most for your interview success in the Netherlands.
        </p>

        {totalScorecards > 0 && (
          <div className="sh__stats">
            <div className="sh__stat">
              <div className="sh__stat-num">{totalScorecards}</div>
              <div className="sh__stat-label">
                Published<br />scorecard{totalScorecards !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="sh__stat">
              <div
                className="sh__stat-num"
                style={{ color: scoreColor(averageOverall) }}
              >
                {averageOverall}<span>%</span>
              </div>
              <div className="sh__stat-label">
                Overall<br />average
              </div>
            </div>
            <div className="sh__stat">
              <div className="sh__stat-num">{criteriaCount}</div>
              <div className="sh__stat-label">
                Criteria<br />assessed
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ScorecardHero