import { Navigate, Outlet } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { LayoutDashboard, CalendarDays, ClipboardList, Users, Megaphone, User } from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'
import DashboardTopbar from './DashboardTopbar.jsx'
import MobileSidebar from './MobileSidebar.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function StudentLayout() {
  const { user, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!loading && !user) return <Navigate to="/login" replace />
  if (!loading && user?.role && user.role !== 'student') {
    const target = user.role === 'admin' ? '/admin/dashboard' : '/coordinator/dashboard'
    return <Navigate to={target} replace />
  }

  const items = useMemo(
    () => [
      { label: 'Dashboard', to: '/student/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
      { label: 'Browse Events', to: '/student/events', icon: <CalendarDays className="h-4 w-4" /> },
      { label: 'My Registrations', to: '/student/registrations', icon: <ClipboardList className="h-4 w-4" /> },
      { label: 'Clubs', to: '/student/clubs', icon: <Users className="h-4 w-4" /> },
      { label: 'Announcements', to: '/student/announcements', icon: <Megaphone className="h-4 w-4" /> },
      { label: 'Profile', to: '/student/profile', icon: <User className="h-4 w-4" /> },
    ],
    [],
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      <div className="flex min-h-screen">
        <Sidebar title="Student" items={items} />
        <MobileSidebar
          open={mobileOpen}
          title="Student"
          items={items}
          onClose={() => setMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar title="Student Portal" onMobileMenu={() => setMobileOpen(true)} />
          <main className="min-w-0 flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
