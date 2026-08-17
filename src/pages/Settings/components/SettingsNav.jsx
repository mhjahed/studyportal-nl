import React from 'react'
import './SettingsNav.scss'

function SettingsNav({ sections, activeSection, onSelect }) {
  return (
    <nav className="s-nav" aria-label="Settings sections">
      <div className="s-nav__label">Sections</div>
      <ul className="s-nav__list">
        {sections.map((section, i) => (
          <li key={section.id}>
            <button
              type="button"
              onClick={() => onSelect(section.id)}
              className={[
                's-nav__link',
                activeSection === section.id && 's-nav__link--active',
              ].filter(Boolean).join(' ')}
            >
              <span className="s-nav__num">{String(i + 1).padStart(2, '0')}</span>
              <i className={`bx ${section.icon}`} />
              <span className="s-nav__text">{section.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default SettingsNav