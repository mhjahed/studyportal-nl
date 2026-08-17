import React from 'react'
import './LoadingState.scss'

function LoadingState({ variant = 'default', label = 'Loading…', fullPage = false }) {
  if (variant === 'skeleton-list') {
    return (
      <div className="loading-state loading-state--skeleton">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton-row">
            <div className="skeleton skeleton--avatar" />
            <div className="skeleton-row__body">
              <div className="skeleton skeleton--line skeleton--title" />
              <div className="skeleton skeleton--line skeleton--text" />
              <div className="skeleton skeleton--line skeleton--text-short" />
            </div>
            <div className="skeleton skeleton--btn" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'skeleton-cards') {
    return (
      <div className="loading-state loading-state--skeleton-cards">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton-card">
            <div className="skeleton skeleton--image" />
            <div className="skeleton-card__body">
              <div className="skeleton skeleton--line skeleton--title" />
              <div className="skeleton skeleton--line skeleton--text" />
              <div className="skeleton skeleton--line skeleton--text-short" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'skeleton-hero') {
    return (
      <div className="skeleton-hero">
        <div className="skeleton skeleton--hero-band" />
      </div>
    )
  }

  // Default centered spinner
  return (
    <div className={['loading-state', fullPage && 'loading-state--fullpage']
      .filter(Boolean).join(' ')}>
      <div className="loading-state__inner">
        <div className="loading-state__spinner">
          <div className="bpn-spinner bpn-spinner--lg" />
        </div>
        <div className="loading-state__label">{label}</div>
      </div>
    </div>
  )
}

export default LoadingState