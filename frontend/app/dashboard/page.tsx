'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  PiggyBank
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth'
import type { DashboardData } from '@/types'

export default function DashboardPage() {
  const { user, empresa } = useAuthStore()

  const { data: dashboard, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard().then(res => res.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dashboard</h3>
        <p className="text-gray-500">Tente recarregar a página.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Bem-vindo, {user?.nome}! {empresa?.nome}
        </p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {dashboard?.total_a_pagar.toFixed(2) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total da semana atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {dashboard?.total_pago.toFixed(2) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Valores já pagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {dashboard?.total_pendente.toFixed(2) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Descontos</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {dashboard?.total_descontos.toFixed(2) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de descontos aplicados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Funcionários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top 5 Funcionários
            </CardTitle>
            <CardDescription>
              Maiores valores a receber na semana atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard?.top_funcionarios?.slice(0, 5).map((funcionario, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{funcionario.nome}</span>
                  </div>
                  <Badge variant="secondary">
                    R$ {funcionario.valor_pendente.toFixed(2)}
                  </Badge>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">Nenhum dado disponível</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contagem por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Funcionários por Tipo
            </CardTitle>
            <CardDescription>
              Distribuição de funcionários ativos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Freelancers</span>
                <Badge variant="outline">
                  {dashboard?.contagem_tipos?.freelancer || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Fixos</span>
                <Badge variant="outline">
                  {dashboard?.contagem_tipos?.fixo || 0}
                </Badge>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <Badge>
                    {(dashboard?.contagem_tipos?.freelancer || 0) + (dashboard?.contagem_tipos?.fixo || 0)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Ações comuns para gestão semanal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <a href="/funcionarios">Gerenciar Funcionários</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/semanas">Gerenciar Semanas</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/pagamentos">Ver Pagamentos</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/configuracoes">Configurações</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
