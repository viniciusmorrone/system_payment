import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Empresa } from '@/types'

export interface AuthState {
  user: User | null
  empresa: Empresa | null
  tokens: {
    access_token: string
    refresh_token: string
  } | null
  isAuthenticated: boolean
  setAuth: (user: User, empresa: Empresa, tokens: { access_token: string; refresh_token: string }) => void
  logout: () => void
  refreshTokens: (tokens: { access_token: string; refresh_token: string }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      empresa: null,
      tokens: null,
      isAuthenticated: false,

      setAuth: (user, empresa, tokens) => {
        localStorage.setItem('access_token', tokens.access_token)
        localStorage.setItem('refresh_token', tokens.refresh_token)
        
        set({
          user,
          empresa,
          tokens,
          isAuthenticated: true,
        })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        set({
          user: null,
          empresa: null,
          tokens: null,
          isAuthenticated: false,
        })
      },

      refreshTokens: (tokens) => {
        localStorage.setItem('access_token', tokens.access_token)
        
        set((state) => ({
          ...state,
          tokens,
        }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        empresa: state.empresa,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
