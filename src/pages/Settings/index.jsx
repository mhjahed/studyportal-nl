import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { dataService } from '../../services/dataService'
import SettingsHero from './components/SettingsHero'
import SettingsNav from './components/SettingsNav'
import NotificationSettings from './sections/NotificationSettings'
import TimezoneSettings from './sections/TimezoneSettings'
import ProfileImageSettings from './sections/ProfileImageSettings'
import DisplaySettings from './sections/DisplaySettings'
import SessionSettings from './sections/SessionSettings'
import ToastMessage from './components/ToastMessage'
import './Settings.scss'

const SECTIONS = [
  { id: 'notifications', label: 'Notifications', icon: 'bx-bell' },
  { id: 'timezone', label: 'Timezone & language', icon: 'bx-globe' },
  { id: 'profile', label: 'Profile image', icon: 'bx-image' },
  { id: 'display', label: 'Display', icon: 'bx-palette' },
  { id: 'session', label: 'Session & security', icon: 'bx-shield-quarter' },
]

function Settings() {
  const { currentUser, refreshUser, logout } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('notifications')
  const [toast, setToast] = useState(null)

  const [settings, setSettings] = useState(() => {
    const userSettings = dataService.getUserSettings(currentUser.id)
    const defaults = dataService.getSettings()
    return {
      notifications: userSettings?.notifications || defaults.notifications,
      timezone: userSettings?.timezone || defaults.timezone,
      language: userSettings?.language || defaults.language,
      display: userSettings?.display || {
        density: 'comfortable',
        reduceMotion: false,
      },
    }
  })

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const saveSettings = useCallback((patch, toastMessage) => {
    const updated = { ...settings, ...patch }
    setSettings(updated)
    dataService.updateUserSettings(currentUser.id, updated)
    if (toastMessage) showToast(toastMessage)
  }, [currentUser.id, settings, showToast])

  const handleProfileImageUpdate = useCallback((newImageUrl) => {
    dataService.updateUser(currentUser.id, { profileImage: newImageUrl })
    refreshUser()
    showToast('Profile image updated successfully.')
  }, [currentUser.id, refreshUser, showToast])

const handleSignOut = useCallback(() => {
  setTimeout(() => {
    logout()
    navigate('/login', { replace: true })
  }, 50)
}, [logout, navigate])

const handleSignOutAll = useCallback(() => {
  setTimeout(() => {
    logout()
    navigate('/login', { replace: true })
  }, 50)
}, [logout, navigate])


  // Persist active section in sessionStorage so it survives refreshes
  useEffect(() => {
    const stored = sessionStorage.getItem('bpn_settings_section')
    if (stored && SECTIONS.some((s) => s.id === stored)) {
      setActiveSection(stored)
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('bpn_settings_section', activeSection)
  }, [activeSection])

  return (
    <div className="settings-page">
      <SettingsHero user={currentUser} />

      <div className="settings-page__body">
        <SettingsNav
          sections={SECTIONS}
          activeSection={activeSection}
          onSelect={setActiveSection}
        />

        <div className="settings-page__content">
          {activeSection === 'notifications' && (
            <NotificationSettings
              value={settings.notifications}
              onChange={(v) =>
                saveSettings({ notifications: v }, 'Notification preferences updated.')
              }
            />
          )}

          {activeSection === 'timezone' && (
            <TimezoneSettings
              timezone={settings.timezone}
              language={settings.language}
              onChange={(v) => saveSettings(v, 'Timezone preferences updated.')}
            />
          )}

          {activeSection === 'profile' && (
            <ProfileImageSettings
              currentImage={currentUser.profileImage}
              userName={`${currentUser.firstName} ${currentUser.lastName}`}
              onUpdate={handleProfileImageUpdate}
            />
          )}

          {activeSection === 'display' && (
            <DisplaySettings
              value={settings.display}
              onChange={(v) => saveSettings({ display: v }, 'Display preferences updated.')}
            />
          )}

          {activeSection === 'session' && (
            <SessionSettings
              onSignOut={handleSignOut}
              onSignOutAll={handleSignOutAll}
            />
          )}
        </div>
      </div>

      {toast && (
        <ToastMessage
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Settings