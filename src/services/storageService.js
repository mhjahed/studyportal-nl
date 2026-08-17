/**
 * Centralized LocalStorage service
 * All LocalStorage operations go through this service
 */

const KEYS = {
  USERS: 'bpn_users',
  SESSION: 'bpn_session',
  INTERVIEWS: 'bpn_interviews',
  INTERVIEW_REQUESTS: 'bpn_interview_requests',
  RESULTS: 'bpn_results',
  SCORECARDS: 'bpn_scorecards',
  NOTIFICATIONS: 'bpn_notifications',
  DOCUMENTS: 'bpn_documents',
  DOCUMENT_STATUS: 'bpn_document_status',
  BLOGS: 'bpn_blogs',
  UNIVERSITIES: 'bpn_universities',
  SETTINGS: 'bpn_settings',
  USER_SETTINGS: 'bpn_user_settings',
  DATA_VERSION: 'bpn_data_version',
}

const CURRENT_VERSION = 1

// ─── Core read/write ────────────────────────────────────────────────────────

function get(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

function clear() {
  try {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
    return true
  } catch {
    return false
  }
}

// ─── Session ─────────────────────────────────────────────────────────────────

function getSession() {
  return get(KEYS.SESSION)
}

function setSession(sessionData) {
  return set(KEYS.SESSION, {
    ...sessionData,
    timestamp: new Date().toISOString(),
  })
}

function clearSession() {
  return remove(KEYS.SESSION)
}

function isSessionValid() {
  const session = getSession()
  if (!session || !session.userId) return false
  // Sessions last 7 days
  const created = new Date(session.timestamp)
  const now = new Date()
  const diffHours = (now - created) / (1000 * 60 * 60)
  return diffHours < 168
}

// ─── Data version ─────────────────────────────────────────────────────────────

function getDataVersion() {
  return get(KEYS.DATA_VERSION) || 0
}

function setDataVersion(version) {
  return set(KEYS.DATA_VERSION, version)
}

// ─── Generic collection helpers ──────────────────────────────────────────────

function getCollection(key) {
  return get(key) || []
}

function setCollection(key, data) {
  return set(key, data)
}

export const storageService = {
  KEYS,
  CURRENT_VERSION,
  get,
  set,
  remove,
  clear,
  getSession,
  setSession,
  clearSession,
  isSessionValid,
  getDataVersion,
  setDataVersion,
  getCollection,
  setCollection,
}