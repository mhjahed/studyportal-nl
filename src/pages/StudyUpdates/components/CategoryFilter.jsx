import React from 'react'
import './CategoryFilter.scss'

function CategoryFilter({ categories, activeCategoryId, onSelect, counts }) {
  return (
    <div className="cat-filter">
      <button
        type="button"
        onClick={() => onSelect('all')}
        className={[
          'cat-filter__btn',
          activeCategoryId === 'all' && 'cat-filter__btn--active',
        ].filter(Boolean).join(' ')}
      >
        <span>All articles</span>
        {counts.all > 0 && (
          <span className="cat-filter__count">{counts.all}</span>
        )}
      </button>

      {categories.map((cat) => {
        const count = counts[cat.id] || 0
        if (count === 0) return null
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={[
              'cat-filter__btn',
              activeCategoryId === cat.id && 'cat-filter__btn--active',
            ].filter(Boolean).join(' ')}
          >
            <span>{cat.label}</span>
            <span className="cat-filter__count">{count}</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter