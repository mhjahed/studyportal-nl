import React, { useState, useMemo, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { dataService } from '../../services/dataService'
import DocumentsHero from './components/DocumentsHero'
import CategoryTabs from './components/CategoryTabs'
import DocumentItem from './components/DocumentItem'
import DocumentsToolbar from './components/DocumentsToolbar'
import DocumentsEmpty from './components/DocumentsEmpty'
import './Documents.scss'

const STATUS_ORDER = ['not_started', 'preparing', 'ready', 'not_applicable']

function Documents() {
  const { currentUser } = useAuth()
  const [activeCategoryId, setActiveCategoryId] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tick, setTick] = useState(0) // for forcing re-read after updates

  const definitions = useMemo(
    () => dataService.getDocumentDefinitions(),
    []
  )
  const { categories, documents } = definitions

  const userStatuses = useMemo(
    () => dataService.getUserDocumentStatus(currentUser.id),
    [currentUser.id, tick]
  )

  // Build a map: documentId -> status object
  const statusMap = useMemo(() => {
    const m = {}
    userStatuses.forEach((s) => { m[s.documentId] = s })
    return m
  }, [userStatuses])

  // Get status for a document (default = not_started)
  const getStatus = useCallback(
    (docId) => statusMap[docId]?.status || 'not_started',
    [statusMap]
  )
  const getNotes = useCallback(
    (docId) => statusMap[docId]?.notes || '',
    [statusMap]
  )

  // Compute per-category progress
  const categoryProgress = useMemo(() => {
    const map = {}
    categories.forEach((cat) => {
      const catDocs = documents.filter((d) => d.categoryId === cat.id)
      const ready = catDocs.filter((d) => getStatus(d.id) === 'ready').length
      const preparing = catDocs.filter((d) => getStatus(d.id) === 'preparing').length
      const notApplicable = catDocs.filter((d) => getStatus(d.id) === 'not_applicable').length
      const notStarted = catDocs.filter((d) => getStatus(d.id) === 'not_started').length
      const effectiveTotal = catDocs.length - notApplicable // exclude N/A from progress
      const pct = effectiveTotal > 0 ? Math.round((ready / effectiveTotal) * 100) : 100
      map[cat.id] = {
        total: catDocs.length,
        ready,
        preparing,
        notStarted,
        notApplicable,
        effectiveTotal,
        pct,
      }
    })
    return map
  }, [categories, documents, getStatus])

  // Overall progress across all categories
  const overallProgress = useMemo(() => {
    const total = documents.length
    const notApplicable = documents.filter((d) => getStatus(d.id) === 'not_applicable').length
    const ready = documents.filter((d) => getStatus(d.id) === 'ready').length
    const preparing = documents.filter((d) => getStatus(d.id) === 'preparing').length
    const notStarted = documents.filter((d) => getStatus(d.id) === 'not_started').length
    const effective = total - notApplicable
    const pct = effective > 0 ? Math.round((ready / effective) * 100) : 100
    return { total, ready, preparing, notStarted, notApplicable, effective, pct }
  }, [documents, getStatus])

  // Filter documents by active category + status filter
  const visibleDocuments = useMemo(() => {
    let list = documents
    if (activeCategoryId !== 'all') {
      list = list.filter((d) => d.categoryId === activeCategoryId)
    }
    if (statusFilter !== 'all') {
      list = list.filter((d) => getStatus(d.id) === statusFilter)
    }
    // Sort: required first, then by status priority, then by name
    return list.sort((a, b) => {
      if (a.required !== b.required) return b.required - a.required
      const sa = STATUS_ORDER.indexOf(getStatus(a.id))
      const sb = STATUS_ORDER.indexOf(getStatus(b.id))
      if (sa !== sb) return sa - sb
      return a.name.localeCompare(b.name)
    })
  }, [documents, activeCategoryId, statusFilter, getStatus])

  const handleStatusChange = useCallback(
    (docId, newStatus) => {
      const existingNotes = getNotes(docId)
      dataService.updateDocumentStatus(currentUser.id, docId, newStatus, existingNotes)
      setTick((t) => t + 1)
    },
    [currentUser.id, getNotes]
  )

  const handleNotesChange = useCallback(
    (docId, notes) => {
      const currentStatus = getStatus(docId)
      dataService.updateDocumentStatus(currentUser.id, docId, currentStatus, notes)
      setTick((t) => t + 1)
    },
    [currentUser.id, getStatus]
  )

  return (
    <div className="docs-page">
      <DocumentsHero
        overallProgress={overallProgress}
        currentUser={currentUser}
      />

      {/* Category tabs */}
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
        categoryProgress={categoryProgress}
        overallProgress={overallProgress}
      />

      {/* Status filter toolbar */}
      <DocumentsToolbar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        visibleCount={visibleDocuments.length}
        activeCategoryLabel={
          activeCategoryId === 'all'
            ? 'All categories'
            : categories.find((c) => c.id === activeCategoryId)?.label
        }
      />

      {/* Documents list */}
      {visibleDocuments.length === 0 ? (
        <DocumentsEmpty statusFilter={statusFilter} />
      ) : (
        <div className="docs-list">
          {visibleDocuments.map((doc) => (
            <DocumentItem
              key={doc.id}
              document={doc}
              status={getStatus(doc.id)}
              notes={getNotes(doc.id)}
              category={categories.find((c) => c.id === doc.categoryId)}
              onStatusChange={(status) => handleStatusChange(doc.id, status)}
              onNotesChange={(notes) => handleNotesChange(doc.id, notes)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Documents