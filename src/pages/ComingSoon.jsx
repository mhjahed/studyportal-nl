import React from 'react'

function ComingSoon({ page }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: '#f8f9fa',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {/* Netherlands Flag */}
        <div
          style={{
            width: '60px',
            height: '40px',
            margin: '0 auto 2rem',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ height: '33.33%', background: '#AE1C28' }} />
          <div style={{ height: '33.34%', background: '#FFFFFF' }} />
          <div style={{ height: '33.33%', background: '#21468B' }} />
        </div>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a1a2e',
            marginBottom: '0.5rem',
          }}
        >
          Bachelors Portal Netherlands
        </h1>

        <p
          style={{
            color: '#6c757d',
            fontSize: '1rem',
            marginBottom: '0.25rem',
          }}
        >
          Page: <strong>{page}</strong>
        </p>

        <p style={{ color: '#adb5bd', fontSize: '0.875rem' }}>
          Project initialized — phases will be built here
        </p>
      </div>
    </div>
  )
}

export default ComingSoon