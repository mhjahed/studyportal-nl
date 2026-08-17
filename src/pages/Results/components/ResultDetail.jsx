import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { dataService } from '../../../services/dataService'
import { useAuth } from '../../../context/AuthContext'
import './ResultDetail.scss'

const TYPE_META = {
  university: { label: 'University Admission', icon: 'bx-book-open' },
  ind: { label: 'IND Interview', icon: 'bx-shield-quarter' },
  embassy: { label: 'Embassy Interview', icon: 'bx-buildings' },
}

function scoreColor(pct) {
  if (pct >= 80) return '#1d7a47'
  if (pct >= 60) return '#e8820c'
  return '#ae1c28'
}

function gradeDescriptor(grade) {
  const map = {
    'A+': 'Outstanding', 'A': 'Excellent', 'B+': 'Very good', 'B': 'Good',
    'C+': 'Above average', 'C': 'Satisfactory', 'D': 'Needs improvement', 'F': 'Unsatisfactory',
  }
  return map[grade] || 'Reviewed'
}

function ResultDetail({ result, onBack }) {
  const { currentUser } = useAuth()
  const type = TYPE_META[result.type] || TYPE_META.university
  const color = scoreColor(result.percentage)

  // Try to load associated scorecard (Phase 12) for criteria breakdown
  const scorecard = useMemo(
    () => dataService.getScorecardByResultId(result.id),
    [result.id]
  )

  const interviewDate = new Date(result.interviewDate).toLocaleDateString(
    'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }
  )

  const publishedDate = new Date(result.publishedAt).toLocaleDateString(
    'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <div className="rd">
      {/* Back link */}
      <button type="button" className="rd__back" onClick={onBack}>
        <i className="bx bx-left-arrow-alt" />
        Back to all results
      </button>

      {/* Hero band with score */}
      <section className="rd__hero" style={{ borderTop: `4px solid ${color}` }}>
        <div className="rd__hero-left">
          <div className="rd__eyebrow">
            <i className={`bx ${type.icon}`} />
            {type.label}
          </div>
          <h1 className="rd__title">{result.typeLabel}</h1>

          <div className="rd__meta">
            <div className="rd__meta-item">
              <span>Interviewed</span>
              <strong>{interviewDate}</strong>
            </div>
            <div className="rd__meta-item">
              <span>Published</span>
              <strong>{publishedDate}</strong>
            </div>
            <div className="rd__meta-item">
              <span>Student</span>
              <strong>{currentUser.firstName} {currentUser.lastName}</strong>
            </div>
            <div className="rd__meta-item">
              <span>ISO Code</span>
              <strong>{result.isoCode}</strong>
            </div>
          </div>
        </div>

        {/* Score panel */}
        <div className="rd__hero-right">
          <div className="rd__score-ring-wrap">
            <svg viewBox="0 0 120 120" className="rd__score-ring">
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="#f0edE6"
                strokeWidth="10"
              />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeDasharray={`${result.percentage * 3.267} 326.7`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="rd__score-inner">
              <div className="rd__score-value" style={{ color }}>
                {result.percentage}
                <span>%</span>
              </div>
            </div>
          </div>

          <div className="rd__score-details">
            <div className="rd__grade" style={{ color }}>
              Grade {result.grade}
            </div>
            <div className="rd__grade-desc">
              {gradeDescriptor(result.grade)}
            </div>
            <div className="rd__score-fraction">
              {result.totalScore} out of {result.maxScore} points
            </div>
          </div>
        </div>
      </section>

      {/* Overall feedback */}
      <section className="rd-section">
        <div className="rd-section__label">Overall feedback</div>
        <h2 className="rd-section__title">
          The interviewer's summary
        </h2>
        <div className="rd-feedback">
          <div className="rd-feedback__quote">"</div>
          <p>{result.overallFeedback}</p>
        </div>
      </section>

      {/* Criteria breakdown from scorecard, if available */}
      {scorecard && scorecard.criteria && scorecard.criteria.length > 0 && (
        <section className="rd-section">
          <div className="rd-section__label">Score breakdown</div>
          <h2 className="rd-section__title">
            How you scored on each criterion
          </h2>

          <div className="rd-criteria">
            {scorecard.criteria.map((c) => {
              const pct = Math.round((c.score / c.maxScore) * 100)
              const cColor = scoreColor(pct)
              return (
                <div key={c.id} className="rd-criterion">
                  <div className="rd-criterion__head">
                    <div className="rd-criterion__name">{c.name}</div>
                    <div className="rd-criterion__score">
                      <span style={{ color: cColor }}>{c.score}</span>
                      <span className="rd-criterion__score-max">/ {c.maxScore}</span>
                    </div>
                  </div>
                  <div className="rd-criterion__bar">
                    <div
                      className="rd-criterion__bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: cColor,
                      }}
                    />
                  </div>
                  {c.feedback && (
                    <div className="rd-criterion__feedback">{c.feedback}</div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="rd__scorecard-link">
            <Link to="/scorecard" className="btn-solid">
              <i className="bx bx-line-chart" />
              View full scorecard
            </Link>
          </div>
        </section>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <section className="rd-section">
          <div className="rd-section__label">Recommendations</div>
          <h2 className="rd-section__title">
            To improve for next time
          </h2>

          <ol className="rd-recos">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="rd-reco">
                <div className="rd-reco__num">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="rd-reco__text">{rec}</div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Bottom CTAs */}
      <section className="rd__actions">
        <div className="rd__actions-content">
          <div>
            <div className="rd__actions-label">Continue your preparation</div>
            <h3 className="rd__actions-title">
              Ready for your next interview?
            </h3>
            <p className="rd__actions-text">
              Book another practice session or review your document checklist to
              stay on track.
            </p>
          </div>
          <div className="rd__actions-cta">
            <Link to="/register-interview" className="btn-solid">
              <i className="bx bx-calendar-plus" />
              Book next interview
            </Link>
            <Link to="/documents" className="btn-ghost">
              Documents
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ResultDetail