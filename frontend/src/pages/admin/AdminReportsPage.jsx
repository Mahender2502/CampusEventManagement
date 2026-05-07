import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useEffect, useMemo, useState } from 'react'

import { getAdminReports } from '../../services/userService.js'

const colors = ['#4f46e5', '#7c3aed', '#0ea5e9', '#10b981']

export default function AdminReportsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminReports()
        setItems(res.data?.data?.clubDistribution || [])
      } catch (err) {
        setError('Failed to fetch reports')
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const data = useMemo(() => items, [items])

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900">Reports</div>
        <div className="mt-1 text-sm text-slate-600">Participation and club activity insights</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Event category distribution</div>
        {error ? <div className="mt-3 text-sm font-medium text-red-600">{error}</div> : null}
        <div className="mt-4 h-72">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-600">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={3}>
                  {data.map((entry, idx) => (
                    <Cell key={entry.name} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.map((d, idx) => (
            <div key={d.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                <div className="text-sm font-semibold text-slate-900">{d.name}</div>
              </div>
              <div className="mt-1 text-xs text-slate-600">{d.value}% participation</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
