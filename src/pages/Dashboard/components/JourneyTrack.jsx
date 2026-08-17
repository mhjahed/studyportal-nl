import React from 'react'
import './JourneyTrack.scss'

const STAGES = [
  { id: 'admission', label: 'University admission', icon: 'bx-book-open' },
  { id: 'university_interview', label: 'University interview', icon: 'bx-chat' },
  { id: 'ind', label: 'IND application', icon: 'bx-shield-quarter' },
  { id: 'embassy', label: 'Embassy interview', icon: 'bx-buildings' },
  { id: 'travel', label: 'Travel preparation', icon: 'bx-plane-take-off' },
]

function JourneyTrack({ currentStage }) {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage)

  return (
    <section className="journey">
      <div className="journey__head">
        <div className="journey__eyebrow">Your journey</div>
        <h2 className="journey__title">Preparation timeline</h2>
      </div>

      <div className="journey__track">
        {STAGES.map((stage, i) => {
          const isDone = i < currentIndex
          const isActive = i === currentIndex
          const isUpcoming = i > currentIndex

          return (
            <React.Fragment key={stage.id}>
              <div
                className={[
                  'journey-stage',
                  isDone && 'journey-stage--done',
                  isActive && 'journey-stage--active',
                  isUpcoming && 'journey-stage--upcoming',
                ].filter(Boolean).join(' ')}
              >
                <div className="journey-stage__marker">
                  {isDone ? (
                    <i className="bx bx-check" />
                  ) : (
                    <i className={`bx ${stage.icon}`} />
                  )}
                </div>
                <div className="journey-stage__num">
                  Stage {String(i + 1).padStart(2, '0')}
                </div>
                <div className="journey-stage__label">{stage.label}</div>
                {isActive && (
                  <div className="journey-stage__badge">Current</div>
                )}
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className={[
                    'journey-line',
                    isDone && 'journey-line--done',
                  ].filter(Boolean).join(' ')}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </section>
  )
}

export default JourneyTrack