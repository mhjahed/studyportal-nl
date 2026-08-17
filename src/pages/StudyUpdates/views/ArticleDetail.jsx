import React, { useMemo, useEffect } from 'react'
import { dataService } from '../../../services/dataService'
import ArticleHero from '../components/ArticleHero'
import ArticleBody from '../components/ArticleBody'
import RelatedArticles from '../components/RelatedArticles'
import '../StudyUpdates.scss'

function ArticleDetail({ slug, onBack, onOpenArticle }) {
  const article = useMemo(
    () => dataService.getArticleBySlug(slug),
    [slug]
  )
  const { articles, categories } = useMemo(
    () => dataService.getBlogs(),
    []
  )

  useEffect(() => {
    if (!article) {
      // Silently return to list if not found
      const t = setTimeout(onBack, 100)
      return () => clearTimeout(t)
    }
  }, [article, onBack])

  if (!article) {
    return (
      <div className="updates-empty">
        <i className="bx bx-error-circle" />
        <h3>Article not found</h3>
        <p>The article you're looking for doesn't exist or may have been removed.</p>
        <button type="button" className="btn-solid" onClick={onBack}>
          Back to updates
        </button>
      </div>
    )
  }

  const category = categories.find((c) => c.id === article.categoryId)

  // Related = same category, excluding current
  const related = articles
    .filter((a) => a.categoryId === article.categoryId && a.id !== article.id)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3)

  return (
    <div className="article-detail">
      <button type="button" className="article-detail__back" onClick={onBack}>
        <i className="bx bx-left-arrow-alt" />
        Back to updates
      </button>

      <ArticleHero article={article} category={category} />

      <ArticleBody article={article} />

      {related.length > 0 && (
        <RelatedArticles
          articles={related}
          categories={categories}
          onOpenArticle={onOpenArticle}
        />
      )}
    </div>
  )
}

export default ArticleDetail