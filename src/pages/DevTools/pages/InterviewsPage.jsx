import React, { useState, useMemo } from 'react'
import { dataService } from '../../../services/dataService'
import { adminService } from '../../../services/adminService'
import AdminModal from '../components/AdminModal'

function InterviewsPage({ refresh }) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const interviews = useMemo(() => {
    const list = dataService.getInterviews()
    return list.sort((a, b) => {
      const dtA = new Date(`${a.date}T${a.time}:00`)
      const dtB = new Date(`${b.date}T${b.time}:00`)
      return dtB - dtA
    })
  }, [refresh])

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return interviews
    return interviews.filter((i) => i.status === statusFilter)
  }, [interviews, statusFilter])

  const getUserName = (userId) => {
    const u = dataService.getUserById(userId)
    return u ? `${u.firstName} ${u.lastName}` : userId
  }

  const handleDelete = (interview) => {
    if (window.confirm(`Delete this interview? This cannot be undone.`)) {
      adminService.deleteInterview(interview.id)
      refresh()
    }
  }

  const handleStatusChange = (interview, status) => {
    adminService.updateInterview(interview.id, { status })
    refresh()
  }

  return (
    <div className="dt-page">
      <div className="dt-page__header">
        <div className="dt-page__title-block">
          <div className="dt-page__eyebrow">Interview management</div>
          <h1 className="dt-page__title">Interviews ({interviews.length})</h1>
          <p className="dt-page__desc">
            Schedule new interviews, edit existing, and manage their lifecycle.
          </p>
        </div>
        <div className="dt-page__actions">
          <button className="dt-btn dt-btn--primary" onClick={() => setCreating(true)}>
            <i className="bx bx-plus" />
            Schedule new
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 16,
        padding: '12px 16px', background: '#ffffff',
        border: '1px solid #d8d4c8', flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: '0.6875rem', fontWeight: 700, color: '#8a8578',
          textTransform: 'uppercase', letterSpacing: '0.12em',
          marginRight: 8, alignSelf: 'center',
        }}>Filter:</span>
        {['all', 'upcoming', 'completed', 'cancelled', 'rescheduled'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`dt-btn ${statusFilter === s ? 'dt-btn--primary' : ''}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="dt-empty">
          <i className="bx bx-calendar-x" />
          <h3>No interviews</h3>
          <p>Schedule your first interview.</p>
        </div>
      ) : (
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Date & time</th>
                <th>Duration</th>
                <th>Meet link</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{getUserName(i.userId)}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#8a8578', fontFamily: 'Courier New, monospace' }}>
                      {i.isoCode}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{i.typeLabel}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                      {new Date(i.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6a6a6a' }}>{i.time} Amsterdam</div>
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>{i.duration} min</td>
                  <td>
                    {i.meetLink ? (
                      <a
                        href={i.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.75rem',
                          color: '#1a3a6b',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        <i className="bx bx-link-external" style={{ fontSize: '0.875rem' }} /> Open
                      </a>
                    ) : (
                      <span style={{ color: '#b0a99a', fontSize: '0.75rem' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`dt-badge dt-badge--${i.status}`}>{i.status}</span>
                  </td>
                  <td>
                    <div className="dt-actions-cell">
                      <button className="dt-btn" onClick={() => setEditing(i)} title="Edit">
                        <i className="bx bx-edit" />
                      </button>
                      {i.status === 'upcoming' && (
                        <>
                          <button
                            className="dt-btn dt-btn--success"
                            onClick={() => handleStatusChange(i, 'completed')}
                            title="Mark completed"
                          >
                            <i className="bx bx-check" />
                          </button>
                          <button
                            className="dt-btn dt-btn--danger"
                            onClick={() => handleStatusChange(i, 'cancelled')}
                            title="Cancel"
                          >
                            <i className="bx bx-x" />
                          </button>
                        </>
                      )}
                      <button
                        className="dt-btn dt-btn--danger"
                        onClick={() => handleDelete(i)}
                        title="Delete"
                      >
                        <i className="bx bx-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <InterviewFormModal
          onClose={() => setCreating(false)}
          onSaved={() => { setCreating(false); refresh() }}
        />
      )}

      {editing && (
        <InterviewFormModal
          interview={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh() }}
        />
      )}
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────

function InterviewFormModal({ interview, onClose, onSaved }) {
  const isEdit = Boolean(interview)
  const users = dataService.getUsers().filter((u) => u.accountStatus === 'active')

  const [data, setData] = useState({
    userId: interview?.userId || '',
    type: interview?.type || 'university',
    date: interview?.date || '',
    time: interview?.time || '',
    duration: interview?.duration || 30,
    meetLink: interview?.meetLink || '',
    interviewerName: interview?.interviewerName || '',
    instructions: interview?.instructions || '',
    status: interview?.status || 'upcoming',
  })

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const typeLabels = {
    university: 'University Admission Interview',
    ind: 'IND Interview',
    embassy: 'Embassy Interview',
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isEdit) {
      adminService.updateInterview(interview.id, {
        ...data,
        duration: Number(data.duration),
        typeLabel: typeLabels[data.type],
      })
    } else {
      adminService.scheduleInterview({
        ...data,
        duration: Number(data.duration),
      })
    }
    onSaved()
  }

  return (
    <AdminModal
      title={isEdit ? 'Edit interview' : 'Schedule new interview'}
      onClose={onClose}
      size="large"
      footer={
        <>
          <button className="dt-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="int-form" className="dt-btn dt-btn--primary">
            <i className="bx bx-check" />
            {isEdit ? 'Save changes' : 'Schedule & notify'}
          </button>
        </>
      }
    >
      <form id="int-form" onSubmit={handleSubmit} className="dt-form">
        <div className="dt-field">
          <label>Student *</label>
          <select required value={data.userId} onChange={set('userId')} disabled={isEdit}>
            <option value="">Select student…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName} — {u.isoCode}
              </option>
            ))}
          </select>
          {isEdit && (
            <div className="dt-field__hint">
              Student cannot be changed after scheduling. Delete and re-create to change.
            </div>
          )}
        </div>

        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>Interview type *</label>
            <select required value={data.type} onChange={set('type')}>
              <option value="university">University Admission</option>
              <option value="ind">IND Interview</option>
              <option value="embassy">Embassy Interview</option>
            </select>
          </div>
          <div className="dt-field">
            <label>Status</label>
            <select value={data.status} onChange={set('status')}>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>

        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>Date *</label>
            <input required type="date" value={data.date} onChange={set('date')} />
          </div>
          <div className="dt-field">
            <label>Time (Amsterdam) *</label>
            <input required type="time" value={data.time} onChange={set('time')} />
          </div>
        </div>

        <div className="dt-field">
          <label>Duration (minutes) *</label>
          <input required type="number" min="10" max="120" step="5" value={data.duration} onChange={set('duration')} />
        </div>

        <div className="dt-field">
          <label>Google Meet link *</label>
          <input
            required
            type="url"
            value={data.meetLink}
            onChange={set('meetLink')}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
          />
          <div className="dt-field__hint">
            Create the meeting at meet.google.com and paste the link here.
          </div>
        </div>

        <div className="dt-field">
          <label>Interviewer name *</label>
          <input required value={data.interviewerName} onChange={set('interviewerName')} />
        </div>

        <div className="dt-field">
          <label>Instructions</label>
          <textarea value={data.instructions} onChange={set('instructions')} placeholder="Notes for the student…" />
        </div>
      </form>
    </AdminModal>
  )
}

export default InterviewsPage