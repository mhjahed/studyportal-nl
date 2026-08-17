import React, { useState, useRef } from 'react'
import { dataService } from '../../../services/dataService'
import { emailService } from '../../../services/emailService'
import './Steps.scss'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function StepReview({ formData, onBack, onSuccess }) {
  const [confirmed, setConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const isSubmittingRef = useRef(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!confirmed) {
      setError('Please confirm the information is correct before submitting.')
      return
    }
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError('')

    try {
      if (dataService.isPassportAlreadyRegistered(formData.passportNumber)) {
        setError('A registration request for this passport already exists. Please contact support.')
        setIsSubmitting(false)
        isSubmittingRef.current = false
        return
      }

      const requestId = dataService.generateRequestId('registration')
      const submittedAt = new Date().toISOString()

      const requestData = {
        id: `reg_${Date.now()}`,
        requestId,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth,
        passportNumber: formData.passportNumber.trim().toUpperCase(),
        passportExpiry: formData.passportExpiry,
        profileImageUrl: formData.profileImageUrl,
        status: 'pending',
        submittedAt,
      }

    dataService.addRegistrationRequest(requestData)

    // Send email — never throws, returns result
    const emailResult = await emailService.sendRegistrationRequest(requestData)

    if (!emailResult.success && !emailResult.queued) {
      console.warn('Email delivery failed but request was saved:', emailResult)
    }

    // Success either way — data is saved and queued if email failed
    onSuccess(requestId)
    } catch (err) {
      console.error('Registration error:', err)
      setError('Something went wrong. Your information has been saved locally. Please try again.')
      setIsSubmitting(false)
      isSubmittingRef.current = false
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Document-style review */}
      <div className="doc">
        <div className="doc__header">
          <div>
            <div className="doc__label">Registration document</div>
            <div className="doc__title">Application summary</div>
          </div>
          <button type="button" className="doc__edit" onClick={onBack}>
            <i className="bx bx-pencil" />
            Edit
          </button>
        </div>

        {/* Applicant */}
        <div className="doc__applicant">
          {formData.profileImageUrl ? (
            <img
              src={formData.profileImageUrl}
              alt={`${formData.firstName} ${formData.lastName}`}
              className="doc__portrait"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="doc__portrait doc__portrait--placeholder">
              <i className="bx bx-user" />
            </div>
          )}

          <div className="doc__applicant-info">
            <div className="doc__applicant-name">
              {formData.firstName} {formData.lastName}
            </div>
            <div className="doc__applicant-sub">Prospective Bachelor's student</div>
          </div>
        </div>

        {/* Detail rows */}
        <dl className="doc__grid">
          <div className="doc__row">
            <dt>First name</dt>
            <dd>{formData.firstName || '—'}</dd>
          </div>
          <div className="doc__row">
            <dt>Last name</dt>
            <dd>{formData.lastName || '—'}</dd>
          </div>
          <div className="doc__row">
            <dt>Date of birth</dt>
            <dd>{formatDate(formData.dateOfBirth)}</dd>
          </div>
          <div className="doc__row">
            <dt>Passport number</dt>
            <dd className="doc__mono">{formData.passportNumber?.toUpperCase() || '—'}</dd>
          </div>
          <div className="doc__row">
            <dt>Passport expiry</dt>
            <dd>{formatDate(formData.passportExpiry)}</dd>
          </div>
        </dl>

        <div className="doc__footer">
          <div className="doc__footer-item">
            <span>Submission timestamp</span>
            <strong>Generated on submit</strong>
          </div>
          <div className="doc__footer-item">
            <span>Request status</span>
            <strong className="doc__pending">Pending review</strong>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="notice">
        <i className="bx bx-time-five" />
        <div>
          <strong>Processing takes 1–3 business days.</strong>
          <span>Your login credentials will be sent to the email address on record.</span>
        </div>
      </div>

      {/* Confirm */}
      <label
        className={[
          'confirm',
          submitAttempted && !confirmed ? 'confirm--error' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => {
            setConfirmed(e.target.checked)
            if (e.target.checked) setError('')
          }}
        />
        <span className="confirm__mark">
          {confirmed && <i className="bx bx-check" />}
        </span>
        <span className="confirm__text">
          I have reviewed the above information and declare that all details are
          accurate and match my passport.
        </span>
      </label>

      {error && (
        <div className="notice notice--danger">
          <i className="bx bx-error-circle" />
          <div><strong>{error}</strong></div>
        </div>
      )}

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onBack} disabled={isSubmitting}>
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
              Submit registration
              <i className="bx bx-right-arrow-alt" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default StepReview