import React from 'react'
import './WizardShell.scss'

function WizardShell({
  steps,
  currentStep,
  eyebrow,
  title,
  subtitle,
  onBackToSelection,
  children,
}) {
  const percent = (currentStep / steps.length) * 100

  return (
    <div className="wizard">
      <button
        type="button"
        className="book__back-link"
        onClick={onBackToSelection}
      >
        <i className="bx bx-left-arrow-alt" />
        Back to interview selection
      </button>

      <div className="book__wiz-header">
        <div className="book__wiz-eyebrow">{eyebrow}</div>
        <h1 className="book__wiz-title" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="book__wiz-subtitle">{subtitle}</p>
      </div>

      <div className="book__progress">
        <div className="book__progress-count">
          Step <strong>{currentStep}</strong> of {steps.length}
        </div>
        <div className="book__progress-bar">
          <div className="book__progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <ol className="book__progress-list">
          {steps.map((step) => {
            const done = step.id < currentStep
            const active = step.id === currentStep
            return (
              <li
                key={step.id}
                className={[
                  'book__progress-item',
                  active && 'book__progress-item--active',
                  done && 'book__progress-item--done',
                ].filter(Boolean).join(' ')}
              >
                <span className="book__progress-item-num">
                  {done ? <i className="bx bx-check" /> : `0${step.id}`}
                </span>
                <span className="book__progress-item-label">{step.label}</span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="wizard__content">
        {children}
      </div>
    </div>
  )
}

export default WizardShell