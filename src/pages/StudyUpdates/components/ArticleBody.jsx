import React from 'react'
import './ArticleBody.scss'

function ArticleBody({ article }) {
  // Split content into paragraphs on double-newline OR single-newline
  const paragraphs = article.content
    .split(/\n\n|\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  return (
    <article className="art-body">
      <div className="art-body__content">
        {paragraphs.map((para, i) => (
          <p key={i} className={i === 0 ? 'art-body__first-para' : ''}>
            {para}
          </p>
        ))}
      </div>

      {/* Info box at end */}
      <aside className="art-body__notice">
        <div className="art-body__notice-label">Editorial note</div>
        <p>
          The Bachelors Portal Netherlands editorial team publishes updates
          regularly based on official Dutch government sources, university
          announcements, and student feedback. Always verify time-sensitive
          information with official sources before acting on it.
        </p>
      </aside>
    </article>
  )
}

export default ArticleBody