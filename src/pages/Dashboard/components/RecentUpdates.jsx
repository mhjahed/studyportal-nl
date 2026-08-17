import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { dataService } from '../../../services/dataService'
import './RecentUpdates.scss'

function RecentUpdates() {
  const navigate = useNavigate()
  const { articles, categories } = dataService.getBlogs()
  const recent = [...articles]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3)

  const getCategoryLabel = (id) =>
    categories.find((c) => c.id === id)?.label || 'Update'

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })

  const openArticle = (slug) => {
    navigate(`/visa-updates?article=${slug}`)
  }

  return (
    <section className="updates">
      <div className="updates__head">
        <div>
          <div className="updates__eyebrow">From the editorial team</div>
          <h2 className="updates__title">Latest study updates</h2>
        </div>
        <Link to="/visa-updates" className="d-card__link">
          All updates
          <i className="bx bx-right-arrow-alt" />
        </Link>
      </div>

      <div className="updates__grid">
        {recent.map((article) => (
          <article
            key={article.id}
            className="update-card"
            onClick={() => openArticle(article.slug)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openArticle(article.slug)
              }
            }}
          >
            <div className="update-card__image">
              <img src={article.image} alt="" />
              <div className="update-card__category">
                {getCategoryLabel(article.categoryId)}
              </div>
            </div>
            <div className="update-card__body">
              <h3 className="update-card__title">{article.title}</h3>
              <p className="update-card__excerpt">{article.excerpt}</p>
              <div className="update-card__meta">
                <span>{formatDate(article.publishedAt)}</span>
                <span className="update-card__dot">·</span>
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentUpdates