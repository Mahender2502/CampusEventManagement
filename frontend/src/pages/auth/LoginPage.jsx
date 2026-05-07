import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import Logo from '../../components/common/Logo.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { login } from '../../services/authService.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const roles = useMemo(
    () => [
      { label: 'Student', value: 'student', to: '/student/dashboard' },
      { label: 'Coordinator', value: 'coordinator', to: '/coordinator/dashboard' },
      { label: 'Admin', value: 'admin', to: '/admin/dashboard' },
    ],
    [],
  )

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await login(form)
      const payload = res.data?.data
      authLogin(payload?.token, payload?.user)
      const target = roles.find((r) => r.value === payload?.user?.role)?.to || '/student/dashboard'
      navigate(target)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <div className="mx-auto mb-6">
          <Link to="/" aria-label="Home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-card">
          <div className="text-lg font-semibold text-slate-900 dark:text-dark-text">Welcome back</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-dark-muted">Sign in to continue</div>

          {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</div>}

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-dark-text">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                placeholder="you@college.edu"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-dark-text">Password</label>
              <input
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4 dark:border-dark-border dark:bg-dark-card dark:text-dark-text"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-dark-muted">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                Remember me
              </label>
              <Link to="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Forgot password
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Sign in
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-dark-muted">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
