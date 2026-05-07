import { useEffect, useState } from 'react'
import { getAnnouncements } from '../../services/announcementService.js'

export default function StudentAnnouncementsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAnnouncements()
        setItems(res.data?.data || [])
      } catch (err) {
        setError('Failed to fetch announcements')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900">Announcements</div>
        <div className="mt-1 text-sm text-slate-600">Global updates from the campus platform</div>
      </div>

      {error && <div className="text-sm text-red-600 font-medium">{error}</div>}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No announcements found.
          </div>
        ) : (
          items.map((a) => (
            <div key={a._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-slate-900">{a.title}</div>
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                      {a.club}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{a.body}</div>
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap">
                  {new Date(a.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
