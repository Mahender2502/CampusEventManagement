import { NavLink } from 'react-router-dom'

export default function Sidebar({ title, items }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block dark:border-dark-border dark:bg-dark-card">
      <div className="flex h-16 items-center px-5">
        <div className="text-sm font-semibold text-slate-900 dark:text-dark-text">{title}</div>
      </div>

      <nav className="px-3 pb-6">
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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
    </aside>
  )
}
