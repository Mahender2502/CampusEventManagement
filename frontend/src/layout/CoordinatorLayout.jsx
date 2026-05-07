import { Navigate, Outlet } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { LayoutDashboard, PlusCircle, ListChecks, ClipboardList, Users, User, Megaphone } from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'
import DashboardTopbar from './DashboardTopbar.jsx'
import MobileSidebar from './MobileSidebar.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function CoordinatorLayout() {
  const { user, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!loading && !user) return <Navigate to="/login" replace />
  if (!loading && user?.role && !['coordinator', 'admin'].includes(user.role)) {
    return <Navigate to="/student/dashboard" replace />
  }

  const items = useMemo(
    () => [
      { label: 'Dashboard', to: '/coordinator/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
      { label: 'Create Event', to: '/coordinator/create-event', icon: <PlusCircle className="h-4 w-4" /> },
      { label: 'Manage Events', to: '/coordinator/events', icon: <ListChecks className="h-4 w-4" /> },
      { label: 'Event Registrations', to: '/coordinator/registrations', icon: <ClipboardList className="h-4 w-4" /> },
      { label: 'Members', to: '/coordinator/members', icon: <Users className="h-4 w-4" /> },
      { label: 'Announcements', to: '/coordinator/announcements', icon: <Megaphone className="h-4 w-4" /> },
      { label: 'Profile', to: '/coordinator/profile', icon: <User className="h-4 w-4" /> },
    ],
    [],
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      <div className="flex min-h-screen">
        <Sidebar title="Coordinator" items={items} />
        <MobileSidebar
          open={mobileOpen}
          title="Coordinator"
          items={items}
          onClose={() => setMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar title="Coordinator Portal" onMobileMenu={() => setMobileOpen(true)} />
          <main className="min-w-0 flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
