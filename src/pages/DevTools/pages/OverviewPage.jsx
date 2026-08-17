import React from 'react'

function StatCard({ label, value, sub, color, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#ffffff',
        border: '1px solid #d8d4c8',
        padding: '1.25rem 1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 150ms ease',
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.borderColor = '#1a3a6b')}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.borderColor = '#d8d4c8')}
    >
      <div style={{
        fontSize: '0.625rem',
        fontWeight: 700,
        color: '#8a8578',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Georgia, serif',
        fontSize: '2rem',
        color: color || '#1a1a2e',
        lineHeight: 1,
        marginBottom: 4,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '0.75rem', color: '#6a6a6a', fontWeight: 500 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function OverviewPage({ stats, onNavigate }) {
  return (
    <div className="dt-page">
      <div className="dt-page__header">
        <div className="dt-page__title-block">
          <div className="dt-page__eyebrow">Admin overview</div>
          <h1 className="dt-page__title">Portal at a glance</h1>
          <p className="dt-page__desc">
            Current state of the entire portal. Click any card to jump to the
            relevant management section.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
        marginBottom: 32,
      }}>
        <StatCard
          label="Total users"
          value={stats.users.total}
          sub={`${stats.users.active} active · ${stats.users.suspended} suspended`}
          onClick={() => onNavigate('users')}
        />
        <StatCard
          label="Pending registrations"
          value={stats.requests.registration.pending}
          sub={`${stats.requests.registration.approved} approved`}
          color={stats.requests.registration.pending > 0 ? '#e8820c' : '#1a1a2e'}
          onClick={() => onNavigate('requests')}
        />
        <StatCard
          label="Interview requests"
          value={stats.requests.interview.pending}
          sub={`${stats.requests.interview.approved} approved`}
          color={stats.requests.interview.pending > 0 ? '#e8820c' : '#1a1a2e'}
          onClick={() => onNavigate('requests')}
        />
        <StatCard
          label="Scheduled interviews"
          value={stats.interviews.upcoming}
          sub={`${stats.interviews.completed} completed · ${stats.interviews.cancelled} cancelled`}
          onClick={() => onNavigate('interviews')}
        />
        <StatCard
          label="Results"
          value={stats.results.total}
          sub={`${stats.results.published} published · ${stats.results.draft} draft`}
          onClick={() => onNavigate('results')}
        />
        <StatCard
          label="Scorecards"
          value={stats.scorecards.total}
          sub={`${stats.scorecards.published} published · ${stats.scorecards.draft} draft`}
          onClick={() => onNavigate('scorecards')}
        />
        <StatCard
          label="Notifications sent"
          value={stats.notifications.total}
          sub={`${stats.notifications.unread} unread`}
          onClick={() => onNavigate('notifications')}
        />
      </div>

      {/* Quick tips */}
      <div style={{
        background: '#faf8f3',
        border: '1px solid #e8e5dc',
        borderLeft: '3px solid #e8820c',
        padding: '1.25rem 1.5rem',
      }}>
        <div style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: '#e8820c',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          marginBottom: 12,
        }}>
          Typical admin workflow
        </div>
        <ol style={{
          margin: 0,
          paddingLeft: 20,
          fontSize: '0.875rem',
          color: '#4a4a4a',
          lineHeight: 1.75,
        }}>
          <li><strong>Requests</strong> → approve registration requests to create accounts, then approve interview requests to schedule them</li>
          <li><strong>Interviews</strong> → paste Google Meet link, set date/time, assign interviewer</li>
          <li><strong>Results</strong> → after an interview completes, create a result with score and feedback</li>
          <li><strong>Scorecards</strong> → create a detailed scorecard with criteria for the same interview</li>
          <li><strong>Publish</strong> → change status to "published" to make results visible to the student and trigger a notification</li>
        </ol>
      </div>
    </div>
  )
}

export default OverviewPage