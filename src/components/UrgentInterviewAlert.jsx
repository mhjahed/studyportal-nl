import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dataService } from '../services/dataService'
import Modal from './Modal/Modal'

const STORAGE_KEY = 'bpn_urgent_alert_shown'

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function UrgentInterviewAlert() {
  const { currentUser, isAuthenticated } = useAuth()
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return

    // Only show once per user per day
    const today = new Date().toISOString().split('T')[0]
    const shown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const userShownDate = shown[currentUser.id]

    if (userShownDate === today) return

    // Find imminent interview
    const upcoming = dataService.getUpcomingInterviews(currentUser.id)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const imminent = upcoming.find((i) => {
      const dt = new Date(`${i.date}T${i.time}:00`)
      return isSameDay(dt, now) || isSameDay(dt, tomorrow)
    })

    if (!imminent) return

    const dt = new Date(`${imminent.date}T${imminent.time}:00`)
    const isToday = isSameDay(dt, now)

    // Delay so it doesn't pop instantly on load
    const timer = setTimeout(() => {
      setAlert({
        interview: imminent,
        isToday,
        time: dt.toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit',
        }),
      })

      // Mark as shown
      shown[currentUser.id] = today
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shown))
    }, 1500)

    return () => clearTimeout(timer)
  }, [isAuthenticated, currentUser])

  if (!alert) return null

  return (
    <Modal
      isOpen={true}
      onClose={() => setAlert(null)}
      size="default"
      ariaLabel="Upcoming interview reminder"
    >
      <div className="modal-content">
        <div className="modal-content__icon modal-content__icon--warning">
          <i className="bx bx-calendar-event" />
        </div>

        <div className="modal-content__eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>
          <span
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#e8820c',
              boxShadow: '0 0 0 3px rgba(232, 130, 12, 0.2)',
            }}
          />
          {alert.isToday ? 'Interview today' : 'Interview tomorrow'}
        </div>

        <h2 className="modal-content__title modal-content__title--center">
          {alert.interview.typeLabel}
        </h2>
        <p className="modal-content__message modal-content__message--center">
          Your practice interview is scheduled for{' '}
          <strong>{alert.isToday ? 'today' : 'tomorrow'} at {alert.time}</strong>{' '}
          Amsterdam time. Take a moment to review your materials and test your
          camera and microphone.
        </p>
      </div>

      <div className="modal-actions modal-actions--center">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setAlert(null)}
        >
          Later
        </button>
        <Link
          to="/upcoming-interviews"
          className="btn-solid"
          onClick={() => setAlert(null)}
        >
          <i className="bx bx-calendar-check" />
          View interview
        </Link>
      </div>
    </Modal>
  )
}

export default UrgentInterviewAlert