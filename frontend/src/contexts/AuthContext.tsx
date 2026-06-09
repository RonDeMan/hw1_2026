import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export type User = {
  token: string
  username: string
  name: string
  email: string
}

export type AuthContextValue = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Interceptor to attach token
    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
      return config
    })

    return () => {
      axios.interceptors.request.eject(requestInterceptor)
    }
  }, [user])

  const login = (newUser: User) => {
    setUser(newUser)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
