import { useMemo, useState, useEffect } from 'react'

import EventCard from '../../components/EventCard.jsx'
import Modal from '../../components/Modal.jsx'
import { getEventsForClubs, registerForEvent } from '../../services/eventService.js'
import { getClubs } from '../../services/clubService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function StudentEventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [registerModal, setRegisterModal] = useState(null)
  const [registrationForm, setRegistrationForm] = useState({ phone: '', department: '', year: 1, rollNo: '', notes: '' })
  const [registering, setRegistering] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const clubsRes = await getClubs()
        const clubs = clubsRes.data?.data || []
        const joinedClubNames = clubs.filter((c) => c.isMember).map((c) => c.name)

        if (joinedClubNames.length === 0) {
          setEvents([])
          return
        }

        const res = await getEventsForClubs(joinedClubNames)
        setEvents(res.data?.data?.items || [])
      } catch {
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return events
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.club.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.createdBy?.name.toLowerCase().includes(q),
    )
  }, [events, query])

  const openRegister = (eventObj) => {
    setError('')
    setRegisterModal(eventObj)
    setRegistrationForm({ phone: '', department: '', year: 1, rollNo: '', notes: '' })
  }

  const submitRegistration = async () => {
    if (!registerModal?._id) return
    const eventId = registerModal._id

    setRegistering(eventId)
    setError('')
    try {
      await registerForEvent(eventId, {
        phone: registrationForm.phone,
        department: registrationForm.department,
        year: Number(registrationForm.year),
        rollNo: registrationForm.rollNo,
        notes: registrationForm.notes,
      })
      setRegisterModal(null)
      const clubsRes = await getClubs()
      const clubs = clubsRes.data?.data || []
      const joinedClubNames = clubs.filter((c) => c.isMember).map((c) => c.name)

      if (joinedClubNames.length === 0) {
        setEvents([])
        return
      }

      const res = await getEventsForClubs(joinedClubNames)
      setEvents(res.data?.data?.items || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(null)
    }
  }

  if (loading) return <div className="p-6 text-center">Loading events...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xl font-semibold text-slate-900 dark:text-dark-text">Browse events</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">Search and register for upcoming events</div>
        </div>
        <div className="w-full sm:w-80">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, clubs, categories..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
          />
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => (
          <EventCard
            key={e._id}
            event={{
              id: e._id,
              title: e.title,
              club: e.club,
              date: e.date,
              venue: e.venue,
              category: e.club,
              seatsTaken: e.registeredUsers?.length || 0,
              seatsTotal: e.capacity,
              description: e.description,
              createdBy: e.createdBy?.name,
            }}
            action={{
              onView: () => setSelected(e),
              onPrimary: () => openRegister(e),
              primaryLabel: e.registeredUsers?.includes(user?._id) ? 'Registered' : 'Register',
              primaryDisabled: e.registeredUsers?.includes(user?._id) || registering === e._id,
            }}
          />
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-4">
            <div>
              <div className="text-lg font-semibold text-slate-900 dark:text-dark-text">{selected.title}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">{selected.club}</div>
            </div>
            <div className="text-sm text-slate-700 dark:text-dark-text">{selected.description}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500 dark:text-dark-muted">Date</div>
                <div className="font-medium text-slate-900 dark:text-dark-text">{new Date(selected.date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-dark-muted">Venue</div>
                <div className="font-medium text-slate-900 dark:text-dark-text">{selected.venue}</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-dark-muted">Capacity</div>
                <div className="font-medium text-slate-900 dark:text-dark-text">{selected.registeredUsers?.length || 0}/{selected.capacity}</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-dark-muted">Created by</div>
                <div className="font-medium text-slate-900 dark:text-dark-text">{selected.createdBy?.name}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!registerModal}
        title={registerModal ? `Register for ${registerModal.title}` : 'Register'}
        onClose={() => setRegisterModal(null)}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input
                value={registrationForm.phone}
                onChange={(e) => setRegistrationForm((p) => ({ ...p, phone: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Roll No</label>
              <input
                value={registrationForm.rollNo}
                onChange={(e) => setRegistrationForm((p) => ({ ...p, rollNo: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="Roll number"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Department</label>
              <input
                value={registrationForm.department}
                onChange={(e) => setRegistrationForm((p) => ({ ...p, department: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="Department"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Year</label>
              <input
                value={registrationForm.year}
                onChange={(e) => setRegistrationForm((p) => ({ ...p, year: e.target.value }))}
                type="number"
                min={1}
                max={8}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
            <textarea
              value={registrationForm.notes}
              onChange={(e) => setRegistrationForm((p) => ({ ...p, notes: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
              rows={3}
              placeholder="Any extra details"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRegisterModal(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitRegistration}
              disabled={registering === registerModal?._id}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {registering === registerModal?._id ? 'Submitting...' : 'Submit registration'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
