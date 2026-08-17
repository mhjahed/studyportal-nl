import React from 'react'
import './ProfileHero.scss'

function ProfileHero({ user }) {
  const fullName = `${user.firstName} ${user.lastName}`
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className="ph">
      {/* Background layer */}
      <div className="ph__bg">
      <img
        src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=1600&h=400&fit=crop&q=80"
        alt=""
        role="presentation"
      />
      <div className="ph__bg-overlay" />
      </div>

      {/* Content */}
      <div className="ph__content">
        <div className="ph__portrait-wrap">
          <img
            src={user.profileImage}
            alt={fullName}
            className="ph__portrait"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=1a3a6b&color=fff&size=240`
            }}
          />
          <div className="ph__portrait-badge" title="Verified student">
            <i className="bx bx-check" />
          </div>
        </div>

        <div className="ph__info">
          <div className="ph__eyebrow">
            <span className="ph__eyebrow-dot" />
            Student profile
          </div>
          <h1 className="ph__name">{fullName}</h1>
          <div className="ph__subtitle">
            <span className="ph__iso">{user.isoCode}</span>
            <span className="ph__sep">·</span>
            <span className="ph__level">
              {user.studyLevel} student
            </span>
            <span className="ph__sep">·</span>
            <span className="ph__since">
              Since {memberSince}
            </span>
          </div>

          <div className="ph__meta">
            <div className="ph__meta-item">
              <i className="bx bx-buildings" />
              <div>
                <span>University</span>
                <strong>{user.university}</strong>
              </div>
            </div>
            <div className="ph__meta-item">
              <i className="bx bx-book-open" />
              <div>
                <span>Course</span>
                <strong>{user.course}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileHero