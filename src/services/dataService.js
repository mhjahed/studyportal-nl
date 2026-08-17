/**
 * Data Service
 * All data operations go through this service.
 * JSON → DataService → LocalStorage → React UI
 */

import { storageService } from './storageService'

// JSON imports
import usersData from '../data/users.json'
import interviewsData from '../data/interviews.json'
import interviewRequestsData from '../data/interviewRequests.json'
import resultsData from '../data/results.json'
import scorecardsData from '../data/scorecards.json'
import notificationsData from '../data/notifications.json'
import documentsData from '../data/documents.json'
import blogsData from '../data/blogs.json'
import universitiesData from '../data/universities.json'
import settingsData from '../data/settings.json'

const { KEYS, CURRENT_VERSION } = storageService

// ─── Initialization ──────────────────────────────────────────────────────────

/**
 * Initialize the data store from JSON files if not already done
 */
async function initialize() {
  const { remoteDataService } = await import('./remoteDataService')

  const result = await remoteDataService.initializeIfNeeded()

  if (result.skipped) {
    console.info('[DataService] Already seeded — using LocalStorage as source of truth.')
  } else {
    console.info('[DataService] First-time seed from remote:', result.results)
  }

  storageService.setDataVersion(CURRENT_VERSION)
  return result
}

// ─── Users ───────────────────────────────────────────────────────────────────

function getUsers() {
  return storageService.get(KEYS.USERS) || []
}

function getUserById(id) {
  const users = getUsers()
  return users.find((u) => u.id === id) || null
}

function findUserByUsername(username) {
  const users = getUsers()
  return users.find((u) => u.username === username) || null
}

function findUserByCredentials(username, password) {
  const users = getUsers()
  return (
    users.find(
      (u) =>
        u.username === username &&
        u.password === password &&
        u.accountStatus === 'active'
    ) || null
  )
}

function getCurrentUser() {
  const session = storageService.getSession()
  if (!session || !session.userId) return null
  return getUserById(session.userId)
}

function addUser(userData) {
  const users = getUsers()
  users.push(userData)
  storageService.set(KEYS.USERS, users)
  return userData
}

function updateUser(id, updates) {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null
  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
  storageService.set(KEYS.USERS, users)
  return users[index]
}

// ─── Registration Requests ───────────────────────────────────────────────────

function getRegistrationRequests() {
  return storageService.get('bpn_registration_requests') || []
}

function addRegistrationRequest(requestData) {
  const requests = getRegistrationRequests()
  requests.push(requestData)
  storageService.set('bpn_registration_requests', requests)
  return requestData
}

function isPassportAlreadyRegistered(passportNumber) {
  const users = getUsers()
  const requests = getRegistrationRequests()
  const inUsers = users.some((u) => u.passportNumber === passportNumber)
  const inRequests = requests.some(
    (r) => r.passportNumber === passportNumber && r.status !== 'rejected'
  )
  return inUsers || inRequests
}

// ─── Interviews ──────────────────────────────────────────────────────────────

function getInterviews() {
  return storageService.get(KEYS.INTERVIEWS) || []
}

function getInterviewsByUserId(userId) {
  const interviews = getInterviews()
  return interviews.filter((i) => i.userId === userId)
}

function getUpcomingInterviews(userId) {
  const interviews = getInterviewsByUserId(userId)
  const now = new Date()
  return interviews
    .filter((i) => {
      const interviewDate = new Date(`${i.date}T${i.time}`)
      return i.status === 'upcoming' && interviewDate >= now
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
}

// ─── Interview Requests ───────────────────────────────────────────────────────

function getInterviewRequests() {
  return storageService.get(KEYS.INTERVIEW_REQUESTS) || []
}

function getInterviewRequestsByUserId(userId) {
  const requests = getInterviewRequests()
  return requests.filter((r) => r.userId === userId)
}

function addInterviewRequest(requestData) {
  const requests = getInterviewRequests()
  requests.push(requestData)
  storageService.set(KEYS.INTERVIEW_REQUESTS, requests)
  return requestData
}

function hasPendingRequest(userId, type) {
  const requests = getInterviewRequestsByUserId(userId)
  return requests.some(
    (r) => r.type === type && ['pending', 'approved'].includes(r.status)
  )
}

// ─── Results ─────────────────────────────────────────────────────────────────

function getResults() {
  return storageService.get(KEYS.RESULTS) || []
}

function getPublishedResultsByUserId(userId) {
  const results = getResults()
  return results.filter((r) => r.userId === userId && r.status === 'published')
}

function getResultById(id) {
  const results = getResults()
  return results.find((r) => r.id === id && r.status === 'published') || null
}

// ─── Scorecards ───────────────────────────────────────────────────────────────

function getScorecards() {
  return storageService.get(KEYS.SCORECARDS) || []
}

function getPublishedScorecardsByUserId(userId) {
  const scorecards = getScorecards()
  return scorecards.filter(
    (s) => s.userId === userId && s.status === 'published'
  )
}

function getScorecardByResultId(resultId) {
  const scorecards = getScorecards()
  return (
    scorecards.find(
      (s) => s.resultId === resultId && s.status === 'published'
    ) || null
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────

function getNotifications() {
  return storageService.get(KEYS.NOTIFICATIONS) || []
}

function getNotificationsByUserId(userId) {
  const notifications = getNotifications()
  return notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function getUnreadCount(userId) {
  const notifications = getNotificationsByUserId(userId)
  return notifications.filter((n) => !n.isRead).length
}

function markNotificationRead(notifId) {
  const notifications = getNotifications()
  const index = notifications.findIndex((n) => n.id === notifId)
  if (index === -1) return false
  notifications[index].isRead = true
  storageService.set(KEYS.NOTIFICATIONS, notifications)
  return true
}

function markAllNotificationsRead(userId) {
  const notifications = getNotifications()
  const updated = notifications.map((n) =>
    n.userId === userId ? { ...n, isRead: true } : n
  )
  storageService.set(KEYS.NOTIFICATIONS, updated)
  return true
}

function addNotification(notifData) {
  const notifications = getNotifications()
  notifications.unshift(notifData)
  storageService.set(KEYS.NOTIFICATIONS, notifications)
  return notifData
}

// ─── Documents ────────────────────────────────────────────────────────────────

function getDocumentDefinitions() {
  const data = storageService.get(KEYS.DOCUMENTS)
  return data || { categories: [], documents: [] }
}

function getDocumentStatuses() {
  return storageService.get(KEYS.DOCUMENT_STATUS) || []
}

function getUserDocumentStatus(userId) {
  const statuses = getDocumentStatuses()
  return statuses.filter((s) => s.userId === userId)
}

function updateDocumentStatus(userId, documentId, status, notes = '') {
  const statuses = getDocumentStatuses()
  const index = statuses.findIndex(
    (s) => s.userId === userId && s.documentId === documentId
  )
  const updated = {
    userId,
    documentId,
    status,
    notes,
    updatedAt: new Date().toISOString(),
  }
  if (index === -1) {
    statuses.push(updated)
  } else {
    statuses[index] = updated
  }
  storageService.set(KEYS.DOCUMENT_STATUS, statuses)
  return updated
}

// ─── Blogs ───────────────────────────────────────────────────────────────────

function getBlogs() {
  const data = storageService.get(KEYS.BLOGS)
  return data || { categories: [], articles: [] }
}

function getFeaturedArticles() {
  const { articles } = getBlogs()
  return articles.filter((a) => a.featured)
}

function getArticlesByCategory(categoryId) {
  const { articles } = getBlogs()
  return articles.filter((a) => a.categoryId === categoryId)
}

function getArticleBySlug(slug) {
  const { articles } = getBlogs()
  return articles.find((a) => a.slug === slug) || null
}

// ─── Universities ─────────────────────────────────────────────────────────────

function getUniversities() {
  return storageService.get(KEYS.UNIVERSITIES) || []
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function getSettings() {
  return storageService.get(KEYS.SETTINGS) || {}
}

function getUserSettings(userId) {
  const allSettings = storageService.get(KEYS.USER_SETTINGS) || {}
  return allSettings[userId] || null
}

function updateUserSettings(userId, settings) {
  const allSettings = storageService.get(KEYS.USER_SETTINGS) || {}
  allSettings[userId] = { ...allSettings[userId], ...settings }
  storageService.set(KEYS.USER_SETTINGS, allSettings)
  return allSettings[userId]
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

function generateId(prefix) {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

function generateRequestId(type) {
  const typeMap = {
    registration: 'RREG',
    university: 'IREQ-UNI',
    ind: 'IREQ-IND',
    embassy: 'IREQ-EMB',
  }
  const prefix = typeMap[type] || 'IREQ'
  const date = new Date()
  const dateStr =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${dateStr}-${random}`
}

export const dataService = {
  initialize,
  // Users
  getUsers,
  getUserById,
  findUserByUsername,
  findUserByCredentials,
  getCurrentUser,
  addUser,
  updateUser,
  // Registration
  getRegistrationRequests,
  addRegistrationRequest,
  isPassportAlreadyRegistered,
  // Interviews
  getInterviews,
  getInterviewsByUserId,
  getUpcomingInterviews,
  // Interview Requests
  getInterviewRequests,
  getInterviewRequestsByUserId,
  addInterviewRequest,
  hasPendingRequest,
  // Results
  getResults,
  getPublishedResultsByUserId,
  getResultById,
  // Scorecards
  getScorecards,
  getPublishedScorecardsByUserId,
  getScorecardByResultId,
  // Notifications
  getNotifications,
  getNotificationsByUserId,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
  // Documents
  getDocumentDefinitions,
  getDocumentStatuses,
  getUserDocumentStatus,
  updateDocumentStatus,
  // Blogs
  getBlogs,
  getFeaturedArticles,
  getArticlesByCategory,
  getArticleBySlug,
  // Universities
  getUniversities,
  // Settings
  getSettings,
  getUserSettings,
  updateUserSettings,
  // Utilities
  generateId,
  generateRequestId,
}