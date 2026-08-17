import { storageService } from './storageService'
import { dataService } from './dataService'

const { KEYS } = storageService

// ─── User management ────────────────────────────────────────────────────────

function generateISO() {
  const year = new Date().getFullYear()
  const random = Math.random().toString().slice(2, 6)
  return `BPN-${year}-NL-${random}`
}

function generateUserId() {
  return `usr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function generateUsername(firstName, lastName) {
  const base = `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z.]/g, '')
  const users = dataService.getUsers()
  let username = base
  let suffix = 1
  while (users.some((u) => u.username === username)) {
    username = `${base}${suffix}`
    suffix++
  }
  return username
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let pw = ''
  for (let i = 0; i < 8; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pw
}

function createUser(data) {
  const users = dataService.getUsers()
  const now = new Date().toISOString()
  const user = {
    id: generateUserId(),
    isoCode: data.isoCode || generateISO(),
    username: data.username || generateUsername(data.firstName, data.lastName),
    password: data.password || generatePassword(),
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    passportNumber: data.passportNumber,
    passportExpiry: data.passportExpiry,
    profileImage:
      data.profileImage ||
      `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=1a3a6b&color=fff&size=200`,
    university: data.university || '',
    course: data.course || '',
    studyLevel: data.studyLevel || 'Bachelor',
    accountStatus: data.accountStatus || 'active',
    createdAt: now,
    updatedAt: now,
  }
  users.push(user)
  storageService.set(KEYS.USERS, users)
  return user
}

function updateUserFull(id, patch) {
  const users = dataService.getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...patch, updatedAt: new Date().toISOString() }
  storageService.set(KEYS.USERS, users)
  return users[idx]
}

function deleteUser(id) {
  const users = dataService.getUsers().filter((u) => u.id !== id)
  storageService.set(KEYS.USERS, users)
  return true
}

function approveRegistrationRequest(requestId) {
  const requests = dataService.getRegistrationRequests()
  const request = requests.find((r) => r.requestId === requestId || r.id === requestId)
  if (!request) return null

  const user = createUser({
    firstName: request.firstName,
    lastName: request.lastName,
    dateOfBirth: request.dateOfBirth,
    passportNumber: request.passportNumber,
    passportExpiry: request.passportExpiry,
    profileImage: request.profileImageUrl,
    accountStatus: 'active',
  })

  // Update request status
  request.status = 'approved'
  request.approvedAt = new Date().toISOString()
  request.userId = user.id
  storageService.set('bpn_registration_requests', requests)

  return { user, credentials: { username: user.username, password: user.password } }
}

function rejectRegistrationRequest(requestId, reason) {
  const requests = dataService.getRegistrationRequests()
  const request = requests.find((r) => r.requestId === requestId || r.id === requestId)
  if (!request) return null
  request.status = 'rejected'
  request.rejectedAt = new Date().toISOString()
  request.rejectionReason = reason || ''
  storageService.set('bpn_registration_requests', requests)
  return request
}

// ─── Interview request management ───────────────────────────────────────────

function updateInterviewRequestStatus(requestId, status, reason) {
  const requests = dataService.getInterviewRequests()
  const req = requests.find((r) => r.requestId === requestId || r.id === requestId)
  if (!req) return null
  req.status = status
  req.updatedAt = new Date().toISOString()
  if (reason) req.adminReason = reason
  storageService.set(KEYS.INTERVIEW_REQUESTS, requests)
  return req
}

// ─── Interview scheduling ──────────────────────────────────────────────────

