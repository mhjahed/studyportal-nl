import React, { useState, useEffect } from 'react'
import { dataService } from '../../../services/dataService'
import './Sections.scss'

const STUDY_LEVELS = ['Bachelor', 'Pre-Master', 'Foundation']

function UniversityDetailsSection({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const universities = dataService.getUniversities()

  const validate = (d) => {
    const errs = {}
    if (!d.universityName?.trim()) errs.universityName = 'University is required.'
    if (!d.studyLevel) errs.studyLevel = 'Study level is required.'
    if (!d.course?.trim()) errs.course = 'Course name is required.'
    if (!d.location?.trim()) errs.location = 'Location is required.'
    if (!d.duration?.trim()) errs.duration = 'Course duration is required.'
    if (!d.startDate) errs.startDate = 'Start date is required.'
    else {
      const sd = new Date(d.startDate)
      const now = new Date()
      if (sd < now) errs.startDate = 'Start date should be in the future.'
    }
    return errs
  }

  const handleChange = (name, value) => {
    const next = { ...data, [name]: value }
    onChange(next)
    if (touched[name]) {
      const e = validate(next)
      setErrors((prev) => ({ ...prev, [name]: e[name] }))
    }
  }

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const e = validate(data)
    setErrors((prev) => ({ ...prev, [name]: e[name] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({
      universityName: true, studyLevel: true, course: true,
      location: true, duration: true, startDate: true,
    })
    const validationErrors = validate(data)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) onNext()
  }

  const errorFor = (name) => touched[name] && errors[name]

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="book__section-head">
        <h2 className="book__section-title">University details</h2>
        <p className="book__section-desc">
          Provide information about the university and course you are applying to.
        </p>
      </div>

      {/* University name */}
      <div className="field">
        <label className="field__label" htmlFor="universityName">
          University name
        </label>
        <input
          id="universityName"
          type="text"
          list="uni-list"
          value={data.universityName}
          onChange={(e) => handleChange('universityName', e.target.value)}
          onBlur={() => handleBlur('universityName')}
          placeholder="e.g. University of Amsterdam"
          className={['field__input', errorFor('universityName') && 'field__input--error']
            .filter(Boolean).join(' ')}
        />
        <datalist id="uni-list">
          {universities.map((u) => (
            <option key={u.id} value={u.name}>{u.city}</option>
          ))}
        </datalist>
        {errorFor('universityName') && (
          <div className="field__error">{errors.universityName}</div>
        )}
      </div>

      {/* Study level + Course */}
      <div className="fields-grid fields-grid--2">
        <div className="field">
          <label className="field__label" htmlFor="studyLevel">Study level</label>
          <select
            id="studyLevel"
            value={data.studyLevel}
            onChange={(e) => handleChange('studyLevel', e.target.value)}
            onBlur={() => handleBlur('studyLevel')}
            className={['field__input', 'field__input--select',
              errorFor('studyLevel') && 'field__input--error']
              .filter(Boolean).join(' ')}
          >
            {STUDY_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
          {errorFor('studyLevel') && (
            <div className="field__error">{errors.studyLevel}</div>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="course">Course / programme</label>
          <input
            id="course"
            type="text"
            value={data.course}
            onChange={(e) => handleChange('course', e.target.value)}
            onBlur={() => handleBlur('course')}
            placeholder="e.g. International Business"
            className={['field__input', errorFor('course') && 'field__input--error']
              .filter(Boolean).join(' ')}
          />
          {errorFor('course') && (
            <div className="field__error">{errors.course}</div>
          )}
        </div>
      </div>

      {/* Location + Duration */}
      <div className="fields-grid fields-grid--2">
        <div className="field">
          <label className="field__label" htmlFor="location">Campus location</label>
          <input
            id="location"
            type="text"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            onBlur={() => handleBlur('location')}
            placeholder="e.g. Amsterdam"
            className={['field__input', errorFor('location') && 'field__input--error']
              .filter(Boolean).join(' ')}
          />
          {errorFor('location') && (
            <div className="field__error">{errors.location}</div>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="duration">Course duration</label>
          <input
            id="duration"
            type="text"
            value={data.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            onBlur={() => handleBlur('duration')}
            placeholder="e.g. 3 years"
            className={['field__input', errorFor('duration') && 'field__input--error']
              .filter(Boolean).join(' ')}
          />
          {errorFor('duration') && (
            <div className="field__error">{errors.duration}</div>
          )}
        </div>
      </div>

      {/* Start date */}
      <div className="field">
        <label className="field__label" htmlFor="startDate">Programme start date</label>
        <input
          id="startDate"
          type="date"
          value={data.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          onBlur={() => handleBlur('startDate')}
          min={new Date().toISOString().split('T')[0]}
          className={['field__input', errorFor('startDate') && 'field__input--error']
            .filter(Boolean).join(' ')}
        />
        {errorFor('startDate') && (
          <div className="field__error">{errors.startDate}</div>
        )}
      </div>

      {/* Additional info */}
      <div className="field">
        <label className="field__label" htmlFor="additionalInfo">
          Additional information <span className="field__optional">(optional)</span>
        </label>
        <textarea
          id="additionalInfo"
          value={data.additionalInfo}
          onChange={(e) => handleChange('additionalInfo', e.target.value)}
          placeholder="Anything specific you would like your interviewer to know…"
          rows="3"
          className="field__input field__input--textarea"
        />
        <div className="field__hint">
          Include scholarships, previous attempts, or specific concerns.
        </div>
      </div>

      <div className="sect-actions">
        <button type="button" className="btn-ghost" onClick={onBack}>
          <i className="bx bx-left-arrow-alt" />
          Back
        </button>
        <button type="submit" className="btn-solid">
          Continue to review
          <i className="bx bx-right-arrow-alt" />
        </button>
      </div>
    </form>
  )
}

export default UniversityDetailsSection