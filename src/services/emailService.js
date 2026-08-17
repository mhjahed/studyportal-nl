/**
 * EmailJS Service
 * Uses TWO templates:
 *   1. Registration template (for new user requests)
 *   2. Universal Interview template (for University / IND / Embassy)
 *
 * Failed sends are queued to LocalStorage for retry.
 */

import emailjs from '@emailjs/browser'
import { storageService } from './storageService'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

const TEMPLATES = {
  REGISTRATION: import.meta.env.VITE_EMAILJS_REGISTRATION_TEMPLATE || '',
  INTERVIEW: import.meta.env.VITE_EMAILJS_INTERVIEW_TEMPLATE || '',
}

const QUEUE_KEY = 'bpn_email_queue'
const MAX_QUEUE_SIZE = 50

// ─── Configuration ──────────────────────────────────────────────────────────

function isConfigured() {
  return Boolean(SERVICE_ID && PUBLIC_KEY)
}

function isTemplateConfigured(templateId) {
  return Boolean(templateId && templateId.length > 0)
}

function getConfigStatus() {
  return {
    serviceIdSet: Boolean(SERVICE_ID),
    publicKeySet: Boolean(PUBLIC_KEY),
    templates: {
      registration: isTemplateConfigured(TEMPLATES.REGISTRATION),
      interview: isTemplateConfigured(TEMPLATES.INTERVIEW),
    },
  }
}

let noticeShown = false
function warnIfNotConfigured() {
  if (noticeShown) return
  noticeShown = true

  if (!isConfigured()) {
    console.warn(
      '[EmailJS] Not configured. Emails will be queued locally.\n' +
      'Set VITE_EMAILJS_SERVICE_ID and VITE_EMAILJS_PUBLIC_KEY in .env\n' +
      'See EMAILJS_SETUP.md for setup instructions.'
    )
  }
}

// ─── Queue ──────────────────────────────────────────────────────────────────

function getQueue() {
  return storageService.get(QUEUE_KEY) || []
}

function saveQueue(queue) {
  const capped = queue.slice(-MAX_QUEUE_SIZE)
  storageService.set(QUEUE_KEY, capped)
}

function enqueue(item) {
  const queue = getQueue()
  queue.push({
    ...item,
    queuedAt: new Date().toISOString(),
    attempts: 0,
    lastAttemptAt: null,
    lastError: null,
  })
  saveQueue(queue)
}

function removeFromQueue(itemId) {
  const queue = getQueue().filter((q) => q.itemId !== itemId)
  saveQueue(queue)
}

function updateQueueItem(itemId, patch) {
  const queue = getQueue()
  const idx = queue.findIndex((q) => q.itemId === itemId)
  if (idx !== -1) {
    queue[idx] = { ...queue[idx], ...patch }
    saveQueue(queue)
  }
}

function clearQueue() {
  storageService.remove(QUEUE_KEY)
}

// ─── Core send ──────────────────────────────────────────────────────────────

