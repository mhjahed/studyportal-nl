/**
 * Converts a File object to a base64 data URL.
 * Automatically compresses large images to stay under ~100KB.
 */

const MAX_WIDTH = 400
const MAX_HEIGHT = 400
const QUALITY = 0.85
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB uncompressed limit

export function validateImageFile(file) {
  if (!file) return { valid: false, error: 'No file selected.' }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please choose a JPEG, PNG, WebP, or GIF image.',
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Image is too large (max 5MB). Yours is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
    }
  }

  return { valid: true }
}

/**
 * Reads a file, compresses it, and returns a base64 data URL.
 */
export function fileToCompressedDataURL(file) {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      reject(new Error(validation.error))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Calculate new dimensions preserving aspect ratio
        let { width, height } = img
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        // Draw to canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        // Fill white background (in case of transparent PNG)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        // Export as JPEG at reduced quality
        const dataURL = canvas.toDataURL('image/jpeg', QUALITY)

        const sizeKB = Math.round((dataURL.length * 0.75) / 1024)
        resolve({ dataURL, sizeKB, width, height })
      }
      img.onerror = () => reject(new Error('Failed to load image.'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsDataURL(file)
  })
}

export function isDataURL(str) {
  return typeof str === 'string' && str.startsWith('data:image/')
}