import React from 'react'
import './ToggleRow.scss'

function ToggleRow({ icon, title, description, checked, onChange, disabled }) {
  return (
    <label
      className={[
        'toggle-row',
        checked && 'toggle-row--on',
        disabled && 'toggle-row--disabled',
      ].filter(Boolean).join(' ')}
    >
      {icon && (
        <div className="toggle-row__icon">
          <i className={`bx ${icon}`} />
        </div>
      )}
      <div className="toggle-row__body">
        <div className="toggle-row__title">{title}</div>
        {description && (
          <div className="toggle-row__desc">{description}</div>
        )}
      </div>
      <div className="toggle-row__switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle-row__track">
          <span className="toggle-row__thumb" />
        </span>
      </div>
    </label>
  )
}

export default ToggleRow