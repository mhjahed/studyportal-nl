import React from 'react'
import './UpdatesHero.scss'

function UpdatesHero({ totalArticles, categoriesCount }) {
  return (
    <section className="uph">
      <div className="uph__image">
        <img
          src="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1600&h=500&fit=crop&q=80"
          alt="Newspapers and editorial reading"
        />
        <div className="uph__overlay" />
      </div>

      <div className="uph__content">
        <div className="uph__eyebrow">
          <span className="uph__eyebrow-dot" />
          Study updates
        </div>
        <h1 className="uph__title">
          The <em>editorial</em>
        </h1>
        <p className="uph__lede">
          Curated news, guidance and updates on studying in the Netherlands.
          From visa policy changes to university admissions — everything in one place.
        </p>

        <div className="uph__stats">
          <div className="uph__stat">
            <div className="uph__stat-num">{totalArticles}</div>
            <div className="uph__stat-label">
              Published<br />article{totalArticles !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="uph__stat">
            <div className="uph__stat-num">{categoriesCount}</div>
            <div className="uph__stat-label">
              Editorial<br />sections
            </div>
          </div>
          <div className="uph__stat">
            <div className="uph__stat-num">Weekly</div>
            <div className="uph__stat-label">
              Update<br />cadence
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UpdatesHero