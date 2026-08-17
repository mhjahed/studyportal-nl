import React from 'react'
import { useNetworkStatus } from '../hooks/useNetworkStatus'
import './NetworkBanner.scss'

function NetworkBanner() {
  const isOnline = useNetworkStatus()

  if (isOnline) return null

  return (
    <div className="network-banner" role="alert">
      <div className="network-banner__inner">
        <div className="network-banner__icon">
          <i className="bx bx-wifi-off" />
        </div>
        <div className="network-banner__body">
          <strong>You are offline.</strong>
          <span>
            Changes are being saved locally and will sync when your connection returns.
          </span>
        </div>
      </div>
    </div>
  )
}

export default NetworkBanner