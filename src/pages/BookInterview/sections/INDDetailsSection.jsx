import React, { useState } from 'react'
import YesNoField from '../components/YesNoField'
import './Sections.scss'

function INDDetailsSection({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({})

  const validate = (d) => {
    const errs = {}
    if (d.hasOfferOfPlace === null) errs.hasOfferOfPlace = 'Please answer this question.'
    if (d.paidTuition === null) errs.paidTuition = 'Please answer this question.'
    if (d.paidTuition === true && !d.tuitionAmount) errs.tuitionAmount = 'Please provide the tuition amount.'
    if (d.paidBlockMoney === null) errs.paidBlockMoney = 'Please answer this question.'
    if (d.paidBlockMoney === true && !d.blockMoneyAmount) errs.blockMoneyAmount = 'Please provide the block money amount.'
    if (d.hasINDDate === null) errs.hasINDDate = 'Please answer this question.'
    if (d.hasINDDate === true && !d.indDate) errs.indDate = 'Please provide the IND interview date.'
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
        <h2 className="book__section-title">IND application details</h2>
        <p className="book__section-desc">
          Tell us about your current IND application status so we can tailor the
          practice session to your situation.
        </p>
      </div>

      {/* Q1 */}
      <div className="question">
        <div className="question__num">01</div>
        <div className="question__body">
          <div className="question__label">Do you have an offer of place?</div>
          <div className="question__hint">
            A conditional or unconditional offer from your Dutch university.
          </div>
          <YesNoField
            value={data.hasOfferOfPlace}
            onChange={(v) => handleUpdate({ hasOfferOfPlace: v })}
          />
          {errors.hasOfferOfPlace && (
            <div className="field__error">{errors.hasOfferOfPlace}</div>
          )}
        </div>
      </div>

      {/* Q2 */}
      <div className="question">
        <div className="question__num">02</div>
        <div className="question__body">
          <div className="question__label">Did you pay your tuition fees?</div>
          <YesNoField
            value={data.paidTuition}
            onChange={(v) => handleUpdate({ paidTuition: v, tuitionAmount: v ? data.tuitionAmount : '' })}
          />
          {errors.paidTuition && (
            <div className="field__error">{errors.paidTuition}</div>
          )}

          {data.paidTuition === true && (
            <div className="question__conditional">
              <label className="field__label" htmlFor="tuitionAmount">Amount paid (€)</label>
              <input
                id="tuitionAmount"
                type="number"
                min="0"
                step="100"
                value={data.tuitionAmount}
                onChange={(e) => handleUpdate({ tuitionAmount: e.target.value })}
                placeholder="e.g. 14000"
                className={['field__input', errors.tuitionAmount && 'field__input--error']
                  .filter(Boolean).join(' ')}
              />
              {errors.tuitionAmount && (
                <div className="field__error">{errors.tuitionAmount}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Q3 */}
      <div className="question">
        <div className="question__num">03</div>
        <div className="question__body">
          <div className="question__label">Did you pay your block money?</div>
          <div className="question__hint">
            The minimum required deposit for your first year of study (currently ~€2,700 per year).
          </div>
          <YesNoField
            value={data.paidBlockMoney}
            onChange={(v) => handleUpdate({ paidBlockMoney: v, blockMoneyAmount: v ? data.blockMoneyAmount : '' })}
          />
          {errors.paidBlockMoney && (
            <div className="field__error">{errors.paidBlockMoney}</div>
          )}

          {data.paidBlockMoney === true && (
            <div className="question__conditional">
              <label className="field__label" htmlFor="blockMoneyAmount">Amount paid (€)</label>
              <input
                id="blockMoneyAmount"
                type="number"
                min="0"
                step="100"
                value={data.blockMoneyAmount}
                onChange={(e) => handleUpdate({ blockMoneyAmount: e.target.value })}
                placeholder="e.g. 12000"
                className={['field__input', errors.blockMoneyAmount && 'field__input--error']
                  .filter(Boolean).join(' ')}
              />
              {errors.blockMoneyAmount && (
                <div className="field__error">{errors.blockMoneyAmount}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Q4 */}
      <div className="question">
        <div className="question__num">04</div>
        <div className="question__body">
          <div className="question__label">
            Have you been scheduled for an IND interview?
          </div>
          <YesNoField
            value={data.hasINDDate}
            onChange={(v) => handleUpdate({ hasINDDate: v, indDate: v ? data.indDate : '' })}
          />
          {errors.hasINDDate && (
            <div className="field__error">{errors.hasINDDate}</div>
          )}

          {data.hasINDDate === true && (
            <div className="question__conditional">
              <label className="field__label" htmlFor="indDate">Interview date</label>
              <input
                id="indDate"
                type="date"
                value={data.indDate}
                onChange={(e) => handleUpdate({ indDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className={['field__input', errors.indDate && 'field__input--error']
                  .filter(Boolean).join(' ')}
              />
              {errors.indDate && (
                <div className="field__error">{errors.indDate}</div>
              )}
            </div>
          )}
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

export default INDDetailsSection