import { useEffect, useState } from 'react'
import { Loader2, Users, Search } from 'lucide-react'

import Table from '../../components/Table.jsx'
import { getClubMembers } from '../../services/coordinatorService.js'

export default function CoordinatorMembersPage() {
  const [members, setMembers] = useState([])
  const [clubName, setClubName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getClubMembers()
        setMembers(res.data?.data?.members || [])
        setClubName(res.data?.data?.clubName || '')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load members')
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
          row.role === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {row.role}
        </span>
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (row) => (
        <span className="text-sm text-slate-600">
          {row.joinedAt ? new Date(row.joinedAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ]

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xl font-semibold text-slate-900">
            {clubName ? `${clubName} Members` : 'Members'}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {members.length} member{members.length !== 1 ? 's' : ''} in your club
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-indigo-200 focus:ring-4"
          />
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300" />
          <div className="mt-4 text-sm text-slate-600">
            {searchQuery ? 'No members match your search' : 'No members in your club yet'}
          </div>
        </div>
      ) : (
        <Table columns={columns} rows={filteredMembers} />
      )}
    </div>
  )
}
