import React, { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { dataService } from '../../services/dataService'
import ResultsHero from './components/ResultsHero'
import ResultCard from './components/ResultCard'
import ResultDetail from './components/ResultDetail'
import ResultsEmpty from './components/ResultsEmpty'
import './Results.scss'

const FILTERS = [
  { id: 'all', label: 'All results' },
  { id: 'university', label: 'University' },
  { id: 'ind', label: 'IND' },
  { id: 'embassy', label: 'Embassy' },
]

function Results() {
  const { currentUser } = useAuth()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedResultId, setSelectedResultId] = useState(null)

  // Only published results
  const results = useMemo(() => {
    const list = dataService.getPublishedResultsByUserId(currentUser.id)
    return list.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    )
  }, [currentUser.id])

  const counts = useMemo(() => {
    const c = { all: results.length, university: 0, ind: 0, embassy: 0 }
    results.forEach((r) => {
      if (c[r.type] !== undefined) c[r.type]++
    })
    return c
  }, [results])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return results
    return results.filter((r) => r.type === activeFilter)
  }, [results, activeFilter])

  // Aggregate stats
  const stats = useMemo(() => {
    if (results.length === 0) {
      return { average: 0, highest: 0, best: null }
    }
    const total = results.reduce((sum, r) => sum + r.percentage, 0)
    const average = Math.round(total / results.length)
    const highest = Math.max(...results.map((r) => r.percentage))
    const best = results.find((r) => r.percentage === highest)
    return { average, highest, best }
  }, [results])

  // Detail view
  if (selectedResultId) {
    const result = dataService.getResultById(selectedResultId)
    if (!result) {
      // Not found or unpublished — go back to list
      setSelectedResultId(null)
      return null
    }
    return (
      <ResultDetail
        result={result}
        onBack={() => setSelectedResultId(null)}
      />
    )
  }

  return (
    <div className="results-page">
      <ResultsHero
        totalResults={results.length}
        averageScore={stats.average}
        highestScore={stats.highest}
        bestResult={stats.best}
      />

      {results.length > 0 && (
        <>
          {/* Filters */}
          <div className="results-filters">
            <div className="results-filters__label">Filter by type</div>
            <div className="results-filters__row">
              {FILTERS.map((f) => {
                const count = counts[f.id] || 0
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    className={[
                      'results-filter',
                      activeFilter === f.id && 'results-filter--active',
                    ].filter(Boolean).join(' ')}
                  >
                    <span>{f.label}</span>
                    {count > 0 && (
                      <span className="results-filter__count">{count}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="results-empty-filter">
              <i className="bx bx-filter-alt" />
              <p>No {activeFilter} results published yet.</p>
            </div>
          ) : (
            <div className="results-list">
              {filtered.map((result, index) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  index={index}
                  onView={() => setSelectedResultId(result.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {results.length === 0 && <ResultsEmpty />}
    </div>
  )
}

export default Results