import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/auth/me')
      .then((res) => {
        const freshUser = res.data?.data?.user
        if (freshUser) {
          localStorage.setItem('user', JSON.stringify(freshUser))
          setUser(freshUser)
          return
        }

        const storedUser = localStorage.getItem('user')
        if (storedUser) setUser(JSON.parse(storedUser))
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        } else {
          const storedUser = localStorage.getItem('user')
          if (storedUser) setUser(JSON.parse(storedUser))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(() => {
    const doLogin = (token, userObj) => {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userObj))
      setUser(userObj)
    }

    const doLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }

    return { user, loading, login: doLogin, logout: doLogout }
  }, [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
