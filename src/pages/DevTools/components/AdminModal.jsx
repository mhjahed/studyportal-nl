import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function AdminModal({ title, children, onClose, size = 'default', footer }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const originalOverflow = window.document.body.style.overflow
    window.document.body.style.overflow = 'hidden'

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.document.addEventListener('keydown', handleKey)

    if (panelRef.current) {
      const focusable = panelRef.current.querySelector('input, select, textarea, button')
      if (focusable) focusable.focus()
    }

    return () => {
      window.document.body.style.overflow = originalOverflow
      window.document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const maxWidth = {
    compact: '440px',
    default: '560px',
    large: '760px',
    xlarge: '900px',
  }[size]

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '3rem 1.5rem 1.5rem',
        background: 'rgba(10, 20, 40, 0.6)',
        overflowY: 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        style={{
          background: '#ffffff',
          border: '1px solid #d8d4c8',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth,
          animation: 'am-in 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <style>{`
          @keyframes am-in {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #ececec',
          background: '#0a1428',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.125rem',
            fontWeight: 400,
            margin: 0,
            color: '#ffffff',
          }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              padding: 4,
              fontSize: '1.5rem',
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {children}
        </div>

        {footer && (
          <div style={{
            padding: '14px 24px',
            borderTop: '1px solid #ececec',
            background: '#faf8f3',
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    window.document.body
  )
}

export default AdminModal