import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getSession } from 'next-auth/react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      
      if (response.data.success) {
        set({ user: response.data.user, isLoading: false })
        toast.success(`Welcome back, ${response.data.user.name || 'User'}!`)
        return true
      } else {
        const errorMessage = response.data.message || 'Login failed'
        set({ error: errorMessage, isLoading: false })
        toast.error(errorMessage)
        return false
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'
        : 'Login failed'
      set({ error: errorMessage, isLoading: false })
      toast.error(errorMessage)
      return false
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post('/api/auth/register', { email, password, name })
      
      if (response.data.success) {
        toast.success('Account created successfully!')
        // Auto-login after successful registration
        const loginSuccess = await get().login(email, password)
        return loginSuccess
      } else {
        const errorMessage = response.data.message || 'Registration failed'
        set({ error: errorMessage, isLoading: false })
        toast.error(errorMessage)
        return false
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed'
        : 'Registration failed'
      set({ error: errorMessage, isLoading: false })
      toast.error(errorMessage)
      return false
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      // Check if it's a NextAuth session
      const session = await getSession()
      if (session) {
        // Use NextAuth signOut
        const { signOut } = await import('next-auth/react')
        await signOut({ callbackUrl: '/' })
      } else {
        // Use custom JWT logout
        await axios.post('/api/auth/logout')
      }
      
      set({ user: null, isLoading: false, error: null })
      toast.success('Logged out successfully')
    } catch {
      // Even if logout fails on server, clear local state
      set({ user: null, isLoading: false, error: null })
      toast.success('Logged out successfully')
    }
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      // The /api/auth/me endpoint now handles both NextAuth and JWT
      const response = await axios.get('/api/auth/me')
      if (response.data.success) {
        set({ user: response.data.user, isLoading: false })
      } else {
        set({ user: null, isLoading: false })
      }
    } catch {
      set({ user: null, isLoading: false })
    }
  },

  clearError: () => set({ error: null })
}))