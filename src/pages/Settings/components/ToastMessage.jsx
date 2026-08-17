import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './ToastMessage.scss'

function ToastMessage({ message, type = 'success', onDismiss, duration = 3000 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10)
    const hideTimer = setTimeout(() => setVisible(false), duration - 300)
    const dismissTimer = setTimeout(() => onDismiss(), duration)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      clearTimeout(dismissTimer)
    }
  }, [duration, onDismiss])

  const iconMap = {
    success: 'bx-check-circle',
    error: 'bx-error-circle',
    info: 'bx-info-circle',
  }

  return createPortal(
    <div
      className={[
        'toast',
        `toast--${type}`,
        visible && 'toast--visible',
      ].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
    >
      <div className="toast__icon">
        <i className={`bx ${iconMap[type]}`} />
      </div>
      <div className="toast__message">{message}</div>
    </div>,
    window.document.body
  )
}

export default ToastMessage