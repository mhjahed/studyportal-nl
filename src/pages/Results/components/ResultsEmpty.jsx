import React from 'react'
import { Link } from 'react-router-dom'
import './ResultsEmpty.scss'

function ResultsEmpty() {
  return (
    <div className="rem">
      <div className="rem__image">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop&q=80"
          alt="Empty notebook waiting for the first entry"
        />
        <div className="rem__image-overlay" />
      </div>

      <div className="rem__content">
        <div className="rem__eyebrow">
          <span className="rem__eyebrow-dot" />
          No results yet
        </div>
        <h2 className="rem__title">
          Your first result<br />
          is <em>on its way.</em>
        </h2>
        <p className="rem__text">
          Once you complete a practice interview and our team publishes the
          result, your feedback and score will appear here.
        </p>

        <div className="rem__steps">
          <div className="rem__step">
            <div className="rem__step-num">01</div>
            <div>
              <div className="rem__step-title">Book an interview</div>
              <div className="rem__step-desc">
                Choose university, IND or embassy assistance.
              </div>
            </div>
          </div>
          <div className="rem__step">
            <div className="rem__step-num">02</div>
            <div>
              <div className="rem__step-title">Attend the session</div>
              <div className="rem__step-desc">
                Join via Google Meet at your scheduled time.
              </div>
            </div>
          </div>
          <div className="rem__step">
            <div className="rem__step-num">03</div>
            <div>
              <div className="rem__step-title">Review your result</div>
              <div className="rem__step-desc">
                Score, feedback and recommendations appear here.
              </div>
            </div>
          </div>
        </div>

        <Link to="/register-interview" className="btn-solid">
          <i className="bx bx-calendar-plus" />
          Book your first interview
        </Link>
      </div>
    </div>
  )
}

export default ResultsEmpty