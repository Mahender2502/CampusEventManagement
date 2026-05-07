import { CalendarDays, ClipboardList, Megaphone, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import StatsCard from '../../components/StatsCard.jsx'
import EventCard from '../../components/EventCard.jsx'
import Modal from '../../components/Modal.jsx'
import { getEventsForClubs, registerForEvent, getMyRegistrations } from '../../services/eventService.js'
import { getClubs } from '../../services/clubService.js'
import { getAnnouncements } from '../../services/announcementService.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    registrations: 0,
    clubsJoined: 0,
    announcements: 0,
  })

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [registerModal, setRegisterModal] = useState(null)
  const [registrationForm, setRegistrationForm] = useState({ phone: '', department: '', year: 1, rollNo: '', notes: '' })
  const [registering, setRegistering] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [clubsRes, registrationsRes, announcementsRes] = await Promise.all([
          getClubs(),
          getMyRegistrations().catch(() => ({ data: { data: [] } })),
          getAnnouncements().catch(() => ({ data: { data: [] } })),
        ])

        const clubs = clubsRes.data?.data || []
        const joinedClubNames = clubs.filter((c) => c.isMember).map((c) => c.name)

        const announcementsCount = (announcementsRes.data?.data || []).length

        if (joinedClubNames.length === 0) {
          const myRegistrations = registrationsRes.data?.data || []
          setEvents([])
          setStats({
            upcomingEvents: 0,
            registrations: myRegistrations.length,
            clubsJoined: 0,
            announcements: announcementsCount,
          })
          return
        }

        const eventsRes = await getEventsForClubs(joinedClubNames, { limit: 100 })

        const allEvents = eventsRes.data?.data?.items || []
        const myRegistrations = registrationsRes.data?.data || []

        setEvents(allEvents)

        // Calculate real stats
        const now = new Date()
        const in30Days = new Date(now)
        in30Days.setDate(in30Days.getDate() + 30)

        const upcomingCount = allEvents.filter((e) => {
          const d = new Date(e.date)
          return !Number.isNaN(d.getTime()) && d >= now && d <= in30Days
        }).length

        const uniqueClubs = new Set(joinedClubNames)

        setStats({
          upcomingEvents: upcomingCount,
          registrations: myRegistrations.length,
          clubsJoined: uniqueClubs.size,
          announcements: announcementsCount,
        })
      } catch {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    const in30Days = new Date(now)
    in30Days.setDate(in30Days.getDate() + 30)
    return (events || [])
      .filter((e) => {
        const d = new Date(e.date)
        return !Number.isNaN(d.getTime()) && d >= now && d <= in30Days
      })
      .slice(0, 6)
  }, [events])

  const openRegister = (eventObj) => {
    setError('')
    setRegisterModal(eventObj)
    setRegistrationForm({ phone: '', department: '', year: 1, rollNo: '', notes: '' })
  }

  const submitRegistration = async () => {
    if (!registerModal?._id) return
    const eventId = registerModal._id

    if (!registrationForm.phone || !registrationForm.department || !registrationForm.rollNo || !registrationForm.year) {
      setError('Please fill all required fields')
      return
    }

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
      // Refresh both events and registrations
      const [clubsRes, registrationsRes, announcementsRes] = await Promise.all([
        getClubs(),
        getMyRegistrations(),
        getAnnouncements().catch(() => ({ data: { data: [] } })),
      ])

      const clubs = clubsRes.data?.data || []
      const joinedClubNames = clubs.filter((c) => c.isMember).map((c) => c.name)

      const myRegistrations = registrationsRes.data?.data || []
      const announcementsCount = (announcementsRes.data?.data || []).length

      if (joinedClubNames.length === 0) {
        setEvents([])
        setStats({
          upcomingEvents: 0,
          registrations: myRegistrations.length,
          clubsJoined: 0,
          announcements: announcementsCount,
        })
        return
      }

      const eventsRes = await getEventsForClubs(joinedClubNames, { limit: 100 })
      const allEvents = eventsRes.data?.data?.items || []
      setEvents(allEvents)

      // Recalculate stats
      const now = new Date()
      const in30Days = new Date(now)
      in30Days.setDate(in30Days.getDate() + 30)
      const upcomingCount = allEvents.filter((e) => {
        const d = new Date(e.date)
        return !Number.isNaN(d.getTime()) && d >= now && d <= in30Days
      }).length
      const uniqueClubs = new Set(joinedClubNames)
      setStats({
        upcomingEvents: upcomingCount,
        registrations: myRegistrations.length,
        clubsJoined: uniqueClubs.size,
        announcements: announcementsCount,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900">Dashboard</div>
        <div className="mt-1 text-sm text-slate-600">Your upcoming events and activity</div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Upcoming" value="-" subtitle="Next 30 days" icon={<CalendarDays className="h-5 w-5" />} />
          <StatsCard title="Registrations" value="-" subtitle="Active" icon={<ClipboardList className="h-5 w-5" />} />
          <StatsCard title="Clubs" value="-" subtitle="Joined" icon={<Users className="h-5 w-5" />} />
          <StatsCard title="Announcements" value="-" subtitle="New" icon={<Megaphone className="h-5 w-5" />} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Upcoming" value={stats.upcomingEvents} subtitle="Next 30 days" icon={<CalendarDays className="h-5 w-5" />} />
          <StatsCard title="Registrations" value={stats.registrations} subtitle="Active" icon={<ClipboardList className="h-5 w-5" />} />
          <StatsCard title="Clubs" value={stats.clubsJoined} subtitle="Joined" icon={<Users className="h-5 w-5" />} />
          <StatsCard title="Announcements" value={stats.announcements} subtitle="New" icon={<Megaphone className="h-5 w-5" />} />
        </div>
      )}

      <div>
        <div className="text-sm font-semibold text-slate-900">Upcoming events</div>
        {error && <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-6 text-center text-sm text-slate-600">Loading events...</div>
          ) : upcomingEvents.length === 0 ? (
            <div className="col-span-full p-6 text-center text-sm text-slate-600">No upcoming events</div>
          ) : (
            upcomingEvents.map((e) => (
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
                  onPrimary: () => e.registeredUsers?.includes(user?._id) ? null : openRegister(e),
                  primaryLabel: e.registeredUsers?.includes(user?._id) ? 'Registered' : 'Register',
                  primaryDisabled: e.registeredUsers?.includes(user?._id) || registering === e._id,
                }}
              />
            ))
          )}
        </div>
      </div>

      <Modal
        open={!!registerModal}
        title={registerModal ? `Register for ${registerModal.title}` : 'Register'}
        onClose={() => setRegisterModal(null)}
      >
        <div className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input
                value={registrationForm.phone}
                onChange={(e) => setRegistrationForm((p) => ({ ...p, phone: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="Phone number"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Roll No</label>
              <input
                value={registrationForm.rollNo}
                onChange={(e) => setRegistrationForm((p) => ({ ...p, rollNo: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="Roll number"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Department</label>
              <input
                value={registrationForm.department}
                onChange={(e) => setRegistrationForm((p) => ({ ...p, department: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="Department"
                required
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
                required
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
    </div>
  )
}
