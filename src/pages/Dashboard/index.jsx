import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { dataService } from '../../services/dataService'
import DashboardHero from './components/DashboardHero'
import JourneyTrack from './components/JourneyTrack'
import UpcomingInterviewCard from './components/UpcomingInterviewCard'
import LatestResultCard from './components/LatestResultCard'
import DocumentProgressCard from './components/DocumentProgressCard'
import RecentNotifications from './components/RecentNotifications'
import RecommendedActions from './components/RecommendedActions'
import RecentUpdates from './components/RecentUpdates'
import InspirationBand from './components/InspirationBand'
import './Dashboard.scss'

function Dashboard() {
  const { currentUser } = useAuth()

  const upcomingInterviews = dataService.getUpcomingInterviews(currentUser.id)
  const nextInterview = upcomingInterviews[0] || null

  const results = dataService.getPublishedResultsByUserId(currentUser.id)
  const latestResult = results.sort((a, b) =>
    new Date(b.publishedAt) - new Date(a.publishedAt)
  )[0] || null

  const notifications = dataService.getNotificationsByUserId(currentUser.id)
  const unreadCount = dataService.getUnreadCount(currentUser.id)

  const interviewRequests = dataService.getInterviewRequestsByUserId(currentUser.id)

  const docDefs = dataService.getDocumentDefinitions()
  const userDocStatuses = dataService.getUserDocumentStatus(currentUser.id)
  const readyCount = userDocStatuses.filter((s) => s.status === 'ready').length
  const totalDocs = docDefs.documents.length
  const docProgress = totalDocs > 0 ? Math.round((readyCount / totalDocs) * 100) : 0

  const determineStage = () => {
    if (results.length > 0) {
      const types = results.map((r) => r.type)
      if (types.includes('embassy')) return 'travel'
      if (types.includes('ind')) return 'embassy'
      if (types.includes('university')) return 'ind'
    }
    if (interviewRequests.length > 0) return 'university_interview'
    return 'admission'
  }
  const currentStage = determineStage()

  return (
    <div className="dashboard">
      {/* Hero with real image */}
      <DashboardHero
        user={currentUser}
        upcomingCount={upcomingInterviews.length}
      />

      {/* Journey */}
      <JourneyTrack currentStage={currentStage} />

      {/* Main grid */}
      <div className="dashboard__grid">
        <div className="dashboard__col dashboard__col--main">
          <UpcomingInterviewCard interview={nextInterview} />
          <LatestResultCard result={latestResult} />
          <RecommendedActions
            user={currentUser}
            nextInterview={nextInterview}
            docProgress={docProgress}
            unreadCount={unreadCount}
          />
        </div>

        <div className="dashboard__col dashboard__col--side">
          <DocumentProgressCard
            readyCount={readyCount}
            totalDocs={totalDocs}
            progress={docProgress}
            categories={docDefs.categories}
            statuses={userDocStatuses}
            documents={docDefs.documents}
          />
          <RecentNotifications
            notifications={notifications.slice(0, 4)}
          />
        </div>
      </div>

      {/* Inspiration Band with image */}
      <InspirationBand university={currentUser.university} />

      {/* Full-width updates */}
      <RecentUpdates />
    </div>
  )
}

export default Dashboard