import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import InterviewSelector from './components/InterviewSelector'
import UniversityWizard from './wizards/UniversityWizard'
import INDWizard from './wizards/INDWizard'
import EmbassyWizard from './wizards/EmbassyWizard'
import SubmissionSuccess from './components/SubmissionSuccess'
import './BookInterview.scss'

function BookInterview() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedType = searchParams.get('type') // university | ind | embassy | null
  const [submissionResult, setSubmissionResult] = useState(null)

  const handleSelect = (type) => {
    setSearchParams({ type })
    setSubmissionResult(null)
  }

  const handleBack = () => {
    setSearchParams({})
    setSubmissionResult(null)
  }

  const handleSuccess = (result) => {
    setSubmissionResult(result)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Success screen
  if (submissionResult) {
    return (
      <SubmissionSuccess
        result={submissionResult}
        onBookAnother={handleBack}
      />
    )
  }

  // Wizard screens
  if (selectedType === 'university') {
    return <UniversityWizard onBack={handleBack} onSuccess={handleSuccess} />
  }
  if (selectedType === 'ind') {
    return <INDWizard onBack={handleBack} onSuccess={handleSuccess} />
  }
  if (selectedType === 'embassy') {
    return <EmbassyWizard onBack={handleBack} onSuccess={handleSuccess} />
  }

  // Selection screen (default)
  return <InterviewSelector onSelect={handleSelect} />
}

export default BookInterview