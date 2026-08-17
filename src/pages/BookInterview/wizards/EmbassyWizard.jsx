import React, { useState, useCallback, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { dataService } from '../../../services/dataService'
import { emailService } from '../../../services/emailService'
import WizardShell from '../components/WizardShell'
import PersonalDetailsSection from '../sections/PersonalDetailsSection'
import EmbassyDetailsSection from '../sections/EmbassyDetailsSection'
import ReviewSection from '../sections/ReviewSection'
import UnsavedChangesGuard from '../../../components/UnsavedChangesGuard'

const STEPS = [
  { id: 1, label: 'Personal details' },
  { id: 2, label: 'Embassy details' },
  { id: 3, label: 'Review & submit' },
]

function EmbassyWizard({ onBack, onSuccess }) {
  const { currentUser } = useAuth()
  const [step, setStep] = useState(1)
  
  const [personalData, setPersonalData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    dateOfBirth: currentUser.dateOfBirth,
    passportNumber: currentUser.passportNumber,
    passportExpiry: currentUser.passportExpiry,
    university: currentUser.university || '',
    course: currentUser.course || '',
  })
  const [embData, setEmbData] = useState({
    hasEmbassyDate: null,
    embassyDate: '',
    embassyLocation: '',
    additionalInfo: '',
    
  })
  
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const isDirty =
    step > 1 ||
    embData.hasEmbassyDate !== null ||
    Boolean(embData.additionalInfo)
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
      if (dataService.hasPendingRequest(currentUser.id, 'embassy')) {
        setError('You already have a pending or approved Embassy Interview request.')
        setIsSubmitting(false)
        submittingRef.current = false
        return
      }

      const requestId = dataService.generateRequestId('embassy')
      const submittedAt = new Date().toISOString()

      const requestData = {
        id: `req_${Date.now()}`,
        requestId,
        userId: currentUser.id,
        isoCode: currentUser.isoCode,
        type: 'embassy',
        typeLabel: 'Embassy Interview',
        status: 'pending',
        personalDetails: personalData,
        embassyDetails: embData,
        submittedAt,
        updatedAt: submittedAt,
      }

      dataService.addInterviewRequest(requestData)

      const emailResult = await emailService.sendEmbassyInterviewRequest(requestData)
      if (!emailResult.success && !emailResult.queued) {
        console.warn('Email delivery failed but request was saved:', emailResult)
      }

      onSuccess({
        requestId,
        type: 'embassy',
        typeLabel: 'Embassy Interview',
        studentName: `${personalData.firstName} ${personalData.lastName}`,
        submittedAt,
      })
    } catch (err) {
      console.error('Embassy submission error:', err)
      setError('Something went wrong. Your request has been saved locally. Please try again.')
      setIsSubmitting(false)
      submittingRef.current = false
    }
  }

  const extraFields = [
    {
      key: 'hasEmbassyDate',
      label: 'Passport submission scheduled',
      format: 'yesno',
    },
    {
      key: 'embassyDate',
      label: 'Embassy submission date',
      hide: embData.hasEmbassyDate !== true,
      format: 'date',
    },
    {
      key: 'embassyLocation',
      label: 'Embassy / consulate location',
      hide: embData.hasEmbassyDate !== true,
    },
    {
      key: 'additionalInfo',
      label: 'Additional information',
    },
  ]

  return (
    <WizardShell
      steps={STEPS}
      currentStep={step}
      eyebrow="Stage 3 · Embassy interview"
      title="Book your embassy interview"
      subtitle="Final preparation for your Dutch embassy interview and MVV submission. Provide your appointment details if scheduled."
      onBackToSelection={onBack}
    >
      {step === 1 && (
        <PersonalDetailsSection
          data={personalData}
          onChange={setPersonalData}
          onNext={goNext}
          onBack={goBack}
          fromUserProfile={true}
          showAcademic={true}
          backLabel="Back to selection"
        />
      )}

      {step === 2 && (
        <EmbassyDetailsSection
          data={embData}
          onChange={setEmbData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 3 && (
        <ReviewSection
          type="embassy"
          typeLabel="Embassy Interview"
          personalData={personalData}
          personalExtraFields={[
            { key: 'university', label: 'University' },
            { key: 'course', label: 'Course' },
          ]}
          extraData={embData}
          extraLabel="Embassy details"
          extraFields={extraFields}
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

export default EmbassyWizard