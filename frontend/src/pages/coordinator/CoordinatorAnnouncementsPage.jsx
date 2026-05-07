import { useEffect, useState } from 'react'
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../../services/announcementService.js'
import { Megaphone, Trash2, Send } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function CoordinatorAnnouncementsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', body: '', targetRole: 'all' })

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements()
      setItems(res.data?.data || [])
    } catch (err) {
      setError('Failed to fetch announcements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await createAnnouncement({
        ...form,
        club: user.clubs?.[0] || user.club || 'Club'
      })
      setForm({ title: '', body: '', targetRole: 'all' })
      fetchAnnouncements()
    } catch (err) {
      setError('Failed to create announcement')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return
    try {
      await deleteAnnouncement(id)
      fetchAnnouncements()
    } catch (err) {
      setError('Failed to delete announcement')
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <div className="text-xl font-semibold text-slate-900">Club Announcements</div>
        <div className="mt-1 text-sm text-slate-600">Send updates to students and members</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Create New Announcement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
              placeholder="e.g. Next Club Meeting"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">Message</label>
            <textarea
              required
              rows={3}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
              placeholder="Describe the update..."
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Target Audience</label>
              <select
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
              >
                <option value="all">Everyone</option>
                <option value="student">Students Only</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Sending...' : (
                <>
                  <Send className="h-4 w-4" />
                  Post Announcement
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Previous Announcements</h3>
        {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
        
        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No announcements posted yet.
          </div>
        ) : (
          items.map((a) => (
            <div key={a._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-indigo-600" />
                    <div className="text-sm font-semibold text-slate-900">{a.title}</div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 uppercase">
                      Target: {a.targetRole}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{a.body}</div>
                  <div className="mt-3 text-[10px] text-slate-400">
                    Posted on {new Date(a.createdAt).toLocaleString()}
                  </div>
                </div>
                { (a.createdBy === user._id || user.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
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
