import { useEffect } from 'react'
import { emailService } from '../services/emailService'

/**
 * Attempts to flush the pending email queue when the app
 * regains connectivity, and once on initial mount.
 */
export function useEmailQueue() {
  useEffect(() => {
    if (!emailService.isConfigured()) return

    const queue = emailService.getQueue()
    if (queue.length > 0) {
      // Small delay so UI mounts first
      const t = setTimeout(() => {
        emailService.retryQueue().then((result) => {
          if (result.sent > 0) {
            console.info(`[EmailJS] Flushed ${result.sent} queued email(s).`)
          }
        })
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      if (!emailService.isConfigured()) return
      emailService.retryQueue().then((result) => {
        if (result.sent > 0) {
          console.info(`[EmailJS] Flushed ${result.sent} queued email(s) after reconnect.`)
        }
      })
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])
}