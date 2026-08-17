import React, { useState, useRef, useEffect } from 'react'
import './DocumentItem.scss'

const STATUS_META = {
  not_started: {
    label: 'Not started',
    icon: 'bx-circle',
    color: '#8a8a8a',
    bg: '#f0edE6',
  },
  preparing: {
    label: 'Preparing',
    icon: 'bx-loader-circle',
    color: '#e8820c',
    bg: 'rgba(232, 130, 12, 0.1)',
  },
  ready: {
    label: 'Ready',
    icon: 'bx-check-circle',
    color: '#1d7a47',
    bg: 'rgba(29, 122, 71, 0.1)',
  },
  not_applicable: {
    label: 'Not applicable',
    icon: 'bx-minus-circle',
    color: '#b0a99a',
    bg: '#faf8f3',
  },
}

const STATUS_OPTIONS = ['not_started', 'preparing', 'ready', 'not_applicable']

const CATEGORY_ICONS = {
  cat_university_admission: 'bx-book-open',
  cat_university_interview: 'bx-chat',
  cat_ind: 'bx-shield-quarter',
  cat_embassy: 'bx-buildings',
  cat_passport: 'bx-plane-take-off',
}

// Debounce helper for notes autosave
function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => callback(...args), delay)
  }
}

function DocumentItem({
  document: doc,   // ← renamed to avoid shadowing global `document`
  status,
  notes,
  category,
  onStatusChange,
  onNotesChange,
}) {
  const [expanded, setExpanded] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [localNotes, setLocalNotes] = useState(notes)
  const [savedIndicator, setSavedIndicator] = useState(false)
  const statusBtnRef = useRef(null)

  const meta = STATUS_META[status]
  const catIcon = category ? CATEGORY_ICONS[category.id] : 'bx-folder'

  const debouncedSaveNotes = useDebouncedCallback((newNotes) => {
    onNotesChange(newNotes)
    setSavedIndicator(true)
    setTimeout(() => setSavedIndicator(false), 1500)
  }, 500)

  useEffect(() => {
    setLocalNotes(notes)
  }, [notes])

  // Close status menu on outside click — uses window.document explicitly
  useEffect(() => {
    if (!statusMenuOpen) return
    const handleClick = (e) => {
      if (statusBtnRef.current && !statusBtnRef.current.contains(e.target)) {
        setStatusMenuOpen(false)
      }
    }
    window.document.addEventListener('mousedown', handleClick)
    return () => window.document.removeEventListener('mousedown', handleClick)
  }, [statusMenuOpen])

  const handleNotesInput = (e) => {
    const v = e.target.value
    setLocalNotes(v)
    debouncedSaveNotes(v)
  }

  const handleStatusPick = (newStatus) => {
    onStatusChange(newStatus)
    setStatusMenuOpen(false)
    if (newStatus === 'preparing' && !expanded) {
      setExpanded(true)
    }
  }

  return (
    <article
      className={[
        'doc-item',
        `doc-item--${status}`,
        expanded && 'doc-item--expanded',
        !doc.required && 'doc-item--optional',
      ].filter(Boolean).join(' ')}
    >
      <div
        className="doc-item__strip"
        style={{ background: meta.color }}
      />

      <div className="doc-item__main">
        <button
          type="button"
          className="doc-item__expand-toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <i className={`bx ${expanded ? 'bx-chevron-down' : 'bx-chevron-right'}`} />
        </button>

        <div className="doc-item__body">
          <div className="doc-item__title-row">
            <h3 className="doc-item__title">{doc.name}</h3>
            {doc.required ? (
              <span className="doc-item__req doc-item__req--required">Required</span>
            ) : (
              <span className="doc-item__req doc-item__req--optional">Optional</span>
            )}
          </div>

          <div className="doc-item__meta">
            {category && (
              <span className="doc-item__meta-item doc-item__meta-item--cat">
                <i className={`bx ${catIcon}`} />
                {category.label}
              </span>
            )}
            {notes && !expanded && (
              <span className="doc-item__meta-item doc-item__meta-item--notes">
                <i className="bx bx-note" />
                Has note
              </span>
            )}
          </div>
        </div>

        <div className="doc-item__status-wrap" ref={statusBtnRef}>
          <button
            type="button"
            className="doc-item__status-btn"
            onClick={() => setStatusMenuOpen((s) => !s)}
            style={{
              color: meta.color,
              background: meta.bg,
              borderColor: meta.color,
            }}
          >
            <i className={`bx ${meta.icon}`} />
            <span>{meta.label}</span>
            <i className={`bx bx-chevron-${statusMenuOpen ? 'up' : 'down'} doc-item__status-chevron`} />
          </button>

          {statusMenuOpen && (
            <div className="doc-item__status-menu">
              {STATUS_OPTIONS.map((opt) => {
                const optMeta = STATUS_META[opt]
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleStatusPick(opt)}
                    className={[
                      'doc-item__status-option',
                      status === opt && 'doc-item__status-option--current',
                    ].filter(Boolean).join(' ')}
                  >
                    <i className={`bx ${optMeta.icon}`} style={{ color: optMeta.color }} />
                    <span>{optMeta.label}</span>
                    {status === opt && (
                      <i className="bx bx-check doc-item__status-option-check" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="doc-item__expanded">
          {doc.description && (
            <div className="doc-item__section">
              <div className="doc-item__section-label">About this document</div>
              <p className="doc-item__description">{doc.description}</p>
            </div>
          )}

          <div className="doc-item__section">
            <div className="doc-item__section-label">
              <span>Your notes</span>
              {savedIndicator && (
                <span className="doc-item__saved">
                  <i className="bx bx-check" />
                  Saved
                </span>
              )}
            </div>
            <textarea
              className="doc-item__notes"
              value={localNotes}
              onChange={handleNotesInput}
              placeholder="Add a private note — reference numbers, deadlines, reminders, or where you saved the document…"
              rows="3"
            />
            <div className="doc-item__notes-hint">
              Notes are saved automatically as you type.
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default DocumentItem