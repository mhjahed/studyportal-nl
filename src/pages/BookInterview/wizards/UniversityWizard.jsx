import React, { useState, useCallback, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { dataService } from '../../../services/dataService'
import { emailService } from '../../../services/emailService'
import WizardShell from '../components/WizardShell'
import PersonalDetailsSection from '../sections/PersonalDetailsSection'
import UniversityDetailsSection from '../sections/UniversityDetailsSection'
import ReviewSection from '../sections/ReviewSection'
import UnsavedChangesGuard from '../../../components/UnsavedChangesGuard'

const STEPS = [
  { id: 1, label: 'Personal details' },
  { id: 2, label: 'University details' },
  { id: 3, label: 'Review & submit' },
]

function UniversityWizard({ onBack, onSuccess }) {
  const { currentUser } = useAuth()
  const [step, setStep] = useState(1)

  const [personalData, setPersonalData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    dateOfBirth: currentUser.dateOfBirth,
    passportNumber: currentUser.passportNumber,
    passportExpiry: currentUser.passportExpiry,
  })
  const [uniData, setUniData] = useState({
    universityName: currentUser.university || '',
    studyLevel: currentUser.studyLevel || 'Bachelor',
    course: currentUser.course || '',
    location: '',
    duration: '3 years',
    startDate: '',
    additionalInfo: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

    // Consider form "dirty" once user has advanced past personal details OR filled a university field
  const isDirty =
    step > 1 ||
    Boolean(uniData.location) ||
    Boolean(uniData.startDate) ||
    Boolean(uniData.additionalInfo)
    
  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, 3))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goBack = useCallback(() => {
    if (step === 1) {
      onBack()
    } else {
      setStep((s) => Math.max(s - 1, 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [step, onBack])

  const handleSubmit = async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    setIsSubmitting(true)
    setError('')

    try {
      if (dataService.hasPendingRequest(currentUser.id, 'university')) {
        setError(
          'You already have a pending or approved University Admission Interview request. Please wait for a response or contact support.'
        )
        setIsSubmitting(false)
        submittingRef.current = false
        return
      }

      const requestId = dataService.generateRequestId('university')
      const submittedAt = new Date().toISOString()

      const requestData = {
        id: `req_${Date.now()}`,
        requestId,
        userId: currentUser.id,
        isoCode: currentUser.isoCode,
        type: 'university',
        typeLabel: 'University Admission Interview',
        status: 'pending',
        personalDetails: personalData,
        universityDetails: uniData,
        submittedAt,
        updatedAt: submittedAt,
      }

    dataService.addInterviewRequest(requestData)

    const emailResult = await emailService.sendUniversityInterviewRequest(requestData)
    if (!emailResult.success && !emailResult.queued) {
      console.warn('Email delivery failed but request was saved:', emailResult)
    }

    onSuccess({
      requestId,
      type: 'university',
      typeLabel: 'University Admission Interview',
      studentName: `${personalData.firstName} ${personalData.lastName}`,
      submittedAt,
    })
    } catch (err) {
      console.error('University submission error:', err)
      setError('Something went wrong. Your request has been saved locally. Please try again.')
      setIsSubmitting(false)
      submittingRef.current = false
    }
  }

  return (
    <WizardShell
      steps={STEPS}
      currentStep={step}
      eyebrow="Stage 1 · University admission"
      title="Book your university interview"
      subtitle="Prepare for your admission interview with a personalised practice session. We will confirm the schedule after review."
      onBackToSelection={onBack}
    >
      {step === 1 && (
        <PersonalDetailsSection
          data={personalData}
          onChange={setPersonalData}
          onNext={goNext}
          onBack={goBack}
          fromUserProfile={true}
          backLabel="Back to selection"
        />
      )}

      {step === 2 && (
        <UniversityDetailsSection
          data={uniData}
          onChange={setUniData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 3 && (
        <ReviewSection
          type="university"
          typeLabel="University Admission Interview"
          personalData={personalData}
          extraData={uniData}
          extraLabel="University details"
          extraFields={[
            { key: 'universityName', label: 'University' },
            { key: 'studyLevel', label: 'Study level' },
            { key: 'course', label: 'Course' },
            { key: 'location', label: 'Location' },
            { key: 'duration', label: 'Course duration' },
            { key: 'startDate', label: 'Start date', format: 'date' },
            { key: 'additionalInfo', label: 'Additional information' },
          ]}
          onBack={goBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
      <UnsavedChangesGuard isDirty={isDirty && !isSubmitting} />
    </WizardShell>
  )
}

export default UniversityWizard