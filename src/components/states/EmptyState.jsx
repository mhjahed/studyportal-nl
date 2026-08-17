import React from 'react'
import { Link } from 'react-router-dom'
import './EmptyState.scss'

function EmptyState({
  icon = 'bx-inbox',
  eyebrow,
  title,
  message,
  action,
  actionTo,
  actionOnClick,
  secondaryAction,
  secondaryActionTo,
  variant = 'default',
}) {
  const CTA = () => {
    if (!action) return null

    if (actionTo) {
      return (
        <Link to={actionTo} className="btn-solid">
          {action}
          <i className="bx bx-right-arrow-alt" />
        </Link>
      )
    }

    return (
      <button type="button" onClick={actionOnClick} className="btn-solid">
        {action}
        <i className="bx bx-right-arrow-alt" />
      </button>
    )
  }

  return (
    <div className={['empty', variant !== 'default' && `empty--${variant}`]
      .filter(Boolean).join(' ')}>
      <div className="empty__icon">
        <i className={`bx ${icon}`} />
      </div>

      {eyebrow && <div className="empty__eyebrow">{eyebrow}</div>}
      <h3 className="empty__title">{title}</h3>
      {message && <p className="empty__message">{message}</p>}

      {(action || secondaryAction) && (
        <div className="empty__actions">
          <CTA />
          {secondaryAction && secondaryActionTo && (
            <Link to={secondaryActionTo} className="btn-ghost">
              {secondaryAction}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default EmptyState