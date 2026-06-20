import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  function login(email, password) {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    const fakeUser = { id: 1, email, name: email.split('@')[0] }
    localStorage.setItem('user', JSON.stringify(fakeUser))
    setUser(fakeUser)
    return { success: true }
  }

  function register(name, email, password) {
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' }
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    const newUser = { id: 1, email, name }
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
    return { success: true }
  }

  function logout() {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}