import { useAuth } from '../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function LogoutButton({ className = '' }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:hover:bg-slate-800 ${className}`}
    >
      Logout
    </button>
  )
}
