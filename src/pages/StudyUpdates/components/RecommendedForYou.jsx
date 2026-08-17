import React from 'react'
import ArticleCard from './ArticleCard'
import './RecommendedForYou.scss'

function RecommendedForYou({ articles, category, onOpenArticle }) {
  return (
    <section className="reco">
      <div className="reco__header">
        <div>
          <div className="reco__eyebrow">
            <span className="reco__eyebrow-dot" />
            Relevant to your current stage
          </div>
          <h2 className="reco__title">
            {category ? `More on ${category.label}` : 'Recommended reading'}
          </h2>
          <p className="reco__lede">
            Selected based on your interview progress and preparation stage.
          </p>
        </div>
      </div>

      <div className="reco__grid">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            category={category}
            onOpen={() => onOpenArticle(article.slug)}
            compact
          />
        ))}
      </div>
    </section>
  )
}

export default RecommendedForYou