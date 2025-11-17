import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, RegisterDto, LoginDto, GuestDto, ConvertGuestDto } from '../types'
import * as api from '../services/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginDto) => Promise<void>
  register: (credentials: RegisterDto) => Promise<void>
  loginAsGuest: (guestData: GuestDto) => Promise<void>
  convertGuestToUser: (conversionData: ConvertGuestDto) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userData = await api.getCurrentUser()
          setUser(userData)
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])

  const login = async (credentials: LoginDto) => {
    const { user, token } = await api.login(credentials)
    localStorage.setItem('token', token)
    setUser(user)
  }

  const register = async (credentials: RegisterDto) => {
    const { user, token } = await api.register(credentials)
    localStorage.setItem('token', token)
    setUser(user)
  }

  const loginAsGuest = async (guestData: GuestDto) => {
    const { user, token } = await api.createGuest(guestData)
    localStorage.setItem('token', token)
    setUser(user)
  }

  const convertGuestToUser = async (conversionData: ConvertGuestDto) => {
    const { user, token } = await api.convertGuest(conversionData)
    localStorage.setItem('token', token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginAsGuest, convertGuestToUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}