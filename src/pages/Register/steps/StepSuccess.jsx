import React from 'react'
import { Link } from 'react-router-dom'
import './Steps.scss'

function StepSuccess({ requestId, formData }) {
  return (
    <div className="success">
      {/* Editorial hero image */}
      <div className="success__hero">
        <img
          src="https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1400&h=600&fit=crop&q=80"
          alt="Amsterdam canal at sunset"
        />
        <div className="success__hero-overlay">
          <div className="success__hero-inner">
            <div className="reg__brand">
              <div className="reg__brand-flag">
                <span /><span /><span />
              </div>
              <div className="reg__brand-text">
                <div className="reg__brand-name">Bachelors Portal</div>
                <div className="reg__brand-sub">Netherlands</div>
              </div>
            </div>

            <div className="success__hero-kicker">
              <span className="reg__kicker-dot" />
              Registration received
            </div>

            <h1 className="success__hero-title">
              Thank you, {formData.firstName}.<br />
              <em>We have your request.</em>
            </h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="success__body">
        <div className="success__container">
          {/* Receipt card */}
          <div className="receipt">
            <div className="receipt__perforation" />

            <div className="receipt__header">
              <div>
                <div className="receipt__label">Request reference</div>
                <div className="receipt__id">{requestId}</div>
              </div>
              <div className="receipt__stamp">
                <span>Pending</span>
                <strong>Review</strong>
              </div>
            </div>

            <div className="receipt__grid">
              <div>
                <div className="receipt__field-label">Applicant</div>
                <div className="receipt__field-value">
                  {formData.firstName} {formData.lastName}
                </div>
              </div>
              <div>
                <div className="receipt__field-label">Submitted</div>
                <div className="receipt__field-value">
                  {new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="receipt__note">
              Please retain this reference number. You will need it for any support
              enquiries relating to your registration.
            </div>
          </div>

          {/* What happens next */}
          <div className="next">
            <div className="next__label">What happens next</div>
            <h2 className="next__title">Your application will progress through four stages.</h2>

            <ol className="next__list">
              <li>
                <div className="next__num">01</div>
                <div>
                  <div className="next__step-title">Application review</div>
                  <div className="next__step-desc">
                    Our team verifies your details against the information you provided.
                  </div>
                </div>
              </li>
              <li>
                <div className="next__num">02</div>
                <div>
                  <div className="next__step-title">Credentials issued</div>
                  <div className="next__step-desc">
                    Your username and password are prepared once your account is approved.
                  </div>
                </div>
              </li>
              <li>
                <div className="next__num">03</div>
                <div>
                  <div className="next__step-title">Portal access</div>
                  <div className="next__step-desc">
                    Sign in to view your dashboard, documents and interview options.
                  </div>
                </div>
              </li>
              <li>
                <div className="next__num">04</div>
                <div>
                  <div className="next__step-title">Interview booking</div>
                  <div className="next__step-desc">
                    Request university, IND or embassy interview assistance from within the portal.
                  </div>
                </div>
              </li>
            </ol>
          </div>

          {/* CTA */}
          <div className="success__cta">
            <div>
              <div className="success__cta-label">When ready</div>
              <div className="success__cta-title">Sign in with your credentials</div>
            </div>
            <Link to="/login" className="btn-solid">
              Go to sign in
              <i className="bx bx-right-arrow-alt" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepSuccess