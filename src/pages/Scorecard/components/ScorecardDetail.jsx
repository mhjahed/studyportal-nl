import React, { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import './ScorecardDetail.scss'

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

function scoreLevel(pct) {
  if (pct >= 90) return 'Outstanding'
  if (pct >= 80) return 'Excellent'
  if (pct >= 70) return 'Very good'
  if (pct >= 60) return 'Good'
  if (pct >= 50) return 'Satisfactory'
  return 'Needs improvement'
}

function ScorecardDetail({ scorecard, onBack }) {
  const { currentUser } = useAuth()
  const type = TYPE_META[scorecard.type] || TYPE_META.university
  const printRef = useRef(null)

  const totalScore = scorecard.criteria.reduce((sum, c) => sum + c.score, 0)
  const totalMax = scorecard.criteria.reduce((sum, c) => sum + c.maxScore, 0)
  const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0
  const color = scoreColor(percentage)
  const level = scoreLevel(percentage)

  const interviewDate = new Date(scorecard.interviewDate).toLocaleDateString(
    'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }
  )
  const publishedDate = new Date(scorecard.publishedAt).toLocaleDateString(
    'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }
  )

  // Find highest and lowest scoring criteria
  const sortedCriteria = useMemo(() => {
    return [...scorecard.criteria].map((c) => ({
      ...c,
      percentage: Math.round((c.score / c.maxScore) * 100),
    }))
  }, [scorecard.criteria])

  const strongest = useMemo(() => {
    return [...sortedCriteria].sort((a, b) => b.percentage - a.percentage)[0]
  }, [sortedCriteria])

  const weakest = useMemo(() => {
    return [...sortedCriteria].sort((a, b) => a.percentage - b.percentage)[0]
  }, [sortedCriteria])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="scd" ref={printRef}>
      {/* Back link */}
      <button type="button" className="scd__back no-print" onClick={onBack}>
        <i className="bx bx-left-arrow-alt" />
        Back to all scorecards
      </button>

      {/* Official-looking scorecard document */}
      <div className="scd-doc">
        {/* Perforation */}
        <div className="scd-doc__perforation" />

        {/* Header */}
        <header className="scd-doc__header">
          <div className="scd-doc__brand">
            <div className="scd-doc__flag">
              <span /><span /><span />
            </div>
            <div>
              <div className="scd-doc__brand-name">Bachelors Portal</div>
              <div className="scd-doc__brand-sub">Netherlands</div>
            </div>
          </div>

          <div className="scd-doc__doc-type">
            <div className="scd-doc__doc-label">Interview scorecard</div>
            <div className="scd-doc__doc-ref">Ref: {scorecard.id.toUpperCase()}</div>
          </div>
        </header>

        {/* Title band */}
        <div className="scd-doc__title-band" style={{ borderTop: `4px solid ${color}` }}>
          <div className="scd-doc__eyebrow">
            <i className={`bx ${type.icon}`} />
            {type.label}
          </div>
          <h1 className="scd-doc__title">
            Performance <em>assessment report</em>
          </h1>
          <div className="scd-doc__subtitle">
            {scorecard.typeLabel} · Assessed {interviewDate}
          </div>
        </div>

        {/* Student + summary panel */}
        <div className="scd-doc__summary">
          <div className="scd-doc__summary-left">
            <div className="scd-doc__section-label">Candidate</div>
            <div className="scd-doc__student-name">
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <dl className="scd-doc__student-meta">
              <div>
                <dt>ISO Code</dt>
                <dd>{scorecard.isoCode}</dd>
              </div>
              <div>
                <dt>University</dt>
                <dd>{currentUser.university}</dd>
              </div>
              <div>
                <dt>Course</dt>
                <dd>{currentUser.course}</dd>
              </div>
              <div>
                <dt>Assessment date</dt>
                <dd>{interviewDate}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{publishedDate}</dd>
              </div>
            </dl>
          </div>

          <div className="scd-doc__summary-right">
            <div className="scd-doc__overall-ring-wrap">
              <svg viewBox="0 0 120 120" className="scd-doc__overall-ring">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f0edE6" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={color}
                  strokeWidth="10"
                  strokeDasharray={`${percentage * 3.267} 326.7`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="scd-doc__overall-content">
                <div className="scd-doc__overall-val" style={{ color }}>
                  {percentage}<span>%</span>
                </div>
              </div>
            </div>
            <div className="scd-doc__overall-level" style={{ color }}>
              {level}
            </div>
            <div className="scd-doc__overall-fraction">
              {totalScore} out of {totalMax} points
            </div>
          </div>
        </div>

        {/* Criteria breakdown */}
        <section className="scd-doc__section">
          <div className="scd-doc__section-header">
            <div className="scd-doc__section-label">Section 1</div>
            <h2 className="scd-doc__section-title">
              Scores by criterion
            </h2>
          </div>

          <div className="scd-criteria">
            {sortedCriteria.map((c, i) => {
              const cColor = scoreColor(c.percentage)
              const isStrongest = c.id === strongest?.id
              const isWeakest = c.id === weakest?.id && strongest?.id !== weakest?.id

              return (
                <article key={c.id} className="scd-criterion">
                  <div className="scd-criterion__head">
                    <div className="scd-criterion__num">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="scd-criterion__name-wrap">
                      <div className="scd-criterion__name">
                        {c.name}
                        {isStrongest && (
                          <span className="scd-criterion__tag scd-criterion__tag--strong">
                            <i className="bx bx-trophy" />
                            Strongest
                          </span>
                        )}
                        {isWeakest && (
                          <span className="scd-criterion__tag scd-criterion__tag--weak">
                            <i className="bx bx-trending-down" />
                            Focus area
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="scd-criterion__score">
                      <span className="scd-criterion__score-val" style={{ color: cColor }}>
                        {c.score}
                      </span>
                      <span className="scd-criterion__score-max">/ {c.maxScore}</span>
                    </div>
                  </div>

                  <div className="scd-criterion__bar">
                    <div
                      className="scd-criterion__bar-fill"
                      style={{ width: `${c.percentage}%`, background: cColor }}
                    />
                  </div>

                  <div className="scd-criterion__level">
                    <span style={{ color: cColor }}>{scoreLevel(c.percentage)}</span>
                    <span className="scd-criterion__pct">{c.percentage}%</span>
                  </div>

                  {c.feedback && (
                    <div className="scd-criterion__feedback">
                      <div className="scd-criterion__feedback-label">
                        Interviewer's feedback
                      </div>
                      <p>{c.feedback}</p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        {/* Strengths + Weaknesses */}
        {((scorecard.strengths && scorecard.strengths.length > 0) ||
          (scorecard.weaknesses && scorecard.weaknesses.length > 0)) && (
          <section className="scd-doc__section">
            <div className="scd-doc__section-header">
              <div className="scd-doc__section-label">Section 2</div>
              <h2 className="scd-doc__section-title">
                Summary observations
              </h2>
            </div>

            <div className="scd-sw">
              {scorecard.strengths && scorecard.strengths.length > 0 && (
                <div className="scd-sw__panel scd-sw__panel--strengths">
                  <div className="scd-sw__panel-head">
                    <div className="scd-sw__panel-icon">
                      <i className="bx bx-check" />
                    </div>
                    <div>
                      <div className="scd-sw__panel-eyebrow">Recognised</div>
                      <div className="scd-sw__panel-title">Strengths</div>
                    </div>
                  </div>
                  <ul className="scd-sw__list">
                    {scorecard.strengths.map((s, i) => (
                      <li key={i}>
                        <i className="bx bx-check-circle" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {scorecard.weaknesses && scorecard.weaknesses.length > 0 && (
                <div className="scd-sw__panel scd-sw__panel--weaknesses">
                  <div className="scd-sw__panel-head">
                    <div className="scd-sw__panel-icon">
                      <i className="bx bx-target-lock" />
                    </div>
                    <div>
                      <div className="scd-sw__panel-eyebrow">To develop</div>
                      <div className="scd-sw__panel-title">Areas for growth</div>
                    </div>
                  </div>
                  <ul className="scd-sw__list">
                    {scorecard.weaknesses.map((w, i) => (
                      <li key={i}>
                        <i className="bx bx-right-arrow-alt" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Overall comments */}
        {scorecard.overallComments && (
          <section className="scd-doc__section">
            <div className="scd-doc__section-header">
              <div className="scd-doc__section-label">Section 3</div>
              <h2 className="scd-doc__section-title">
                Overall assessment
              </h2>
            </div>

            <div className="scd-comments">
              <div className="scd-comments__quote">"</div>
              <p>{scorecard.overallComments}</p>
              <div className="scd-comments__attribution">
                — Assessment panel, Bachelors Portal Netherlands
              </div>
            </div>
          </section>
        )}

        {/* Doc footer */}
        <footer className="scd-doc__footer">
          <div className="scd-doc__footer-left">
            <div className="scd-doc__footer-label">Document reference</div>
            <div className="scd-doc__footer-ref">{scorecard.id.toUpperCase()}</div>
          </div>
          <div className="scd-doc__footer-right">
            <div className="scd-doc__footer-label">Bachelors Portal Netherlands</div>
            <div className="scd-doc__footer-sub">
              This document is for the candidate's personal reference.
            </div>
          </div>
        </footer>
      </div>

      {/* Actions */}
      <div className="scd__actions no-print">
        <button type="button" onClick={handlePrint} className="btn-solid">
          <i className="bx bx-printer" />
          Print scorecard
        </button>
        <Link to="/results" className="btn-ghost">
          <i className="bx bx-award" />
          View interview result
        </Link>
        <Link to="/register-interview" className="btn-ghost">
          <i className="bx bx-calendar-plus" />
          Book next interview
        </Link>
      </div>
    </div>
  )
}

export default ScorecardDetail