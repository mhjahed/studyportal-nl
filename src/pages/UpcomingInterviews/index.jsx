import React, { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { dataService } from '../../services/dataService'
import UpcomingHero from './components/UpcomingHero'
import InterviewCard from './components/InterviewCard'
import EmptyState from './components/EmptyState'
import './UpcomingInterviews.scss'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'today', label: 'Today' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function computeStatus(interview) {
  const dt = new Date(`${interview.date}T${interview.time}:00`)
  const now = new Date()

  if (interview.status === 'cancelled') return 'cancelled'
  if (interview.status === 'rescheduled') return 'rescheduled'
  if (interview.status === 'completed') return 'completed'
  if (isSameDay(dt, now)) return 'today'
  if (dt < now) return 'completed' // past but not marked
  return 'upcoming'
}

function UpcomingInterviews() {
  const { currentUser } = useAuth()
  const [activeFilter, setActiveFilter] = useState('all')

  const interviews = useMemo(() => {
    const all = dataService.getInterviewsByUserId(currentUser.id)
    return all
      .map((i) => ({ ...i, computedStatus: computeStatus(i) }))
      .sort((a, b) => {
        const dtA = new Date(`${a.date}T${a.time}:00`)
        const dtB = new Date(`${b.date}T${b.time}:00`)
        const orderA = ['today', 'upcoming', 'rescheduled', 'cancelled', 'completed'].indexOf(a.computedStatus)
        const orderB = ['today', 'upcoming', 'rescheduled', 'cancelled', 'completed'].indexOf(b.computedStatus)
        if (orderA !== orderB) return orderA - orderB
        // Upcoming: earliest first. Completed: most recent first.
        if (a.computedStatus === 'completed') return dtB - dtA
        return dtA - dtB
      })
  }, [currentUser.id])

  const counts = useMemo(() => {
    const c = { all: interviews.length, upcoming: 0, today: 0, completed: 0, cancelled: 0 }
    interviews.forEach((i) => {
      if (i.computedStatus === 'upcoming' || i.computedStatus === 'rescheduled') c.upcoming++
      if (i.computedStatus === 'today') { c.today++; c.upcoming++ }
      if (i.computedStatus === 'completed') c.completed++
      if (i.computedStatus === 'cancelled') c.cancelled++
    })
    return c
  }, [interviews])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return interviews
    if (activeFilter === 'upcoming') {
      return interviews.filter((i) =>
        ['upcoming', 'today', 'rescheduled'].includes(i.computedStatus)
      )
    }
    return interviews.filter((i) => i.computedStatus === activeFilter)
  }, [interviews, activeFilter])

  // The most urgent next interview (today or upcoming)
  const nextInterview = useMemo(
    () =>
      interviews.find((i) =>
        ['today', 'upcoming'].includes(i.computedStatus)
      ) || null,
    [interviews]
  )

  return (
    <div className="upcoming-page">
      <UpcomingHero
        nextInterview={nextInterview}
        totalUpcoming={counts.upcoming}
        totalCompleted={counts.completed}
      />

      {/* Filters */}
      <div className="upcoming-filters">
        <div className="upcoming-filters__label">Filter</div>
        <div className="upcoming-filters__row">
          {FILTERS.map((f) => {
            const count = counts[f.id] || 0
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={[
                  'upcoming-filter',
                  activeFilter === f.id && 'upcoming-filter--active',
                ].filter(Boolean).join(' ')}
              >
                <span className="upcoming-filter__label">{f.label}</span>
                {count > 0 && (
                  <span className="upcoming-filter__count">{count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState filter={activeFilter} />
      ) : (
        <div className="upcoming-list">
          {filtered.map((interview, i) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              isNext={interview.id === nextInterview?.id}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default UpcomingInterviews