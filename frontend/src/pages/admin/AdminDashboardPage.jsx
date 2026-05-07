import { useEffect, useState } from 'react'
import { BarChart3, Building2, CalendarDays, Users, Loader2 } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

import StatsCard from '../../components/StatsCard.jsx'
import { getAdminDashboard } from '../../services/userService.js'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboard()
        setStats(res.data?.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics')
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
        <div className="mt-1 text-sm text-slate-600">Platform-wide metrics and analytics</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Clubs" 
          value={stats?.totalClubs || 0} 
          subtitle="Active clubs" 
          icon={<Building2 className="h-5 w-5 text-blue-600" />} 
        />
        <StatsCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          subtitle="Students & Coordinators" 
          icon={<Users className="h-5 w-5 text-indigo-600" />} 
        />
        <StatsCard 
          title="Total Events" 
          value={stats?.totalEvents || 0} 
          subtitle="All time" 
          icon={<CalendarDays className="h-5 w-5 text-emerald-600" />} 
        />
        <StatsCard 
          title="Total Registrations" 
          value={stats?.totalRegistrations || 0} 
          subtitle="Event signups" 
          icon={<BarChart3 className="h-5 w-5 text-amber-600" />} 
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-slate-900">Events Growth (Last 6 Months)</h2>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.chartData || []} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="events" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

