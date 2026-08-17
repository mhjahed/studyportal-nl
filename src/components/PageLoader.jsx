import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './PageLoader.scss'

function PageLoader() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [location.pathname])

  if (!loading) return null

  return (
    <div className="page-loader" aria-hidden="true">
      <div className="page-loader__bar" />
    </div>
  )
}

export default PageLoader