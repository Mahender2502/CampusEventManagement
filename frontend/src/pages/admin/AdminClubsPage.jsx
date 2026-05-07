import { useEffect, useState } from 'react'

import Table from '../../components/Table.jsx'
import { createAdminClub, deleteAdminClub, getAdminClubs } from '../../services/adminClubService.js'

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', tagline: '', description: '' })
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchClubs = async () => {
    try {
      setLoading(true)
      const res = await getAdminClubs()
      setClubs(res.data?.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load clubs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClubs()
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      await createAdminClub({
        name: form.name,
        tagline: form.tagline,
        description: form.description,
      })
      setForm({ name: '', tagline: '', description: '' })
      await fetchClubs()
    } catch (err) {
      const backendErrors = err.response?.data?.errors
      if (Array.isArray(backendErrors) && backendErrors.length) {
        setError(backendErrors.join(', '))
      } else {
        setError(err.response?.data?.message || 'Failed to create club')
      }
    } finally {
      setCreating(false)
    }
  }

  const onDelete = async (id) => {
    setError('')
    setDeleting(id)
    try {
      await deleteAdminClub(id)
      await fetchClubs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete club')
    } finally {
      setDeleting(null)
    }
  }

  const columns = [
    { key: 'name', header: 'Club' },
    { key: 'tagline', header: 'Tagline' },
    { key: 'memberCount', header: 'Members' },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(r._id)}
            disabled={deleting === r._id}
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
          >
            {deleting === r._id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900">Manage clubs</div>
        <div className="mt-1 text-sm text-slate-600">Add, edit and remove clubs from the platform</div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Create club</div>
        <form onSubmit={onCreate} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
              placeholder="Club name"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
              placeholder="Short tagline"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
              rows={3}
              placeholder="Describe the club"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create club'}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="p-6 text-center text-sm text-slate-600">Loading clubs...</div>
      ) : (
        <Table columns={columns} rows={clubs} keyField="_id" />
      )}
    </div>
  )
}
