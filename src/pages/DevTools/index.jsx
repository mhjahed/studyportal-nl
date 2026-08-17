import React, { useState, useEffect } from 'react'
import DevToolsGate from './components/DevToolsGate'
import DevToolsShell from './components/DevToolsShell'
import './DevTools.scss'

const SESSION_KEY = 'bpn_devtools_unlocked'
const PASSPHRASE = import.meta.env.VITE_DEV_TOOLS_PASSPHRASE

function DevTools() {
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    // Check if unlocked in this session
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setUnlocked(true)
    }
  }, [])

  const handleUnlock = (attempt) => {
    if (attempt === PASSPHRASE) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setUnlocked(true)
      return true
    }
    return false
  }

  const handleLock = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
  }

  if (!PASSPHRASE) {
    return (
      <div className="dt-disabled">
        <div className="dt-disabled__panel">
          <i className="bx bx-error-circle" />
          <h1>Developer tools are disabled</h1>
          <p>
            Set <code>VITE_DEV_TOOLS_PASSPHRASE</code> in your <code>.env</code>{' '}
            file to enable this section.
          </p>
        </div>
      </div>
    )
  }

  if (!unlocked) {
    return <DevToolsGate onUnlock={handleUnlock} />
  }

  return <DevToolsShell onLock={handleLock} />
}

export default DevTools