import React from 'react'
import { Link } from 'react-router-dom'
import './LatestResultCard.scss'

function LatestResultCard({ result }) {
  if (!result) {
    return (
      <div className="d-card">
        <div className="d-card__head">
          <div>
            <div className="d-card__eyebrow">Latest result</div>
            <h3 className="d-card__title">No results yet</h3>
          </div>
        </div>
        <div className="empty-inline">
          <i className="bx bx-award" />
          <p>Your interview results will appear here once published.</p>
        </div>
      </div>
    )
  }

  const publishedDate = new Date(result.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const scoreColor =
    result.percentage >= 80 ? '#1d7a47' :
    result.percentage >= 60 ? '#e8820c' : '#ae1c28'

  return (
    <div className="d-card result-card">
      <div className="d-card__head">
        <div>
          <div className="d-card__eyebrow">Latest result</div>
          <h3 className="d-card__title">{result.typeLabel}</h3>
        </div>
        <Link to="/results" className="d-card__link">
          All results
          <i className="bx bx-right-arrow-alt" />
        </Link>
      </div>

      <div className="result-card__body">
        {/* Score */}
        <div className="result-score">
          <svg viewBox="0 0 100 100" className="result-score__ring">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#f0edE6"
              strokeWidth="7"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={scoreColor}
              strokeWidth="7"
              strokeDasharray={`${result.percentage * 2.827} 282.7`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="result-score__inner">
            <div className="result-score__value" style={{ color: scoreColor }}>
              {result.percentage}
            </div>
            <div className="result-score__unit">%</div>
          </div>
        </div>

        <div className="result-card__info">
          <div className="result-card__grade" style={{ color: scoreColor }}>
            Grade {result.grade}
          </div>
          <div className="result-card__score">
            {result.totalScore} out of {result.maxScore} points
          </div>
          <p className="result-card__feedback">"{result.overallFeedback}"</p>
          <div className="result-card__date">
            Published on {publishedDate}
          </div>
        </div>
      </div>

      <div className="result-card__actions">
        <Link to="/scorecard" className="btn-solid">
          View full scorecard
          <i className="bx bx-right-arrow-alt" />
        </Link>
      </div>
    </div>
  )
}

export default LatestResultCard