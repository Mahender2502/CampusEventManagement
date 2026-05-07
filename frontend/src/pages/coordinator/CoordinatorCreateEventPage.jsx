import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createEvent } from '../../services/eventService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function CoordinatorCreateEventPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    club: user?.clubs?.[0] || '',
    capacity: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.clubs || user.clubs.length === 0) return
    setForm((p) => ({ ...p, club: user.clubs[0] }))
  }, [user?.clubs])

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const [datePart, timePart] = (form.date || '').split('T')
      const capacity = form.capacity === '' ? null : Number(form.capacity)
      await createEvent({
        title: form.title,
        description: form.description,
        date: datePart || form.date,
        time: timePart || '00:00',
        venue: form.venue,
        club: form.club,
        capacity,
      })
      navigate('/coordinator/events')
    } catch (err) {
      const msg = err.response?.data?.message
      const details = err.response?.data?.errors
      if (Array.isArray(details) && details.length > 0) {
        setError(`${msg || 'Validation failed'}: ${details.join(', ')}`)
      } else {
        setError(msg || 'Failed to create event')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900 dark:text-dark-text">Create event</div>
        <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">Publish a new event for your club</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={submit}>
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-dark-text">Event name</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              placeholder="Event name"
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-dark-text">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              placeholder="Describe the event"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-dark-text">Date</label>
            <input
              name="date"
              type="datetime-local"
              value={form.date}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-dark-text">Venue</label>
            <input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              placeholder="Venue"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-dark-text">Club</label>
            <input
              name="club"
              value={form.club}
              readOnly
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              placeholder="Assigned club"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-dark-text">Max participants</label>
            <input
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
              placeholder="150"
              min="1"
              required
            />
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
