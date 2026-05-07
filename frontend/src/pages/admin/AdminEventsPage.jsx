import { useEffect, useState } from 'react'
import { Loader2, Calendar, Search, Trash2 } from 'lucide-react'

import Table from '../../components/Table.jsx'
import { getEvents, deleteEvent } from '../../services/eventService.js'

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await getEvents()
      setEvents(res.data?.data?.items || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event')
    }
  }

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    { key: 'title', header: 'Event' },
    { key: 'club', header: 'Club' },
    { key: 'venue', header: 'Venue' },
    {
      key: 'date',
      header: 'Date',
      render: (row) => (
        <span className="text-sm text-slate-600">
          {row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDelete(row._id)}
            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Event"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">All Events</h1>
          <p className="mt-1 text-sm text-slate-600">View and manage all club events</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, clubs or venue..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-indigo-200 focus:ring-4"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-300" />
          <div className="mt-4 text-sm text-slate-600">
            {searchQuery ? 'No events match your search' : 'No events found'}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <Table columns={columns} rows={filteredEvents} />
        </div>
      )}
    </div>
  )
}

