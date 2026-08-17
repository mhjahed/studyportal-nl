import React from 'react'
import './SuccessState.scss'

function SuccessState({ title, message, icon = 'bx-check-circle', variant = 'default' }) {
  return (
    <div className={['success-state', `success-state--${variant}`].join(' ')}>
      <div className="success-state__icon">
        <i className={`bx ${icon}`} />
      </div>
      <div className="success-state__body">
        <div className="success-state__title">{title}</div>
        {message && <div className="success-state__message">{message}</div>}
      </div>
    </div>
  )
}

export default SuccessState