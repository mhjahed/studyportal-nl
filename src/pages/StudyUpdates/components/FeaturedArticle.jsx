import React from 'react'
import './FeaturedArticle.scss'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function FeaturedArticle({ article, category, onOpen }) {
  return (
    <article
      className="feat"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      <div className="feat__image">
        <img src={article.image} alt="" />
        <div className="feat__image-tag">Featured</div>
      </div>

      <div className="feat__body">
        <div className="feat__meta-top">
          {category && (
            <span className="feat__category">{category.label}</span>
          )}
          <span className="feat__meta-sep">·</span>
          <span className="feat__date">{formatDate(article.publishedAt)}</span>
        </div>

        <h2 className="feat__title">{article.title}</h2>

        <p className="feat__excerpt">{article.excerpt}</p>

        <div className="feat__footer">
          <div className="feat__author">
            <div className="feat__author-avatar">
              <i className="bx bx-edit-alt" />
            </div>
            <div>
              <div className="feat__author-name">{article.author}</div>
              <div className="feat__author-time">
                {article.readTime} min read
              </div>
            </div>
          </div>

          <div className="feat__cta">
            <span>Read article</span>
            <i className="bx bx-right-arrow-alt" />
          </div>
        </div>
      </div>
    </article>
  )
}

export default FeaturedArticle