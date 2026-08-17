import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Modal.scss'

function Modal({
  isOpen,
  onClose,
  children,
  size = 'default',        // 'compact' | 'default' | 'large'
  closeOnBackdrop = true,
  closeOnEscape = true,
  ariaLabel,
}) {
  const panelRef = useRef(null)

  // Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.document.addEventListener('keydown', handleKey)
    return () => window.document.removeEventListener('keydown', handleKey)
  }, [isOpen, closeOnEscape, onClose])

  // Body scroll lock + focus management
  useEffect(() => {
    if (!isOpen) return

    const previousActive = window.document.activeElement
    const originalOverflow = window.document.body.style.overflow
    window.document.body.style.overflow = 'hidden'

    // Focus the panel on open
    if (panelRef.current) {
      const focusable = panelRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable) {
        focusable.focus()
      } else {
        panelRef.current.focus()
      }
    }

    return () => {
      window.document.body.style.overflow = originalOverflow
      // Restore focus to trigger element
      if (previousActive && typeof previousActive.focus === 'function') {
        previousActive.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdrop = () => {
    if (closeOnBackdrop) onClose()
  }

  return createPortal(
    <div className="modal" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <div className="modal__backdrop" onClick={handleBackdrop} />
      <div
        ref={panelRef}
        className={['modal__panel', `modal__panel--${size}`].join(' ')}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    window.document.body
  )
}

export default Modal