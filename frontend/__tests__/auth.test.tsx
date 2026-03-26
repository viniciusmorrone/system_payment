import { useAuthStore } from '@/lib/auth'
import { describe, it, expect, beforeEach } from 'vitest'
import type { User, Empresa } from '@/types'

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.getState().logout()
  })

  it('should initialize with default values', () => {
    const state = useAuthStore.getState()
    
    expect(state.user).toBeNull()
    expect(state.empresa).toBeNull()
    expect(state.tokens).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should set auth data correctly', () => {
    const mockUser: User = {
      id: 1,
      nome: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      ativo: true,
      empresa_id: 1,
    }
    
    const mockEmpresa: Empresa = {
      id: 1,
      nome: 'Test Company',
      email_contato: 'contact@test.com',
      plano: 'free',
      ativo: true,
    }
    
    const mockTokens = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
    }

    useAuthStore.getState().setAuth(mockUser, mockEmpresa, mockTokens)
    
    const state = useAuthStore.getState()
    
    expect(state.user).toEqual(mockUser)
    expect(state.empresa).toEqual(mockEmpresa)
    expect(state.tokens).toEqual(mockTokens)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should logout correctly', () => {
    // First set some auth data
    const mockUser: User = {
      id: 1,
      nome: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      ativo: true,
      empresa_id: 1,
    }
    
    const mockEmpresa: Empresa = {
      id: 1,
      nome: 'Test Company',
      email_contato: 'contact@test.com',
      plano: 'free',
      ativo: true,
    }
    
    const mockTokens = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
    }
    
    useAuthStore.getState().setAuth(mockUser, mockEmpresa, mockTokens)
    
    // Then logout
    useAuthStore.getState().logout()
    
    const state = useAuthStore.getState()
    
    expect(state.user).toBeNull()
    expect(state.empresa).toBeNull()
    expect(state.tokens).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})
