/**
 * Remote data service
 * Seeds LocalStorage from public/data/ ONLY on first visit.
 * After first visit, LocalStorage is the source of truth.
 * Admin can force a refresh via Dev Tools.
 */

import { storageService } from './storageService'

// Fallback imports (used only if fetch fails on first seed)
import fallbackUsers from '../data/users.json'
import fallbackInterviews from '../data/interviews.json'
import fallbackInterviewRequests from '../data/interviewRequests.json'
import fallbackResults from '../data/results.json'
import fallbackScorecards from '../data/scorecards.json'
import fallbackNotifications from '../data/notifications.json'
import fallbackDocuments from '../data/documents.json'
import fallbackBlogs from '../data/blogs.json'
import fallbackUniversities from '../data/universities.json'
import fallbackSettings from '../data/settings.json'

const { KEYS } = storageService

const REMOTE_BASE = import.meta.env.VITE_REMOTE_DATA_URL || '/data'

const FILES = [
  { file: 'users.json', key: KEYS.USERS, root: 'users', fallback: fallbackUsers },
  { file: 'interviews.json', key: KEYS.INTERVIEWS, root: 'interviews', fallback: fallbackInterviews },
  { file: 'interviewRequests.json', key: KEYS.INTERVIEW_REQUESTS, root: 'requests', fallback: fallbackInterviewRequests },
  { file: 'results.json', key: KEYS.RESULTS, root: 'results', fallback: fallbackResults },
  { file: 'scorecards.json', key: KEYS.SCORECARDS, root: 'scorecards', fallback: fallbackScorecards },
  { file: 'notifications.json', key: KEYS.NOTIFICATIONS, root: 'notifications', fallback: fallbackNotifications },
  {
    file: 'documents.json', key: KEYS.DOCUMENTS, root: null, fallback: fallbackDocuments,
    transform: (d) => ({ categories: d.documentCategories, documents: d.documents }),
  },
  { file: 'documents.json', key: KEYS.DOCUMENT_STATUS, root: 'userDocumentStatus', fallback: fallbackDocuments },
  {
    file: 'blogs.json', key: KEYS.BLOGS, root: null, fallback: fallbackBlogs,
    transform: (d) => ({ categories: d.categories, articles: d.articles }),
  },
  { file: 'universities.json', key: KEYS.UNIVERSITIES, root: 'universities', fallback: fallbackUniversities },
  { file: 'settings.json', key: KEYS.SETTINGS, root: 'defaultSettings', fallback: fallbackSettings },
  { file: 'registrationRequests.json', key: 'bpn_registration_requests', root: 'requests', fallback: { requests: [] }, optional: true },
]

const uniqueFiles = [...new Set(FILES.map((f) => f.file))]
const SEEDED_FLAG = 'bpn_seeded_from_remote'

async function fetchFile(fileName, optional) {
  try {
    const url = `${REMOTE_BASE}/${fileName}?t=${Date.now()}`
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      if (optional) return null
      throw new Error(`Failed to fetch ${fileName}: ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    if (!optional) console.warn(`[RemoteData] Fetch failed for ${fileName}, using fallback.`, err)
    return null
  }
}

async function seedAllFromRemote() {
  const results = { loaded: [], failed: [] }

  const cache = {}
  for (const fileName of uniqueFiles) {
    const isOptional = FILES.find((f) => f.file === fileName)?.optional
    cache[fileName] = await fetchFile(fileName, isOptional)
  }

  for (const entry of FILES) {
    let data = cache[entry.file]
    let usedFallback = false

    if (!data) {
      data = entry.fallback
      usedFallback = true
    }

    const extracted = entry.transform
      ? entry.transform(data)
      : entry.root
        ? data[entry.root]
        : data

    if (extracted === undefined || extracted === null) {
      results.failed.push(entry.key)
      continue
    }

    storageService.set(entry.key, extracted)
    results.loaded.push({ key: entry.key, source: usedFallback ? 'fallback' : 'remote' })
  }

  storageService.set('bpn_last_remote_sync', new Date().toISOString())
  storageService.set(SEEDED_FLAG, true)
  return results
}

/**
 * Called on every app boot.
 * Only seeds if never seeded before (first visit).
 * Otherwise leaves LocalStorage completely alone.
 */
async function initializeIfNeeded() {
  const alreadySeeded = storageService.get(SEEDED_FLAG)
  if (alreadySeeded) {
    return { skipped: true, reason: 'already_seeded' }
  }
  const results = await seedAllFromRemote()
  return { skipped: false, results }
}

/**
 * Called manually from Dev Tools when admin clicks "Refresh from remote".
 * force=true: overwrite everything with what's in public/data/
 * force=false: only overwrite non-admin-managed data (blogs, universities, documents catalog)
 */
async function refreshFromRemote({ force = false } = {}) {
  if (force) {
    // Wipe seeded flag and re-seed everything
    return await seedAllFromRemote()
  }

  // Non-force: only refresh "content" data, not user-created data
  const CONTENT_KEYS = [KEYS.BLOGS, KEYS.UNIVERSITIES, KEYS.DOCUMENTS]
  const results = { loaded: [], skipped: [] }

  const cache = {}
  for (const fileName of uniqueFiles) {
    const isOptional = FILES.find((f) => f.file === fileName)?.optional
    cache[fileName] = await fetchFile(fileName, isOptional)
  }

  for (const entry of FILES) {
    if (!CONTENT_KEYS.includes(entry.key)) {
      results.skipped.push(entry.key)
      continue
    }

    let data = cache[entry.file]
    if (!data) {
      data = entry.fallback
    }

    const extracted = entry.transform
      ? entry.transform(data)
      : entry.root ? data[entry.root] : data

    if (extracted !== undefined && extracted !== null) {
      storageService.set(entry.key, extracted)
      results.loaded.push({ key: entry.key })
    }
  }

  storageService.set('bpn_last_remote_sync', new Date().toISOString())
  return results
}

function getLastSyncTime() {
  return storageService.get('bpn_last_remote_sync')
}

function hasBeenSeeded() {
  return Boolean(storageService.get(SEEDED_FLAG))
}

function isRemoteConfigured() {
  return Boolean(REMOTE_BASE)
}

export const remoteDataService = {
  initializeIfNeeded,
  refreshFromRemote,
  seedAllFromRemote,
  getLastSyncTime,
  hasBeenSeeded,
  isRemoteConfigured,
  REMOTE_BASE,
}