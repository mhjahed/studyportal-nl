import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../../services/adminService'
import OverviewPage from '../pages/OverviewPage'
import UsersPage from '../pages/UsersPage'
import RequestsPage from '../pages/RequestsPage'
import InterviewsPage from '../pages/InterviewsPage'
import ResultsPage from '../pages/ResultsPage'
import ScorecardsPage from '../pages/ScorecardsPage'
import NotificationsAdminPage from '../pages/NotificationsAdminPage'
import DocumentsAdminPage from '../pages/DocumentsAdminPage'
import DataPage from '../pages/DataPage'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'bx-grid-alt' },
  { id: 'users', label: 'Users', icon: 'bx-user' },
  { id: 'requests', label: 'Requests', icon: 'bx-inbox' },
  { id: 'interviews', label: 'Interviews', icon: 'bx-calendar-event' },
  { id: 'results', label: 'Results', icon: 'bx-award' },
  { id: 'scorecards', label: 'Scorecards', icon: 'bx-line-chart' },
  { id: 'notifications', label: 'Notifications', icon: 'bx-bell' },
  { id: 'documents', label: 'Documents', icon: 'bx-file' },
  { id: 'data', label: 'Data', icon: 'bx-data' },
]

function DevToolsShell({ onLock }) {
  const [activePage, setActivePage] = useState('overview')
  const [refreshTick, setRefreshTick] = useState(0)

  const refresh = () => setRefreshTick((t) => t + 1)

  const stats = useMemo(() => adminService.getOverviewStats(), [refreshTick])

  const pendingCount =
    stats.requests.registration.pending + stats.requests.interview.pending

  const renderPage = () => {
    const props = { refresh, stats }
    switch (activePage) {
      case 'overview': return <OverviewPage {...props} onNavigate={setActivePage} />
      case 'users': return <UsersPage {...props} />
      case 'requests': return <RequestsPage {...props} />
      case 'interviews': return <InterviewsPage {...props} />
      case 'results': return <ResultsPage {...props} />
      case 'scorecards': return <ScorecardsPage {...props} />
      case 'notifications': return <NotificationsAdminPage {...props} />
      case 'documents': return <DocumentsAdminPage {...props} />
      case 'data': return <DataPage {...props} />
      default: return null
    }
  }

  return (
    <div className="dt-shell">
      <header className="dt-shell__header">
        <div className="dt-shell__brand">
          <div className="dt-shell__brand-icon">
            <i className="bx bx-shield-quarter" />
          </div>
          <div className="dt-shell__brand-text">
            <div className="dt-shell__brand-name">Developer Tools</div>
            <div className="dt-shell__brand-sub">Bachelors Portal Netherlands</div>
          </div>
        </div>

        <div className="dt-shell__actions">
          <Link to="/dashboard" className="dt-shell__portal-link">
            <i className="bx bx-left-arrow-alt" />
            Back to portal
          </Link>
          <button type="button" onClick={onLock} className="dt-shell__lock-btn">
            <i className="bx bx-lock-alt" />
            Lock
          </button>
        </div>
      </header>

      <div className="dt-shell__body">
        <nav className="dt-shell__nav">
          {NAV_ITEMS.map((item) => {
            let count = null
            if (item.id === 'requests' && pendingCount > 0) count = pendingCount
            if (item.id === 'users' && stats.users.pending > 0) count = stats.users.pending

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={[
                  'dt-shell__nav-item',
                  activePage === item.id && 'dt-shell__nav-item--active',
                ].filter(Boolean).join(' ')}
              >
                <i className={`bx ${item.icon}`} />
                <span>{item.label}</span>
                {count !== null && (
                  <span className="dt-shell__nav-count">{count}</span>
                )}
              </button>
            )
          })}
        </nav>

        <main className="dt-shell__main">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default DevToolsShell