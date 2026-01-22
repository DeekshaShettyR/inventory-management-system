"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from './types'

// TODO: Move mock users to database when backend is ready
// FIXME: Password should be hashed before storing (security issue)
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  register: (username: string, email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user storage (in real app, this would be a database)
const mockUsers: { username: string; email: string; password: string }[] = [
  { username: 'admin', email: 'admin@inventory.com', password: 'admin123' }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback((username: string, password: string): boolean => {
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password
    )
    
    if (foundUser) {
      setUser({
        id: crypto.randomUUID(),
        username: foundUser.username,
        email: foundUser.email
      })
      return true
    }
    return false
  }, [])

  const register = useCallback((username: string, email: string, password: string): boolean => {
    // Check if username already exists
    const exists = mockUsers.some(u => u.username === username)
    if (exists) return false

    // Add new user
    mockUsers.push({ username, email, password })
    
    // Auto login after registration
    setUser({
      id: crypto.randomUUID(),
      username,
      email
    })
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
