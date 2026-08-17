import React, { useState, useMemo } from 'react'
import { dataService } from '../../../services/dataService'
import { adminService } from '../../../services/adminService'
import { fileToCompressedDataURL } from '../../../utils/imageUpload'
import AdminModal from '../components/AdminModal'

function UsersPage({ refresh }) {
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [viewingCreds, setViewingCreds] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const users = useMemo(() => dataService.getUsers(), [refresh])

  const filtered = useMemo(() => {
    let list = users
    if (statusFilter !== 'all') {
      list = list.filter((u) => u.accountStatus === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.isoCode.toLowerCase().includes(q) ||
          u.passportNumber?.toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [users, search, statusFilter])

  const handleDelete = (user) => {
    if (window.confirm(`Delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) {
      adminService.deleteUser(user.id)
      refresh()
    }
  }

  const handleToggleStatus = (user) => {
    const newStatus = user.accountStatus === 'active' ? 'suspended' : 'active'
    adminService.updateUserFull(user.id, { accountStatus: newStatus })
    refresh()
  }

  return (
    <div className="dt-page">
      <div className="dt-page__header">
        <div className="dt-page__title-block">
          <div className="dt-page__eyebrow">User management</div>
          <h1 className="dt-page__title">Users ({users.length})</h1>
          <p className="dt-page__desc">
            View, create, edit, and suspend user accounts.
          </p>
        </div>
        <div className="dt-page__actions">
          <button
            type="button"
            className="dt-btn dt-btn--primary"
            onClick={() => setCreating(true)}
          >
            <i className="bx bx-plus" />
            Create user
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 16,
        padding: '12px 16px',
        background: '#ffffff',
        border: '1px solid #d8d4c8',
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="Search by name, username, ISO, passport…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '8px 12px',
            border: '1px solid #d8d4c8',
            fontSize: '0.875rem',
            fontFamily: 'Poppins, Arial, sans-serif',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d8d4c8',
            fontSize: '0.875rem',
            fontFamily: 'Poppins, Arial, sans-serif',
            background: '#ffffff',
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="dt-empty">
          <i className="bx bx-user-x" />
          <h3>No users match</h3>
          <p>Adjust your filters or create a new user.</p>
        </div>
      ) : (
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ISO Code</th>
                <th>Username</th>
                <th>University</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={u.profileImage}
                        alt=""
                        style={{
                          width: 32, height: 32, borderRadius: '50%',
                          objectFit: 'cover', background: '#f5f3ee',
                          border: '1px solid #ececec',
                        }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=1a3a6b&color=fff&size=64`
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#8a8578' }}>
                          {u.passportNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'Courier New, monospace', fontSize: '0.75rem' }}>
                    {u.isoCode}
                  </td>
                  <td style={{ fontFamily: 'Courier New, monospace', fontSize: '0.75rem' }}>
                    {u.username}
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>
                    {u.university || <span style={{ color: '#b0a99a' }}>Not set</span>}
                  </td>
                  <td>
                    <span className={`dt-badge dt-badge--${u.accountStatus}`}>
                      {u.accountStatus}
                    </span>
                  </td>
                  <td>
                    <div className="dt-actions-cell">
                      <button
                        className="dt-btn"
                        onClick={() => setViewingCreds(u)}
                        title="View credentials"
                      >
                        <i className="bx bx-key" />
                      </button>
                      <button
                        className="dt-btn"
                        onClick={() => setEditing(u)}
                        title="Edit"
                      >
                        <i className="bx bx-edit" />
                      </button>
                      <button
                        className="dt-btn"
                        onClick={() => handleToggleStatus(u)}
                        title={u.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                      >
                        <i className={`bx ${u.accountStatus === 'active' ? 'bx-block' : 'bx-check'}`} />
                      </button>
                      <button
                        className="dt-btn dt-btn--danger"
                        onClick={() => handleDelete(u)}
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
        <UserFormModal
          onClose={() => setCreating(false)}
          onSaved={(newUser) => {
            setCreating(false)
            setViewingCreds(newUser)
            refresh()
          }}
        />
      )}

      {editing && (
        <UserFormModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            refresh()
          }}
        />
      )}

      {viewingCreds && (
        <CredentialsModal
          user={viewingCreds}
          onClose={() => setViewingCreds(null)}
        />
      )}
    </div>
  )
}

// ─── Form ──────────────────────────────────────────────────────────────────

function UserFormModal({ user, onClose, onSaved }) {
  const isEdit = Boolean(user)
  const fileInputRef = React.useRef(null)

  const [data, setData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dateOfBirth: user?.dateOfBirth || '',
    passportNumber: user?.passportNumber || '',
    passportExpiry: user?.passportExpiry || '',
    profileImage: user?.profileImage || '',
    university: user?.university || '',
    course: user?.course || '',
    studyLevel: user?.studyLevel || 'Bachelor',
    accountStatus: user?.accountStatus || 'active',
  })

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [imageSize, setImageSize] = useState(null)

  const hasImage = Boolean(data.profileImage)

  const handleFilePick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')
    setUploading(true)

    try {
      const result = await fileToCompressedDataURL(file)
      setData({ ...data, profileImage: result.dataURL })
      setImageSize({ kb: result.sizeKB, w: result.width, h: result.height })
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }

    e.target.value = ''
  }

  const handleRemoveImage = () => {
    setData({ ...data, profileImage: '' })
    setImageSize(null)
    setUploadError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEdit) {
      adminService.updateUserFull(user.id, data)
      onSaved()
    } else {
      const created = adminService.createUser(data)
      onSaved(created)
    }
  }

  const set = (field) => (e) => setData({ ...data, [field]: e.target.value })

  const initials = `${data.firstName?.[0] || '?'}${data.lastName?.[0] || ''}`.toUpperCase()

  return (
    <AdminModal
      title={isEdit ? `Edit ${user.firstName} ${user.lastName}` : 'Create new user'}
      onClose={onClose}
      size="large"
      footer={
        <>
          <button type="button" className="dt-btn" onClick={onClose}>Cancel</button>
          <button
            type="submit"
            form="user-form"
            className="dt-btn dt-btn--primary"
            disabled={uploading}
          >
            <i className="bx bx-check" />
            {isEdit ? 'Save changes' : 'Create user'}
          </button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit} className="dt-form">
        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>First name *</label>
            <input required value={data.firstName} onChange={set('firstName')} />
          </div>
          <div className="dt-field">
            <label>Last name *</label>
            <input required value={data.lastName} onChange={set('lastName')} />
          </div>
        </div>

        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>Date of birth *</label>
            <input required type="date" value={data.dateOfBirth} onChange={set('dateOfBirth')} />
          </div>
          <div className="dt-field">
            <label>Account status</label>
            <select value={data.accountStatus} onChange={set('accountStatus')}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>Passport number *</label>
            <input required value={data.passportNumber} onChange={set('passportNumber')} />
          </div>
          <div className="dt-field">
            <label>Passport expiry *</label>
            <input required type="date" value={data.passportExpiry} onChange={set('passportExpiry')} />
          </div>
        </div>

        {/* ═══ PROFILE IMAGE UPLOAD ═══ */}
        <div style={{
          background: '#faf8f3',
          border: '1px solid #e8e5dc',
          borderLeft: '3px solid #1a3a6b',
          padding: 16,
          marginTop: 4,
        }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#1a3a6b',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: 12,
          }}>
            Profile image
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 20,
            alignItems: 'flex-start',
          }}>
            {/* Preview */}
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#ffffff',
              border: '2px solid',
              borderColor: hasImage ? '#1d7a47' : uploadError ? '#ae1c28' : '#d8d4c8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
              transition: 'border-color 200ms ease',
            }}>
              {uploading ? (
                <>
                  <div style={{
                    width: 28, height: 28,
                    border: '3px solid #e8e5dc',
                    borderTopColor: '#1a3a6b',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </>
              ) : hasImage ? (
                <>
                  <img
                    src={data.profileImage}
                    alt="Profile preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      // Fallback to avatar if the stored image URL is broken
                      e.target.src = `https://ui-avatars.com/api/?name=${data.firstName || 'U'}+${data.lastName || 'X'}&background=1a3a6b&color=fff&size=200`
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#1d7a47',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}>
                    <i className="bx bx-check" style={{ color: '#ffffff', fontSize: '1rem' }} />
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#b0a99a' }}>
                  {data.firstName || data.lastName ? (
                    <div style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '2rem',
                      color: '#1a3a6b',
                      fontWeight: 400,
                    }}>
                      {initials}
                    </div>
                  ) : (
                    <>
                      <i className="bx bx-image-add" style={{ fontSize: '2rem', display: 'block', marginBottom: 4 }} />
                      <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Preview
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Upload controls */}
            <div style={{ minWidth: 0 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {!hasImage ? (
                <button
                  type="button"
                  className="dt-btn dt-btn--primary"
                  onClick={handleFilePick}
                  disabled={uploading}
                >
                  <i className="bx bx-upload" />
                  {uploading ? 'Processing…' : 'Choose image file'}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="dt-btn"
                    onClick={handleFilePick}
                    disabled={uploading}
                  >
                    <i className="bx bx-refresh" />
                    Change
                  </button>
                  <button
                    type="button"
                    className="dt-btn dt-btn--danger"
                    onClick={handleRemoveImage}
                    disabled={uploading}
                  >
                    <i className="bx bx-trash" />
                    Remove
                  </button>
                </div>
              )}

              {imageSize && !uploadError && (
                <div style={{
                  marginTop: 10,
                  padding: '8px 12px',
                  background: '#ffffff',
                  border: '1px solid rgba(29, 122, 71, 0.3)',
                  borderLeft: '3px solid #1d7a47',
                  fontSize: '0.75rem',
                  color: '#4a4a4a',
                }}>
                  <strong style={{ color: '#1d7a47' }}>
                    <i className="bx bx-check-circle" /> Uploaded:
                  </strong>{' '}
                  {imageSize.w} × {imageSize.h} px · {imageSize.kb} KB
                </div>
              )}

              {uploadError && (
                <div style={{
                  marginTop: 10,
                  padding: '8px 12px',
                  background: 'rgba(174, 28, 40, 0.06)',
                  border: '1px solid rgba(174, 28, 40, 0.2)',
                  borderLeft: '3px solid #ae1c28',
                  fontSize: '0.75rem',
                  color: '#ae1c28',
                  fontWeight: 500,
                }}>
                  {uploadError}
                </div>
              )}

              <div style={{
                fontSize: '0.6875rem',
                color: '#8a8578',
                marginTop: 10,
                lineHeight: 1.5,
              }}>
                Accepted: JPEG, PNG, WebP, GIF · max 5 MB · auto-resized to 400×400
              </div>
            </div>
          </div>
        </div>

        <div className="dt-field dt-field--half">
          <div className="dt-field">
            <label>University</label>
            <input value={data.university} onChange={set('university')} placeholder="e.g. University of Amsterdam" />
          </div>
          <div className="dt-field">
            <label>Study level</label>
            <select value={data.studyLevel} onChange={set('studyLevel')}>
              <option value="Bachelor">Bachelor</option>
              <option value="Pre-Master">Pre-Master</option>
              <option value="Foundation">Foundation</option>
            </select>
          </div>
        </div>

        <div className="dt-field">
          <label>Course</label>
          <input value={data.course} onChange={set('course')} placeholder="e.g. Computer Science" />
        </div>

        {!isEdit && (
          <div style={{
            padding: '12px 14px',
            background: '#faf8f3',
            borderLeft: '3px solid #1a3a6b',
            fontSize: '0.8125rem',
            color: '#4a4a4a',
          }}>
            <strong>Auto-generated:</strong> Username, password, and ISO code will be created automatically. You'll see them after saving.
          </div>
        )}
      </form>
    </AdminModal>
  )
}

// ─── Credentials modal ─────────────────────────────────────────────────────

function CredentialsModal({ user, onClose }) {
  const [copied, setCopied] = useState('')

  const copy = (text, label) => {
    navigator.clipboard?.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <AdminModal
      title={`Credentials for ${user.firstName} ${user.lastName}`}
      onClose={onClose}
      size="default"
      footer={
        <button type="button" className="dt-btn dt-btn--primary" onClick={onClose}>
          Close
        </button>
      }
    >
      <div style={{
        padding: '14px 16px',
        background: '#faf8f3',
        borderLeft: '3px solid #e8820c',
        marginBottom: 16,
        fontSize: '0.8125rem',
        color: '#4a4a4a',
      }}>
        Share these credentials with the student securely. They can be used to sign in at <code>/login</code>.
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
              <input
                readOnly
                value={item.value}
                style={{
                  flex: 1,
                  fontFamily: 'Courier New, monospace',
                  background: '#ffffff',
                }}
              />
              <button
                type="button"
                className="dt-btn"
                onClick={() => copy(item.value, item.label)}
                title="Copy"
              >
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

export default UsersPage