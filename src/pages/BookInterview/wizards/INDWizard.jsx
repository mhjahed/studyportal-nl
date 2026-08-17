import React, { useState, useCallback, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { dataService } from '../../../services/dataService'
import { emailService } from '../../../services/emailService'
import WizardShell from '../components/WizardShell'
import PersonalDetailsSection from '../sections/PersonalDetailsSection'
import INDDetailsSection from '../sections/INDDetailsSection'
import ReviewSection from '../sections/ReviewSection'
import UnsavedChangesGuard from '../../../components/UnsavedChangesGuard'

const STEPS = [
  { id: 1, label: 'Personal details' },
  { id: 2, label: 'IND details' },
  { id: 3, label: 'Review & submit' },
]

function INDWizard({ onBack, onSuccess }) {
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
  const [indData, setINDData] = useState({
    hasOfferOfPlace: null,
    paidTuition: null,
    tuitionAmount: '',
    paidBlockMoney: null,
    blockMoneyAmount: '',
    hasINDDate: null,
    indDate: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const isDirty =
  step > 1 ||
  indData.hasOfferOfPlace !== null ||
  indData.paidTuition !== null ||
  indData.paidBlockMoney !== null ||
  indData.hasINDDate !== null
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
      if (dataService.hasPendingRequest(currentUser.id, 'ind')) {
        setError('You already have a pending or approved IND Interview request.')
        setIsSubmitting(false)
        submittingRef.current = false
        return
      }

      const requestId = dataService.generateRequestId('ind')
      const submittedAt = new Date().toISOString()

      const requestData = {
        id: `req_${Date.now()}`,
        requestId,
        userId: currentUser.id,
        isoCode: currentUser.isoCode,
        type: 'ind',
        typeLabel: 'IND Interview',
        status: 'pending',
        personalDetails: personalData,
        indDetails: indData,
        submittedAt,
        updatedAt: submittedAt,
      }

    dataService.addInterviewRequest(requestData)

    const emailResult = await emailService.sendINDInterviewRequest(requestData)
    if (!emailResult.success && !emailResult.queued) {
      console.warn('Email delivery failed but request was saved:', emailResult)
    }

    onSuccess({
      requestId,
      type: 'ind',
      typeLabel: 'IND Interview',
      studentName: `${personalData.firstName} ${personalData.lastName}`,
      submittedAt,
    })
    } catch (err) {
      console.error('IND submission error:', err)
      setError('Something went wrong. Your request has been saved locally. Please try again.')
      setIsSubmitting(false)
      submittingRef.current = false
    }
  }

  const extraFields = [
    {
      key: 'hasOfferOfPlace',
      label: 'Has offer of place',
      format: 'yesno',
    },
    {
      key: 'paidTuition',
      label: 'Paid tuition fees',
      format: 'yesno',
    },
    {
      key: 'tuitionAmount',
      label: 'Tuition amount',
      hide: indData.paidTuition !== true,
      format: 'money',
    },
    {
      key: 'paidBlockMoney',
      label: 'Paid block money',
      format: 'yesno',
    },
    {
      key: 'blockMoneyAmount',
      label: 'Block money amount',
      hide: indData.paidBlockMoney !== true,
      format: 'money',
    },
    {
      key: 'hasINDDate',
      label: 'IND interview scheduled',
      format: 'yesno',
    },
    {
      key: 'indDate',
      label: 'IND interview date',
      hide: indData.hasINDDate !== true,
      format: 'date',
    },
  ]

  return (
    <WizardShell
      steps={STEPS}
      currentStep={step}
      eyebrow="Stage 2 · IND application"
      title="Book your IND interview"
      subtitle="We will help you prepare for your IND residence permit interview based on your current application status."
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
        <INDDetailsSection
          data={indData}
          onChange={setINDData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 3 && (
        <ReviewSection
          type="ind"
          typeLabel="IND Interview"
          personalData={personalData}
          personalExtraFields={[
            { key: 'university', label: 'University' },
            { key: 'course', label: 'Course' },
          ]}
          extraData={indData}
          extraLabel="IND details"
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

export default INDWizard