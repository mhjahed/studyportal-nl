import React from 'react'
import SettingsSection from '../components/SettingsSection'
import ToggleRow from '../components/ToggleRow'

const DENSITY_OPTIONS = [
  {
    value: 'comfortable',
    label: 'Comfortable',
    description: 'Standard spacing with generous whitespace.',
    icon: 'bx-menu',
  },
  {
    value: 'compact',
    label: 'Compact',
    description: 'Tighter spacing for more content on screen.',
    icon: 'bx-menu-alt-left',
  },
]

function DisplaySettings({ value, onChange }) {
  const handleDensityChange = (density) => {
    onChange({ ...value, density })
  }

  const handleMotionToggle = (reduceMotion) => {
    onChange({ ...value, reduceMotion })
  }

  return (
    <SettingsSection
      eyebrow="Section 04"
      title="Display preferences"
      description="Adjust how content is displayed throughout the portal to match your reading preference."
    >
      {/* Density */}
      <div className="s-field">
        <label className="s-field__label">
          <i className="bx bx-layout" />
          Interface density
        </label>
        <div className="s-field__hint">
          Controls the spacing between elements in lists and cards.
        </div>

        <div className="pi-density-grid">
          {DENSITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={[
                'pi-density',
                value.density === opt.value && 'pi-density--selected',
              ].filter(Boolean).join(' ')}
            >
              <input
                type="radio"
                name="density"
                value={opt.value}
                checked={value.density === opt.value}
                onChange={() => handleDensityChange(opt.value)}
              />
              <div className="pi-density__icon">
                <i className={`bx ${opt.icon}`} />
              </div>
              <div className="pi-density__body">
                <div className="pi-density__title">{opt.label}</div>
                <div className="pi-density__desc">{opt.description}</div>
              </div>
              <span className="pi-density__mark">
                <i className="bx bx-check" />
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Motion */}
      <ToggleRow
        icon="bx-run"
        title="Reduce motion"
        description="Minimise animations and transitions. Helpful if animations cause discomfort."
        checked={value.reduceMotion}
        onChange={handleMotionToggle}
      />
    </SettingsSection>
  )
}

export default DisplaySettings