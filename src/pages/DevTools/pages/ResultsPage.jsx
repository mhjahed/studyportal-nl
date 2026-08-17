import React, { useState, useMemo } from 'react'
import { dataService } from '../../../services/dataService'
import { adminService } from '../../../services/adminService'
import { storageService } from '../../../services/storageService'
import AdminModal from '../components/AdminModal'

function ResultsPage({ refresh }) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)

  const results = useMemo(() => {
    const list = storageService.get('bpn_results') || []
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [refresh])

  const getUserName = (userId) => {
    const u = dataService.getUserById(userId)
    return u ? `${u.firstName} ${u.lastName}` : userId
  }

  const handleTogglePublish = (result) => {
    const newStatus = result.status === 'published' ? 'draft' : 'published'
    adminService.updateResult(result.id, { status: newStatus })
    refresh()
  }

  const handleDelete = (result) => {
    if (window.confirm('Delete this result? This cannot be undone.')) {
      adminService.deleteResult(result.id)
      refresh()
    }
  }

  return (
    <div className="dt-page">
      <div className="dt-page__header">
        <div className="dt-page__title-block">
          <div className="dt-page__eyebrow">Interview results</div>
          <h1 className="dt-page__title">Results ({results.length})</h1>
          <p className="dt-page__desc">
            Create results for completed interviews. Publish to make visible to students and send a notification.
          </p>
        </div>
        <div className="dt-page__actions">
          <button className="dt-btn dt-btn--primary" onClick={() => setCreating(true)}>
            <i className="bx bx-plus" />
            Create result
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="dt-empty">
          <i className="bx bx-award" />
          <h3>No results yet</h3>
          <p>Create your first interview result.</p>
        </div>
      ) : (
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Interview date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{getUserName(r.userId)}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#8a8578', fontFamily: 'Courier New, monospace' }}>
                      {r.isoCode}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{r.typeLabel}</td>
                  <td>
                    <div style={{ fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                      {r.totalScore}/{r.maxScore}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6a6a6a' }}>{r.percentage}%</div>
                  </td>
                  <td>
                    <div style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '1.125rem',
                      color: r.percentage >= 80 ? '#1d7a47' : r.percentage >= 60 ? '#e8820c' : '#ae1c28',
                    }}>
                      {r.grade}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: '#6a6a6a' }}>
                    {new Date(r.interviewDate).toLocaleDateString('en-GB')}
                  </td>
                  <td>
                    <span className={`dt-badge dt-badge--${r.status}`}>{r.status}</span>
                  </td>
                  <td>
                    <div className="dt-actions-cell">
                      <button className="dt-btn" onClick={() => setEditing(r)}>
                        <i className="bx bx-edit" />
                      </button>
                      <button
                        className={`dt-btn ${r.status === 'draft' ? 'dt-btn--success' : 'dt-btn--warning'}`}
                        onClick={() => handleTogglePublish(r)}
                      >
                        <i className={`bx ${r.status === 'draft' ? 'bx-cloud-upload' : 'bx-cloud-download'}`} />
                        {r.status === 'draft' ? 'Publish' : 'Unpublish'}
                      </button>
                      <button className="dt-btn dt-btn--danger" onClick={() => handleDelete(r)}>
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
        <ResultFormModal onClose={() => setCreating(false)} onSaved={() => { setCreating(false); refresh() }} />
      )}

      {editing && (
        <ResultFormModal
          result={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh() }}
        />
      )}
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────

