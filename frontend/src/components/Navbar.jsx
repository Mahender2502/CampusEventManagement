import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import Container from './common/Container.jsx'
import Logo from './common/Logo.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Events', href: '#events' },
  { label: 'Clubs', href: '#clubs' },
]

export default function Navbar() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const { user, logout } = useAuth()

  const dashboardHref = user?.role === 'admin'
    ? '/admin/dashboard'
    : user?.role === 'coordinator'
      ? '/coordinator/dashboard'
      : '/student/dashboard'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-dark-border dark:bg-dark-card/85">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={isLanding ? item.href : `/${item.href}`}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-dark-muted dark:hover:text-dark-text"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <NavLink
                  to={dashboardHref}
                  className={({ isActive }) =>
                    `hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-dark-text dark:hover:bg-slate-800 md:inline-flex ${
                      isActive ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Logout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-dark-text dark:hover:bg-slate-800 md:inline-flex ${
                      isActive ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 ${
                      isActive ? 'bg-indigo-700' : ''
                    }`
                  }
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </NavLink>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}