function generateInterviewId() {
  return `int_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function scheduleInterview(data) {
  const interviews = dataService.getInterviews()
  const user = dataService.getUserById(data.userId)
  if (!user) return null

  const interview = {
    id: generateInterviewId(),
    userId: data.userId,
    isoCode: user.isoCode,
    type: data.type,
    typeLabel: data.typeLabel || {
      university: 'University Admission Interview',
      ind: 'IND Interview',
      embassy: 'Embassy Interview',
    }[data.type],
    university: data.university || user.university,
    course: data.course || user.course,
    date: data.date,
    time: data.time,
    timezone: 'Europe/Amsterdam',
    duration: data.duration || 30,
    meetLink: data.meetLink,
    status: 'upcoming',
    instructions: data.instructions || '',
    interviewerName: data.interviewerName || 'To be assigned',
    createdAt: new Date().toISOString(),
  }
  interviews.push(interview)
  storageService.set(KEYS.INTERVIEWS, interviews)

  // Auto-create notification
  addNotification({
    userId: data.userId,
    type: `${data.type}_scheduled`,
    category: 'interview',
    title: `${interview.typeLabel} Scheduled`,
    message: `Your ${interview.typeLabel} has been scheduled for ${formatFullDate(data.date)} at ${data.time} Amsterdam time.`,
    actionUrl: '/upcoming-interviews',
    actionLabel: 'View Interview',
  })

  // Mark related interview request as approved if there was one
  if (data.linkedRequestId) {
    updateInterviewRequestStatus(data.linkedRequestId, 'approved')
  }

  return interview
}

function updateInterview(id, patch) {
  const interviews = dataService.getInterviews()
  const idx = interviews.findIndex((i) => i.id === id)
  if (idx === -1) return null
  interviews[idx] = { ...interviews[idx], ...patch }
  storageService.set(KEYS.INTERVIEWS, interviews)
  return interviews[idx]
}

function deleteInterview(id) {
  const interviews = dataService.getInterviews().filter((i) => i.id !== id)
  storageService.set(KEYS.INTERVIEWS, interviews)
  return true
}

// ─── Results management ───────────────────────────────────────────────────

function generateResultId() {
  return `res_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function computeGrade(percentage) {
  if (percentage >= 95) return 'A+'
  if (percentage >= 85) return 'A'
  if (percentage >= 80) return 'B+'
  if (percentage >= 75) return 'B'
  if (percentage >= 70) return 'C+'
  if (percentage >= 60) return 'C'
  if (percentage >= 50) return 'D'
  return 'F'
}

function createResult(data) {
  const results = storageService.get(KEYS.RESULTS) || []
  const interview = dataService.getInterviews().find((i) => i.id === data.interviewId)
  const user = dataService.getUserById(data.userId)
  if (!user) return null

  const percentage = Math.round((data.totalScore / data.maxScore) * 100)
  const grade = data.grade || computeGrade(percentage)

  const result = {
    id: generateResultId(),
    userId: data.userId,
    isoCode: user.isoCode,
    interviewId: data.interviewId,
    type: data.type || interview?.type,
    typeLabel: data.typeLabel || interview?.typeLabel,
    interviewDate: data.interviewDate || interview?.date,
    totalScore: data.totalScore,
    maxScore: data.maxScore,
    percentage,
    grade,
    status: data.status || 'draft',
    overallFeedback: data.overallFeedback || '',
    recommendations: data.recommendations || [],
    publishedAt: data.status === 'published' ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
  }
  results.push(result)
  storageService.set(KEYS.RESULTS, results)

  // If interview exists and is upcoming, mark as completed
  if (interview && interview.status === 'upcoming') {
    updateInterview(interview.id, { status: 'completed' })
  }

  // Notification if published
  if (result.status === 'published') {
    addNotification({
      userId: data.userId,
      type: 'result_published',
      category: 'result',
      title: 'Interview Result Published',
      message: `Your ${result.typeLabel} result has been published. You scored ${result.totalScore}/${result.maxScore} (${percentage}%).`,
      actionUrl: '/results',
      actionLabel: 'View Result',
    })
  }

  return result
}

function updateResult(id, patch) {
  const results = storageService.get(KEYS.RESULTS) || []
  const idx = results.findIndex((r) => r.id === id)
  if (idx === -1) return null

  const previousStatus = results[idx].status
  results[idx] = { ...results[idx], ...patch }

  if (patch.totalScore !== undefined || patch.maxScore !== undefined) {
    results[idx].percentage = Math.round(
      (results[idx].totalScore / results[idx].maxScore) * 100
    )
    if (!patch.grade) {
      results[idx].grade = computeGrade(results[idx].percentage)
    }
  }

  if (patch.status === 'published' && previousStatus !== 'published') {
    results[idx].publishedAt = new Date().toISOString()
    addNotification({
      userId: results[idx].userId,
      type: 'result_published',
      category: 'result',
      title: 'Interview Result Published',
      message: `Your ${results[idx].typeLabel} result has been published.`,
      actionUrl: '/results',
      actionLabel: 'View Result',
    })
  }

  storageService.set(KEYS.RESULTS, results)
  return results[idx]
}

function deleteResult(id) {
  const results = (storageService.get(KEYS.RESULTS) || []).filter((r) => r.id !== id)
  storageService.set(KEYS.RESULTS, results)
  return true
}

// ─── Scorecard management ─────────────────────────────────────────────────

function generateScorecardId() {
  return `sc_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function generateCriterionId() {
  return `cr_${Math.random().toString(36).slice(2, 8)}`
}

function createScorecard(data) {
  const scorecards = storageService.get(KEYS.SCORECARDS) || []
  const user = dataService.getUserById(data.userId)
  if (!user) return null

  const scorecard = {
    id: generateScorecardId(),
    userId: data.userId,
    isoCode: user.isoCode,
    resultId: data.resultId || null,
    interviewId: data.interviewId,
    type: data.type,
    typeLabel: data.typeLabel,
    interviewDate: data.interviewDate,
    status: data.status || 'draft',
    criteria: (data.criteria || []).map((c) => ({
      id: c.id || generateCriterionId(),
      name: c.name,
      score: Number(c.score),
      maxScore: Number(c.maxScore),
      feedback: c.feedback || '',
    })),
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    overallComments: data.overallComments || '',
    publishedAt: data.status === 'published' ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
  }
  scorecards.push(scorecard)
  storageService.set(KEYS.SCORECARDS, scorecards)

  if (scorecard.status === 'published') {
    addNotification({
      userId: data.userId,
      type: 'scorecard_published',
      category: 'result',
      title: 'Scorecard Published',
      message: `Your ${scorecard.typeLabel} scorecard is now available with detailed feedback.`,
      actionUrl: '/scorecard',
      actionLabel: 'View Scorecard',
    })
  }

  return scorecard
}

function updateScorecard(id, patch) {
  const scorecards = storageService.get(KEYS.SCORECARDS) || []
  const idx = scorecards.findIndex((s) => s.id === id)
  if (idx === -1) return null

  const previousStatus = scorecards[idx].status
  scorecards[idx] = { ...scorecards[idx], ...patch }

  if (patch.status === 'published' && previousStatus !== 'published') {
    scorecards[idx].publishedAt = new Date().toISOString()
    addNotification({
      userId: scorecards[idx].userId,
      type: 'scorecard_published',
      category: 'result',
      title: 'Scorecard Published',
      message: `Your ${scorecards[idx].typeLabel} scorecard is now available.`,
      actionUrl: '/scorecard',
      actionLabel: 'View Scorecard',
    })
  }

  storageService.set(KEYS.SCORECARDS, scorecards)
  return scorecards[idx]
}

function deleteScorecard(id) {
  const scorecards = (storageService.get(KEYS.SCORECARDS) || []).filter((s) => s.id !== id)
  storageService.set(KEYS.SCORECARDS, scorecards)
  return true
}

// ─── Notifications ────────────────────────────────────────────────────────

function addNotification(data) {
  const notifications = storageService.get(KEYS.NOTIFICATIONS) || []
  const notif = {
    id: `notif_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
    userId: data.userId,
    type: data.type,
    category: data.category || 'update',
    title: data.title,
    message: data.message,
    isRead: false,
    actionUrl: data.actionUrl || null,
    actionLabel: data.actionLabel || null,
    createdAt: new Date().toISOString(),
  }
  notifications.unshift(notif)
  storageService.set(KEYS.NOTIFICATIONS, notifications)
  return notif
}

