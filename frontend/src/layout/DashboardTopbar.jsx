import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'

import NotificationBell from '../components/NotificationBell.jsx'
import LogoutButton from '../components/LogoutButton.jsx'

export default function DashboardTopbar({ title, onMobileMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-dark-border dark:bg-dark-card/85">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:hover:bg-slate-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-dark-text">{title}</div>
            <div className="text-xs text-slate-500 dark:text-dark-muted">Campus Club Event Management</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link
            to="/"
            className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:hover:bg-slate-800 sm:inline-flex"
          >
            Home
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
