/**
 * Normalises user-pasted image URLs into browser-loadable direct URLs.
 * Handles:
 *   - Google Drive share links → thumbnail URLs
 *   - Google Drive "open" links → thumbnail URLs
 *   - Dropbox share links → raw URLs
 *   - OneDrive share links (basic)
 *   - Direct image URLs → returned unchanged
 */

// Extract the file ID from any Google Drive URL variant
function extractGoogleDriveId(url) {
  // Format: /file/d/FILE_ID/...
  let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return match[1]

  // Format: ?id=FILE_ID
  match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (match) return match[1]

  // Format: /open?id=FILE_ID
  match = url.match(/\/open\?id=([a-zA-Z0-9_-]+)/)
  if (match) return match[1]

  // Format: /d/FILE_ID/
  match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return match[1]

  return null
}

/**
 * Converts a user-provided URL into a URL that can be used as <img src>.
 * Returns the original URL if no conversion is needed or possible.
 */
export function normaliseImageUrl(url) {
  if (!url || typeof url !== 'string') return url
  const trimmed = url.trim()
  if (!trimmed) return trimmed

// Google Drive
if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
  const fileId = extractGoogleDriveId(trimmed)
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w800`
  }
}
  // Dropbox — replace www.dropbox.com with dl.dropboxusercontent.com
  if (trimmed.includes('dropbox.com')) {
    return trimmed
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace('?dl=0', '')
      .replace('?dl=1', '')
  }

  // OneDrive — append &download=1
  if (trimmed.includes('1drv.ms') || trimmed.includes('onedrive.live.com')) {
    return trimmed.includes('?') ? `${trimmed}&download=1` : `${trimmed}?download=1`
  }

  // Otherwise assume it is already a direct image URL
  return trimmed
}

/**
 * Detect whether a URL looks like a share link that will need converting.
 * Used to show the user a helpful message.
 */
export function isShareLink(url) {
  if (!url) return false
  return (
    url.includes('drive.google.com') ||
    url.includes('docs.google.com') ||
    url.includes('dropbox.com') ||
    url.includes('1drv.ms') ||
    url.includes('onedrive.live.com')
  )
}