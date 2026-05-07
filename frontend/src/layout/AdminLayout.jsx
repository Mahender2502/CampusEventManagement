import { Navigate, Outlet } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { LayoutDashboard, Building2, Users, CalendarDays, BarChart3, User, Megaphone } from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'
import DashboardTopbar from './DashboardTopbar.jsx'
import MobileSidebar from './MobileSidebar.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AdminLayout() {
  const { user, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!loading && !user) return <Navigate to="/login" replace />
  if (!loading && user?.role && user.role !== 'admin') {
    const target = user.role === 'student' ? '/student/dashboard' : '/coordinator/dashboard'
    return <Navigate to={target} replace />
  }

  const items = useMemo(
    () => [
      { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
      { label: 'Manage Clubs', to: '/admin/clubs', icon: <Building2 className="h-4 w-4" /> },
      { label: 'Manage Users', to: '/admin/users', icon: <Users className="h-4 w-4" /> },
      { label: 'All Events', to: '/admin/events', icon: <CalendarDays className="h-4 w-4" /> },
      { label: 'Reports', to: '/admin/reports', icon: <BarChart3 className="h-4 w-4" /> },
      { label: 'Announcements', to: '/admin/announcements', icon: <Megaphone className="h-4 w-4" /> },
      { label: 'Profile', to: '/admin/profile', icon: <User className="h-4 w-4" /> },
    ],
    [],
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      <div className="flex min-h-screen">
        <Sidebar title="Admin" items={items} />
        <MobileSidebar open={mobileOpen} title="Admin" items={items} onClose={() => setMobileOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar title="Admin Console" onMobileMenu={() => setMobileOpen(true)} />
          <main className="min-w-0 flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
