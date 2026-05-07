export default function StatsCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-600">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
          {subtitle ? <div className="mt-1 text-xs text-slate-500">{subtitle}</div> : null}
        </div>
        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-700">{icon}</div>
      </div>
    </div>
  )
}
