import { useState, useEffect } from 'react'

import Table from '../../components/Table.jsx'
import { getMyRegistrations } from '../../services/eventService.js'

export default function StudentRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyRegistrations()
        setRegistrations(res.data?.data || [])
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const rows = registrations.map((r) => ({
    id: r._id,
    event: r.event?.title,
    club: r.event?.club,
    date: r.event?.date ? new Date(r.event.date).toLocaleDateString() : '',
    venue: r.event?.venue,
    status: r.status,
  }))

  const columns = [
    { key: 'event', header: 'Event' },
    { key: 'club', header: 'Club' },
    { key: 'date', header: 'Date' },
    { key: 'venue', header: 'Venue' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        const status = r.status || 'pending'
        const styles =
          status === 'approved'
            ? 'bg-emerald-50 text-emerald-700'
            : status === 'rejected'
              ? 'bg-rose-50 text-rose-700'
              : 'bg-amber-50 text-amber-700'

        return (
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>
            {status}
          </span>
        )
      },
    },
    {
      key: 'action',
      header: 'Action',
      render: () => (
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:hover:bg-slate-800"
        >
          Cancel
        </button>
      ),
    },
  ]

  if (loading) return <div className="p-6 text-center">Loading registrations...</div>

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900 dark:text-dark-text">My registrations</div>
        <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">Track approvals and cancel pending registrations</div>
      </div>

      <Table columns={columns} rows={rows} />
    </div>
  )
}
