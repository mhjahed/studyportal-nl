import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { dataService } from '../../services/dataService'
import ProfileHero from './components/ProfileHero'
import IdentityCard from './components/IdentityCard'
import AcademicCard from './components/AcademicCard'
import AccountCard from './components/AccountCard'
import ProfileActivity from './components/ProfileActivity'
import './Profile.scss'

function Profile() {
  const { currentUser } = useAuth()

  // Compute activity stats from real data
  const interviews = dataService.getInterviewsByUserId(currentUser.id)
  const results = dataService.getPublishedResultsByUserId(currentUser.id)
  const requests = dataService.getInterviewRequestsByUserId(currentUser.id)
  const docStatuses = dataService.getUserDocumentStatus(currentUser.id)
  const docDefs = dataService.getDocumentDefinitions()

  const readyDocs = docStatuses.filter((s) => s.status === 'ready').length
  const totalDocs = docDefs.documents.length

  const stats = {
    upcomingInterviews: interviews.filter((i) => i.status === 'upcoming').length,
    completedInterviews: interviews.filter((i) => i.status === 'completed').length,
    publishedResults: results.length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
    readyDocs,
    totalDocs,
    docProgressPct: totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 0,
  }

  return (
    <div className="profile-page">
      <ProfileHero user={currentUser} />

      <div className="profile-page__grid">
        <div className="profile-page__main">
          <IdentityCard user={currentUser} />
          <AcademicCard user={currentUser} />
        </div>

        <div className="profile-page__side">
          <AccountCard user={currentUser} />
          <ProfileActivity stats={stats} />
        </div>
      </div>
    </div>
  )
}

export default Profile