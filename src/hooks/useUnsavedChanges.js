import { useEffect } from 'react'

/**
 * Prevents navigation / tab close when a form has unsaved changes.
 * Attaches to window.beforeunload for browser-level warning.
 */
export function useUnsavedChanges(isDirty, message = 'You have unsaved changes. Are you sure you want to leave?') {
  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (e) => {
      // Don't block if the app is actively signing out
      if (window.__bpn_signing_out) return

      e.preventDefault()
      e.returnValue = message
      return message
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, message])
}