function deleteNotification(id) {
  const notifications = (storageService.get(KEYS.NOTIFICATIONS) || []).filter((n) => n.id !== id)
  storageService.set(KEYS.NOTIFICATIONS, notifications)
  return true
}

// ─── Data management ──────────────────────────────────────────────────────

function exportAllData() {
  const data = {
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    users: storageService.get(KEYS.USERS) || [],
    interviews: storageService.get(KEYS.INTERVIEWS) || [],
    interviewRequests: storageService.get(KEYS.INTERVIEW_REQUESTS) || [],
    registrationRequests: storageService.get('bpn_registration_requests') || [],
    results: storageService.get(KEYS.RESULTS) || [],
    scorecards: storageService.get(KEYS.SCORECARDS) || [],
    notifications: storageService.get(KEYS.NOTIFICATIONS) || [],
    documents: storageService.get(KEYS.DOCUMENTS) || {},
    documentStatuses: storageService.get(KEYS.DOCUMENT_STATUS) || [],
    blogs: storageService.get(KEYS.BLOGS) || {},
    universities: storageService.get(KEYS.UNIVERSITIES) || [],
    settings: storageService.get(KEYS.SETTINGS) || {},
    userSettings: storageService.get(KEYS.USER_SETTINGS) || {},
  }
  return data
}

