import React from 'react'
import './SettingsSection.scss'

function SettingsSection({ eyebrow, title, description, children }) {
  return (
    <section className="s-section">
      <header className="s-section__header">
        <div className="s-section__eyebrow">{eyebrow}</div>
        <h2 className="s-section__title">{title}</h2>
        {description && (
          <p className="s-section__description">{description}</p>
        )}
      </header>

      <div className="s-section__body">
        {children}
      </div>
    </section>
  )
}

export default SettingsSection