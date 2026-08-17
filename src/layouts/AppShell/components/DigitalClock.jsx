import React, { useState, useEffect } from 'react'
import './DigitalClock.scss'

function DigitalClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')

  const weekday = time.toLocaleDateString('en-GB', { weekday: 'long' })
  const day = time.getDate()
  const month = time.toLocaleDateString('en-GB', { month: 'long' })
  const year = time.getFullYear()

  const amsterdamTime = time.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/Amsterdam',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  // Screen-reader friendly full time string
  const srTimeLabel = `Current time ${hours}:${minutes}, ${weekday} ${day} ${month} ${year}. Amsterdam time ${amsterdamTime}.`

  return (
    <div className="clock" role="group" aria-label={srTimeLabel}>
      {/* Visual clock — hidden from screen readers */}
      <div className="clock__block" aria-hidden="true">
        <div className="clock__time">
          {hours}
          <span className="clock__colon">:</span>
          {minutes}
        </div>
        <div className="clock__meta">
          <span className="clock__weekday">{weekday}</span>
          <span className="clock__sep">·</span>
          <span className="clock__date">{day} {month} {year}</span>
        </div>
      </div>

      <div className="clock__divider" aria-hidden="true" />

      <div className="clock__block clock__block--ams" aria-hidden="true">
        <div className="clock__ams-label">
          <div className="clock__ams-flag">
            <span /><span /><span />
          </div>
          <span>Amsterdam</span>
        </div>
        <div className="clock__ams-time">{amsterdamTime}</div>
      </div>
    </div>
  )
}

export default DigitalClock