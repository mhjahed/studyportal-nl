import React from 'react'
import './ResultsHero.scss'

function scoreColor(pct) {
  if (pct >= 80) return '#1d7a47'
  if (pct >= 60) return '#e8820c'
  return '#ae1c28'
}

function ResultsHero({ totalResults, averageScore, highestScore, bestResult }) {
  return (
    <section className="rh">
      <div className="rh__image">
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&h=500&fit=crop&q=80"
          alt="Graduation and academic achievement"
        />
        <div className="rh__overlay" />
      </div>

      <div className="rh__content">
        <div className="rh__eyebrow">
          <span className="rh__eyebrow-dot" />
          Interview results
        </div>
        <h1 className="rh__title">
          Your <em>performance</em> record
        </h1>
        <p className="rh__lede">
          Every published result from your practice interviews. Use the feedback
          to strengthen your next session.
        </p>

        {totalResults > 0 && (
          <div className="rh__stats">
            <div className="rh__stat">
              <div className="rh__stat-num">{totalResults}</div>
              <div className="rh__stat-label">
                Published<br />result{totalResults !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="rh__stat">
              <div
                className="rh__stat-num"
                style={{ color: scoreColor(averageScore) }}
              >
                {averageScore}<span>%</span>
              </div>
              <div className="rh__stat-label">
                Average<br />score
              </div>
            </div>
            <div className="rh__stat">
              <div
                className="rh__stat-num"
                style={{ color: scoreColor(highestScore) }}
              >
                {highestScore}<span>%</span>
              </div>
              <div className="rh__stat-label">
                Highest<br />score
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Best result callout */}
      {bestResult && totalResults > 1 && (
        <div className="rh__callout">
          <div className="rh__callout-label">Best performance</div>
          <div className="rh__callout-title">{bestResult.typeLabel}</div>
          <div className="rh__callout-meta">
            Grade {bestResult.grade} · {bestResult.percentage}%
          </div>
        </div>
      )}
    </section>
  )
}

export default ResultsHero