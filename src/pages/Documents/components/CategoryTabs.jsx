import React from 'react'
import './CategoryTabs.scss'

const CATEGORY_ICONS = {
  cat_university_admission: 'bx-book-open',
  cat_university_interview: 'bx-chat',
  cat_ind: 'bx-shield-quarter',
  cat_embassy: 'bx-buildings',
  cat_passport: 'bx-plane-take-off',
}

function CategoryTabs({ categories, activeCategoryId, onSelect, categoryProgress, overallProgress }) {
  return (
    <div className="cat-tabs">
      <button
        type="button"
        onClick={() => onSelect('all')}
        className={[
          'cat-tab',
          activeCategoryId === 'all' && 'cat-tab--active',
        ].filter(Boolean).join(' ')}
      >
        <div className="cat-tab__icon">
          <i className="bx bx-collection" />
        </div>
        <div className="cat-tab__body">
          <div className="cat-tab__label">All documents</div>
          <div className="cat-tab__count">{overallProgress.total} total</div>
        </div>
        <div className="cat-tab__pct">
          <div className="cat-tab__pct-num">{overallProgress.pct}%</div>
          <div className="cat-tab__pct-bar">
            <div
              className="cat-tab__pct-bar-fill"
              style={{ width: `${overallProgress.pct}%` }}
            />
          </div>
        </div>
      </button>

      {categories.map((cat) => {
        const prog = categoryProgress[cat.id] || { pct: 0, total: 0, ready: 0 }
        const icon = CATEGORY_ICONS[cat.id] || 'bx-folder'
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={[
              'cat-tab',
              activeCategoryId === cat.id && 'cat-tab--active',
            ].filter(Boolean).join(' ')}
          >
            <div className="cat-tab__icon">
              <i className={`bx ${icon}`} />
            </div>
            <div className="cat-tab__body">
              <div className="cat-tab__label">{cat.label}</div>
              <div className="cat-tab__count">
                {prog.ready}/{prog.effectiveTotal} ready
              </div>
            </div>
            <div className="cat-tab__pct">
              <div className="cat-tab__pct-num">{prog.pct}%</div>
              <div className="cat-tab__pct-bar">
                <div
                  className="cat-tab__pct-bar-fill"
                  style={{ width: `${prog.pct}%` }}
                />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabs