import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import Logo from '../../components/common/Logo.jsx'
import { register } from '../../services/authService.js'
import { getPublicClubs } from '../../services/clubService.js'

export default function RegisterPage() {
  const navigate = useNavigate()
  const roles = useMemo(
    () => [
      { label: 'Student', value: 'student', to: '/student/dashboard' },
      { label: 'Coordinator', value: 'coordinator', to: '/coordinator/dashboard' }
    ],
    [],
  )

  const [clubs, setClubs] = useState([])
  const [clubsLoading, setClubsLoading] = useState(true)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    rollNo: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    club: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPublicClubs()
        setClubs(res.data?.data || [])
      } catch {
        setClubs([])
      } finally {
        setClubsLoading(false)
      }
    }
    fetch()
  }, [])

  async function submit(e) {
    e.preventDefault()

    setError('')
    setSubmitting(true)

    try {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (form.role === 'coordinator' && !form.club) {
        setError('Please select a club for coordinator account')
        return
      }

      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        department: form.department,
        year: form.year,
        rollNo: form.rollNo,
        role: form.role,
        club: form.role === 'coordinator' ? form.club : undefined,
        clubs: form.role === 'student' && form.club ? [form.club] : [],
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <div className="mx-auto mb-6">
          <Link to="/" aria-label="Home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">Create your account</div>
          <div className="mt-1 text-sm text-slate-600">Get started with KMIT</div>

          {error ? <div className="mt-4 text-sm font-medium text-red-600">{error}</div> : null}

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="you@college.edu"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Mobile number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                type="tel"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="e.g. +91 9876543210"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Department</label>
                <input
                  value={form.department}
                  onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Year</label>
                <input
                  value={form.year}
                  onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                  placeholder="e.g. 3rd Year"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Roll number</label>
              <input
                value={form.rollNo}
                onChange={(e) => setForm((p) => ({ ...p, rollNo: e.target.value }))}
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="e.g. 20BCS001"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Confirm password</label>
              <input
                value={form.confirmPassword}
                onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                placeholder="Re-enter password"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Club {form.role === 'coordinator' ? '' : '(optional)'}
              </label>
              <select
                value={form.club}
                onChange={(e) => setForm((p) => ({ ...p, club: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4"
                disabled={clubsLoading}
              >
                <option value="">Select a club</option>
                {clubs.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              {submitting ? 'Creating...' : 'Create account'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
