import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Renders children into a portal at document.body,
 * positioned relative to an anchor element.
 * Solves all stacking / overflow / positioning issues.
 */
function PortalDropdown({ anchorRef, isOpen, onClose, children, width = 380, align = 'right' }) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !anchorRef.current) return

    const updatePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const isMobile = viewportWidth < 640

      if (isMobile) {
        // Full-width panel on mobile with 12px side margins
        setPosition({
          top: rect.bottom + 12,
          left: 12,
          right: 12,
          width: 'auto',
        })
      } else {
        // Desktop: align to right edge of anchor (or left)
        const dropdownWidth = width
        let left
        if (align === 'right') {
          left = rect.right - dropdownWidth
        } else {
          left = rect.left
        }
        // Clamp within viewport
        left = Math.max(12, Math.min(left, viewportWidth - dropdownWidth - 12))
        setPosition({
          top: rect.bottom + 12,
          left,
          width: dropdownWidth,
        })
      }
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, anchorRef, width, align])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose()
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, anchorRef, onClose])

  if (!isOpen) return null

  const style = {
    position: 'fixed',
    top: `${position.top}px`,
    left: typeof position.left === 'number' ? `${position.left}px` : position.left,
    zIndex: 9999,
  }

  if (position.right !== undefined) {
    style.right = typeof position.right === 'number' ? `${position.right}px` : position.right
  }
  if (position.width !== undefined) {
    style.width = typeof position.width === 'number' ? `${position.width}px` : position.width
  }

  return createPortal(
    <div ref={dropdownRef} style={style} className="portal-dropdown">
      {children}
    </div>,
    document.body
  )
}

export default PortalDropdown