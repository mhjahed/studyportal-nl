import React, { useState, useEffect } from 'react'
import SettingsSection from '../components/SettingsSection'

const TIMEZONE_OPTIONS = [
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', region: 'Europe' },
  { value: 'Europe/London', label: 'London (GMT/BST)', region: 'Europe' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', region: 'Europe' },
  { value: 'Asia/Karachi', label: 'Karachi (PKT)', region: 'Asia' },
  { value: 'Asia/Dhaka', label: 'Dhaka (BST)', region: 'Asia' },
  { value: 'Asia/Kolkata', label: 'Kolkata / Mumbai (IST)', region: 'Asia' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', region: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', region: 'Asia' },
  { value: 'America/New_York', label: 'New York (EST/EDT)', region: 'Americas' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', region: 'Americas' },
]

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'nl', label: 'Dutch', native: 'Nederlands', disabled: true },
]

function useCurrentTime(timezone) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  try {
    return {
      formatted: time.toLocaleTimeString('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: time.toLocaleDateString('en-GB', {
        timeZone: timezone,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    }
  } catch {
    return { formatted: '—:—', date: '—' }
  }
}

function TimezoneSettings({ timezone, language, onChange }) {
  const currentTime = useCurrentTime(timezone)
  const amsTime = useCurrentTime('Europe/Amsterdam')
  const isAmsterdam = timezone === 'Europe/Amsterdam'

  return (
    <SettingsSection
      eyebrow="Section 02"
      title="Timezone & language"
      description="Set how times and dates are displayed throughout the portal. Interview times are always confirmed in Amsterdam time regardless of your selection."
    >
      {/* Current time preview */}
      <div className="tz-preview">
        <div className="tz-preview__local">
          <div className="tz-preview__label">Your timezone</div>
          <div className="tz-preview__time">{currentTime.formatted}</div>
          <div className="tz-preview__date">{currentTime.date}</div>
          <div className="tz-preview__tz-code">
            {TIMEZONE_OPTIONS.find((t) => t.value === timezone)?.label || timezone}
          </div>
        </div>

        {!isAmsterdam && (
          <div className="tz-preview__ams">
            <div className="tz-preview__ams-flag">
              <span /><span /><span />
            </div>
            <div className="tz-preview__label">Amsterdam</div>
            <div className="tz-preview__ams-time">{amsTime.formatted}</div>
            <div className="tz-preview__date">{amsTime.date}</div>
          </div>
        )}
      </div>

      {/* Timezone select */}
      <div className="s-field">
        <label className="s-field__label" htmlFor="timezone-select">
          <i className="bx bx-globe" />
          Timezone
        </label>
        <div className="s-field__hint">
          Choose the timezone closest to your current location.
        </div>
        <select
          id="timezone-select"
          value={timezone}
          onChange={(e) => onChange({ timezone: e.target.value })}
          className="s-field__select"
        >
          {['Europe', 'Asia', 'Americas'].map((region) => (
            <optgroup key={region} label={region}>
              {TIMEZONE_OPTIONS
                .filter((t) => t.region === region)
                .map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Language */}
      <div className="s-field">
        <label className="s-field__label">
          <i className="bx bx-message-square-detail" />
          Interface language
        </label>
        <div className="s-field__hint">
          Currently only English is supported. Additional languages are planned.
        </div>
        <div className="s-radio-list">
          {LANGUAGE_OPTIONS.map((lang) => (
            <label
              key={lang.value}
              className={[
                's-radio',
                language === lang.value && 's-radio--selected',
                lang.disabled && 's-radio--disabled',
              ].filter(Boolean).join(' ')}
            >
              <input
                type="radio"
                name="language"
                value={lang.value}
                checked={language === lang.value}
                onChange={(e) => !lang.disabled && onChange({ language: e.target.value })}
                disabled={lang.disabled}
              />
              <span className="s-radio__mark">
                <span className="s-radio__mark-inner" />
              </span>
              <div className="s-radio__body">
                <div className="s-radio__title">{lang.label}</div>
                <div className="s-radio__desc">
                  {lang.native}
                  {lang.disabled && ' · Coming soon'}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </SettingsSection>
  )
}

export default TimezoneSettings