import React, { useState, useRef, useMemo } from 'react'
import { adminService } from '../../../services/adminService'
import { remoteDataService } from '../../../services/remoteDataService'
import AdminModal from '../components/AdminModal'

function DataPage({ refresh }) {
  const [importPreview, setImportPreview] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmForceRefresh, setConfirmForceRefresh] = useState(false)
  const [confirmClear, setConfirmClear] = useState(null)
  const [confirmPublish, setConfirmPublish] = useState(false)
  const [refreshingRemote, setRefreshingRemote] = useState(false)
  const [toast, setToast] = useState('')
  const fileInputRef = useRef(null)

  const lastSync = useMemo(() => remoteDataService.getLastSyncTime(), [refresh])
  const hasBeenSeeded = useMemo(() => remoteDataService.hasBeenSeeded(), [refresh])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(''), 3500)
  }

  const doRefreshContent = async () => {
    setRefreshingRemote(true)
    try {
      const result = await adminService.refreshFromRemote(false)
      showToast(
        `Content refreshed: ${result.loaded.length} content file${result.loaded.length !== 1 ? 's' : ''} updated. Your admin data was preserved.`
      )
      refresh()
    } catch (err) {
      console.error(err)
      showToast('Refresh failed. Check console for details.', 'error')
    } finally {
      setRefreshingRemote(false)
    }
  }

  const doForceRefresh = async () => {
    setConfirmForceRefresh(false)
    setRefreshingRemote(true)
    try {
      const result = await adminService.refreshFromRemote(true)
      showToast(
        `Force refreshed: ${result.loaded.length} file${result.loaded.length !== 1 ? 's' : ''} reloaded from source.`
      )
      refresh()
    } catch (err) {
      console.error(err)
      showToast('Refresh failed. Check console for details.', 'error')
    } finally {
      setRefreshingRemote(false)
    }
  }

  const handlePublish = async () => {
    setConfirmPublish(false)
    const files = await adminService.downloadPublishBundle()
    showToast(`Downloaded ${files.length} JSON files. Drop them into public/data/ and redeploy.`)
  }

  const handleExport = () => {
    const data = adminService.exportAllData()
    adminService.downloadJsonFile(`bpn-backup-${new Date().toISOString().split('T')[0]}.json`, data)
    showToast('Backup downloaded.')
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        const validation = adminService.validateImportData(parsed)
        if (!validation.valid) {
          showToast(`Import failed: ${validation.error}`, 'error')
          return
        }
        setImportPreview({ data: parsed, summary: validation.summary, fileName: file.name })
      } catch (err) {
        showToast('Invalid JSON file.', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleConfirmImport = () => {
    adminService.importAllData(importPreview.data)
    setImportPreview(null)
    refresh()
    showToast('Data imported successfully.')
  }

  const handleReset = () => {
    adminService.resetToSeed()
    setConfirmReset(false)
    refresh()
    showToast('Data reset to seed successfully.')
  }

  const handleClearCollection = () => {
    adminService.clearCollection(confirmClear)
    setConfirmClear(null)
    refresh()
    showToast(`Collection cleared.`)
  }

  const formatSyncTime = (iso) => {
    if (!iso) return 'Never'
    const d = new Date(iso)
    const now = new Date()
    const diff = (now - d) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleString('en-GB')
  }

  return (
    <div className="dt-page">
      <div className="dt-page__header">
        <div className="dt-page__title-block">
          <div className="dt-page__eyebrow">Data management</div>
          <h1 className="dt-page__title">Publish & sync</h1>
          <p className="dt-page__desc">
            Publish your changes so every user sees them. Your admin work is preserved
            across refreshes — the app only re-seeds from remote on first visit or when
            you force it.
          </p>
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%',
          transform: 'translateX(-50%)', zIndex: 10001,
          padding: '12px 24px',
          background: toast.type === 'error' ? '#ae1c28' : '#1d7a47',
          color: '#ffffff',
          fontSize: '0.875rem', fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          maxWidth: 500,
        }}>
          <i className={`bx ${toast.type === 'error' ? 'bx-error-circle' : 'bx-check-circle'}`} style={{ marginRight: 8 }} />
          {toast.msg}
        </div>
      )}

      {/* ═══ HOW IT WORKS (short primer) ═══ */}
      <div style={{
        background: '#faf8f3',
        border: '1px solid #e8e5dc',
        borderLeft: '3px solid #1a3a6b',
        padding: '14px 18px',
        marginBottom: 24,
      }}>
        <div style={{
          fontSize: '0.6875rem', fontWeight: 700, color: '#1a3a6b',
          textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8,
        }}>
          How data persistence works
        </div>
        <ul style={{
          margin: 0, paddingLeft: 20, fontSize: '0.8125rem', lineHeight: 1.75, color: '#4a4a4a',
        }}>
          <li>
            <strong>Your admin work is safe:</strong> users, interviews, results, and scorecards
            you create persist in LocalStorage. Refreshing the page keeps everything.
          </li>
          <li>
            <strong>First visit:</strong> the app seeds data from <code>public/data/</code>.
            Later visits use LocalStorage as the source of truth.
          </li>
          <li>
            <strong>To publish changes for other users:</strong> download the JSON bundle
            below and commit it to <code>public/data/</code>.
          </li>
        </ul>
      </div>

      {/* ═══ PUBLISH SECTION (most important) ═══ */}
      <div style={{
        background: 'linear-gradient(160deg, #1a3a6b 0%, #0f2444 100%)',
        color: '#ffffff',
        padding: 24,
        marginBottom: 24,
        border: '1px solid #0a1428',
      }}>
        <div style={{
          fontSize: '0.6875rem', fontWeight: 700, color: '#f3c896',
          textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8,
        }}>
          Publish to production
        </div>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.5rem', margin: '0 0 8px', color: '#ffffff',
        }}>
          Push your changes live
        </h2>
        <p style={{
          fontSize: '0.9375rem', color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.65, margin: '0 0 20px', maxWidth: 620,
        }}>
          Download all portal data as JSON files, then drop them into your{' '}
          <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 2 }}>
            public/data/
          </code> folder. After redeploying, every visitor sees your updates on first visit.
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: 16,
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: '0.6875rem', fontWeight: 700, color: '#f3c896',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8,
          }}>
            Publish steps
          </div>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: '0.875rem', lineHeight: 1.85, color: 'rgba(255,255,255,0.9)' }}>
            <li>Click <strong>"Download publish bundle"</strong> below — 11 JSON files download</li>
            <li>Move them into your project's <code>public/data/</code> folder (overwrite the existing ones)</li>
            <li>Commit &amp; push to your git repo</li>
            <li>Netlify / Vercel auto-redeploys in ~30 seconds</li>
            <li>New visitors see the update on first load; existing visitors keep their local state</li>
          </ol>
        </div>

        <button
          onClick={() => setConfirmPublish(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px',
            background: '#e8820c',
            color: '#ffffff',
            border: 'none',
            fontFamily: 'Poppins, Arial, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          <i className="bx bx-cloud-upload" style={{ fontSize: '1.25rem' }} />
          Download publish bundle
        </button>
      </div>

      {/* ═══ REMOTE SYNC ═══ */}
      <div style={{ background: '#ffffff', border: '1px solid #d8d4c8', padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 4,
            background: 'rgba(26, 58, 107, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <i className="bx bx-sync" style={{ fontSize: '1.5rem', color: '#1a3a6b' }} />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.125rem', margin: '0 0 6px' }}>
              Refresh from deployed data
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6a6a6a', margin: '0 0 8px', lineHeight: 1.6 }}>
              Pull the latest data from <code>{remoteDataService.REMOTE_BASE}/*.json</code>. Choose:
            </p>
            <ul style={{ fontSize: '0.75rem', color: '#6a6a6a', margin: '0 0 12px', paddingLeft: 18, lineHeight: 1.7 }}>
              <li>
                <strong>Refresh content only</strong> — updates blogs, universities, and document
                catalogue. Your users, interviews, results, and scorecards are preserved.
              </li>
              <li>
                <strong>Force refresh everything</strong> — wipes ALL local data and re-seeds
                from <code>public/data/</code>. Use only if you want to reset to the published state.
              </li>
            </ul>
            <p style={{ fontSize: '0.75rem', color: '#8a8578', margin: '0 0 12px' }}>
              Last sync: <strong>{formatSyncTime(lastSync)}</strong>
              {!hasBeenSeeded && (
                <span style={{ marginLeft: 12, color: '#e8820c' }}>
                  ⚠ Data not yet seeded on this browser
                </span>
              )}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                className="dt-btn dt-btn--primary"
                onClick={doRefreshContent}
                disabled={refreshingRemote}
              >
                <i className={`bx ${refreshingRemote ? 'bx-loader-alt bx-spin' : 'bx-refresh'}`} />
                {refreshingRemote ? 'Refreshing…' : 'Refresh content only'}
              </button>
              <button
                className="dt-btn dt-btn--warning"
                onClick={() => setConfirmForceRefresh(true)}
                disabled={refreshingRemote}
              >
                <i className="bx bx-refresh" />
                Force refresh everything
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BACKUP / IMPORT / RESET ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#ffffff', border: '1px solid #d8d4c8', padding: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 4,
            background: 'rgba(29, 122, 71, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            <i className="bx bx-cloud-download" style={{ fontSize: '1.5rem', color: '#1d7a47' }} />
          </div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.125rem', margin: '0 0 6px' }}>
            Full backup
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#6a6a6a', margin: '0 0 12px', lineHeight: 1.6 }}>
            Download a single JSON containing everything — for archival or safe migration.
          </p>
          <button className="dt-btn dt-btn--success" onClick={handleExport}>
            <i className="bx bx-download" />
            Download backup
          </button>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #d8d4c8', padding: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 4,
            background: 'rgba(26, 58, 107, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            <i className="bx bx-cloud-upload" style={{ fontSize: '1.5rem', color: '#1a3a6b' }} />
          </div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.125rem', margin: '0 0 6px' }}>
            Import backup
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#6a6a6a', margin: '0 0 12px', lineHeight: 1.6 }}>
            Restore a previous backup. You'll see a preview before anything is overwritten.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button className="dt-btn dt-btn--primary" onClick={() => fileInputRef.current?.click()}>
            <i className="bx bx-upload" />
            Select JSON file
          </button>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #d8d4c8', padding: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 4,
            background: 'rgba(232, 130, 12, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            <i className="bx bx-refresh" style={{ fontSize: '1.5rem', color: '#e8820c' }} />
          </div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.125rem', margin: '0 0 6px' }}>
            Reset to seed
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#6a6a6a', margin: '0 0 12px', lineHeight: 1.6 }}>
            Wipe local data and re-fetch from remote. Cannot be undone.
          </p>
          <button className="dt-btn dt-btn--warning" onClick={() => setConfirmReset(true)}>
            <i className="bx bx-reset" />
            Reset all data
          </button>
        </div>
      </div>

      {/* Clear specific */}
      <div style={{ background: '#ffffff', border: '1px solid #d8d4c8', padding: 20 }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.125rem', margin: '0 0 6px' }}>
          Clear specific collection
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#6a6a6a', margin: '0 0 16px', lineHeight: 1.6 }}>
          Delete all records of a specific type without touching the rest.
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { key: 'users', label: 'Clear users' },
            { key: 'interviews', label: 'Clear interviews' },
            { key: 'interviewRequests', label: 'Clear interview requests' },
            { key: 'registrationRequests', label: 'Clear registration requests' },
            { key: 'results', label: 'Clear results' },
            { key: 'scorecards', label: 'Clear scorecards' },
            { key: 'notifications', label: 'Clear notifications' },
            { key: 'documentStatuses', label: 'Clear document statuses' },
          ].map((c) => (
            <button
              key={c.key}
              className="dt-btn dt-btn--danger"
              onClick={() => setConfirmClear(c.key)}
            >
              <i className="bx bx-trash" />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════ MODALS ═══════════ */}

      {confirmPublish && (
        <AdminModal
          title="Download publish bundle?"
          onClose={() => setConfirmPublish(false)}
          size="default"
          footer={
            <>
              <button className="dt-btn" onClick={() => setConfirmPublish(false)}>Cancel</button>
              <button className="dt-btn dt-btn--warning" onClick={handlePublish}>
                <i className="bx bx-cloud-upload" />
                Download all files
              </button>
            </>
          }
        >
          <p style={{ margin: '0 0 12px', fontSize: '0.9375rem', color: '#4a4a4a', lineHeight: 1.65 }}>
            Your browser will download <strong>11 JSON files</strong> — one per data collection.
          </p>
          <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: '#6a6a6a', lineHeight: 1.65 }}>
            After downloading:
          </p>
          <ol style={{ paddingLeft: 20, fontSize: '0.8125rem', color: '#4a4a4a', lineHeight: 1.75 }}>
            <li>Open your project folder</li>
            <li>Move all downloaded files into <code>public/data/</code></li>
            <li>Confirm the overwrite when prompted</li>
            <li><code>git add public/data && git commit -m "Update portal data" && git push</code></li>
            <li>Wait ~30 seconds for auto-deploy</li>
          </ol>
          <div style={{
            padding: '10px 14px',
            background: '#faf8f3',
            borderLeft: '3px solid #e8820c',
            marginTop: 12,
            fontSize: '0.8125rem',
            color: '#4a4a4a',
          }}>
            <strong>Tip:</strong> Your browser may ask permission to download multiple files at once — click "Allow".
          </div>
        </AdminModal>
      )}

      {importPreview && (
        <AdminModal
          title="Confirm data import"
          onClose={() => setImportPreview(null)}
          size="default"
          footer={
            <>
              <button className="dt-btn" onClick={() => setImportPreview(null)}>Cancel</button>
              <button className="dt-btn dt-btn--warning" onClick={handleConfirmImport}>
                <i className="bx bx-cloud-upload" />
                Import & overwrite
              </button>
            </>
          }
        >
          <div style={{ marginBottom: 16, padding: 12, background: '#faf8f3', borderLeft: '3px solid #e8820c' }}>
            <strong>File:</strong> <code>{importPreview.fileName}</code>
          </div>
          <p style={{ margin: '0 0 12px', fontSize: '0.875rem' }}>
            The following data will be imported and will <strong>overwrite existing data</strong>:
          </p>
          <div style={{
            background: '#ffffff',
            border: '1px solid #d8d4c8',
            padding: 14,
            fontSize: '0.8125rem',
            fontFamily: 'Courier New, monospace',
          }}>
            {Object.entries(importPreview.summary).map(([key, count]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{key}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </AdminModal>
      )}

      {confirmForceRefresh && (
        <AdminModal
          title="Force refresh everything?"
          onClose={() => setConfirmForceRefresh(false)}
          size="default"
          footer={
            <>
              <button className="dt-btn" onClick={() => setConfirmForceRefresh(false)}>Cancel</button>
              <button className="dt-btn dt-btn--danger" onClick={doForceRefresh}>
                <i className="bx bx-refresh" />
                Yes, wipe & re-fetch
              </button>
            </>
          }
        >
          <p style={{ fontSize: '0.9375rem', color: '#4a4a4a', lineHeight: 1.65, margin: '0 0 12px' }}>
            This will <strong>wipe all local admin data</strong> — including any users, interviews, results,
            or scorecards you've created here — and reload everything from{' '}
            <code>{remoteDataService.REMOTE_BASE}/*.json</code>.
          </p>
          <div style={{
            padding: '10px 14px',
            background: 'rgba(174, 28, 40, 0.08)',
            borderLeft: '3px solid #ae1c28',
            fontSize: '0.8125rem',
            color: '#ae1c28',
            fontWeight: 500,
          }}>
            Consider downloading a backup first if you have unpublished work.
          </div>
        </AdminModal>
      )}

      {confirmReset && (
        <AdminModal
          title="Reset all data?"
          onClose={() => setConfirmReset(false)}
          size="compact"
          footer={
            <>
              <button className="dt-btn" onClick={() => setConfirmReset(false)}>Cancel</button>
              <button className="dt-btn dt-btn--danger" onClick={handleReset}>
                <i className="bx bx-reset" />
                Reset everything
              </button>
            </>
          }
        >
          <p style={{ fontSize: '0.9375rem', color: '#4a4a4a', lineHeight: 1.65, margin: 0 }}>
            This will <strong>wipe all local data</strong> and clear the seeded flag. On the next
            page load, the app will re-fetch fresh from your deployed JSON files.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#ae1c28', fontWeight: 600, marginTop: 12 }}>
            Consider downloading a backup first.
          </p>
        </AdminModal>
      )}

      {confirmClear && (
        <AdminModal
          title={`Clear ${confirmClear}?`}
          onClose={() => setConfirmClear(null)}
          size="compact"
          footer={
            <>
              <button className="dt-btn" onClick={() => setConfirmClear(null)}>Cancel</button>
              <button className="dt-btn dt-btn--danger" onClick={handleClearCollection}>
                <i className="bx bx-trash" />
                Clear collection
              </button>
            </>
          }
        >
          <p style={{ fontSize: '0.9375rem', color: '#4a4a4a', lineHeight: 1.65, margin: 0 }}>
            All records in <code>{confirmClear}</code> will be permanently deleted.
          </p>
        </AdminModal>
      )}
    </div>
  )
}

export default DataPage