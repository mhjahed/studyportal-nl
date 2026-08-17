import React, { useState, useMemo } from 'react'
import { dataService } from '../../../services/dataService'
import { adminService } from '../../../services/adminService'
import { storageService } from '../../../services/storageService'
import AdminModal from '../components/AdminModal'

function ScorecardsPage({ refresh }) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)

  const scorecards = useMemo(() => {
    const list = storageService.get('bpn_scorecards') || []
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [refresh])

  const getUserName = (userId) => {
    const u = dataService.getUserById(userId)
    return u ? `${u.firstName} ${u.lastName}` : userId
  }

  const handleTogglePublish = (sc) => {
    const newStatus = sc.status === 'published' ? 'draft' : 'published'
    adminService.updateScorecard(sc.id, { status: newStatus })
    refresh()
  }

  const handleDelete = (sc) => {
    if (window.confirm('Delete this scorecard? This cannot be undone.')) {
      adminService.deleteScorecard(sc.id)
      refresh()
    }
  }

  return (
    <div className="dt-page">
      <div className="dt-page__header">
        <div className="dt-page__title-block">
          <div className="dt-page__eyebrow">Detailed scorecards</div>
          <h1 className="dt-page__title">Scorecards ({scorecards.length})</h1>
          <p className="dt-page__desc">
            Create detailed performance scorecards with dynamic criteria. Any number of criteria are supported per scorecard.
          </p>
        </div>
        <div className="dt-page__actions">
          <button className="dt-btn dt-btn--primary" onClick={() => setCreating(true)}>
            <i className="bx bx-plus" />
            Create scorecard
          </button>
        </div>
      </div>

      {scorecards.length === 0 ? (
        <div className="dt-empty">
          <i className="bx bx-line-chart" />
          <h3>No scorecards yet</h3>
          <p>Create your first detailed scorecard.</p>
        </div>
      ) : (
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Criteria</th>
                <th>Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scorecards.map((sc) => {
                const total = sc.criteria.reduce((s, c) => s + c.score, 0)
                const max = sc.criteria.reduce((s, c) => s + c.maxScore, 0)
                const pct = max > 0 ? Math.round((total / max) * 100) : 0

                return (
                  <tr key={sc.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{getUserName(sc.userId)}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#8a8578', fontFamily: 'Courier New, monospace' }}>
                        {sc.isoCode}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{sc.typeLabel}</td>
                    <td style={{ fontSize: '0.75rem' }}>{sc.criteria.length} criteria</td>
                    <td>
                      <div style={{ fontWeight: 700, fontFamily: 'Georgia, serif' }}>{total}/{max}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6a6a6a' }}>{pct}%</div>
                    </td>
                    <td>
                      <span className={`dt-badge dt-badge--${sc.status}`}>{sc.status}</span>
                    </td>
                    <td>
                      <div className="dt-actions-cell">
                        <button className="dt-btn" onClick={() => setEditing(sc)}>
                          <i className="bx bx-edit" />
                        </button>
                        <button
                          className={`dt-btn ${sc.status === 'draft' ? 'dt-btn--success' : 'dt-btn--warning'}`}
                          onClick={() => handleTogglePublish(sc)}
                        >
                          <i className={`bx ${sc.status === 'draft' ? 'bx-cloud-upload' : 'bx-cloud-download'}`} />
                          {sc.status === 'draft' ? 'Publish' : 'Unpublish'}
                        </button>
                        <button className="dt-btn dt-btn--danger" onClick={() => handleDelete(sc)}>
                          <i className="bx bx-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <ScorecardFormModal onClose={() => setCreating(false)} onSaved={() => { setCreating(false); refresh() }} />
      )}

      {editing && (
        <ScorecardFormModal
          scorecard={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh() }}
        />
      )}
    </div>
  )
}

// ─── Form with dynamic criteria ───────────────────────────────────────────

const DEFAULT_CRITERIA = [
  { name: 'Communication', maxScore: 20 },
  { name: 'Confidence', maxScore: 20 },
  { name: 'Course Knowledge', maxScore: 20 },
  { name: 'University Knowledge', maxScore: 20 },
  { name: 'Study Motivation', maxScore: 20 },
]

function ScorecardFormModal({ scorecard, onClose, onSaved }) {
  const isEdit = Boolean(scorecard)
  const users = dataService.getUsers().filter((u) => u.accountStatus === 'active')
  const results = storageService.get('bpn_results') || []

  const [data, setData] = useState({
    userId: scorecard?.userId || '',
    resultId: scorecard?.resultId || '',
    interviewId: scorecard?.interviewId || '',
    type: scorecard?.type || 'university',
    interviewDate: scorecard?.interviewDate || '',
    criteria: scorecard?.criteria?.length
      ? scorecard.criteria.map((c) => ({ ...c }))
      : DEFAULT_CRITERIA.map((c) => ({ ...c, score: 15, feedback: '' })),
    strengthsText: (scorecard?.strengths || []).join('\n'),
    weaknessesText: (scorecard?.weaknesses || []).join('\n'),
    overallComments: scorecard?.overallComments || '',
    status: scorecard?.status || 'draft',
  })

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const typeLabels = {
    university: 'University Admission Interview',
    ind: 'IND Interview',
    embassy: 'Embassy Interview',
  }

  const userResults = data.userId ? results.filter((r) => r.userId === data.userId) : []

  const handleResultSelect = (e) => {
    const rId = e.target.value
    const r = results.find((x) => x.id === rId)
    if (r) {
      setData({
        ...data,
        resultId: rId,
        interviewId: r.interviewId,
        type: r.type,
        interviewDate: r.interviewDate,
      })
    } else {
      setData({ ...data, resultId: rId })
    }
  }

  const updateCriterion = (idx, field, value) => {
    const next = [...data.criteria]
    next[idx] = { ...next[idx], [field]: field === 'score' || field === 'maxScore' ? Number(value) : value }
    setData({ ...data, criteria: next })
  }

  const addCriterion = () => {
    setData({
      ...data,
      criteria: [...data.criteria, { name: '', score: 15, maxScore: 20, feedback: '' }],
    })
  }

  const removeCriterion = (idx) => {
    setData({ ...data, criteria: data.criteria.filter((_, i) => i !== idx) })
  }

  const loadDefaults = () => {
    if (window.confirm('Replace current criteria with default set?')) {
      setData({
        ...data,
        criteria: DEFAULT_CRITERIA.map((c) => ({ ...c, score: 15, feedback: '' })),
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (data.criteria.length === 0) {
      alert('Add at least one criterion.')
      return
    }

    const payload = {
      userId: data.userId,
      resultId: data.resultId || null,
      interviewId: data.interviewId,
      type: data.type,
      typeLabel: typeLabels[data.type],
      interviewDate: data.interviewDate,
      criteria: data.criteria,
      strengths: data.strengthsText.split('\n').map((s) => s.trim()).filter(Boolean),
      weaknesses: data.weaknessesText.split('\n').map((s) => s.trim()).filter(Boolean),
      overallComments: data.overallComments,
      status: data.status,
    }

    if (isEdit) {
      adminService.updateScorecard(scorecard.id, payload)
    } else {
      adminService.createScorecard(payload)
    }
    onSaved()
  }

  const totalScore = data.criteria.reduce((s, c) => s + Number(c.score || 0), 0)
  const totalMax = data.criteria.reduce((s, c) => s + Number(c.maxScore || 0), 0)
  const overall = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0

  return (
    <AdminModal
      title={isEdit ? 'Edit scorecard' : 'Create new scorecard'}
      onClose={onClose}
      size="xlarge"
      footer={
        <>
          <button className="dt-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="sc-form" className="dt-btn dt-btn--primary">
            <i className="bx bx-check" />
            {isEdit ? 'Save changes' : 'Create scorecard'}
          </button>
        </>
      }
    >
      <form id="sc-form" onSubmit={handleSubmit} className="dt-form">
        <div className="dt-field">
          <label>Student *</label>
          <select required value={data.userId} onChange={set('userId')} disabled={isEdit}>
            <option value="">Select student…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.isoCode}</option>
            ))}
          </select>
        </div>

        {data.userId && userResults.length > 0 && (
          <div className="dt-field">
            <label>Link to result (optional)</label>
            <select value={data.resultId} onChange={handleResultSelect}>
              <option value="">Not linked</option>
              {userResults.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.typeLabel} — {r.totalScore}/{r.maxScore} ({r.status})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>Type *</label>
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

        {/* Dynamic criteria */}
        <div style={{ marginTop: 8 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
            padding: '10px 12px',
            background: '#0a1428',
            color: '#ffffff',
          }}>
            <div>
              <div style={{
                fontSize: '0.6875rem', fontWeight: 700, color: '#f3c896',
                textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3,
              }}>
                Section — Criteria ({data.criteria.length})
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Total: {totalScore}/{totalMax} ({overall}%)
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="dt-btn" onClick={loadDefaults}>
                <i className="bx bx-refresh" /> Defaults
              </button>
              <button type="button" className="dt-btn dt-btn--warning" onClick={addCriterion}>
                <i className="bx bx-plus" /> Add criterion
              </button>
            </div>
          </div>

          {data.criteria.map((c, idx) => (
            <div
              key={idx}
              style={{
                background: '#faf8f3',
                border: '1px solid #e8e5dc',
                padding: 12,
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.25rem',
                  color: '#1a3a6b',
                  minWidth: 26,
                  paddingTop: 6,
                }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
                  <div className="dt-field" style={{ margin: 0 }}>
                    <label>Criterion name *</label>
                    <input
                      required
                      value={c.name}
                      onChange={(e) => updateCriterion(idx, 'name', e.target.value)}
                      placeholder="e.g. Communication"
                    />
                  </div>
                  <div className="dt-field" style={{ margin: 0 }}>
                    <label>Score</label>
                    <input
                      type="number"
                      min="0"
                      max={c.maxScore}
                      value={c.score}
                      onChange={(e) => updateCriterion(idx, 'score', e.target.value)}
                    />
                  </div>
                  <div className="dt-field" style={{ margin: 0 }}>
                    <label>Max</label>
                    <input
                      type="number"
                      min="1"
                      value={c.maxScore}
                      onChange={(e) => updateCriterion(idx, 'maxScore', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="dt-btn dt-btn--danger"
                    onClick={() => removeCriterion(idx)}
                    title="Remove"
                    style={{ height: 38 }}
                  >
                    <i className="bx bx-trash" />
                  </button>
                </div>
              </div>
              <div className="dt-field" style={{ margin: 0 }}>
                <label>Feedback for this criterion</label>
                <textarea
                  value={c.feedback}
                  onChange={(e) => updateCriterion(idx, 'feedback', e.target.value)}
                  placeholder="Specific feedback for this criterion…"
                  style={{ minHeight: 60 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>Strengths (one per line)</label>
            <textarea value={data.strengthsText} onChange={set('strengthsText')} style={{ minHeight: 100 }} />
          </div>
          <div className="dt-field">
            <label>Areas for growth (one per line)</label>
            <textarea value={data.weaknessesText} onChange={set('weaknessesText')} style={{ minHeight: 100 }} />
          </div>
        </div>

        <div className="dt-field">
          <label>Overall comments</label>
          <textarea
            value={data.overallComments}
            onChange={set('overallComments')}
            placeholder="Panel's overall assessment…"
            style={{ minHeight: 80 }}
          />
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

export default ScorecardsPage