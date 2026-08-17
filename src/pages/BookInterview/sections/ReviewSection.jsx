import React, { useState } from 'react'
import './Sections.scss'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

function formatValue(value, format) {
  if (value === null || value === undefined || value === '') return '—'
  if (format === 'yesno') return value === true ? 'Yes' : value === false ? 'No' : '—'
  if (format === 'date') return formatDate(value)
  if (format === 'money') return `€${Number(value).toLocaleString('en-GB')}`
  return value
}

function ReviewSection({
  type,
  typeLabel,
  personalData,
  personalExtraFields = [],
  extraData,
  extraLabel,
  extraFields,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}) {
  const [confirmed, setConfirmed] = useState(false)
  const [confirmError, setConfirmError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!confirmed) {
      setConfirmError(true)
      return
    }
    setConfirmError(false)
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="book__section-head">
        <h2 className="book__section-title">Review your request</h2>
        <p className="book__section-desc">
          Please review all information carefully before submitting. Our team
          will confirm your interview schedule via notification.
        </p>
      </div>

      {/* Document-style review */}
      <div className="review-doc">
        <div className="review-doc__header">
          <div>
            <div className="review-doc__label">Interview request</div>
            <div className="review-doc__title">{typeLabel}</div>
          </div>
          <div className="review-doc__stamp">
            <span>Pending</span>
            <strong>Review</strong>
          </div>
        </div>

        {/* Personal */}
        <div className="review-doc__section">
          <div className="review-doc__section-label">Personal details</div>
          <dl className="review-doc__grid">
            <div className="review-doc__row">
              <dt>First name</dt>
              <dd>{personalData.firstName}</dd>
            </div>
            <div className="review-doc__row">
              <dt>Last name</dt>
              <dd>{personalData.lastName}</dd>
            </div>
            <div className="review-doc__row">
              <dt>Date of birth</dt>
              <dd>{formatDate(personalData.dateOfBirth)}</dd>
            </div>
            <div className="review-doc__row">
              <dt>Passport number</dt>
              <dd>{personalData.passportNumber}</dd>
            </div>
            <div className="review-doc__row review-doc__row--full">
              <dt>Passport expiry</dt>
              <dd>{formatDate(personalData.passportExpiry)}</dd>
            </div>
            {personalExtraFields.map((f) => (
              <div key={f.key} className="review-doc__row review-doc__row--full">
                <dt>{f.label}</dt>
                <dd>{personalData[f.key] || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Extra */}
        <div className="review-doc__section">
          <div className="review-doc__section-label">{extraLabel}</div>
          <dl className="review-doc__grid">
            {extraFields
              .filter((f) => !f.hide)
              .map((f) => (
                <div key={f.key} className="review-doc__row review-doc__row--full">
                  <dt>{f.label}</dt>
                  <dd>{formatValue(extraData[f.key], f.format)}</dd>
                </div>
              ))}
          </dl>
        </div>

        <div className="review-doc__footer">
          <span>Once submitted, this request cannot be edited.</span>
        </div>
      </div>

      {/* Notice */}
      <div className="review-notice">
        <i className="bx bx-time-five" />
        <div>
          <strong>Processing takes 1–3 business days.</strong>
          <span>You will receive a notification with your interview schedule.</span>
        </div>
      </div>

      {/* Confirm */}
      <label
        className={['review-confirm', confirmError && !confirmed && 'review-confirm--error']
          .filter(Boolean).join(' ')}
      >
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => {
            setConfirmed(e.target.checked)
            if (e.target.checked) setConfirmError(false)
          }}
        />
        <span className="review-confirm__mark">
          {confirmed && <i className="bx bx-check" />}
        </span>
        <span className="review-confirm__text">
          I have reviewed and declare that all information above is correct.
        </span>
      </label>
      {confirmError && !confirmed && (
        <div className="field__error" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
          You must confirm before submitting.
        </div>
      )}

      {error && (
        <div className="review-notice review-notice--danger">
          <i className="bx bx-error-circle" />
          <div><strong>{error}</strong></div>
        </div>
      )}

      {/* Actions */}
      <div className="sect-actions">
        <button
          type="button"
          className="btn-ghost"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <i className="bx bx-left-arrow-alt" />
          Back
        </button>
        <button
          type="submit"
          className="btn-solid"
          disabled={isSubmitting || !confirmed}
        >
          {isSubmitting ? (
            <>
              <div className="bpn-spinner bpn-spinner--white bpn-spinner--sm" />
              Submitting…
            </>
          ) : (
            <>
              Submit request
              <i className="bx bx-right-arrow-alt" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ReviewSection