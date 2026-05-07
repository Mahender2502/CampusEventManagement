import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function MobileSidebar({ open, title, items, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative h-full w-80 bg-white dark:bg-dark-card">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-dark-border">
          <div className="text-sm font-semibold text-slate-900 dark:text-dark-text">{title}</div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 pb-6 pt-3">
          <div className="space-y-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-dark-text dark:hover:bg-slate-800'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
