import { useEffect, useState } from 'react'
import { BarChart3, ClipboardList, CalendarDays, Users, Loader2 } from 'lucide-react'
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

import StatsCard from '../../components/StatsCard.jsx'
import { getCoordinatorStats } from '../../services/coordinatorService.js'

export default function CoordinatorDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getCoordinatorStats()
        setStats(res.data?.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900">Dashboard</div>
        <div className="mt-1 text-sm text-slate-600">Club performance and registrations overview</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total events" 
          value={stats.totalEvents} 
          subtitle="All created" 
          icon={<CalendarDays className="h-5 w-5" />} 
        />
        <StatsCard 
          title="Registrations" 
          value={stats.registrations} 
          subtitle="All-time" 
          icon={<ClipboardList className="h-5 w-5" />} 
        />
        <StatsCard 
          title="Members" 
          value={stats.members} 
          subtitle="Active" 
          icon={<Users className="h-5 w-5" />} 
        />
        <StatsCard 
          title="Pending" 
          value={stats.pendingApprovals} 
          subtitle="Approvals" 
          icon={<BarChart3 className="h-5 w-5" />} 
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Weekly registrations</div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="regs" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
