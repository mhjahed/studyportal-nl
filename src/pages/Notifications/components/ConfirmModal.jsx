import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'info',
  icon,
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null)

  useEffect(() => {
    // Focus confirm button on mount
    if (confirmBtnRef.current) {
      confirmBtnRef.current.focus()
    }

    // Lock body scroll
    const originalOverflow = window.document.body.style.overflow
    window.document.body.style.overflow = 'hidden'

    // Escape handler
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    window.document.addEventListener('keydown', handleKey)

    return () => {
      window.document.body.style.overflow = originalOverflow
      window.document.removeEventListener('keydown', handleKey)
    }
  }, [onCancel])

  const iconMap = {
    info: icon || 'bx-help-circle',
    warning: icon || 'bx-error-circle',
    danger: icon || 'bx-error',
  }

  const iconColor = {
    info: '#1a3a6b',
    warning: '#e8820c',
    danger: '#ae1c28',
  }

  const iconBg = {
    info: 'rgba(26, 58, 107, 0.08)',
    warning: 'rgba(232, 130, 12, 0.1)',
    danger: 'rgba(174, 28, 40, 0.08)',
  }

  const confirmBg = variant === 'danger' ? '#ae1c28' : '#1a3a6b'
  const confirmHoverBg = variant === 'danger' ? '#8a1620' : '#0f2444'

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  // CRITICAL: use onMouseDown instead of onClick to fire before any focus/blur events
  const handleConfirm = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('[ConfirmModal] Confirm clicked')
    onConfirm()
  }

  const handleCancel = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onCancel()
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(10, 20, 40, 0.55)',
        animation: 'cm-fade 200ms ease',
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes cm-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cm-slide {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .cm-confirm-btn:hover:not(:disabled) {
          background: ${confirmHoverBg} !important;
        }
      `}</style>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #d8d4c8',
          boxShadow: '0 20px 60px rgba(10, 20, 40, 0.2)',
          width: '100%',
          maxWidth: '480px',
          maxHeight: 'calc(100vh - 3rem)',
          overflowY: 'auto',
          animation: 'cm-slide 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '2rem 2rem 1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 1.25rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: iconBg[variant],
            }}
          >
            <i
              className={`bx ${iconMap[variant]}`}
              style={{ fontSize: '1.75rem', color: iconColor[variant] }}
            />
          </div>

          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.5rem',
              fontWeight: 400,
              color: '#1a1a2e',
              letterSpacing: '-0.005em',
              lineHeight: 1.25,
              margin: '0 0 0.75rem 0',
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: '0.9375rem',
              color: '#6a6a6a',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {message}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            padding: '1.25rem 2rem',
            borderTop: '1px solid #ececec',
            background: '#faf8f3',
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '10px 18px',
              background: 'transparent',
              border: '1px solid #d8d4c8',
              color: '#4a4a4a',
              fontFamily: 'Poppins, Arial, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              minWidth: '100px',
            }}
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmBtnRef}
            type="button"
            className="cm-confirm-btn"
            onClick={handleConfirm}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 18px',
              background: confirmBg,
              color: '#ffffff',
              border: 'none',
              fontFamily: 'Poppins, Arial, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: '100px',
              transition: 'background 180ms ease',
            }}
          >
            <i className="bx bx-check" style={{ fontSize: '1.125rem' }} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    window.document.body
  )
}

export default ConfirmModal