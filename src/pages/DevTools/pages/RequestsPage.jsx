import React, { useState, useMemo } from 'react'
import { dataService } from '../../../services/dataService'
import { adminService } from '../../../services/adminService'
import AdminModal from '../components/AdminModal'

function RequestsPage({ refresh }) {
  const [tab, setTab] = useState('registration')
  const [viewingCreds, setViewingCreds] = useState(null)
  const [rejecting, setRejecting] = useState(null)

  const regRequests = useMemo(
    () => dataService.getRegistrationRequests()
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [refresh]
  )

  const intRequests = useMemo(
    () => dataService.getInterviewRequests()
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [refresh]
  )

  const handleApproveReg = (req) => {
    if (window.confirm(`Approve registration for ${req.firstName} ${req.lastName}? This will create a user account.`)) {
      const result = adminService.approveRegistrationRequest(req.requestId)
      if (result) {
        setViewingCreds(result.user)
        refresh()
      }
    }
  }

  const handleRejectReg = (req, reason) => {
    adminService.rejectRegistrationRequest(req.requestId, reason)
    setRejecting(null)
    refresh()
  }

  return (
    <div className="dt-page">
      <div className="dt-page__header">
        <div className="dt-page__title-block">
          <div className="dt-page__eyebrow">Incoming requests</div>
          <h1 className="dt-page__title">Requests</h1>
          <p className="dt-page__desc">
            Registration requests from new users and interview requests from existing users.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        <button
          onClick={() => setTab('registration')}
          className={`dt-btn ${tab === 'registration' ? 'dt-btn--primary' : ''}`}
        >
          Registration ({regRequests.filter((r) => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setTab('interview')}
          className={`dt-btn ${tab === 'interview' ? 'dt-btn--primary' : ''}`}
        >
          Interview ({intRequests.filter((r) => r.status === 'pending').length})
        </button>
      </div>

      {tab === 'registration' && (
        <RegistrationRequests
          requests={regRequests}
          onApprove={handleApproveReg}
          onReject={setRejecting}
        />
      )}

      {tab === 'interview' && (
        <InterviewRequests
          requests={intRequests}
          refresh={refresh}
        />
      )}

      {viewingCreds && (
        <CredentialsShare user={viewingCreds} onClose={() => setViewingCreds(null)} />
      )}

      {rejecting && (
        <RejectModal
          request={rejecting}
          onClose={() => setRejecting(null)}
          onConfirm={(reason) => handleRejectReg(rejecting, reason)}
        />
      )}
    </div>
  )
}

// ─── Registration requests ─────────────────────────────────────────────────

function RegistrationRequests({ requests, onApprove, onReject }) {
  if (requests.length === 0) {
    return (
      <div className="dt-empty">
        <i className="bx bx-inbox" />
        <h3>No registration requests</h3>
        <p>New requests will appear here.</p>
      </div>
    )
  }

  return (
    <div className="dt-table-wrap">
      <table className="dt-table">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Passport</th>
            <th>Ref ID</th>
            <th>Submitted</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>
                <div style={{ fontWeight: 600 }}>{r.firstName} {r.lastName}</div>
                <div style={{ fontSize: '0.6875rem', color: '#8a8578' }}>
                  DOB: {new Date(r.dateOfBirth).toLocaleDateString('en-GB')}
                </div>
              </td>
              <td style={{ fontFamily: 'Courier New, monospace', fontSize: '0.75rem' }}>
                <div>{r.passportNumber}</div>
                <div style={{ color: '#8a8578' }}>
                  Expires {new Date(r.passportExpiry).toLocaleDateString('en-GB')}
                </div>
              </td>
              <td style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6875rem' }}>
                {r.requestId}
              </td>
              <td style={{ fontSize: '0.75rem', color: '#6a6a6a' }}>
                {new Date(r.submittedAt).toLocaleDateString('en-GB')}
              </td>
              <td>
                <span className={`dt-badge dt-badge--${r.status}`}>{r.status}</span>
              </td>
              <td>
                {r.status === 'pending' ? (
                  <div className="dt-actions-cell">
                    <button
                      className="dt-btn dt-btn--success"
                      onClick={() => onApprove(r)}
                    >
                      <i className="bx bx-check" />
                      Approve
                    </button>
                    <button
                      className="dt-btn dt-btn--danger"
                      onClick={() => onReject(r)}
                    >
                      <i className="bx bx-x" />
                      Reject
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#8a8578' }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Interview requests ────────────────────────────────────────────────────

function InterviewRequests({ requests, refresh }) {
  const [scheduling, setScheduling] = useState(null)
  const [viewing, setViewing] = useState(null)

  if (requests.length === 0) {
    return (
      <div className="dt-empty">
        <i className="bx bx-calendar-x" />
        <h3>No interview requests</h3>
        <p>Requests from students will appear here.</p>
      </div>
    )
  }

  const typeIcons = {
    university: 'bx-book-open',
    ind: 'bx-shield-quarter',
    embassy: 'bx-buildings',
  }

  const getUserName = (userId) => {
    const u = dataService.getUserById(userId)
    return u ? `${u.firstName} ${u.lastName}` : userId
  }

  return (
    <>
      <div className="dt-table-wrap">
        <table className="dt-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>Ref ID</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{getUserName(r.userId)}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#8a8578', fontFamily: 'Courier New, monospace' }}>
                    {r.isoCode}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className={`bx ${typeIcons[r.type]}`} style={{ color: '#1a3a6b' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{r.typeLabel}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6875rem' }}>
                  {r.requestId}
                </td>
                <td style={{ fontSize: '0.75rem', color: '#6a6a6a' }}>
                  {new Date(r.submittedAt).toLocaleDateString('en-GB')}
                </td>
                <td>
                  <span className={`dt-badge dt-badge--${r.status}`}>{r.status}</span>
                </td>
                <td>
                  <div className="dt-actions-cell">
                    <button className="dt-btn" onClick={() => setViewing(r)}>
                      <i className="bx bx-show" />
                      View
                    </button>
                    {r.status === 'pending' && (
                      <button
                        className="dt-btn dt-btn--success"
                        onClick={() => setScheduling(r)}
                      >
                        <i className="bx bx-calendar-plus" />
                        Schedule
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {scheduling && (
        <ScheduleInterviewModal
          request={scheduling}
          onClose={() => setScheduling(null)}
          onSaved={() => {
            setScheduling(null)
            refresh()
          }}
        />
      )}

      {viewing && (
        <ViewRequestModal request={viewing} onClose={() => setViewing(null)} />
      )}
    </>
  )
}

// ─── Schedule interview from request ──────────────────────────────────────

function ScheduleInterviewModal({ request, onClose, onSaved }) {
  const [data, setData] = useState({
    date: '',
    time: '',
    duration: 30,
    meetLink: '',
    interviewerName: '',
    instructions: '',
  })

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    adminService.scheduleInterview({
      userId: request.userId,
      type: request.type,
      typeLabel: request.typeLabel,
      university: request.personalDetails?.university || request.universityDetails?.universityName,
      course: request.personalDetails?.course || request.universityDetails?.course,
      date: data.date,
      time: data.time,
      duration: Number(data.duration),
      meetLink: data.meetLink,
      interviewerName: data.interviewerName,
      instructions: data.instructions,
      linkedRequestId: request.requestId,
    })
    onSaved()
  }

  return (
    <AdminModal
      title={`Schedule: ${request.typeLabel}`}
      onClose={onClose}
      size="large"
      footer={
        <>
          <button type="button" className="dt-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="schedule-form" className="dt-btn dt-btn--primary">
            <i className="bx bx-calendar-check" />
            Schedule & notify student
          </button>
        </>
      }
    >
      <div style={{
        padding: '12px 14px',
        background: '#faf8f3',
        borderLeft: '3px solid #1a3a6b',
        marginBottom: 16,
        fontSize: '0.8125rem',
      }}>
        <div><strong>Student:</strong> {dataService.getUserById(request.userId)?.firstName} {dataService.getUserById(request.userId)?.lastName}</div>
        <div><strong>Request ID:</strong> <code>{request.requestId}</code></div>
      </div>

      <form id="schedule-form" onSubmit={handleSubmit} className="dt-form">
        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>Date *</label>
            <input required type="date" value={data.date} onChange={set('date')} min={new Date().toISOString().split('T')[0]} />
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
            Create the meeting at <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer">meet.google.com</a> and paste the link here.
          </div>
        </div>

        <div className="dt-field">
          <label>Interviewer name *</label>
          <input required value={data.interviewerName} onChange={set('interviewerName')} placeholder="e.g. Dr. Van der Berg" />
        </div>

        <div className="dt-field">
          <label>Instructions for the student</label>
          <textarea
            value={data.instructions}
            onChange={set('instructions')}
            placeholder="e.g. Please have your passport and offer letter ready. Join 5 minutes early."
          />
        </div>
      </form>
    </AdminModal>
  )
}

// ─── View request details ─────────────────────────────────────────────────

function ViewRequestModal({ request, onClose }) {
  const details = request.universityDetails || request.indDetails || request.embassyDetails
  const detailsLabel = request.universityDetails ? 'University details' :
    request.indDetails ? 'IND details' : 'Embassy details'

  return (
    <AdminModal
      title={`Request ${request.requestId}`}
      onClose={onClose}
      size="large"
      footer={<button type="button" className="dt-btn dt-btn--primary" onClick={onClose}>Close</button>}
    >
      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', margin: '0 0 8px' }}>Personal details</h3>
      <pre style={{
        background: '#faf8f3',
        padding: 12,
        border: '1px solid #e8e5dc',
        fontSize: '0.75rem',
        overflow: 'auto',
        marginBottom: 16,
      }}>
        {JSON.stringify(request.personalDetails, null, 2)}
      </pre>

      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', margin: '0 0 8px' }}>{detailsLabel}</h3>
      <pre style={{
        background: '#faf8f3',
        padding: 12,
        border: '1px solid #e8e5dc',
        fontSize: '0.75rem',
        overflow: 'auto',
      }}>
        {JSON.stringify(details, null, 2)}
      </pre>
    </AdminModal>
  )
}

// ─── Reject modal ─────────────────────────────────────────────────────────

function RejectModal({ request, onClose, onConfirm }) {
  const [reason, setReason] = useState('')

  return (
    <AdminModal
      title="Reject registration request"
      onClose={onClose}
      footer={
        <>
          <button className="dt-btn" onClick={onClose}>Cancel</button>
          <button className="dt-btn dt-btn--danger" onClick={() => onConfirm(reason)}>
            Reject request
          </button>
        </>
      }
    >
      <p style={{ margin: '0 0 12px', fontSize: '0.875rem', color: '#4a4a4a' }}>
        Rejecting <strong>{request.firstName} {request.lastName}</strong>'s registration request.
      </p>
      <div className="dt-field">
        <label>Reason (optional)</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this being rejected?" />
      </div>
    </AdminModal>
  )
}

// ─── Credentials share (reused pattern) ──────────────────────────────────

function CredentialsShare({ user, onClose }) {
  const [copied, setCopied] = useState('')
  const copy = (text, label) => {
    navigator.clipboard?.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <AdminModal
      title="✓ Account created — share credentials"
      onClose={onClose}
      footer={<button className="dt-btn dt-btn--primary" onClick={onClose}>Done</button>}
    >
      <div style={{
        padding: '12px 14px',
        background: 'rgba(29, 122, 71, 0.08)',
        borderLeft: '3px solid #1d7a47',
        marginBottom: 16,
        fontSize: '0.8125rem',
        color: '#155c35',
      }}>
        <strong>Account created for {user.firstName} {user.lastName}.</strong>
        <div style={{ marginTop: 4 }}>Send these credentials to the student securely.</div>
      </div>
      <div className="dt-form">
        {[
          { label: 'ISO Code', value: user.isoCode },
          { label: 'Username', value: user.username },
          { label: 'Password', value: user.password },
        ].map((item) => (
          <div key={item.label} className="dt-field">
            <label>{item.label}</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input readOnly value={item.value} style={{ flex: 1, fontFamily: 'Courier New, monospace' }} />
              <button type="button" className="dt-btn" onClick={() => copy(item.value, item.label)}>
                <i className={`bx ${copied === item.label ? 'bx-check' : 'bx-copy'}`} />
                {copied === item.label ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminModal>
  )
}

export default RequestsPage