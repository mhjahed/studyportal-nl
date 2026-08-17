import React from 'react'
import { Link } from 'react-router-dom'
import './SubmissionSuccess.scss'

const HERO_IMAGES = {
  university: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&h=500&fit=crop&q=80',
  ind: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&h=500&fit=crop&q=80',
  embassy: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1400&h=500&fit=crop&q=80',
}

function SubmissionSuccess({ result, onBookAnother }) {
  const heroImg = HERO_IMAGES[result.type] || HERO_IMAGES.university

  return (
    <div className="submission">
      {/* Hero */}
      <div className="submission__hero">
        <img src={heroImg} alt="" />
        <div className="submission__hero-overlay">
          <div className="submission__hero-inner">
            <div className="submission__hero-kicker">
              <span className="submission__hero-dot" />
              Request received
            </div>
            <h1 className="submission__hero-title">
              Thank you, {result.studentName.split(' ')[0]}.<br />
              <em>Your request is with our team.</em>
            </h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="submission__body">
        {/* Receipt */}
        <div className="submission-receipt">
          <div className="submission-receipt__perforation" />

          <div className="submission-receipt__header">
            <div>
              <div className="submission-receipt__label">Request reference</div>
              <div className="submission-receipt__id">{result.requestId}</div>
            </div>
            <div className="submission-receipt__stamp">
              <span>Pending</span>
              <strong>Review</strong>
            </div>
          </div>

          <div className="submission-receipt__grid">
            <div>
              <div className="submission-receipt__field-label">Interview type</div>
              <div className="submission-receipt__field-value">{result.typeLabel}</div>
            </div>
            <div>
              <div className="submission-receipt__field-label">Applicant</div>
              <div className="submission-receipt__field-value">{result.studentName}</div>
            </div>
            <div>
              <div className="submission-receipt__field-label">Submitted</div>
              <div className="submission-receipt__field-value">
                {new Date(result.submittedAt).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </div>
            </div>
            <div>
              <div className="submission-receipt__field-label">Response time</div>
              <div className="submission-receipt__field-value">1–3 business days</div>
            </div>
          </div>

          <div className="submission-receipt__note">
            Please retain this reference number. You will need it for any
            support enquiries relating to this request.
          </div>
        </div>

        {/* Next steps */}
        <div className="submission-next">
          <div className="submission-next__label">What happens next</div>
          <h2 className="submission-next__title">
            Your request will progress through three stages.
          </h2>

          <ol className="submission-next__list">
            <li>
              <div className="submission-next__num">01</div>
              <div>
                <div className="submission-next__step-title">Team review</div>
                <div className="submission-next__step-desc">
                  Our team reviews your request and matches you with an
                  appropriate interviewer.
                </div>
              </div>
            </li>
            <li>
              <div className="submission-next__num">02</div>
              <div>
                <div className="submission-next__step-title">Schedule confirmed</div>
                <div className="submission-next__step-desc">
                  You will receive a notification with your interview date,
                  time and Google Meet link.
                </div>
              </div>
            </li>
            <li>
              <div className="submission-next__num">03</div>
              <div>
                <div className="submission-next__step-title">Practice session</div>
                <div className="submission-next__step-desc">
                  Attend your interview. Afterwards, view your result and
                  detailed scorecard in the portal.
                </div>
              </div>
            </li>
          </ol>
        </div>

        {/* CTAs */}
        <div className="submission__actions">
          <Link to="/dashboard" className="btn-solid">
            <i className="bx bx-home-alt" />
            Back to dashboard
          </Link>
          <button type="button" onClick={onBookAnother} className="btn-ghost">
            Book another interview
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmissionSuccess