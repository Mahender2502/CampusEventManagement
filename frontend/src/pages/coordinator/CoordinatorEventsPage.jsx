import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Table from '../../components/Table.jsx'
import { getEvents, deleteEvent } from '../../services/eventService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function CoordinatorEventsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getEvents()
        const items = res.data?.data?.items || []
        setEvents(items.filter((e) => e.createdBy?._id === user?._id))
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [user])

  const handleDelete = async (eventId) => {
    if (!confirm('Delete this event?')) return
    try {
      await deleteEvent(eventId)
      setEvents(events.filter(e => e._id !== eventId))
    } catch {
    }
  }

  const columns = [
    { key: 'title', header: 'Event' },
    { key: 'venue', header: 'Venue' },
    { key: 'date', header: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/coordinator/create-event?edit=${row.id}`)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const rows = events.map(e => ({
    id: e._id,
    title: e.title,
    venue: e.venue,
    date: e.date,
  }))

  if (loading) return <div className="p-6 text-center">Loading events...</div>

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900 dark:text-dark-text">Manage events</div>
        <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">Edit or delete events created by your club</div>
      </div>

      <Table columns={columns} rows={rows} />
    </div>
  )
}
