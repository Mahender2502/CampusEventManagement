import Table from '../../components/Table.jsx'
import { useEffect, useMemo, useState } from 'react'

import { getCoordinatorEvents, getCoordinatorEventRegistrations, updateCoordinatorRegistrationStatus } from '../../services/eventService.js'

export default function CoordinatorRegistrationsPage() {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await getCoordinatorEvents()
        const items = res.data?.data || []
        setEvents(items)
        if (items.length > 0) setSelectedEventId(items[0]._id)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load coordinator events')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!selectedEventId) {
      setRegistrations([])
      return
    }

    const fetch = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await getCoordinatorEventRegistrations(selectedEventId)
        setRegistrations(res.data?.data?.registrations || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load registrations')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [selectedEventId])

  const refreshRegistrations = async (eventId) => {
    if (!eventId) return
    const res = await getCoordinatorEventRegistrations(eventId)
    setRegistrations(res.data?.data?.registrations || [])
  }

  const updateStatus = async (registrationId, status) => {
    if (!registrationId || !selectedEventId) return
    setUpdatingId(registrationId)
    setError('')
    try {
      await updateCoordinatorRegistrationStatus(registrationId, { status })
      await refreshRegistrations(selectedEventId)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const rows = useMemo(() => {
    return (registrations || []).map((r) => ({
      ...r,
      studentName: r.student?.name || '—',
      studentEmail: r.student?.email || '—',
    }))
  }, [registrations])

  const columns = [
    { key: 'studentName', header: 'Student' },
    { key: 'studentEmail', header: 'Email' },
    { key: 'rollNo', header: 'Roll No' },
    { key: 'department', header: 'Department' },
    { key: 'year', header: 'Year' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {(r.status || 'pending').slice(0, 1).toUpperCase() + (r.status || 'pending').slice(1)}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => updateStatus(r._id, 'approved')}
            disabled={r.status === 'approved' || updatingId === r._id}
          >
            {updatingId === r._id ? 'Updating...' : 'Approve'}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            onClick={() => updateStatus(r._id, 'rejected')}
            disabled={r.status === 'rejected' || updatingId === r._id}
          >
            Reject
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900">Event registrations</div>
        <div className="mt-1 text-sm text-slate-600">Approve or reject student registrations</div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="text-sm font-medium text-slate-700">Event</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
        >
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-6 text-center text-sm text-slate-600">Loading registrations...</div>
      ) : (
        <Table columns={columns} rows={rows} keyField="_id" />
      )}
    </div>
  )
}
