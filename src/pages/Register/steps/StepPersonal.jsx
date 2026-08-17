import React, { useState } from 'react'
import './Steps.scss'

function validate(data) {
  const errors = {}

  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required.'
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters.'
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.firstName)) {
    errors.firstName = 'First name contains invalid characters.'
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required.'
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.'
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.lastName)) {
    errors.lastName = 'Last name contains invalid characters.'
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required.'
  } else {
    const dob = new Date(data.dateOfBirth)
    const now = new Date()
    const age = (now - dob) / (1000 * 60 * 60 * 24 * 365.25)
    if (dob >= now) errors.dateOfBirth = 'Date of birth cannot be in the future.'
    else if (age < 15) errors.dateOfBirth = 'You must be at least 15 years old to register.'
    else if (age > 60) errors.dateOfBirth = 'Please check your date of birth.'
  }

  if (!data.passportNumber.trim()) {
    errors.passportNumber = 'Passport number is required.'
  } else if (!/^[A-Z0-9]{6,12}$/.test(data.passportNumber.trim().toUpperCase())) {
    errors.passportNumber = 'Enter a valid passport number (6–12 alphanumeric characters).'
  }

  if (!data.passportExpiry) {
    errors.passportExpiry = 'Passport expiry date is required.'
  } else {
    const expiry = new Date(data.passportExpiry)
    const now = new Date()
    const sixMonths = new Date()
    sixMonths.setMonth(sixMonths.getMonth() + 6)
    if (expiry <= now) errors.passportExpiry = 'Your passport has expired. A valid passport is required.'
    else if (expiry < sixMonths) errors.passportExpiry = 'Your passport must be valid for at least 6 months.'
  }

  return errors
}

function StepPersonal({ formData, updateForm, onNext }) {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    updateForm({ [name]: value })
    if (touched[name]) {
      const newErrors = validate({ ...formData, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const newErrors = validate(formData)
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      passportNumber: true,
      passportExpiry: true,
    })
    const validationErrors = validate(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) onNext()
  }

  const field = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
    className: [
      'field__input',
      errors[name] && touched[name] ? 'field__input--error' : '',
    ]
      .filter(Boolean)
      .join(' '),
  })

  const maxDOB = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 15)
    return d.toISOString().split('T')[0]
  })()

  const minExpiry = (() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 6)
    return d.toISOString().split('T')[0]
  })()

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Two-column: name */}
      <div className="fields-grid fields-grid--2">
        <div className="field">
          <label className="field__label" htmlFor="firstName">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="As on passport"
            autoComplete="given-name"
            {...field('firstName')}
          />
          {touched.firstName && errors.firstName && (
            <div className="field__error">{errors.firstName && (
            <div className="field__error" role="alert">
              {errors.firstName}
            </div>
          )}
          </div>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="lastName">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="As on passport"
            autoComplete="family-name"
            {...field('lastName')}
          />
          {touched.lastName && errors.lastName && (
            <div className="field__error">{errors.lastName}</div>
          )}
        </div>
      </div>

      {/* DOB */}
      <div className="field">
        <label className="field__label" htmlFor="dateOfBirth">
          Date of birth
        </label>
        <input
          id="dateOfBirth"
          type="date"
          max={maxDOB}
          autoComplete="bday"
          {...field('dateOfBirth')}
        />
        <div className="field__hint">Must match your passport date of birth.</div>
        {touched.dateOfBirth && errors.dateOfBirth && (
          <div className="field__error">{errors.dateOfBirth}</div>
        )}
      </div>

      {/* Passport */}
      <div className="fields-grid fields-grid--2">
        <div className="field">
          <label className="field__label" htmlFor="passportNumber">
            Passport number
          </label>
          <input
            id="passportNumber"
            type="text"
            placeholder="e.g. PK1234567"
            autoComplete="off"
            {...field('passportNumber')}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase()
              handleChange(e)
            }}
          />
          {touched.passportNumber && errors.passportNumber && (
            <div className="field__error">{errors.passportNumber}</div>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="passportExpiry">
            Passport expiry
          </label>
          <input
            id="passportExpiry"
            type="date"
            min={minExpiry}
            {...field('passportExpiry')}
          />
          {touched.passportExpiry && errors.passportExpiry && (
            <div className="field__error">{errors.passportExpiry}</div>
          )}
        </div>
      </div>

      <div className="field__hint field__hint--block">
        Your passport must remain valid for at least six months beyond your intended
        arrival in the Netherlands.
      </div>

      {/* Actions */}
      <div className="form-actions">
        <div className="form-actions__note">
          All fields required
        </div>
        <button type="submit" className="btn-solid">
          Continue
          <i className="bx bx-right-arrow-alt" />
        </button>
      </div>
    </form>
  )
}

export default StepPersonal