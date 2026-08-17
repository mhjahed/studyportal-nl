import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import StepPersonal from './steps/StepPersonal'
import StepProfile from './steps/StepProfile'
import StepReview from './steps/StepReview'
import StepSuccess from './steps/StepSuccess'
import UnsavedChangesGuard from '../../components/UnsavedChangesGuard'
import './Register.scss'

const STEPS = [
  { id: 1, label: 'Personal details' },
  { id: 2, label: 'Profile photograph' },
  { id: 3, label: 'Review & submit' },
]

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  passportNumber: '',
  passportExpiry: '',
  profileImageUrl: '',
}

function Register() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedRequestId, setSubmittedRequestId] = useState('')

  // Dirty when user has entered any personal info
  const isDirty =
    !isSubmitted &&
    (Boolean(formData.firstName) ||
      Boolean(formData.lastName) ||
      Boolean(formData.dateOfBirth) ||
      Boolean(formData.passportNumber) ||
      Boolean(formData.passportExpiry))

  const updateForm = useCallback((fields) => {
    setFormData((prev) => ({ ...prev, ...fields }))
  }, [])

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSuccess = useCallback((requestId) => {
    setSubmittedRequestId(requestId)
    setIsSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (isSubmitted) {
    return <StepSuccess requestId={submittedRequestId} formData={formData} />
  }

  return (
    <div className="reg">
      {/* ─── Editorial Photo Column ─────────────────────────────────── */}
      <aside className="reg__editorial">
        <div className="reg__editorial-image">
          <img
            src="https://www.fontys.nl/upload/77abc647-fbb3-440e-80d0-c3514a24324c_Nexus_groot.webp"
            alt="Fontys University of Applied Sciences, Netherlands"
          />
        </div>

        <div className="reg__editorial-overlay">
          {/* Top brand row */}
          <header className="reg__brand-row">
            <div className="reg__brand">
              <div className="reg__brand-flag">
                <span />
                <span />
                <span />
              </div>
              <div className="reg__brand-text">
                <div className="reg__brand-name">Bachelors Portal</div>
                <div className="reg__brand-sub">Netherlands</div>
              </div>
            </div>

            <div className="reg__brand-year">EST · 2024</div>
          </header>

          {/* Editorial content */}
          <div className="reg__editorial-content">
            <div className="reg__kicker">Student registration</div>

            <h1 className="reg__display">
              Your study<br />
              in the Netherlands<br />
              <em>begins here.</em>
            </h1>

            <p className="reg__lede">
              A dedicated preparation platform for international students pursuing a
              Bachelor's degree at a Dutch university.
            </p>
          </div>

          {/* Bottom caption bar */}
          <footer className="reg__editorial-footer">
            <div className="reg__caption">
              <div className="reg__caption-line">Herengracht, Amsterdam</div>
              <div className="reg__caption-sub">Photograph · Prinsengracht canal district</div>
            </div>

            <div className="reg__stat">
              <div className="reg__stat-num">14</div>
              <div className="reg__stat-label">Research<br/>universities</div>
            </div>
          </footer>
        </div>
      </aside>

      {/* ─── Form Column ────────────────────────────────────────────── */}
      <main className="reg__form-col">
        {/* Mobile-only compact brand */}
        <div className="reg__mobile-header">
          <div className="reg__brand">
            <div className="reg__brand-flag">
              <span />
              <span />
              <span />
            </div>
            <div className="reg__brand-text">
              <div className="reg__brand-name">Bachelors Portal Netherlands</div>
              <div className="reg__brand-sub">Student registration</div>
            </div>
          </div>
        </div>

        <div className="reg__form-inner">
          {/* Step meta */}
          <div className="reg__step-meta">
            <div className="reg__step-count">
              Step <strong>{currentStep}</strong> of {STEPS.length}
            </div>
            <div className="reg__step-bar">
              <div
                className="reg__step-bar-fill"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>
            <ol className="reg__step-list">
              {STEPS.map((step) => {
                const isActive = step.id === currentStep
                const isDone = step.id < currentStep
                return (
                  <li
                    key={step.id}
                    className={[
                      'reg__step-item',
                      isActive && 'reg__step-item--active',
                      isDone && 'reg__step-item--done',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span className="reg__step-num">
                      {isDone ? <i className="bx bx-check" /> : `0${step.id}`}
                    </span>
                    <span className="reg__step-label">{step.label}</span>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Section title */}
          <div className="reg__section-head">
            <h2 className="reg__section-title">
              {currentStep === 1 && 'Personal details'}
              {currentStep === 2 && 'Profile photograph'}
              {currentStep === 3 && 'Review & submit'}
            </h2>
            <p className="reg__section-desc">
              {currentStep === 1 &&
                'Provide your details exactly as they appear on your passport. This information will be used for your IND and embassy processes.'}
              {currentStep === 2 &&
                'A profile photograph helps us verify your identity and personalise your portal.'}
              {currentStep === 3 &&
                'Please review your registration carefully. Once submitted, changes must be requested via support.'}
            </p>
          </div>

          {/* Step content */}
          {currentStep === 1 && (
            <StepPersonal
              formData={formData}
              updateForm={updateForm}
              onNext={goNext}
            />
          )}
          {currentStep === 2 && (
            <StepProfile
              formData={formData}
              updateForm={updateForm}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentStep === 3 && (
            <StepReview
              formData={formData}
              onBack={goBack}
              onSuccess={handleSuccess}
            />
          )}

          {/* Footer link */}
          <div className="reg__existing">
            <span>Already registered?</span>
            <Link to="/login">Sign in to the portal →</Link>
          </div>
        </div>
      </main>

      <UnsavedChangesGuard
        isDirty={isDirty}
        message="You have started a registration. If you leave now, all your information will be lost."
      />
    </div>
  )
}

export default Register