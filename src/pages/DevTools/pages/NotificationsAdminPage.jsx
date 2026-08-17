import React, { useState, useMemo } from 'react'
import { dataService } from '../../../services/dataService'
import { adminService } from '../../../services/adminService'
import { storageService } from '../../../services/storageService'
import AdminModal from '../components/AdminModal'

function NotificationsAdminPage({ refresh }) {
  const [creating, setCreating] = useState(false)

  const notifications = useMemo(() => {
    const list = storageService.get('bpn_notifications') || []
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [refresh])

  const getUserName = (userId) => {
    const u = dataService.getUserById(userId)
    return u ? `${u.firstName} ${u.lastName}` : userId
  }

  const handleDelete = (n) => {
    if (window.confirm('Delete this notification?')) {
      adminService.deleteNotification(n.id)
      refresh()
    }
  }

  return (
    <div className="dt-page">
      <div className="dt-page__header">
        <div className="dt-page__title-block">
          <div className="dt-page__eyebrow">Notifications</div>
          <h1 className="dt-page__title">All notifications ({notifications.length})</h1>
          <p className="dt-page__desc">
            View all notifications sent through the portal. Send custom notifications to users manually.
          </p>
        </div>
        <div className="dt-page__actions">
          <button className="dt-btn dt-btn--primary" onClick={() => setCreating(true)}>
            <i className="bx bx-send" />
            Send notification
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="dt-empty">
          <i className="bx bx-bell-off" />
          <h3>No notifications</h3>
          <p>Send your first notification.</p>
        </div>
      ) : (
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th>To</th>
                <th>Category</th>
                <th>Title & message</th>
                <th>Read</th>
                <th>Sent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.slice(0, 50).map((n) => (
                <tr key={n.id}>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{getUserName(n.userId)}</td>
                  <td>
                    <span className="dt-badge dt-badge--upcoming">{n.category}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{n.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6a6a6a', marginTop: 2 }}>{n.message}</div>
                  </td>
                  <td>
                    {n.isRead
                      ? <span className="dt-badge dt-badge--active">Read</span>
                      : <span className="dt-badge dt-badge--pending">Unread</span>
                    }
                  </td>
                  <td style={{ fontSize: '0.6875rem', color: '#8a8578' }}>
                    {new Date(n.createdAt).toLocaleString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td>
                    <button className="dt-btn dt-btn--danger" onClick={() => handleDelete(n)}>
                      <i className="bx bx-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {notifications.length > 50 && (
            <div style={{ padding: 12, textAlign: 'center', fontSize: '0.75rem', color: '#8a8578' }}>
              Showing latest 50 of {notifications.length}
            </div>
          )}
        </div>
      )}

      {creating && (
        <NotificationFormModal onClose={() => setCreating(false)} onSaved={() => { setCreating(false); refresh() }} />
      )}
    </div>
  )
}

function NotificationFormModal({ onClose, onSaved }) {
  const users = dataService.getUsers().filter((u) => u.accountStatus === 'active')

  const [data, setData] = useState({
    userIds: [],
    category: 'update',
    title: '',
    message: '',
    actionUrl: '',
    actionLabel: '',
  })

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const toggleUser = (id) => {
    setData({
      ...data,
      userIds: data.userIds.includes(id)
        ? data.userIds.filter((u) => u !== id)
        : [...data.userIds, id],
    })
  }

  const selectAll = () => setData({ ...data, userIds: users.map((u) => u.id) })
  const clearAll = () => setData({ ...data, userIds: [] })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (data.userIds.length === 0) {
      alert('Select at least one user.')
      return
    }
    data.userIds.forEach((userId) => {
      adminService.addNotification({
        userId,
        type: 'admin_notice',
        category: data.category,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl || null,
        actionLabel: data.actionLabel || null,
      })
    })
    onSaved()
  }

  return (
    <AdminModal
      title="Send notification"
      onClose={onClose}
      size="large"
      footer={
        <>
          <button className="dt-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="notif-form" className="dt-btn dt-btn--primary">
            <i className="bx bx-send" />
            Send to {data.userIds.length} user{data.userIds.length !== 1 ? 's' : ''}
          </button>
        </>
      }
    >
      <form id="notif-form" onSubmit={handleSubmit} className="dt-form">
        <div className="dt-field">
          <label>Recipients * ({data.userIds.length} selected)</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <button type="button" className="dt-btn" onClick={selectAll}>Select all ({users.length})</button>
            <button type="button" className="dt-btn" onClick={clearAll}>Clear</button>
          </div>
          <div style={{
            maxHeight: 200, overflowY: 'auto',
            border: '1px solid #d8d4c8', padding: 8,
            background: '#ffffff',
          }}>
            {users.map((u) => (
              <label key={u.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 8px', cursor: 'pointer',
                background: data.userIds.includes(u.id) ? '#faf8f3' : 'transparent',
              }}>
                <input
                  type="checkbox"
                  checked={data.userIds.includes(u.id)}
                  onChange={() => toggleUser(u.id)}
                />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  {u.firstName} {u.lastName}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#8a8578', fontFamily: 'Courier New, monospace' }}>
                  {u.isoCode}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="dt-field">
          <label>Category *</label>
          <select value={data.category} onChange={set('category')}>
            <option value="update">Update</option>
            <option value="interview">Interview</option>
            <option value="result">Result</option>
            <option value="document">Document</option>
          </select>
        </div>

        <div className="dt-field">
          <label>Title *</label>
          <input required value={data.title} onChange={set('title')} maxLength="80" />
        </div>

        <div className="dt-field">
          <label>Message *</label>
          <textarea required value={data.message} onChange={set('message')} maxLength="300" />
        </div>

        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>Action link (optional)</label>
            <input value={data.actionUrl} onChange={set('actionUrl')} placeholder="/dashboard" />
          </div>
          <div className="dt-field">
            <label>Action label</label>
            <input value={data.actionLabel} onChange={set('actionLabel')} placeholder="View details" />
          </div>
        </div>
      </form>
    </AdminModal>
  )
}

export default NotificationsAdminPage