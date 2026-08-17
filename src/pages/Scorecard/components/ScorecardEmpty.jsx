import React from 'react'
import { Link } from 'react-router-dom'
import './ScorecardEmpty.scss'

function ScorecardEmpty() {
  return (
    <div className="sce">
      <div className="sce__image">
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop&q=80"
          alt="Empty desk waiting for assessment"
        />
        <div className="sce__image-overlay" />
      </div>

      <div className="sce__content">
        <div className="sce__eyebrow">
          <span className="sce__eyebrow-dot" />
          No scorecards yet
        </div>
        <h2 className="sce__title">
          Detailed feedback<br />
          arrives <em>after your first interview.</em>
        </h2>
        <p className="sce__text">
          A scorecard is a comprehensive performance report — assessments across
          multiple criteria, individual feedback per criterion, recognised
          strengths, focus areas, and overall observations from the assessment
          panel.
        </p>

        <div className="sce__steps">
          <div className="sce__step">
            <div className="sce__step-num">01</div>
            <div>
              <div className="sce__step-title">Complete an interview</div>
              <div className="sce__step-desc">
                Book and attend a practice interview session.
              </div>
            </div>
          </div>
          <div className="sce__step">
            <div className="sce__step-num">02</div>
            <div>
              <div className="sce__step-title">Panel assessment</div>
              <div className="sce__step-desc">
                Our team reviews your performance across defined criteria.
              </div>
            </div>
          </div>
          <div className="sce__step">
            <div className="sce__step-num">03</div>
            <div>
              <div className="sce__step-title">Scorecard published</div>
              <div className="sce__step-desc">
                Detailed report with per-criterion feedback appears here.
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

export default ScorecardEmpty