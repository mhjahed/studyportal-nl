import React from 'react'
import './DocumentsEmpty.scss'

const EMPTY_MESSAGES = {
  all: {
    icon: 'bx-file',
    title: 'No documents in this category',
    text: 'There are no documents to show. Try selecting a different category.',
  },
  ready: {
    icon: 'bx-check-circle',
    title: 'No documents marked as ready',
    text: 'You have not marked any documents as ready in this view yet.',
  },
  preparing: {
    icon: 'bx-loader-circle',
    title: 'No documents in preparation',
    text: 'You have no documents currently in preparation.',
  },
  not_started: {
    icon: 'bx-circle',
    title: 'Everything has been started',
    text: 'You have made a start on every document in this view.',
  },
  not_applicable: {
    icon: 'bx-minus-circle',
    title: 'No documents marked N/A',
    text: 'No documents in this view are marked as not applicable.',
  },
}

function DocumentsEmpty({ statusFilter }) {
  const msg = EMPTY_MESSAGES[statusFilter] || EMPTY_MESSAGES.all

  return (
    <div className="docs-empty">
      <div className="docs-empty__icon">
        <i className={`bx ${msg.icon}`} />
      </div>
      <h3 className="docs-empty__title">{msg.title}</h3>
      <p className="docs-empty__text">{msg.text}</p>
    </div>
  )
}

export default DocumentsEmpty