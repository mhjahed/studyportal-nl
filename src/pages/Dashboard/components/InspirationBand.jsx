import React from 'react'
import { Link } from 'react-router-dom'
import './InspirationBand.scss'

function InspirationBand({ university }) {
  return (
    <section className="inspiration">
      <div className="inspiration__image">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=600&fit=crop&q=80"
          alt="International students in university library"
        />
      </div>

      <div className="inspiration__content">
        <div className="inspiration__eyebrow">
          <span className="inspiration__eyebrow-dot" />
          Your path forward
        </div>

        <h2 className="inspiration__title">
          Every great Dutch graduate<br />
          started exactly <em>where you are.</em>
        </h2>

        <p className="inspiration__text">
          {university} joins a legacy of Dutch institutions that have shaped
          international leaders across engineering, business, science and the arts.
          Focus on preparation — the rest will follow.
        </p>

        <div className="inspiration__stats">
          <div className="inspiration__stat">
            <div className="inspiration__stat-num">122k+</div>
            <div className="inspiration__stat-label">International<br/>students</div>
          </div>
          <div className="inspiration__stat">
            <div className="inspiration__stat-num">14</div>
            <div className="inspiration__stat-label">Research<br/>universities</div>
          </div>
          <div className="inspiration__stat">
            <div className="inspiration__stat-num">2,100+</div>
            <div className="inspiration__stat-label">English-taught<br/>programmes</div>
          </div>
        </div>

        <div className="inspiration__actions">
          <Link to="/visa-updates" className="btn-solid btn-solid--light">
            Read study updates
            <i className="bx bx-right-arrow-alt" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default InspirationBand