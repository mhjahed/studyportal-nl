import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import AppSidebar from './components/AppSidebar'
import MobileNav from './components/MobileNav'
import './AppShell.scss'

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="shell">
      {/* Sidebar (desktop persistent, mobile drawer) */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="shell__backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content column */}
      <div className="shell__main">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />

<main
  id="main-content"
  className="shell__content"
  role="main"
  aria-label="Main content"
>
  <Outlet />
</main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  )
}

export default AppShell