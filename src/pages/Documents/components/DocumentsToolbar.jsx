import React from 'react'
import './DocumentsToolbar.scss'

const STATUS_FILTERS = [
  { id: 'all', label: 'All', icon: 'bx-list-ul' },
  { id: 'not_started', label: 'Not started', icon: 'bx-circle' },
  { id: 'preparing', label: 'Preparing', icon: 'bx-loader-circle' },
  { id: 'ready', label: 'Ready', icon: 'bx-check-circle' },
  { id: 'not_applicable', label: 'Not applicable', icon: 'bx-minus-circle' },
]

function DocumentsToolbar({
  statusFilter,
  onStatusFilterChange,
  visibleCount,
  activeCategoryLabel,
}) {
  return (
    <div className="docs-toolbar">
      <div className="docs-toolbar__left">
        <div className="docs-toolbar__count">
          Showing <strong>{visibleCount}</strong> document{visibleCount !== 1 ? 's' : ''}
          <span className="docs-toolbar__count-sep">·</span>
          <span className="docs-toolbar__count-cat">{activeCategoryLabel}</span>
        </div>
      </div>

      <div className="docs-toolbar__right">
        <div className="docs-toolbar__filter-label">Status</div>
        <div className="docs-toolbar__filters">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onStatusFilterChange(f.id)}
              className={[
                'docs-toolbar__filter',
                statusFilter === f.id && 'docs-toolbar__filter--active',
                f.id !== 'all' && `docs-toolbar__filter--${f.id}`,
              ].filter(Boolean).join(' ')}
              title={f.label}
            >
              <i className={`bx ${f.icon}`} />
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DocumentsToolbar