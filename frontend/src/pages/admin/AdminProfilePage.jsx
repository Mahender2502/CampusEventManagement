import { useState } from 'react'
import { Loader2, CheckCircle2, AlertCircle, Save, Shield, Pencil, X } from 'lucide-react'

import { useAuth } from '../../contexts/AuthContext.jsx'
import { updateProfile } from '../../services/userService.js'

export default function AdminProfilePage() {
  const { user, login } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await updateProfile(form)
      const updatedUser = res.data?.data
      login(localStorage.getItem('token'), updatedUser)
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
    setIsEditing(false)
    setError('')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Admin Profile</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your administrator account information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Personal Details</h2>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {success}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={!isEditing}
                  className={`mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition-all ${
                    isEditing 
                      ? 'bg-white ring-indigo-200 focus:ring-4' 
                      : 'bg-slate-50 text-slate-500 cursor-not-allowed'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!isEditing}
                  className={`mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition-all ${
                    isEditing 
                      ? 'bg-white ring-indigo-200 focus:ring-4' 
                      : 'bg-slate-50 text-slate-500 cursor-not-allowed'
                  }`}
                  required
                />
              </div>

              {/* <div>
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={!isEditing}
                  className={`mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition-all ${
                    isEditing 
                      ? 'bg-white ring-indigo-200 focus:ring-4' 
                      : 'bg-slate-50 text-slate-500 cursor-not-allowed'
                  }`}
                  placeholder="e.g. +91 9876543210"
                />
              </div> */}

              {isEditing && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              Administrator
            </h2>
            <div className="mt-4">
              <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                System Admin
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              You have full access to the campus club management system.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
