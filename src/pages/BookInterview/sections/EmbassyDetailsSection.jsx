import React, { useState } from 'react'
import YesNoField from '../components/YesNoField'
import './Sections.scss'

function EmbassyDetailsSection({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({})

  const validate = (d) => {
    const errs = {}
    if (d.hasEmbassyDate === null) errs.hasEmbassyDate = 'Please answer this question.'
    if (d.hasEmbassyDate === true && !d.embassyDate) errs.embassyDate = 'Please provide the embassy date.'
    if (d.hasEmbassyDate === true && !d.embassyLocation?.trim()) errs.embassyLocation = 'Please provide the embassy location.'
    return errs
  }

  const handleUpdate = (patch) => {
    onChange({ ...data, ...patch })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate(data)
    setErrors(v)
    if (Object.keys(v).length === 0) onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="book__section-head">
        <h2 className="book__section-title">Embassy interview details</h2>
        <p className="book__section-desc">
          Provide details about your Dutch embassy or consulate appointment if
          one has been scheduled.
        </p>
      </div>

      {/* Q1 */}
      <div className="question">
        <div className="question__num">01</div>
        <div className="question__body">
          <div className="question__label">
            Do you have an embassy passport submission date?
          </div>
          <div className="question__hint">
            The confirmed date for your MVV appointment at the Dutch embassy or consulate.
          </div>
          <YesNoField
            value={data.hasEmbassyDate}
            onChange={(v) =>
              handleUpdate({
                hasEmbassyDate: v,
                embassyDate: v ? data.embassyDate : '',
                embassyLocation: v ? data.embassyLocation : '',
              })
            }
          />
          {errors.hasEmbassyDate && (
            <div className="field__error">{errors.hasEmbassyDate}</div>
          )}

          {data.hasEmbassyDate === true && (
            <>
              <div className="question__conditional">
                <label className="field__label" htmlFor="embassyDate">Appointment date</label>
                <input
                  id="embassyDate"
                  type="date"
                  value={data.embassyDate}
                  onChange={(e) => handleUpdate({ embassyDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={['field__input', errors.embassyDate && 'field__input--error']
                    .filter(Boolean).join(' ')}
                />
                {errors.embassyDate && (
                  <div className="field__error">{errors.embassyDate}</div>
                )}
              </div>

              <div className="question__conditional">
                <label className="field__label" htmlFor="embassyLocation">
                  Embassy or consulate location
                </label>
                <input
                  id="embassyLocation"
                  type="text"
                  value={data.embassyLocation}
                  onChange={(e) => handleUpdate({ embassyLocation: e.target.value })}
                  placeholder="e.g. Dutch Embassy, Islamabad"
                  className={['field__input', errors.embassyLocation && 'field__input--error']
                    .filter(Boolean).join(' ')}
                />
                {errors.embassyLocation && (
                  <div className="field__error">{errors.embassyLocation}</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Q2 - Additional info */}
      <div className="question">
        <div className="question__num">02</div>
        <div className="question__body">
          <div className="question__label">
            Additional information <span className="field__optional">(optional)</span>
          </div>
          <div className="question__hint">
            Anything else our team should know about your embassy interview.
          </div>
          <textarea
            value={data.additionalInfo}
            onChange={(e) => handleUpdate({ additionalInfo: e.target.value })}
            placeholder="e.g. specific concerns, previous rejections, missing documents…"
            rows="3"
            className="field__input field__input--textarea"
          />
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

export default EmbassyDetailsSection