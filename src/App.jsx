import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register/index'
import Login from './pages/Login/index'
import AppShell from './layouts/AppShell/index'
import Dashboard from './pages/Dashboard/index'
import BookInterview from './pages/BookInterview/index'
import UpcomingInterviews from './pages/UpcomingInterviews/index'
import Results from './pages/Results/index'
import Scorecard from './pages/Scorecard/index'
import Documents from './pages/Documents/index'
import StudyUpdates from './pages/StudyUpdates/index'
import Notifications from './pages/Notifications/index'
import Profile from './pages/Profile/index'
import Settings from './pages/Settings/index'
import NotFound from './pages/NotFound'
import DevTools from './pages/DevTools/index'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import ErrorBoundary from './components/ErrorBoundary'
import NetworkBanner from './components/NetworkBanner'
import PageLoader from './components/PageLoader'
import SessionMonitor from './components/SessionMonitor'
import UrgentInterviewAlert from './components/UrgentInterviewAlert'
import SkipToContent from './components/SkipToContent'
import { useEmailQueue } from './hooks/useEmailQueue'

function App() {
  useEmailQueue()

  return (
    <ErrorBoundary>
      <SkipToContent />
      <NetworkBanner />
      <PageLoader />
      <SessionMonitor />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Dev tools — no auth required, has its own passphrase gate */}
        <Route path="/dev-tools" element={<DevTools />} />

        <Route
          path="/register"
          element={<PublicOnlyRoute><Register /></PublicOnlyRoute>}
        />
        <Route
          path="/login"
          element={<PublicOnlyRoute><Login /></PublicOnlyRoute>}
        />

        <Route
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AppShell />
                <UrgentInterviewAlert />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register-interview" element={<BookInterview />} />
          <Route path="/upcoming-interviews" element={<UpcomingInterviews />} />
          <Route path="/results" element={<Results />} />
          <Route path="/scorecard" element={<Scorecard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/visa-updates" element={<StudyUpdates />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App