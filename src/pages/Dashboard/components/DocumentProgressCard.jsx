import React from 'react'
import { Link } from 'react-router-dom'
import './DocumentProgressCard.scss'

function DocumentProgressCard({ readyCount, totalDocs, progress, categories, statuses, documents }) {
  const getCategoryProgress = (catId) => {
    const catDocs = documents.filter((d) => d.categoryId === catId)
    const ready = catDocs.filter((d) => {
      const status = statuses.find((s) => s.documentId === d.id)
      return status?.status === 'ready'
    }).length
    return {
      ready,
      total: catDocs.length,
      pct: catDocs.length > 0 ? Math.round((ready / catDocs.length) * 100) : 0,
    }
  }

  return (
    <div className="d-card doc-card">
      <div className="d-card__head">
        <div>
          <div className="d-card__eyebrow">Documents</div>
          <h3 className="d-card__title">Preparation</h3>
        </div>
        <Link to="/documents" className="d-card__link">
          Manage
          <i className="bx bx-right-arrow-alt" />
        </Link>
      </div>

      {/* Overall */}
      <div className="doc-overall">
        <div className="doc-overall__pct">{progress}%</div>
        <div className="doc-overall__info">
          <div className="doc-overall__label">Overall ready</div>
          <div className="doc-overall__count">
            {readyCount} of {totalDocs} documents complete
          </div>
        </div>
      </div>

      <div className="doc-bar">
        <div className="doc-bar__fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Categories */}
      <div className="doc-categories">
        {categories.slice(0, 4).map((cat) => {
          const { ready, total, pct } = getCategoryProgress(cat.id)
          return (
            <div key={cat.id} className="doc-category">
              <div className="doc-category__head">
                <span className="doc-category__label">{cat.label}</span>
                <span className="doc-category__count">{ready}/{total}</span>
              </div>
              <div className="doc-category__bar">
                <div
                  className="doc-category__bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DocumentProgressCard