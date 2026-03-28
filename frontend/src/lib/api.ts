import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type { 
  RegisterRequest, 
  AuthResponse, 
  Funcionario, 
  CreateFuncionarioRequest,
  Semana,
  CreateSemanaRequest,
  Presenca,
  CreatePresencaRequest,
  Pagamento,
  ItemConsumo,
  CreateItemConsumoRequest,
  DashboardData
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken)
              const { access_token } = response.data.tokens
              
              localStorage.setItem('access_token', access_token)
              
              // Retry the original request
              originalRequest.headers.Authorization = `Bearer ${access_token}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.clearAuthData()
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> {
    return this.client.post('/api/v1/auth/register', data)
  }

  async login(email: string, senha: string): Promise<AxiosResponse<AuthResponse>> {
    return this.client.post('/api/v1/auth/login', { email, senha })
  }

  async refreshToken(refreshToken: string): Promise<AxiosResponse<AuthResponse>> {
    return this.client.post('/api/v1/auth/refresh', { refresh_token: refreshToken })
  }

  async logout(): Promise<AxiosResponse> {
    const response = await this.client.post('/api/v1/auth/logout')
    this.clearAuthData()
    return response
  }

  clearAuthData() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    localStorage.removeItem('empresa')
  }

  // Dashboard
  async getDashboard(): Promise<AxiosResponse<DashboardData>> {
    return this.client.get('/api/v1/dashboard')
  }

  // Funcionários
  async getFuncionarios(params?: { tipo?: string; ativo?: boolean; busca?: string }): Promise<AxiosResponse<Funcionario[]>> {
    return this.client.get('/api/v1/funcionarios', { params })
  }

  async createFuncionario(data: CreateFuncionarioRequest): Promise<AxiosResponse<Funcionario>> {
    return this.client.post('/api/v1/funcionarios', data)
  }

  async updateFuncionario(id: number, data: Partial<CreateFuncionarioRequest>): Promise<AxiosResponse<Funcionario>> {
    return this.client.put(`/api/v1/funcionarios/${id}`, data)
  }

  async deleteFuncionario(id: number): Promise<AxiosResponse<void>> {
    return this.client.patch(`/api/v1/funcionarios/${id}/status`, { ativo: false })
  }

  // Semanas
  async getSemanas(): Promise<AxiosResponse<Semana[]>> {
    return this.client.get('/api/v1/semanas')
  }

  async createSemana(data: CreateSemanaRequest): Promise<AxiosResponse<Semana>> {
    return this.client.post('/api/v1/semanas', data)
  }

  async getSemana(id: number): Promise<AxiosResponse<Semana>> {
    return this.client.get(`/api/v1/semanas/${id}`)
  }

  async encerrarSemana(id: number): Promise<AxiosResponse<void>> {
    return this.client.post(`/api/v1/semanas/${id}/encerrar`)
  }

  // Presenças
  async getPresencas(semanaId: number): Promise<AxiosResponse<Presenca[]>> {
    return this.client.get(`/api/v1/semanas/${semanaId}/presencas`)
  }

  async createPresenca(semanaId: number, data: CreatePresencaRequest): Promise<AxiosResponse<Presenca>> {
    return this.client.post(`/api/v1/semanas/${semanaId}/presencas`, data)
  }

  async updatePresenca(id: number, data: Partial<CreatePresencaRequest>): Promise<AxiosResponse<Presenca>> {
    return this.client.put(`/api/v1/presencas/${id}`, data)
  }

  // Pagamentos
  async getPagamentos(params?: { status?: string; semana_id?: number }): Promise<AxiosResponse<Pagamento[]>> {
    return this.client.get('/api/v1/pagamentos', { params })
  }

  async getPagamento(id: number): Promise<AxiosResponse<Pagamento>> {
    return this.client.get(`/api/v1/pagamentos/${id}`)
  }

  async marcarPago(id: number, data?: { data_pagamento?: string; comprovante?: string }): Promise<AxiosResponse<void>> {
    return this.client.patch(`/api/v1/pagamentos/${id}/pagar`, data)
  }

  async marcarPagosLote(ids: number[]): Promise<AxiosResponse<void>> {
    return this.client.post('/api/v1/pagamentos/pagar-lote', { pagamento_ids: ids })
  }

  // Itens de Consumo
  async getItensConsumo(): Promise<AxiosResponse<ItemConsumo[]>> {
    return this.client.get('/api/v1/itens-consumo')
  }

  async createItemConsumo(data: CreateItemConsumoRequest): Promise<AxiosResponse<ItemConsumo>> {
    return this.client.post('/api/v1/itens-consumo', data)
  }

  async updateItemConsumo(id: number, data: Partial<CreateItemConsumoRequest>): Promise<AxiosResponse<ItemConsumo>> {
    return this.client.put(`/api/v1/itens-consumo/${id}`, data)
  }
}

export const api = new ApiClient()
