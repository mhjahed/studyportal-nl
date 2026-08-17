import React from 'react'
import { dataService } from '../../../services/dataService'
import './AcademicCard.scss'

function AcademicCard({ user }) {
  const universities = dataService.getUniversities()
  const uniData = universities.find((u) => u.name === user.university)

  return (
    <section className="ac-card">
      <header className="ac-card__header">
        <div>
          <div className="ac-card__eyebrow">Section 2</div>
          <h2 className="ac-card__title">Academic information</h2>
        </div>
        <div className="ac-card__lock-badge">
          <i className="bx bx-lock-alt" />
          <span>Locked</span>
        </div>
      </header>

      {/* University spotlight */}
      <div className="ac-uni">
        <div className="ac-uni__icon">
          <i className="bx bx-buildings" />
        </div>
        <div className="ac-uni__info">
          <div className="ac-uni__label">University</div>
          <div className="ac-uni__name">{user.university}</div>
          {uniData && (
            <div className="ac-uni__meta">
              <span>{uniData.city}</span>
              <span className="ac-uni__sep">·</span>
              <span>{uniData.type}</span>
              {uniData.ranking && (
                <>
                  <span className="ac-uni__sep">·</span>
                  <span>{uniData.ranking}</span>
                </>
              )}
            </div>
          )}
        </div>
        {uniData?.website && (
          <a
            href={uniData.website}
            target="_blank"
            rel="noopener noreferrer"
            className="ac-uni__link"
          >
            <i className="bx bx-link-external" />
            <span>Visit</span>
          </a>
        )}
      </div>

      {/* Course + Level */}
      <div className="ac-card__grid">
        <div className="ac-field">
          <div className="ac-field__label">Course / programme</div>
          <div className="ac-field__value">{user.course || '—'}</div>
        </div>
        <div className="ac-field">
          <div className="ac-field__label">Study level</div>
          <div className="ac-field__value">
            <span className="ac-field__badge">{user.studyLevel || '—'}</span>
          </div>
        </div>
      </div>

      <div className="ac-card__notice">
        <i className="bx bx-info-circle" />
        <span>
          To update university or course information, please contact support.
          Academic changes may require re-verification of your interview
          eligibility.
        </span>
      </div>
    </section>
  )
}

export default AcademicCard