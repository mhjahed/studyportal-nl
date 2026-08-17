import React from 'react'
import './InterviewSelector.scss'

const INTERVIEW_TYPES = [
  {
    id: 'university',
    tag: 'Stage 1',
    title: 'University admission',
    subtitle: 'Interview assistance',
    description:
      'Prepare for your university admission interview. We help you refine your motivation, course knowledge and communication for the Dutch academic environment.',
    duration: '45 minutes',
    ideal: 'Before your first university interview',
    image:
      'https://www.thedailystar.net/sites/default/files/styles/big_1/public/news/images/public_university_admission_battle_02.jpg?h=741069c8',
    imageAlt: 'University lecture hall in the Netherlands',
    color: '#1a3a6b',
    accent: '#f3c896',
  },
  {
    id: 'ind',
    tag: 'Stage 2',
    title: 'IND application',
    subtitle: 'Interview assistance',
    description:
      'Preparation for the IND (Immigratie en Naturalisatiedienst) residence permit interview. We cover tuition, block money, health insurance and housing requirements.',
    duration: '30 minutes',
    ideal: 'After tuition and block money payment',
    image:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop&q=80',
    imageAlt: 'Official Dutch government building',
    color: '#0f2444',
    accent: '#e8820c',
  },
  {
    id: 'embassy',
    tag: 'Stage 3',
    title: 'Embassy interview',
    subtitle: 'MVV interview assistance',
    description:
      'Final preparation for your Dutch embassy interview for the MVV (Machtiging tot Voorlopig Verblijf). We cover documentation, questioning style and expectations.',
    duration: '20 minutes',
    ideal: 'Before your embassy visa appointment',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5Nfpytc9OXTFFfDMXoq7GfUP3-O_BbaiMagnmzX3XhExIEw-VUPmyIEZT&s=10',
    imageAlt: 'Passport and travel documents',
    color: '#1d7a47',
    accent: '#f3c896',
  },
]

function InterviewSelector({ onSelect }) {
  return (
    <div className="selector">
      {/* Header */}
      <div className="selector__header">
        <div className="selector__eyebrow">
          <span className="selector__eyebrow-dot" />
          Interview assistance
        </div>
        <h1 className="selector__title">
          Which interview assistance<br />
          are you <em>looking for?</em>
        </h1>
        <p className="selector__lede">
          Select the type of interview you would like to practice for. Each
          session is tailored to the specific stage of your Netherlands study
          journey.
        </p>
      </div>

      {/* Cards */}
      <div className="selector__grid">
        {INTERVIEW_TYPES.map((type, i) => (
          <article
            key={type.id}
            className="type-card"
            onClick={() => onSelect(type.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(type.id)
              }
            }}
          >
            {/* Image */}
            <div className="type-card__image">
              <img src={type.image} alt={type.imageAlt} />
              <div
                className="type-card__image-overlay"
                style={{
                  background: `linear-gradient(180deg, rgba(10,20,40,0.15) 0%, ${type.color} 100%)`,
                }}
              />
              <div className="type-card__tag">{type.tag}</div>
              <div className="type-card__num">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>

            {/* Body */}
            <div className="type-card__body">
              <div className="type-card__subtitle">{type.subtitle}</div>
              <h2 className="type-card__title">{type.title}</h2>
              <p className="type-card__desc">{type.description}</p>

              <div className="type-card__meta">
                <div className="type-card__meta-item">
                  <i className="bx bx-time-five" />
                  <div>
                    <span>Duration</span>
                    <strong>{type.duration}</strong>
                  </div>
                </div>
                <div className="type-card__meta-item">
                  <i className="bx bx-calendar-check" />
                  <div>
                    <span>Ideal timing</span>
                    <strong>{type.ideal}</strong>
                  </div>
                </div>
              </div>

              <div className="type-card__cta">
                <span>Choose this interview</span>
                <i className="bx bx-right-arrow-alt" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom note */}
      <div className="selector__note">
        <i className="bx bx-info-circle" />
        <div>
          <strong>Not sure which to choose?</strong>
          <p>
            Start with the interview that matches your current stage. If your
            university has already scheduled an interview, choose University
            Admission. If you have paid your tuition and are preparing for IND,
            choose IND. If your MVV appointment is confirmed, choose Embassy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default InterviewSelector