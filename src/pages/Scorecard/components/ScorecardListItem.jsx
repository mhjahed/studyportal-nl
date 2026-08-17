import React from 'react'
import './ScorecardListItem.scss'

const TYPE_META = {
  university: { label: 'University Admission', icon: 'bx-book-open', color: '#1a3a6b' },
  ind: { label: 'IND Interview', icon: 'bx-shield-quarter', color: '#0f2444' },
  embassy: { label: 'Embassy Interview', icon: 'bx-buildings', color: '#1d7a47' },
}

function scoreColor(pct) {
  if (pct >= 80) return '#1d7a47'
  if (pct >= 60) return '#e8820c'
  return '#ae1c28'
}

function ScorecardListItem({ scorecard, index, onView }) {
  const type = TYPE_META[scorecard.type] || TYPE_META.university

  // Compute overall from criteria
  const totalScore = scorecard.criteria.reduce((sum, c) => sum + c.score, 0)
  const totalMax = scorecard.criteria.reduce((sum, c) => sum + c.maxScore, 0)
  const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0
  const color = scoreColor(percentage)

  const interviewDate = new Date(scorecard.interviewDate).toLocaleDateString(
    'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }
  )

  // Show top 3 criteria as preview
  const previewCriteria = scorecard.criteria.slice(0, 3)

  return (
    <article className="sc-item" onClick={onView}>
      {/* Colored side band */}
      <div className="sc-item__side" style={{ background: type.color }}>
        <div className="sc-item__num">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="sc-item__type">
          <i className={`bx ${type.icon}`} />
          <span>{type.label}</span>
        </div>
      </div>

      {/* Body */}
      <div className="sc-item__body">
        <div className="sc-item__head">
          <div>
            <h3 className="sc-item__title">{scorecard.typeLabel}</h3>
            <div className="sc-item__date">
              Assessed on {interviewDate}
            </div>
          </div>

          <div className="sc-item__overall">
            <div className="sc-item__overall-val" style={{ color }}>
              {percentage}<span>%</span>
            </div>
            <div className="sc-item__overall-label">
              {totalScore} / {totalMax} pts
            </div>
          </div>
        </div>

        {/* Criteria preview bars */}
        <div className="sc-item__criteria-preview">
          {previewCriteria.map((c) => {
            const pct = Math.round((c.score / c.maxScore) * 100)
            const cColor = scoreColor(pct)
            return (
              <div key={c.id} className="sc-item__criterion">
                <div className="sc-item__criterion-head">
                  <span className="sc-item__criterion-name">{c.name}</span>
                  <span className="sc-item__criterion-score">
                    <span style={{ color: cColor }}>{c.score}</span>
                    <span className="sc-item__criterion-max">/{c.maxScore}</span>
                  </span>
                </div>
                <div className="sc-item__criterion-bar">
                  <div
                    className="sc-item__criterion-bar-fill"
                    style={{ width: `${pct}%`, background: cColor }}
                  />
                </div>
              </div>
            )
          })}

          {scorecard.criteria.length > 3 && (
            <div className="sc-item__more">
              + {scorecard.criteria.length - 3} more {scorecard.criteria.length - 3 === 1 ? 'criterion' : 'criteria'}
            </div>
          )}
        </div>

        {/* Meta + View button */}
        <div className="sc-item__foot">
          <div className="sc-item__foot-meta">
            {scorecard.strengths && scorecard.strengths.length > 0 && (
              <div className="sc-item__foot-item">
                <i className="bx bx-check-circle" />
                {scorecard.strengths.length} strength{scorecard.strengths.length !== 1 ? 's' : ''}
              </div>
            )}
            {scorecard.weaknesses && scorecard.weaknesses.length > 0 && (
              <div className="sc-item__foot-item">
                <i className="bx bx-error-circle" />
                {scorecard.weaknesses.length} area{scorecard.weaknesses.length !== 1 ? 's' : ''} to improve
              </div>
            )}
          </div>

          <button
            type="button"
            className="sc-item__view"
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
          >
            View scorecard
            <i className="bx bx-right-arrow-alt" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ScorecardListItem