import React, { useState, useMemo } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { dataService } from '../../../services/dataService'
import UpdatesHero from '../components/UpdatesHero'
import FeaturedArticle from '../components/FeaturedArticle'
import ArticleCard from '../components/ArticleCard'
import CategoryFilter from '../components/CategoryFilter'
import RecommendedForYou from '../components/RecommendedForYou'
import '../StudyUpdates.scss'

function UpdatesList({ onOpenArticle }) {
  const { currentUser } = useAuth()
  const [activeCategoryId, setActiveCategoryId] = useState('all')

  const { categories, articles } = useMemo(() => dataService.getBlogs(), [])

  // Sort all articles by date descending
  const sortedArticles = useMemo(
    () => [...articles].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    ),
    [articles]
  )

  // Featured = first article marked featured; fallback to newest
  const featured = useMemo(() => {
    return sortedArticles.find((a) => a.featured) || sortedArticles[0]
  }, [sortedArticles])

  // Filter by category
  const filtered = useMemo(() => {
    let list = sortedArticles
    if (activeCategoryId !== 'all') {
      list = list.filter((a) => a.categoryId === activeCategoryId)
    }
    // Exclude the featured article from the grid when All is selected
    if (activeCategoryId === 'all' && featured) {
      list = list.filter((a) => a.id !== featured.id)
    }
    return list
  }, [sortedArticles, activeCategoryId, featured])

  // Determine stage-relevant category based on real user data (not fake personalisation)
  const relevantCategoryId = useMemo(() => {
    const results = dataService.getPublishedResultsByUserId(currentUser.id)
    const requests = dataService.getInterviewRequestsByUserId(currentUser.id)

    if (results.length > 0) {
      const types = results.map((r) => r.type)
      if (types.includes('embassy')) return 'netherlands_news'
      if (types.includes('ind')) return 'embassy'
      if (types.includes('university')) return 'ind'
    }
    if (requests.some((r) => r.type === 'university')) return 'university_admission'
    return 'visa_updates'
  }, [currentUser.id])

  const recommendedArticles = useMemo(() => {
    return sortedArticles
      .filter(
        (a) => a.categoryId === relevantCategoryId && a.id !== featured?.id
      )
      .slice(0, 3)
  }, [sortedArticles, relevantCategoryId, featured])

  const counts = useMemo(() => {
    const c = { all: sortedArticles.length }
    categories.forEach((cat) => {
      c[cat.id] = sortedArticles.filter((a) => a.categoryId === cat.id).length
    })
    return c
  }, [sortedArticles, categories])

  return (
    <div className="updates-page">
      <UpdatesHero
        totalArticles={sortedArticles.length}
        categoriesCount={categories.length}
      />

      {/* Featured article — only show when "All" is selected */}
      {activeCategoryId === 'all' && featured && (
        <FeaturedArticle
          article={featured}
          category={categories.find((c) => c.id === featured.categoryId)}
          onOpen={() => onOpenArticle(featured.slug)}
        />
      )}

      {/* Recommended for you (only when All view + user has stage progress) */}
      {activeCategoryId === 'all' && recommendedArticles.length > 0 && (
        <RecommendedForYou
          articles={recommendedArticles}
          category={categories.find((c) => c.id === relevantCategoryId)}
          onOpenArticle={onOpenArticle}
        />
      )}

      {/* Category filter + grid */}
      <div className="updates-grid-section">
        <div className="updates-grid-header">
          <div>
            <div className="updates-section-eyebrow">
              {activeCategoryId === 'all' ? 'Latest articles' :
                categories.find((c) => c.id === activeCategoryId)?.label}
            </div>
            <h2 className="updates-section-title">
              {activeCategoryId === 'all'
                ? 'The latest from our editorial team'
                : categories.find((c) => c.id === activeCategoryId)?.label}
            </h2>
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={setActiveCategoryId}
          counts={counts}
        />

        {filtered.length === 0 ? (
          <div className="updates-empty">
            <i className="bx bx-news" />
            <h3>No articles in this category yet</h3>
            <p>Check back soon — we regularly publish new content.</p>
          </div>
        ) : (
          <div className="updates-grid">
            {filtered.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                category={categories.find((c) => c.id === article.categoryId)}
                onOpen={() => onOpenArticle(article.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdatesList