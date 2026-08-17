import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Detects when the user tries to navigate away in-app.
 * Returns state you can use to show a confirmation modal.
 */
export function useLeaveConfirmation(isDirty) {
  const location = useLocation()
  const [pendingPath, setPendingPath] = useState(null)

  useEffect(() => {
    if (!isDirty) return

    const handleClick = (e) => {
      // Ignore modifier clicks (open in new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return

      // Only intercept anchor tags, not buttons
      const link = e.target.closest('a[href]')
      if (!link) return

      // Don't intercept if the click is inside a modal (portal)
      // Modals are rendered to body via portal, so we check for the modal class
      if (e.target.closest('.modal, .portal-dropdown, .confirm-modal, .toast')) return

      const href = link.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return

      // Don't intercept target=_blank
      if (link.getAttribute('target') === '_blank') return

      // Don't intercept sign-out related destinations
      if (href === '/login' || href === '/logout') return

      // Same-page navigation? ignore
      if (href === location.pathname) return

      e.preventDefault()
      setPendingPath(href)
    }

    window.document.addEventListener('click', handleClick, true)
    return () => window.document.removeEventListener('click', handleClick, true)
  }, [isDirty, location.pathname])

  const cancelLeave = useCallback(() => setPendingPath(null), [])

  const confirmLeave = useCallback((navigate) => {
    const path = pendingPath
    setPendingPath(null)
    if (path && navigate) navigate(path)
  }, [pendingPath])

  return { pendingPath, cancelLeave, confirmLeave }
}