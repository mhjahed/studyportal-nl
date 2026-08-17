import React, { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { dataService } from '../../services/dataService'
import ScorecardHero from './components/ScorecardHero'
import ScorecardListItem from './components/ScorecardListItem'
import ScorecardDetail from './components/ScorecardDetail'
import ScorecardEmpty from './components/ScorecardEmpty'
import './Scorecard.scss'

const FILTERS = [
  { id: 'all', label: 'All scorecards' },
  { id: 'university', label: 'University' },
  { id: 'ind', label: 'IND' },
  { id: 'embassy', label: 'Embassy' },
]

function Scorecard() {
  const { currentUser } = useAuth()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const scorecards = useMemo(() => {
    const list = dataService.getPublishedScorecardsByUserId(currentUser.id)
    return list.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    )
  }, [currentUser.id])

  const counts = useMemo(() => {
    const c = { all: scorecards.length, university: 0, ind: 0, embassy: 0 }
    scorecards.forEach((s) => {
      if (c[s.type] !== undefined) c[s.type]++
    })
    return c
  }, [scorecards])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return scorecards
    return scorecards.filter((s) => s.type === activeFilter)
  }, [scorecards, activeFilter])

  // Aggregate: average score across all criteria in all scorecards
  const overall = useMemo(() => {
    if (scorecards.length === 0) return { avg: 0, criteriaCount: 0 }
    let totalScore = 0
    let totalMax = 0
    let criteriaCount = 0
    scorecards.forEach((sc) => {
      sc.criteria.forEach((c) => {
        totalScore += c.score
        totalMax += c.maxScore
        criteriaCount++
      })
    })
    return {
      avg: totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0,
      criteriaCount,
    }
  }, [scorecards])

  // Detail view
  if (selectedId) {
    const scorecard = scorecards.find((s) => s.id === selectedId)
    if (!scorecard) {
      setSelectedId(null)
      return null
    }
    return (
      <ScorecardDetail
        scorecard={scorecard}
        onBack={() => setSelectedId(null)}
      />
    )
  }

  return (
    <div className="sc-page">
      <ScorecardHero
        totalScorecards={scorecards.length}
        averageOverall={overall.avg}
        criteriaCount={overall.criteriaCount}
      />

      {scorecards.length > 0 && (
        <>
          {/* Filters */}
          <div className="sc-filters">
            <div className="sc-filters__label">Filter by type</div>
            <div className="sc-filters__row">
              {FILTERS.map((f) => {
                const count = counts[f.id] || 0
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    className={[
                      'sc-filter',
                      activeFilter === f.id && 'sc-filter--active',
                    ].filter(Boolean).join(' ')}
                  >
                    <span>{f.label}</span>
                    {count > 0 && (
                      <span className="sc-filter__count">{count}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="sc-empty-filter">
              <i className="bx bx-filter-alt" />
              <p>No {activeFilter} scorecards published yet.</p>
            </div>
          ) : (
            <div className="sc-list">
              {filtered.map((sc, i) => (
                <ScorecardListItem
                  key={sc.id}
                  scorecard={sc}
                  index={i}
                  onView={() => setSelectedId(sc.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {scorecards.length === 0 && <ScorecardEmpty />}
    </div>
  )
}

export default Scorecard