import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { dataService } from '../../services/dataService'
import NotificationsHero from './components/NotificationsHero'
import NotificationsToolbar from './components/NotificationsToolbar'
import NotificationItem from './components/NotificationItem'
import NotificationsEmpty from './components/NotificationsEmpty'
import ConfirmModal from './components/ConfirmModal'
import './Notifications.scss'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'interview', label: 'Interviews' },
  { id: 'result', label: 'Results' },
  { id: 'document', label: 'Documents' },
  { id: 'update', label: 'Updates' },
]

function Notifications() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('all')
  const [tick, setTick] = useState(0)
  const [confirmMarkAll, setConfirmMarkAll] = useState(false)

  const notifications = useMemo(
    () => dataService.getNotificationsByUserId(currentUser.id),
    [currentUser.id, tick]
  )

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  )

  const counts = useMemo(() => {
    const c = {
      all: notifications.length,
      unread: unreadCount,
      interview: 0,
      result: 0,
      document: 0,
      update: 0,
    }
    notifications.forEach((n) => {
      if (c[n.category] !== undefined) c[n.category]++
    })
    return c
  }, [notifications, unreadCount])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return notifications
    if (activeFilter === 'unread') return notifications.filter((n) => !n.isRead)
    return notifications.filter((n) => n.category === activeFilter)
  }, [notifications, activeFilter])

  // Group notifications by day
  const grouped = useMemo(() => {
    const groups = {}
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    filtered.forEach((n) => {
      const d = new Date(n.createdAt)
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      let label
      if (dayStart.getTime() === today.getTime()) {
        label = 'Today'
      } else if (dayStart.getTime() === yesterday.getTime()) {
        label = 'Yesterday'
      } else {
        const daysAgo = Math.floor((today - dayStart) / (1000 * 60 * 60 * 24))
        if (daysAgo < 7) {
          label = d.toLocaleDateString('en-GB', { weekday: 'long' })
        } else {
          label = d.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
          })
        }
      }
      if (!groups[label]) groups[label] = []
      groups[label].push(n)
    })
    return groups
  }, [filtered])

  const handleMarkRead = useCallback((notifId) => {
    dataService.markNotificationRead(notifId)
    setTick((t) => t + 1)
  }, [])

  const handleMarkAllRead = useCallback(() => {
    dataService.markAllNotificationsRead(currentUser.id)
    setTick((t) => t + 1)
    setConfirmMarkAll(false)
  }, [currentUser.id])

  const handleOpenNotification = useCallback((notif) => {
    if (!notif.isRead) {
      dataService.markNotificationRead(notif.id)
      setTick((t) => t + 1)
    }
    if (notif.actionUrl) {
      navigate(notif.actionUrl)
    }
  }, [navigate])

  return (
    <div className="notif-page">
      <NotificationsHero
        totalNotifications={notifications.length}
        unreadCount={unreadCount}
        onMarkAllRead={() => setConfirmMarkAll(true)}
      />

      {notifications.length > 0 && (
        <>
          <NotificationsToolbar
            filters={FILTERS}
            activeFilter={activeFilter}
            counts={counts}
            onFilterChange={setActiveFilter}
            unreadCount={unreadCount}
            onMarkAllRead={() => setConfirmMarkAll(true)}
            visibleCount={filtered.length}
          />

          {filtered.length === 0 ? (
            <NotificationsEmpty filter={activeFilter} />
          ) : (
            <div className="notif-list">
              {Object.entries(grouped).map(([dayLabel, items]) => (
                <div key={dayLabel} className="notif-group">
                  <div className="notif-group__header">
                    <span className="notif-group__label">{dayLabel}</span>
                    <span className="notif-group__count">
                      {items.length} {items.length === 1 ? 'notification' : 'notifications'}
                    </span>
                    <div className="notif-group__line" />
                  </div>
                  <div className="notif-group__items">
                    {items.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onOpen={() => handleOpenNotification(n)}
                        onMarkRead={() => handleMarkRead(n.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {notifications.length === 0 && <NotificationsEmpty filter="none" />}

      {confirmMarkAll && (
        <ConfirmModal
          title="Mark all as read?"
          message={`This will mark ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''} as read. This cannot be undone.`}
          confirmLabel="Mark all read"
          onConfirm={handleMarkAllRead}
          onCancel={() => setConfirmMarkAll(false)}
        />
      )}
    </div>
  )
}

export default Notifications