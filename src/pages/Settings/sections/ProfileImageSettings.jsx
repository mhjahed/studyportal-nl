import React, { useState, useRef } from 'react'
import SettingsSection from '../components/SettingsSection'
import { fileToCompressedDataURL } from '../../../utils/imageUpload'

function ProfileImageSettings({ currentImage, userName, onUpdate }) {
  const fileInputRef = useRef(null)
  const [pendingImage, setPendingImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [imageSize, setImageSize] = useState(null)

  const handleFilePick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const result = await fileToCompressedDataURL(file)
      setPendingImage(result.dataURL)
      setImageSize({ kb: result.sizeKB, w: result.width, h: result.height })
    } catch (err) {
      setError(err.message)
      setPendingImage('')
      setImageSize(null)
    } finally {
      setUploading(false)
    }

    e.target.value = ''
  }

  const handleSave = () => {
    if (!pendingImage) return
    onUpdate(pendingImage)
    setPendingImage('')
    setImageSize(null)
  }

  const handleCancel = () => {
    setPendingImage('')
    setImageSize(null)
    setError('')
  }

  return (
    <SettingsSection
      eyebrow="Section 03"
      title="Profile image"
      description="Update the photograph shown in your portal, on the sidebar, and on interview scorecards."
    >
      {/* Current image */}
      <div className="pi-current">
        <div className="pi-current__label">Current image</div>
        <div className="pi-current__row">
          <img
            src={currentImage}
            alt={userName}
            className="pi-current__image"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}&background=1a3a6b&color=fff&size=100`
            }}
          />
          <div className="pi-current__info">
            <div className="pi-current__name">{userName}</div>
            <div className="pi-current__caption">
              This image appears wherever your profile is shown.
            </div>
          </div>
        </div>
      </div>

      {/* Upload section */}
      <div className="pi-instructions">
        <div className="pi-instructions__label">How to change your image</div>
        <ol className="pi-instructions__list">
          <li>
            <span>1</span>
            <div>Click <strong>Choose image file</strong> below.</div>
          </li>
          <li>
            <span>2</span>
            <div>Select a clear, front-facing photograph (max 5 MB).</div>
          </li>
          <li>
            <span>3</span>
            <div>Preview it, then click <strong>Save new image</strong>.</div>
          </li>
        </ol>
      </div>

      <div className="pi-form">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {!pendingImage && !uploading && (
          <button
            type="button"
            className="btn-solid"
            onClick={handleFilePick}
          >
            <i className="bx bx-upload" />
            Choose image file
          </button>
        )}

        {uploading && (
          <div className="pi-preview">
            <div className="pi-preview__label">Processing…</div>
            <div className="pi-preview__frame">
              <div className="pi-preview__loader">
                <div className="bpn-spinner" />
                <span>Compressing image…</span>
              </div>
            </div>
          </div>
        )}

        {pendingImage && !uploading && (
          <>
            <div className="pi-preview">
              <div className="pi-preview__label">New image preview</div>
              <div className="pi-preview__frame">
                <img src={pendingImage} alt="New profile preview" />
              </div>
            </div>

            {imageSize && (
              <div style={{
                padding: '8px 12px',
                background: '#faf8f3',
                borderLeft: '3px solid #1d7a47',
                fontSize: '0.75rem',
                color: '#4a4a4a',
              }}>
                <strong style={{ color: '#1d7a47' }}>
                  <i className="bx bx-check-circle" /> Ready to save:
                </strong>{' '}
                {imageSize.w} × {imageSize.h} px · {imageSize.kb} KB
              </div>
            )}
          </>
        )}

        {error && (
          <div className="s-field__error" style={{ marginTop: 6 }}>
            {error}
          </div>
        )}

        <div className="pi-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={handleCancel}
            disabled={!pendingImage || uploading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-solid"
            onClick={handleSave}
            disabled={!pendingImage || uploading}
          >
            <i className="bx bx-check" />
            Save new image
          </button>
        </div>
      </div>
    </SettingsSection>
  )
}

export default ProfileImageSettings