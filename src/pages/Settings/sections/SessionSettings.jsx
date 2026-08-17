import React, { useState } from 'react'
import SettingsSection from '../components/SettingsSection'
import ConfirmModal from '../../Notifications/components/ConfirmModal'
import { storageService } from '../../../services/storageService'

function SessionSettings({ onSignOut, onSignOutAll }) {
  const [confirmSignOut, setConfirmSignOut] = useState(false)
  const [confirmSignOutAll, setConfirmSignOutAll] = useState(false)

  const session = storageService.getSession()
  const sessionStart = session?.timestamp
    ? new Date(session.timestamp).toLocaleString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'Unknown'

  return (
    <SettingsSection
      eyebrow="Section 05"
      title="Session & security"
      description="Manage your active session and understand how your data is stored."
    >
      {/* Session info */}
      <div className="ss-session">
        <div className="ss-session__row">
          <div className="ss-session__icon">
            <i className="bx bx-shield-quarter" />
          </div>
          <div className="ss-session__body">
            <div className="ss-session__label">Current session</div>
            <div className="ss-session__title">Signed in on this device</div>
            <div className="ss-session__meta">
              Session started · {sessionStart}
            </div>
          </div>
          <div className="ss-session__status">
            <span className="ss-session__pulse" />
            Active
          </div>
        </div>
      </div>

      {/* Frontend-only notice */}
      <div className="ss-notice">
        <div className="ss-notice__icon">
          <i className="bx bx-info-circle" />
        </div>
        <div className="ss-notice__body">
          <div className="ss-notice__title">About your data</div>
          <p>
            All portal data is currently stored locally in your browser. Signing
            out will end your session on this device. To fully clear your data,
            use your browser's clear-storage function.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="ss-actions">
        <button
          type="button"
          className="ss-action ss-action--warning"
          onClick={() => setConfirmSignOut(true)}
        >
          <div className="ss-action__icon">
            <i className="bx bx-log-out" />
          </div>
          <div className="ss-action__body">
            <div className="ss-action__title">Sign out of this device</div>
            <div className="ss-action__desc">
              End your current session and return to the login screen.
            </div>
          </div>
          <i className="bx bx-right-arrow-alt ss-action__arrow" />
        </button>

        <button
          type="button"
          className="ss-action ss-action--danger"
          onClick={() => setConfirmSignOutAll(true)}
        >
          <div className="ss-action__icon">
            <i className="bx bx-power-off" />
          </div>
          <div className="ss-action__body">
            <div className="ss-action__title">Sign out of all sessions</div>
            <div className="ss-action__desc">
              End every active session across devices.
            </div>
          </div>
          <i className="bx bx-right-arrow-alt ss-action__arrow" />
        </button>
      </div>

    {confirmSignOut && (
      <ConfirmModal
        title="Sign out of this device?"
        message="You will need to sign in again to access the portal. Your data will remain saved."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        variant="warning"
        icon="bx-log-out"
        onConfirm={onSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    )}

    {confirmSignOutAll && (
      <ConfirmModal
        title="Sign out of all sessions?"
        message="This will end every active session across all devices. You will need to sign in again."
        confirmLabel="Sign out everywhere"
        cancelLabel="Stay signed in"
        variant="danger"
        icon="bx-power-off"
        onConfirm={onSignOutAll}
        onCancel={() => setConfirmSignOutAll(false)}
      />
    )}
    </SettingsSection>
  )
}

export default SessionSettings