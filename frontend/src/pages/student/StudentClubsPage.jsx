import { useEffect, useState } from 'react'

import { getClubs, joinClub, leaveClub } from '../../services/clubService.js'

export default function StudentClubsPage() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(null)

  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    try {
      setLoading(true)
      const res = await getClubs()
      setClubs(res.data?.data || [])
    } catch (err) {
      setError('Failed to load clubs')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (clubId) => {
    setJoining(clubId)
    setError('')
    try {
      await joinClub(clubId)
      await fetchClubs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join club')
    } finally {
      setJoining(null)
    }
  }

  const handleLeave = async (clubId) => {
    setJoining(clubId)
    setError('')
    try {
      await leaveClub(clubId)
      await fetchClubs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave club')
    } finally {
      setJoining(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-xl font-semibold text-slate-900">Clubs</div>
          <div className="mt-1 text-sm text-slate-600">Explore campus clubs and join communities</div>
        </div>
        <div className="p-6 text-center text-sm text-slate-600">Loading clubs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900">Clubs</div>
        <div className="mt-1 text-sm text-slate-600">Explore campus clubs and join communities</div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.length === 0 ? (
          <div className="col-span-full p-6 text-center text-sm text-slate-600">No clubs available</div>
        ) : (
          clubs.map((c) => (
            <div key={c._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{c.name}</div>
              <div className="mt-1 text-sm text-slate-600">{c.tagline}</div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-slate-500">{c.memberCount} members</div>
                {c.isMember ? (
                  <button
                    onClick={() => handleLeave(c._id)}
                    disabled={joining === c._id}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {joining === c._id ? 'Leaving...' : 'Leave'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(c._id)}
                    disabled={joining === c._id}
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {joining === c._id ? 'Joining...' : 'Join'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