async function send(templateId, params, meta = {}) {
  warnIfNotConfigured()

  const itemId = meta.itemId || `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  if (!isConfigured()) {
    enqueue({ itemId, templateId, params, meta })
    return {
      success: false,
      reason: 'not_configured',
      queued: true,
      itemId,
      message: 'EmailJS is not configured. Request saved locally.',
    }
  }

  if (!isTemplateConfigured(templateId)) {
    enqueue({ itemId, templateId, params, meta })
    return {
      success: false,
      reason: 'template_missing',
      queued: true,
      itemId,
      message: 'Email template not configured. Request saved locally.',
    }
  }

  try {
    const response = await emailjs.send(SERVICE_ID, templateId, params, PUBLIC_KEY)
    return {
      success: true,
      reason: 'sent',
      queued: false,
      itemId,
      response,
    }
  } catch (error) {
    const errorMessage = error?.text || error?.message || 'Unknown error'
    console.error('[EmailJS] Send failed:', errorMessage, error)

    enqueue({
      itemId,
      templateId,
      params,
      meta,
      lastError: errorMessage,
    })

    return {
      success: false,
      reason: 'send_error',
      queued: true,
      itemId,
      error: errorMessage,
      message: 'Email could not be sent. Request saved locally and will be retried.',
    }
  }
}

// ─── Retry ──────────────────────────────────────────────────────────────────

async function retryQueue() {
  warnIfNotConfigured()

  if (!isConfigured()) {
    return { attempted: 0, sent: 0, failed: 0, skipped: 0, reason: 'not_configured' }
  }

  const queue = getQueue()
  const results = { attempted: 0, sent: 0, failed: 0, skipped: 0 }

  for (const item of queue) {
    if (!isTemplateConfigured(item.templateId)) {
      results.skipped++
      continue
    }

    results.attempted++

    try {
      await emailjs.send(SERVICE_ID, item.templateId, item.params, PUBLIC_KEY)
      removeFromQueue(item.itemId)
      results.sent++
    } catch (error) {
      const errorMessage = error?.text || error?.message || 'Unknown error'
      updateQueueItem(item.itemId, {
        attempts: (item.attempts || 0) + 1,
        lastAttemptAt: new Date().toISOString(),
        lastError: errorMessage,
      })
      results.failed++
    }
  }

  return results
}

// ─── Helpers to build the details_block for the universal template ─────────

function formatMoney(v) {
  if (v === null || v === undefined || v === '') return 'N/A'
  return `€${Number(v).toLocaleString('en-GB')}`
}

function formatYesNo(v) {
  if (v === true) return 'Yes'
  if (v === false) return 'No'
  return '—'
}

function formatDate(d) {
  if (!d) return 'Not yet scheduled'
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

function buildUniversityDetailsBlock(data) {
  const d = data.universityDetails
  return [
    `University:       ${d.universityName}`,
    `Study level:      ${d.studyLevel}`,
    `Course:           ${d.course}`,
    `Location:         ${d.location}`,
    `Duration:         ${d.duration}`,
    `Start date:       ${formatDate(d.startDate)}`,
  ].join('\n')
}

function buildINDDetailsBlock(data) {
  const d = data.indDetails
  return [
    `Offer of place:      ${formatYesNo(d.hasOfferOfPlace)}`,
    `Paid tuition:        ${formatYesNo(d.paidTuition)}`,
    `  Amount paid:       ${formatMoney(d.tuitionAmount)}`,
    `Paid block money:    ${formatYesNo(d.paidBlockMoney)}`,
    `  Amount paid:       ${formatMoney(d.blockMoneyAmount)}`,
    `IND scheduled:       ${formatYesNo(d.hasINDDate)}`,
    `  Scheduled date:    ${formatDate(d.indDate)}`,
  ].join('\n')
}

function buildEmbassyDetailsBlock(data) {
  const d = data.embassyDetails
  return [
    `Passport submission: ${formatYesNo(d.hasEmbassyDate)}`,
    `Appointment date:    ${formatDate(d.embassyDate)}`,
    `Location:            ${d.embassyLocation || 'N/A'}`,
  ].join('\n')
}

// ─── Common formatter ───────────────────────────────────────────────────────

function formatSubmittedAt(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    timeZone: 'Europe/Amsterdam',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Registration (uses dedicated template) ─────────────────────────────────

async function sendRegistrationRequest(data) {
  const params = {
    request_id: data.requestId,
    student_name: `${data.firstName} ${data.lastName}`,
    first_name: data.firstName,
    last_name: data.lastName,
    passport_number: data.passportNumber,
    passport_expiry: data.passportExpiry,
    date_of_birth: data.dateOfBirth,
    profile_image_url: data.profileImageUrl || 'Not provided',
    submitted_at: formatSubmittedAt(data.submittedAt),
    request_type: 'Registration Request',
  }
  return send(TEMPLATES.REGISTRATION, params, {
    itemId: `reg_${data.requestId}`,
    type: 'registration',
    requestId: data.requestId,
  })
}

// ─── Interview senders (all use the universal template) ────────────────────

async function sendUniversityInterviewRequest(data) {
  const params = {
    request_type: 'University Admission Interview',
    request_id: data.requestId,
    submitted_at: formatSubmittedAt(data.submittedAt),

    student_name: `${data.personalDetails.firstName} ${data.personalDetails.lastName}`,
    iso_code: data.isoCode,
    dob: data.personalDetails.dateOfBirth,
    passport_number: data.personalDetails.passportNumber,
    passport_expiry: data.personalDetails.passportExpiry,
    university: data.universityDetails.universityName,
    course: data.universityDetails.course,

    details_block: buildUniversityDetailsBlock(data),
    additional_info: data.universityDetails.additionalInfo || 'None',
  }
  return send(TEMPLATES.INTERVIEW, params, {
    itemId: `uni_${data.requestId}`,
    type: 'university',
    requestId: data.requestId,
  })
}

async function sendINDInterviewRequest(data) {
  const params = {
    request_type: 'IND Interview',
    request_id: data.requestId,
    submitted_at: formatSubmittedAt(data.submittedAt),

    student_name: `${data.personalDetails.firstName} ${data.personalDetails.lastName}`,
    iso_code: data.isoCode,
    dob: data.personalDetails.dateOfBirth,
    passport_number: data.personalDetails.passportNumber,
    passport_expiry: data.personalDetails.passportExpiry,
    university: data.personalDetails.university,
    course: data.personalDetails.course,

    details_block: buildINDDetailsBlock(data),
    additional_info: 'None',
  }
  return send(TEMPLATES.INTERVIEW, params, {
    itemId: `ind_${data.requestId}`,
    type: 'ind',
    requestId: data.requestId,
  })
}

async function sendEmbassyInterviewRequest(data) {
  const params = {
    request_type: 'Embassy Interview',
    request_id: data.requestId,
    submitted_at: formatSubmittedAt(data.submittedAt),

    student_name: `${data.personalDetails.firstName} ${data.personalDetails.lastName}`,
    iso_code: data.isoCode,
    dob: data.personalDetails.dateOfBirth,
    passport_number: data.personalDetails.passportNumber,
    passport_expiry: data.personalDetails.passportExpiry,
    university: data.personalDetails.university,
    course: data.personalDetails.course,

    details_block: buildEmbassyDetailsBlock(data),
    additional_info: data.embassyDetails.additionalInfo || 'None',
  }
  return send(TEMPLATES.INTERVIEW, params, {
    itemId: `emb_${data.requestId}`,
    type: 'embassy',
    requestId: data.requestId,
  })
}

// ─── Export ─────────────────────────────────────────────────────────────────

export const emailService = {
  isConfigured,
  isTemplateConfigured,
  getConfigStatus,

  sendRegistrationRequest,
  sendUniversityInterviewRequest,
  sendINDInterviewRequest,
  sendEmbassyInterviewRequest,

  getQueue,
  retryQueue,
  clearQueue,
  removeFromQueue,
}