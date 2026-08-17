import React from 'react'
import './RegisterProgress.scss'

function RegisterProgress({ steps, currentStep }) {
  return (
    <div className="reg-progress">
      {steps.map((step, index) => {
        const isComplete = currentStep > step.id
        const isActive = currentStep === step.id

        return (
          <React.Fragment key={step.id}>
            <div className="reg-progress__step">
              <div
                className={[
                  'reg-progress__indicator',
                  isComplete ? 'reg-progress__indicator--complete' : '',
                  isActive ? 'reg-progress__indicator--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {isComplete ? (
                  <i className="bx bx-check" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span
                className={[
                  'reg-progress__label',
                  isActive ? 'reg-progress__label--active' : '',
                  isComplete ? 'reg-progress__label--complete' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={[
                  'reg-progress__line',
                  isComplete ? 'reg-progress__line--complete' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default RegisterProgress