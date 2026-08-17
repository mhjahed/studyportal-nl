import React from 'react'
import './Sections.scss'

function formatDateDisplay(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

function PersonalDetailsSection({
  data,
  onChange,
  onNext,
  onBack,
  fromUserProfile,
  showAcademic,
  backLabel,
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="book__section-head">
        <h2 className="book__section-title">Personal details</h2>
        <p className="book__section-desc">
          The information below is taken from your registered profile. Identity
          fields cannot be edited here — contact support if changes are needed.
        </p>
      </div>

      {fromUserProfile && (
        <div className="book__locked-notice">
          <i className="bx bx-lock-alt" />
          <span>
            Identity information is locked. Contact support to request changes.
          </span>
        </div>
      )}

      {/* Locked identity fields (display only) */}
      <div className="sect-locked">
        <div className="sect-locked__grid">
          <div className="sect-locked__field">
            <div className="sect-locked__label">First name</div>
            <div className="sect-locked__value">{data.firstName}</div>
          </div>
          <div className="sect-locked__field">
            <div className="sect-locked__label">Last name</div>
            <div className="sect-locked__value">{data.lastName}</div>
          </div>
          <div className="sect-locked__field">
            <div className="sect-locked__label">Date of birth</div>
            <div className="sect-locked__value">{formatDateDisplay(data.dateOfBirth)}</div>
          </div>
          <div className="sect-locked__field">
            <div className="sect-locked__label">Passport number</div>
            <div className="sect-locked__value">{data.passportNumber}</div>
          </div>
          <div className="sect-locked__field sect-locked__field--full">
            <div className="sect-locked__label">Passport expiry</div>
            <div className="sect-locked__value">{formatDateDisplay(data.passportExpiry)}</div>
          </div>
        </div>
      </div>

      {/* Academic (IND/Embassy show this) */}
      {showAcademic && (
        <>
          <div className="sect-divider">
            <span>Academic information</span>
          </div>

          <div className="sect-locked">
            <div className="sect-locked__grid">
              <div className="sect-locked__field sect-locked__field--full">
                <div className="sect-locked__label">University</div>
                <div className="sect-locked__value">{data.university || '—'}</div>
              </div>
              <div className="sect-locked__field sect-locked__field--full">
                <div className="sect-locked__label">Course</div>
                <div className="sect-locked__value">{data.course || '—'}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="sect-actions">
        <button type="button" className="btn-ghost" onClick={onBack}>
          <i className="bx bx-left-arrow-alt" />
          {backLabel || 'Back'}
        </button>
        <button type="submit" className="btn-solid">
          Confirm & continue
          <i className="bx bx-right-arrow-alt" />
        </button>
      </div>
    </form>
  )
}

export default PersonalDetailsSection