import { useEffect, useState } from 'react'
import { Loader2, Trash2, User, Search } from 'lucide-react'

import Table from '../../components/Table.jsx'
import { getAllUsers, deleteUser } from '../../services/userService.js'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await getAllUsers()
      setUsers(res.data?.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
          row.role === 'admin' ? 'bg-purple-100 text-purple-700' :
          row.role === 'coordinator' ? 'bg-amber-100 text-amber-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.role !== 'admin' && (
            <button
              onClick={() => handleDelete(row._id)}
              className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors"
              title="Delete User"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Manage Users</h1>
          <p className="mt-1 text-sm text-slate-600">Search and manage all system accounts</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email or role..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-indigo-200 focus:ring-4"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <User className="mx-auto h-12 w-12 text-slate-300" />
          <div className="mt-4 text-sm text-slate-600">
            {searchQuery ? 'No users match your search' : 'No users found'}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <Table columns={columns} rows={filteredUsers} />
        </div>
      )}
    </div>
  )
}

