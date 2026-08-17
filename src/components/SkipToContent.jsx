import React from 'react'
import './SkipToContent.scss'

function SkipToContent() {
  const handleSkip = (e) => {
    e.preventDefault()
    const main = window.document.querySelector('main, [role="main"], .shell__content')
    if (main) {
      main.setAttribute('tabindex', '-1')
      main.focus()
      main.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <a href="#main-content" className="skip-to-content" onClick={handleSkip}>
      Skip to main content
    </a>
  )
}

export default SkipToContent