function ResultFormModal({ result, onClose, onSaved }) {
  const isEdit = Boolean(result)
  const users = dataService.getUsers().filter((u) => u.accountStatus === 'active')
  const interviews = dataService.getInterviews()

  const [data, setData] = useState({
    userId: result?.userId || '',
    interviewId: result?.interviewId || '',
    type: result?.type || 'university',
    interviewDate: result?.interviewDate || '',
    totalScore: result?.totalScore || 80,
    maxScore: result?.maxScore || 100,
    overallFeedback: result?.overallFeedback || '',
    recommendationsText: (result?.recommendations || []).join('\n'),
    status: result?.status || 'draft',
  })

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value })

  // Get interviews for the selected user
  const userInterviews = data.userId
    ? interviews.filter((i) => i.userId === data.userId)
    : []

  const typeLabels = {
    university: 'University Admission Interview',
    ind: 'IND Interview',
    embassy: 'Embassy Interview',
  }

  // Auto-fill from selected interview
  const handleInterviewSelect = (e) => {
    const iId = e.target.value
    const int = interviews.find((i) => i.id === iId)
    if (int) {
      setData({
        ...data,
        interviewId: iId,
        type: int.type,
        interviewDate: int.date,
      })
    } else {
      setData({ ...data, interviewId: iId })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      userId: data.userId,
      interviewId: data.interviewId || null,
      type: data.type,
      typeLabel: typeLabels[data.type],
      interviewDate: data.interviewDate,
      totalScore: Number(data.totalScore),
      maxScore: Number(data.maxScore),
      overallFeedback: data.overallFeedback,
      recommendations: data.recommendationsText.split('\n').map((s) => s.trim()).filter(Boolean),
      status: data.status,
    }

    if (isEdit) {
      adminService.updateResult(result.id, payload)
    } else {
      adminService.createResult(payload)
    }
    onSaved()
  }

  const percentage = data.maxScore > 0
    ? Math.round((data.totalScore / data.maxScore) * 100)
    : 0

  return (
    <AdminModal
      title={isEdit ? 'Edit result' : 'Create new result'}
      onClose={onClose}
      size="large"
      footer={
        <>
          <button className="dt-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="res-form" className="dt-btn dt-btn--primary">
            <i className="bx bx-check" />
            {isEdit ? 'Save changes' : 'Create result'}
          </button>
        </>
      }
    >
      <form id="res-form" onSubmit={handleSubmit} className="dt-form">
        <div className="dt-field">
          <label>Student *</label>
          <select required value={data.userId} onChange={set('userId')} disabled={isEdit}>
            <option value="">Select student…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.isoCode}</option>
            ))}
          </select>
        </div>

        {data.userId && (
          <div className="dt-field">
            <label>Link to interview (optional)</label>
            <select value={data.interviewId} onChange={handleInterviewSelect}>
              <option value="">No linked interview</option>
              {userInterviews.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.typeLabel} — {new Date(i.date).toLocaleDateString('en-GB')} ({i.status})
                </option>
              ))}
            </select>
            <div className="dt-field__hint">
              Selecting an interview auto-fills type and date, and marks the interview as completed.
            </div>
          </div>
        )}

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
            <label>Interview date *</label>
            <input required type="date" value={data.interviewDate} onChange={set('interviewDate')} />
          </div>
        </div>

        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>Score *</label>
            <input required type="number" min="0" value={data.totalScore} onChange={set('totalScore')} />
          </div>
          <div className="dt-field">
            <label>Max score *</label>
            <input required type="number" min="1" value={data.maxScore} onChange={set('maxScore')} />
          </div>
        </div>

        <div style={{
          padding: '10px 14px',
          background: '#faf8f3',
          borderLeft: `3px solid ${percentage >= 80 ? '#1d7a47' : percentage >= 60 ? '#e8820c' : '#ae1c28'}`,
          fontSize: '0.875rem',
        }}>
          Computed: <strong>{percentage}%</strong> — grade <strong>{adminService.computeGrade(percentage)}</strong>
        </div>

        <div className="dt-field">
          <label>Overall feedback *</label>
          <textarea
            required
            value={data.overallFeedback}
            onChange={set('overallFeedback')}
            placeholder="Summary of the student's performance…"
            style={{ minHeight: 100 }}
          />
        </div>

        <div className="dt-field">
          <label>Recommendations</label>
          <textarea
            value={data.recommendationsText}
            onChange={set('recommendationsText')}
            placeholder="One per line…"
            style={{ minHeight: 100 }}
          />
          <div className="dt-field__hint">Enter one recommendation per line.</div>
        </div>

        <div className="dt-field">
          <label>Status</label>
          <select value={data.status} onChange={set('status')}>
            <option value="draft">Draft (hidden from student)</option>
            <option value="published">Published (visible + notification)</option>
          </select>
        </div>
      </form>
    </AdminModal>
  )
}

export default ResultsPage