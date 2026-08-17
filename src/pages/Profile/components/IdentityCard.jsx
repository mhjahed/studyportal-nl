import React from 'react'
import './IdentityCard.scss'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

function computeAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function passportExpiryStatus(expiryStr) {
  if (!expiryStr) return null
  const expiry = new Date(expiryStr)
  const now = new Date()
  const monthsUntil = (expiry - now) / (1000 * 60 * 60 * 24 * 30.44)
  if (monthsUntil <= 0) return { label: 'Expired', color: '#ae1c28', bg: 'rgba(174, 28, 40, 0.08)' }
  if (monthsUntil < 6) return { label: 'Expires soon', color: '#e8820c', bg: 'rgba(232, 130, 12, 0.1)' }
  return { label: 'Valid', color: '#1d7a47', bg: 'rgba(29, 122, 71, 0.1)' }
}

function IdentityCard({ user }) {
  const age = computeAge(user.dateOfBirth)
  const expiryStatus = passportExpiryStatus(user.passportExpiry)

  const fields = [
    { label: 'First name', value: user.firstName },
    { label: 'Last name', value: user.lastName },
    {
      label: 'Date of birth',
      value: formatDate(user.dateOfBirth),
      hint: age ? `${age} years old` : null,
    },
    { label: 'Passport number', value: user.passportNumber, mono: true },
    {
      label: 'Passport expiry',
      value: formatDate(user.passportExpiry),
      pill: expiryStatus,
    },
    { label: 'ISO Code', value: user.isoCode, mono: true },
  ]

  return (
    <section className="id-card">
      <header className="id-card__header">
        <div>
          <div className="id-card__eyebrow">Section 1</div>
          <h2 className="id-card__title">Identity information</h2>
        </div>
        <div className="id-card__lock-badge">
          <i className="bx bx-lock-alt" />
          <span>Locked</span>
        </div>
      </header>

      <div className="id-card__grid">
        {fields.map((field) => (
          <div key={field.label} className="id-field">
            <div className="id-field__label">{field.label}</div>
            <div className={['id-field__value', field.mono && 'id-field__value--mono']
              .filter(Boolean).join(' ')}>
              {field.value || '—'}
            </div>
            {field.hint && (
              <div className="id-field__hint">{field.hint}</div>
            )}
            {field.pill && (
              <div
                className="id-field__pill"
                style={{ color: field.pill.color, background: field.pill.bg }}
              >
                <i className={field.pill.label === 'Valid' ? 'bx bx-check-circle' :
                  field.pill.label === 'Expires soon' ? 'bx bx-time' : 'bx bx-error-circle'} />
                {field.pill.label}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact support notice */}
      <div className="id-card__notice">
        <div className="id-card__notice-icon">
          <i className="bx bx-info-circle" />
        </div>
        <div className="id-card__notice-body">
          <div className="id-card__notice-title">
            To change any of this information, contact support
          </div>
          <p className="id-card__notice-text">
            Identity information is used for your IND and embassy applications
            and must match your passport exactly. If any detail is incorrect,
            please contact us with your ISO Code so we can verify and update
            your record.
          </p>
          <a
            href="mailto:infogicuofficial@gmail.com?subject=Identity%20update%20request"
            className="id-card__notice-cta"
          >
            <i className="bx bx-envelope" />
            <span>infogicuofficial@gmail.com</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default IdentityCard