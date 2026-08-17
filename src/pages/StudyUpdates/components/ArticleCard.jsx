import React from 'react'
import './ArticleCard.scss'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function ArticleCard({ article, category, onOpen, compact }) {
  return (
    <article
      className={['art-card', compact && 'art-card--compact'].filter(Boolean).join(' ')}
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
      <div className="art-card__image">
        <img src={article.image} alt="" />
        {category && (
          <div className="art-card__category">{category.label}</div>
        )}
      </div>

      <div className="art-card__body">
        <h3 className="art-card__title">{article.title}</h3>
        <p className="art-card__excerpt">{article.excerpt}</p>

        <div className="art-card__meta">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="art-card__meta-sep">·</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard