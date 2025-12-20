import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string | null
  picture: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  isHydrated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,
  setAuth: (user, token) => {
    set({ user, token })
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-storage', JSON.stringify({ user, token }))
    }
  },
  logout: () => {
    set({ user: null, token: null })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage')
    }
  },
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth-storage')
      if (stored) {
        try {
          const { user, token } = JSON.parse(stored)
          set({ user, token, isHydrated: true })
        } catch (e) {
          console.error('Failed to parse stored auth:', e)
          set({ isHydrated: true })
        }
      } else {
        set({ isHydrated: true })
      }
    }
  },
}))
