import React from 'react'
import './SettingsHero.scss'

function SettingsHero({ user }) {
  return (
    <section className="sh">
      <div className="sh__bg">
        <img
          src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1600&h=400&fit=crop&q=80"
          alt=""
        />
        <div className="sh__overlay" />
      </div>

      <div className="sh__content">
        <div className="sh__left">
          <div className="sh__eyebrow">
            <span className="sh__eyebrow-dot" />
            Portal settings
          </div>
          <h1 className="sh__title">
            <em>Personalise</em> your portal
          </h1>
          <p className="sh__lede">
            Control how the portal communicates with you and how information
            is displayed. Changes save automatically.
          </p>
        </div>

        <div className="sh__right">
          <div className="sh__avatar-wrap">
            <img
              src={user.profileImage}
              alt=""
              className="sh__avatar"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=1a3a6b&color=fff&size=100`
              }}
            />
          </div>
          <div className="sh__user-info">
            <div className="sh__user-label">Signed in as</div>
            <div className="sh__user-name">
              {user.firstName} {user.lastName}
            </div>
            <div className="sh__user-iso">{user.isoCode}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingsHero