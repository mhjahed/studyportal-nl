import React from 'react'
import './YesNoField.scss'

function YesNoField({ value, onChange }) {
  return (
    <div className="yesno">
      <button
        type="button"
        className={['yesno__option', value === true && 'yesno__option--active-yes']
          .filter(Boolean).join(' ')}
        onClick={() => onChange(true)}
      >
        <span className="yesno__mark">
          {value === true && <i className="bx bx-check" />}
        </span>
        <span>Yes</span>
      </button>
      <button
        type="button"
        className={['yesno__option', value === false && 'yesno__option--active-no']
          .filter(Boolean).join(' ')}
        onClick={() => onChange(false)}
      >
        <span className="yesno__mark">
          {value === false && <i className="bx bx-x" />}
        </span>
        <span>No</span>
      </button>
    </div>
  )
}

export default YesNoField