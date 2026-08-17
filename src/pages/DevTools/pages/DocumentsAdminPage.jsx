import React, { useMemo, useState } from 'react'
import { dataService } from '../../../services/dataService'

function DocumentsAdminPage({ refresh }) {
  const [selectedUserId, setSelectedUserId] = useState('all')

  const users = useMemo(() => dataService.getUsers(), [refresh])
  const defs = useMemo(() => dataService.getDocumentDefinitions(), [refresh])
  const allStatuses = useMemo(() => dataService.getDocumentStatuses(), [refresh])

  const filteredStatuses = useMemo(() => {
    if (selectedUserId === 'all') return allStatuses
    return allStatuses.filter((s) => s.userId === selectedUserId)
  }, [allStatuses, selectedUserId])

  const getUser = (userId) => dataService.getUserById(userId)
  const getDoc = (docId) => defs.documents.find((d) => d.id === docId)
  const getCat = (catId) => defs.categories.find((c) => c.id === catId)

  // Summary per user
  const userSummaries = useMemo(() => {
    return users.map((u) => {
      const statuses = allStatuses.filter((s) => s.userId === u.id)
      const ready = statuses.filter((s) => s.status === 'ready').length
      const preparing = statuses.filter((s) => s.status === 'preparing').length
      const na = statuses.filter((s) => s.status === 'not_applicable').length
      const total = defs.documents.length
      const effective = total - na
      const pct = effective > 0 ? Math.round((ready / effective) * 100) : 0
      return { user: u, ready, preparing, total, pct }
    })
  }, [users, allStatuses, defs])

  return (
    <div className="dt-page">
      <div className="dt-page__header">
        <div className="dt-page__title-block">
          <div className="dt-page__eyebrow">Document tracker</div>
          <h1 className="dt-page__title">Document statuses</h1>
          <p className="dt-page__desc">
            View document preparation across all students. Students manage their own status; this is a read-only overview.
          </p>
        </div>
      </div>

      {/* Per-user summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        {userSummaries.map(({ user, ready, preparing, total, pct }) => (
          <div
            key={user.id}
            style={{
              background: '#ffffff',
              border: '1px solid #d8d4c8',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <img
                src={user.profileImage}
                alt=""
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  objectFit: 'cover', border: '1px solid #ececec',
                  background: '#f5f3ee',
                }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=1a3a6b&color=fff&size=64`
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#8a8578', fontFamily: 'Courier New, monospace' }}>
                  {user.isoCode}
                </div>
              </div>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.375rem',
                color: pct >= 80 ? '#1d7a47' : pct >= 40 ? '#e8820c' : '#ae1c28',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {pct}%
              </div>
            </div>

            <div style={{
              height: 4,
              background: '#f0edE6',
              overflow: 'hidden',
              marginBottom: 8,
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: pct >= 80 ? '#1d7a47' : pct >= 40 ? '#e8820c' : '#ae1c28',
                transition: 'width 400ms ease',
              }} />
            </div>

            <div style={{ fontSize: '0.75rem', color: '#6a6a6a' }}>
              <strong>{ready}</strong> ready · <strong>{preparing}</strong> preparing · out of <strong>{total}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed table */}
      <div style={{
        padding: '12px 16px', background: '#ffffff', border: '1px solid #d8d4c8',
        marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Filter by user:</label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          style={{
            padding: '6px 10px', fontSize: '0.8125rem',
            border: '1px solid #d8d4c8', background: '#ffffff',
          }}
        >
          <option value="all">All users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
          ))}
        </select>
        <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#8a8578' }}>
          {filteredStatuses.length} status record{filteredStatuses.length !== 1 ? 's' : ''}
        </div>
      </div>

      {filteredStatuses.length === 0 ? (
        <div className="dt-empty">
          <i className="bx bx-file" />
          <h3>No status records</h3>
          <p>Students haven't updated any documents yet.</p>
        </div>
      ) : (
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Document</th>
                <th>Category</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredStatuses.map((s, idx) => {
                const user = getUser(s.userId)
                const doc = getDoc(s.documentId)
                const cat = doc ? getCat(doc.categoryId) : null

                return (
                  <tr key={`${s.userId}-${s.documentId}-${idx}`}>
                    <td>
                      {user ? (
                        <>
                          <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: '#8a8578', fontFamily: 'Courier New, monospace' }}>
                            {user.isoCode}
                          </div>
                        </>
                      ) : (
                        <span style={{ color: '#b0a99a' }}>Unknown user</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {doc ? doc.name : s.documentId}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#6a6a6a' }}>
                      {cat ? cat.label : '—'}
                    </td>
                    <td>
                      <span className={`dt-badge dt-badge--${
                        s.status === 'ready' ? 'active' :
                        s.status === 'preparing' ? 'pending' :
                        s.status === 'not_applicable' ? 'cancelled' : 'draft'
                      }`}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#6a6a6a', maxWidth: 240 }}>
                      {s.notes || <span style={{ color: '#b0a99a' }}>—</span>}
                    </td>
                    <td style={{ fontSize: '0.6875rem', color: '#8a8578' }}>
                      {new Date(s.updatedAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DocumentsAdminPage