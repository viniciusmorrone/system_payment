// Auth types
export interface RegisterRequest {
  empresa: {
    nome: string
    email_contato: string
  }
  usuario: {
    nome: string
    email: string
  }
  senha: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface User {
  id: number
  nome: string
  email: string
  role: string
  ativo: boolean
  empresa_id: number
}

export interface Empresa {
  id: number
  nome: string
  email_contato: string
  plano: string
  ativo: boolean
}

export interface AuthResponse {
  usuario: User
  empresa: Empresa
  tokens: {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
  }
}

// Funcionario types
export interface Funcionario {
  id: number
  empresa_id: number
  nome_completo: string
  tipo: 'freelancer' | 'fixo'
  chave_pix?: string
  forma_pagamento: 'PIX' | 'DINHEIRO'
  cargo?: string
  valor_diaria: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface CreateFuncionarioRequest {
  nome_completo: string
  tipo: 'freelancer' | 'fixo'
  chave_pix?: string
  forma_pagamento: 'PIX' | 'DINHEIRO'
  cargo?: string
  valor_diaria: number
}

// Semana types
export interface Semana {
  id: number
  empresa_id: number
  data_inicio: string
  data_fim: string
  encerrada: boolean
  criado_em: string
  atualizado_em: string
}

export interface CreateSemanaRequest {
  data_inicio: string
  data_fim: string
}

// Presenca types
export interface Presenca {
  id: number
  funcionario_id: number
  semana_id: number
  data_presenca: string
  dia_semana: string
  status: 'presente' | 'folga' | 'ponto' | 'dobrar' | 'falta'
  valor_diaria: number
  criado_em: string
  atualizado_em: string
}

export interface CreatePresencaRequest {
  funcionario_id: number
  data_presenca: string
  dia_semana: string
  status: 'presente' | 'folga' | 'ponto' | 'dobrar' | 'falta'
  valor_diaria: number
}

// Pagamento types
export interface Pagamento {
  id: number
  funcionario_id: number
  semana_id: number
  valor_bruto: number
  total_descontos: number
  valor_liquido: number
  status: 'pendente' | 'pago' | 'cancelado' | 'parcial'
  data_pagamento?: string
  comprovante?: string
  criado_em: string
  atualizado_em: string
}

// Item Consumo types
export interface ItemConsumo {
  id: number
  empresa_id: number
  nome: string
  preco_padrao: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface CreateItemConsumoRequest {
  nome: string
  preco_padrao: number
}

// Dashboard types
export interface DashboardData {
  total_a_pagar: number
  total_pago: number
  total_pendente: number
  total_descontos: number
  top_funcionarios: {
    nome: string
    valor_pendente: number
  }[]
  contagem_tipos: {
    freelancer: number
    fixo: number
  }
}
