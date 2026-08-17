import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import UpdatesList from './views/UpdatesList'
import ArticleDetail from './views/ArticleDetail'

function StudyUpdates() {
  const [searchParams, setSearchParams] = useSearchParams()
  const articleSlug = searchParams.get('article')

  const openArticle = (slug) => {
    setSearchParams({ article: slug })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const backToList = () => {
    setSearchParams({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (articleSlug) {
    return <ArticleDetail slug={articleSlug} onBack={backToList} onOpenArticle={openArticle} />
  }

  return <UpdatesList onOpenArticle={openArticle} />
}

export default StudyUpdates