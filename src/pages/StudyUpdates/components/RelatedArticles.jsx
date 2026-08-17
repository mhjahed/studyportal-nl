import React from 'react'
import ArticleCard from './ArticleCard'
import './RelatedArticles.scss'

function RelatedArticles({ articles, categories, onOpenArticle }) {
  return (
    <section className="rel">
      <div className="rel__header">
        <div className="rel__eyebrow">Continue reading</div>
        <h2 className="rel__title">Related articles</h2>
      </div>

      <div className="rel__grid">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            category={categories.find((c) => c.id === article.categoryId)}
            onOpen={() => onOpenArticle(article.slug)}
          />
        ))}
      </div>
    </section>
  )
}

export default RelatedArticles