function validateImportData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format' }
  }
  const required = ['users', 'interviews', 'results']
  for (const key of required) {
    if (!Array.isArray(data[key])) {
      return { valid: false, error: `Missing or invalid "${key}" array` }
    }
  }
  const summary = {
    users: data.users?.length || 0,
    interviews: data.interviews?.length || 0,
    interviewRequests: data.interviewRequests?.length || 0,
    registrationRequests: data.registrationRequests?.length || 0,
    results: data.results?.length || 0,
    scorecards: data.scorecards?.length || 0,
    notifications: data.notifications?.length || 0,
  }
  return { valid: true, summary }
}

function importAllData(data) {
  if (data.users) storageService.set(KEYS.USERS, data.users)
  if (data.interviews) storageService.set(KEYS.INTERVIEWS, data.interviews)
  if (data.interviewRequests) storageService.set(KEYS.INTERVIEW_REQUESTS, data.interviewRequests)
  if (data.registrationRequests) storageService.set('bpn_registration_requests', data.registrationRequests)
  if (data.results) storageService.set(KEYS.RESULTS, data.results)
  if (data.scorecards) storageService.set(KEYS.SCORECARDS, data.scorecards)
  if (data.notifications) storageService.set(KEYS.NOTIFICATIONS, data.notifications)
  if (data.documents) storageService.set(KEYS.DOCUMENTS, data.documents)
  if (data.documentStatuses) storageService.set(KEYS.DOCUMENT_STATUS, data.documentStatuses)
  if (data.blogs) storageService.set(KEYS.BLOGS, data.blogs)
  if (data.universities) storageService.set(KEYS.UNIVERSITIES, data.universities)
  if (data.settings) storageService.set(KEYS.SETTINGS, data.settings)
  if (data.userSettings) storageService.set(KEYS.USER_SETTINGS, data.userSettings)
  return true
}

function resetToSeed() {
  // Clear everything then re-initialize
  Object.values(KEYS).forEach((key) => storageService.remove(key))
  storageService.remove('bpn_registration_requests')
  storageService.remove('bpn_email_queue')
  storageService.setDataVersion(0)
  // Trigger re-initialization
  dataService.initialize()
  return true
}

function clearCollection(collection) {
  const map = {
    users: KEYS.USERS,
    interviews: KEYS.INTERVIEWS,
    interviewRequests: KEYS.INTERVIEW_REQUESTS,
    registrationRequests: 'bpn_registration_requests',
    results: KEYS.RESULTS,
    scorecards: KEYS.SCORECARDS,
    notifications: KEYS.NOTIFICATIONS,
    documentStatuses: KEYS.DOCUMENT_STATUS,
  }
  const key = map[collection]
  if (!key) return false
  storageService.set(key, [])
  return true
}

// ─── Overview stats ──────────────────────────────────────────────────────

