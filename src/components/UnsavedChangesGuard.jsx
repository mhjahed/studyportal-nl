import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUnsavedChanges } from '../hooks/useUnsavedChanges'
import { useLeaveConfirmation } from '../hooks/useLeaveConfirmation'
import ConfirmModal from '../pages/Notifications/components/ConfirmModal'

function UnsavedChangesGuard({ isDirty, message }) {
  const navigate = useNavigate()
  useUnsavedChanges(isDirty)
  const { pendingPath, cancelLeave, confirmLeave } = useLeaveConfirmation(isDirty)

  if (!pendingPath) return null

  return (
    <ConfirmModal
      title="Leave this page?"
      message={
        message ||
        'You have unsaved changes. If you leave now, your progress will be lost.'
      }
      confirmLabel="Leave anyway"
      cancelLabel="Stay on page"
      variant="warning"
      icon="bx-exit"
      onConfirm={() => confirmLeave(navigate)}
      onCancel={cancelLeave}
    />
  )
}

export default UnsavedChangesGuard