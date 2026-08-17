import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { storageService } from '../services/storageService'

function SessionMonitor() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) return

    // Check session validity every 60 seconds
    const checkInterval = setInterval(() => {
      if (!storageService.isSessionValid()) {
        logout()
        navigate('/login', {
          state: {
            from: location,
            reason: 'session_expired',
          },
          replace: true,
        })
      }
    }, 60000)

    return () => clearInterval(checkInterval)
  }, [isAuthenticated, logout, navigate, location])

  // Listen for cross-tab session changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === storageService.KEYS.SESSION && !e.newValue && isAuthenticated) {
        // Session was cleared in another tab
        logout()
        navigate('/login', { replace: true })
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [isAuthenticated, logout, navigate])

  return null
}

export default SessionMonitor