function getOverviewStats() {
  const users = dataService.getUsers()
  const interviews = dataService.getInterviews()
  const results = storageService.get(KEYS.RESULTS) || []
  const scorecards = storageService.get(KEYS.SCORECARDS) || []
  const notifications = dataService.getNotifications()
  const regRequests = dataService.getRegistrationRequests()
  const intRequests = dataService.getInterviewRequests()

  return {
    users: {
      total: users.length,
      active: users.filter((u) => u.accountStatus === 'active').length,
      pending: users.filter((u) => u.accountStatus === 'pending').length,
      suspended: users.filter((u) => u.accountStatus === 'suspended').length,
    },
    interviews: {
      total: interviews.length,
      upcoming: interviews.filter((i) => i.status === 'upcoming').length,
      completed: interviews.filter((i) => i.status === 'completed').length,
      cancelled: interviews.filter((i) => i.status === 'cancelled').length,
    },
    requests: {
      registration: {
        pending: regRequests.filter((r) => r.status === 'pending').length,
        approved: regRequests.filter((r) => r.status === 'approved').length,
      },
      interview: {
        pending: intRequests.filter((r) => r.status === 'pending').length,
        approved: intRequests.filter((r) => r.status === 'approved').length,
      },
    },
    results: {
      total: results.length,
      published: results.filter((r) => r.status === 'published').length,
      draft: results.filter((r) => r.status === 'draft').length,
    },
    scorecards: {
      total: scorecards.length,
      published: scorecards.filter((s) => s.status === 'published').length,
      draft: scorecards.filter((s) => s.status === 'draft').length,
    },
    notifications: {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
    },
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function formatFullDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
// ─── Publish / Sync ──────────────────────────────────────────────────────

/**
 * Build the four "editable" JSON files in the same shape as public/data/
 * These are the files you'll drop back into public/data/ after editing.
 */
function buildPublishBundle() {
  // Registration requests file
  const registrationRequests = {
    dataVersion: 1,
    requests: storageService.get('bpn_registration_requests') || [],
  }

  // Users file
  const users = {
    dataVersion: 1,
    users: storageService.get(KEYS.USERS) || [],
  }

  // Interviews file
  const interviews = {
    dataVersion: 1,
    interviews: storageService.get(KEYS.INTERVIEWS) || [],
  }

  // Interview requests file
  const interviewRequests = {
    dataVersion: 1,
    requests: storageService.get(KEYS.INTERVIEW_REQUESTS) || [],
  }

  // Results file
  const results = {
    dataVersion: 1,
    results: storageService.get(KEYS.RESULTS) || [],
  }

  // Scorecards file
  const scorecards = {
    dataVersion: 1,
    scorecards: storageService.get(KEYS.SCORECARDS) || [],
  }

  // Notifications file
  const notifications = {
    dataVersion: 1,
    notifications: storageService.get(KEYS.NOTIFICATIONS) || [],
  }

  // Documents file (definitions + statuses)
  const docsDef = storageService.get(KEYS.DOCUMENTS) || { categories: [], documents: [] }
  const documents = {
    dataVersion: 1,
    documentCategories: docsDef.categories,
    documents: docsDef.documents,
    userDocumentStatus: storageService.get(KEYS.DOCUMENT_STATUS) || [],
  }

  // Blogs file
  const blogsData = storageService.get(KEYS.BLOGS) || { categories: [], articles: [] }
  const blogs = {
    dataVersion: 1,
    categories: blogsData.categories,
    articles: blogsData.articles,
  }

  // Universities file
  const universities = {
    dataVersion: 1,
    universities: storageService.get(KEYS.UNIVERSITIES) || [],
  }

  // Settings file
  const settings = {
    dataVersion: 1,
    defaultSettings: storageService.get(KEYS.SETTINGS) || {},
  }

  return {
    'users.json': users,
    'interviews.json': interviews,
    'interviewRequests.json': interviewRequests,
    'registrationRequests.json': registrationRequests,
    'results.json': results,
    'scorecards.json': scorecards,
    'notifications.json': notifications,
    'documents.json': documents,
    'blogs.json': blogs,
    'universities.json': universities,
    'settings.json': settings,
  }
}

/**
 * Download a single file as JSON
 */
function downloadJsonFile(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = window.document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Download all publish-bundle files individually (bulk download)
 */
async function downloadPublishBundle() {
  const bundle = buildPublishBundle()
  for (const [filename, data] of Object.entries(bundle)) {
    downloadJsonFile(filename, data)
    // Small delay so browsers don't block multiple downloads
    await new Promise((r) => setTimeout(r, 150))
  }
  return Object.keys(bundle)
}

async function refreshFromRemote(force = false) {
  const { remoteDataService } = await import('./remoteDataService')
  return remoteDataService.loadAllRemoteData({ force, preserveLocalWrites: !force })
}
// ─── Export ─────────────────────────────────────────────────────────────

export const adminService = {
  // Users
  createUser,
  updateUserFull,
  deleteUser,
  approveRegistrationRequest,
  rejectRegistrationRequest,

  // Interview requests
  updateInterviewRequestStatus,

  // Interviews
  scheduleInterview,
  updateInterview,
  deleteInterview,

  // Results
  createResult,
  updateResult,
  deleteResult,
  computeGrade,

  // Scorecards
  createScorecard,
  updateScorecard,
  deleteScorecard,

  // Notifications
  addNotification,
  deleteNotification,

  // Data management
  exportAllData,
  validateImportData,
  importAllData,
  resetToSeed,
  clearCollection,

  // Overview
  getOverviewStats,

  // Publish / Sync
  buildPublishBundle,
  downloadJsonFile,
  downloadPublishBundle,
  refreshFromRemote,
}