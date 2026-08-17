import React from 'react'
import './ResultCard.scss'

const TYPE_META = {
  university: {
    label: 'University Admission',
    icon: 'bx-book-open',
    color: '#1a3a6b',
  },
  ind: {
    label: 'IND Interview',
    icon: 'bx-shield-quarter',
    color: '#0f2444',
  },
  embassy: {
    label: 'Embassy Interview',
    icon: 'bx-buildings',
    color: '#1d7a47',
  },
}

function scoreColor(pct) {
  if (pct >= 80) return '#1d7a47'
  if (pct >= 60) return '#e8820c'
  return '#ae1c28'
}

function gradeDescriptor(grade) {
  const map = {
    'A+': 'Outstanding',
    'A': 'Excellent',
    'B+': 'Very good',
    'B': 'Good',
    'C+': 'Above average',
    'C': 'Satisfactory',
    'D': 'Needs improvement',
    'F': 'Unsatisfactory',
  }
  return map[grade] || 'Reviewed'
}

function ResultCard({ result, index, onView }) {
  const type = TYPE_META[result.type] || TYPE_META.university
  const color = scoreColor(result.percentage)

  const publishedDate = new Date(result.publishedAt).toLocaleDateString(
    'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }
  )

  const interviewDate = new Date(result.interviewDate).toLocaleDateString(
    'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <article className="rc" onClick={onView}>
      {/* Left: number + type */}
      <div className="rc__side" style={{ background: type.color }}>
        <div className="rc__num">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="rc__type">
          <i className={`bx ${type.icon}`} />
          <span>{type.label}</span>
        </div>
      </div>

      {/* Middle: content */}
      <div className="rc__body">
        <div className="rc__header">
          <h3 className="rc__title">{result.typeLabel}</h3>
          <div className="rc__interview-date">
            Interviewed on {interviewDate}
          </div>
        </div>

        <p className="rc__feedback">
          "{result.overallFeedback}"
        </p>

        <div className="rc__meta">
          <div className="rc__meta-item">
            <span>Published</span>
            <strong>{publishedDate}</strong>
          </div>
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="rc__meta-item">
              <span>Recommendations</span>
              <strong>{result.recommendations.length} note{result.recommendations.length !== 1 ? 's' : ''}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Right: score */}
      <div className="rc__score">
        <div className="rc__score-inner">
          <svg viewBox="0 0 100 100" className="rc__score-ring">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#f0edE6"
              strokeWidth="8"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={`${result.percentage * 2.827} 282.7`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="rc__score-content">
            <div className="rc__score-value" style={{ color }}>
              {result.percentage}
              <span>%</span>
            </div>
          </div>
        </div>

        <div className="rc__score-info">
          <div className="rc__grade" style={{ color }}>
            Grade {result.grade}
          </div>
          <div className="rc__grade-desc">{gradeDescriptor(result.grade)}</div>
          <div className="rc__score-fraction">
            {result.totalScore} / {result.maxScore} points
          </div>
        </div>

        <button
          type="button"
          className="rc__view"
          onClick={(e) => {
            e.stopPropagation()
            onView()
          }}
        >
          View result
          <i className="bx bx-right-arrow-alt" />
        </button>
      </div>
    </article>
  )
}

export default ResultCard