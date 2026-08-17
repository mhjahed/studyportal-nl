import React from 'react'
import './ArticleHero.scss'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function ArticleHero({ article, category }) {
  return (
    <section className="art-hero">
      <div className="art-hero__meta-top">
        {category && (
          <span className="art-hero__category">{category.label}</span>
        )}
      </div>

      <h1 className="art-hero__title">{article.title}</h1>

      <p className="art-hero__excerpt">{article.excerpt}</p>

      <div className="art-hero__byline">
        <div className="art-hero__author">
          <div className="art-hero__author-avatar">
            <i className="bx bx-edit-alt" />
          </div>
          <div>
            <div className="art-hero__author-name">{article.author}</div>
            <div className="art-hero__author-meta">
              {formatDate(article.publishedAt)}
              <span className="art-hero__meta-sep">·</span>
              {article.readTime} min read
            </div>
          </div>
        </div>
      </div>

      {article.image && (
        <div className="art-hero__image">
          <img src={article.image} alt="" />
        </div>
      )}
    </section>
  )
}

export default ArticleHero