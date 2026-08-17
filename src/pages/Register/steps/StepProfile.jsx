import React, { useState, useRef } from 'react'
import { fileToCompressedDataURL, isDataURL } from '../../../utils/imageUpload'
import './Steps.scss'

function StepProfile({ formData, updateForm, onNext, onBack }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [imageSize, setImageSize] = useState(null)

  const hasImage = Boolean(formData.profileImageUrl)

  const handleFilePick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const result = await fileToCompressedDataURL(file)
      updateForm({ profileImageUrl: result.dataURL })
      setImageSize({ kb: result.sizeKB, w: result.width, h: result.height })
    } catch (err) {
      setError(err.message)
      updateForm({ profileImageUrl: '' })
      setImageSize(null)
    } finally {
      setUploading(false)
    }

    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleRemove = () => {
    updateForm({ profileImageUrl: '' })
    setImageSize(null)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!hasImage) {
      setError('Please upload a profile photograph.')
      return
    }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Instructions */}
      <div className="instructions">
        <div className="instructions__label">Instructions</div>
        <h3 className="instructions__title">Upload your photograph</h3>

        <ol className="instructions__steps">
          <li>
            <span className="instructions__num">1</span>
            <div>
              <strong>Choose a clear, front-facing photograph.</strong>
              <p>Plain background, good lighting, face clearly visible.</p>
            </div>
          </li>
          <li>
            <span className="instructions__num">2</span>
            <div>
              <strong>Click the upload button below.</strong>
              <p>Select any JPEG, PNG, WebP, or GIF from your device (max 5 MB).</p>
            </div>
          </li>
          <li>
            <span className="instructions__num">3</span>
            <div>
              <strong>Preview and continue.</strong>
              <p>The image is automatically resized and optimised.</p>
            </div>
          </li>
        </ol>
      </div>

      {/* Preview + upload */}
      <div className="profile-grid">
        <div className="profile-grid__preview">
          {!hasImage && !uploading && (
            <div className="preview-frame preview-frame--idle">
              <i className="bx bx-image-add" />
              <span>Photograph preview</span>
            </div>
          )}

          {uploading && (
            <div className="preview-frame preview-frame--loading">
              <div className="bpn-spinner" />
              <span>Processing…</span>
            </div>
          )}

          {hasImage && !uploading && (
            <div className="preview-frame preview-frame--loaded">
              <img src={formData.profileImageUrl} alt="Profile preview" />
              <div className="preview-frame__badge">
                <i className="bx bx-check" />
                Ready
              </div>
            </div>
          )}
        </div>

        <div className="profile-grid__input">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {!hasImage ? (
            <>
              <button
                type="button"
                className="btn-solid"
                onClick={handleFilePick}
                disabled={uploading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <i className="bx bx-upload" />
                {uploading ? 'Processing…' : 'Choose photograph'}
              </button>
              <div className="field__hint" style={{ marginTop: 12 }}>
                Accepted formats: JPEG, PNG, WebP, GIF · maximum 5 MB
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handleFilePick}
                  disabled={uploading}
                >
                  <i className="bx bx-refresh" />
                  Change photograph
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handleRemove}
                  disabled={uploading}
                  style={{ color: '#ae1c28' }}
                >
                  <i className="bx bx-trash" />
                  Remove
                </button>
              </div>

              {imageSize && (
                <div style={{
                  marginTop: 12,
                  padding: '8px 12px',
                  background: '#faf8f3',
                  borderLeft: '3px solid #1d7a47',
                  fontSize: '0.75rem',
                  color: '#4a4a4a',
                }}>
                  <strong style={{ color: '#1d7a47' }}>
                    <i className="bx bx-check-circle" /> Image ready:
                  </strong>{' '}
                  {imageSize.w} × {imageSize.h} px · {imageSize.kb} KB
                </div>
              )}
            </>
          )}

          {error && (
            <div className="field__error" role="alert" style={{ marginTop: 12 }}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onBack}>
          <i className="bx bx-left-arrow-alt" />
          Back
        </button>
        <button
          type="submit"
          className="btn-solid"
          disabled={uploading || !hasImage}
        >
          Continue to review
          <i className="bx bx-right-arrow-alt" />
        </button>
      </div>
    </form>
  )
}

export default StepProfile