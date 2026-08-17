import React from 'react'
import SettingsSection from '../components/SettingsSection'
import ToggleRow from '../components/ToggleRow'

const NOTIFICATION_TYPES = [
  {
    key: 'interviewScheduled',
    icon: 'bx-calendar-check',
    title: 'Interview scheduled',
    description: 'When a new practice interview is scheduled for you.',
  },
  {
    key: 'interviewReminder',
    icon: 'bx-time',
    title: 'Interview reminders',
    description: 'Reminders before your upcoming interviews.',
  },
  {
    key: 'resultPublished',
    icon: 'bx-award',
    title: 'Result published',
    description: 'When your interview result becomes available.',
  },
  {
    key: 'scorecardPublished',
    icon: 'bx-line-chart',
    title: 'Scorecard published',
    description: 'When your detailed performance scorecard is ready.',
  },
  {
    key: 'documentReminder',
    icon: 'bx-file',
    title: 'Document reminders',
    description: 'Prompts to complete pending document preparation.',
  },
  {
    key: 'studyUpdates',
    icon: 'bx-news',
    title: 'Study updates',
    description: 'New articles about IND, visa, and university news.',
  },
  {
    key: 'systemAnnouncements',
    icon: 'bx-info-circle',
    title: 'Portal announcements',
    description: 'Important notices about the portal itself.',
  },
]

function NotificationSettings({ value, onChange }) {
  const handleToggle = (key) => (checked) => {
    onChange({ ...value, [key]: checked })
  }

  const enabledCount = Object.values(value).filter(Boolean).length
  const totalCount = NOTIFICATION_TYPES.length

  return (
    <SettingsSection
      eyebrow="Section 01"
      title="Notification preferences"
      description="Choose which notifications you want to receive in the portal. Your choices apply to the notification centre and the header bell."
    >
      <div className="s-summary">
        <div className="s-summary__num">{enabledCount}<span>/{totalCount}</span></div>
        <div className="s-summary__label">
          Notification categories enabled
        </div>
        <div className="s-summary__actions">
          <button
            type="button"
            className="s-summary__btn"
            onClick={() => onChange(
              NOTIFICATION_TYPES.reduce((acc, t) => ({ ...acc, [t.key]: true }), {})
            )}
            disabled={enabledCount === totalCount}
          >
            Enable all
          </button>
          <button
            type="button"
            className="s-summary__btn"
            onClick={() => onChange(
              NOTIFICATION_TYPES.reduce((acc, t) => ({ ...acc, [t.key]: false }), {})
            )}
            disabled={enabledCount === 0}
          >
            Disable all
          </button>
        </div>
      </div>

      <div className="s-toggle-list">
        {NOTIFICATION_TYPES.map((type) => (
          <ToggleRow
            key={type.key}
            icon={type.icon}
            title={type.title}
            description={type.description}
            checked={value[type.key] || false}
            onChange={handleToggle(type.key)}
          />
        ))}
      </div>
    </SettingsSection>
  )
}

export default NotificationSettings