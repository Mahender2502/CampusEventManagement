import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell } from 'lucide-react'

import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService.js'

import { useAuth } from '../contexts/AuthContext.jsx'

export default function NotificationBell() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const containerRef = useRef(null)

  const notifications = useMemo(() => items, [items])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleDropdownClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleDropdownClickOutside)
    return () => document.removeEventListener('mousedown', handleDropdownClickOutside)
  }, [])

  useEffect(() => {
    if (!user) {
      setItems([])
      setUnreadCount(0)
      return
    }

    let cancelled = false
    getMyNotifications({ page: 1, limit: 10 })
      .then((res) => {
        if (cancelled) return
        setItems(res.data?.data?.items || [])
        setUnreadCount(res.data?.data?.unreadCount || 0)
      })
      .catch(() => {
        if (cancelled) return
        setItems([])
        setUnreadCount(0)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  async function toggleOpen() {
    const next = !open
    setOpen(next)

    if (next && unreadCount > 0) {
      try {
        await markAllNotificationsRead()
        setUnreadCount(0)
        setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })))
      } catch {
        // ignore
      }
    }
  }

  async function handleClickNotification(n) {
    if (!n?.readAt) {
      try {
        await markNotificationRead(n._id)
        setUnreadCount((c) => Math.max(0, c - 1))
        setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, readAt: new Date().toISOString() } : x)))
      } catch {
        // ignore
      }
    }

    if (n?.link) {
      window.location.href = n.link
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600" /> : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">Notifications</div>
            <div className="text-xs text-slate-500">Recent updates</div>
          </div>
          <div className="max-h-80 overflow-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-600">No notifications</div>
            ) : (
              notifications.map((n) => (
                <button
                  type="button"
                  key={n._id}
                  onClick={() => handleClickNotification(n)}
                  className="w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">{n.title}</div>
                    {!n.readAt ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" /> : null}
                  </div>
                  <div className="mt-0.5 text-sm text-slate-600">{n.body}</div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
