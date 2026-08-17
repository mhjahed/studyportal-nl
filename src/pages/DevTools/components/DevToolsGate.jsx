import React, { useState, useRef, useEffect } from 'react'

function DevToolsGate({ onUnlock }) {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(false)
    const success = onUnlock(passphrase)
    if (!success) {
      setError(true)
      setPassphrase('')
      if (inputRef.current) inputRef.current.focus()
    }
  }

  return (
    <div className="dt-gate">
      <div className="dt-gate__panel">
        <div className="dt-gate__logo">
          <div className="dt-gate__logo-icon">
            <i className="bx bx-lock-alt" />
          </div>
          <div className="dt-gate__logo-text">
            <div className="dt-gate__logo-name">Developer Tools</div>
            <div className="dt-gate__logo-sub">Bachelors Portal</div>
          </div>
        </div>

        <div className="dt-gate__eyebrow">Restricted access</div>
        <h1 className="dt-gate__title">Administrator access required</h1>
        <p className="dt-gate__message">
          This area allows management of users, interviews, results, and portal
          data. Enter the passphrase to continue.
        </p>

        <form onSubmit={handleSubmit} className="dt-gate__form">
          <div className="dt-field">
            <label htmlFor="dt-passphrase">Passphrase</label>
            <input
              ref={inputRef}
              id="dt-passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter passphrase"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="dt-btn dt-btn--primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '12px' }}
            disabled={!passphrase}
          >
            <i className="bx bx-check-shield" />
            Unlock developer tools
          </button>
        </form>

        {error && (
          <div className="dt-gate__error">
            Incorrect passphrase. Please try again.
          </div>
        )}

        <div className="dt-gate__hint">
          Session unlocks for this browser tab only.
        </div>
      </div>
    </div>
  )
}

export default DevToolsGate