'use client'

import { useState} from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  CreditCard, 
  Search, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Download,
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth'
import type { Pagamento } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function PagamentosPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useState(new URLSearchParams())
  const [selectedPayments, setSelectedPayments] = useState<number[]>([])

  const statusFilter = searchParams.get('status') || ''
  const semanaFilter = searchParams.get('semana_id') || ''

  const { data: pagamentos, isLoading } = useQuery<Pagamento[]>({
    queryKey: ['pagamentos', { status: statusFilter, semana_id: semanaFilter }],
    queryFn: () => api.getPagamentos({ 
      status: statusFilter, 
      semana_id: semanaFilter ? parseInt(semanaFilter) : undefined
    }).then(res => res.data),
  })

  const marcarPagoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data?: { data_pagamento?: string } }) => api.marcarPago(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] })
      setSelectedPayments([])
    },
  })

  const marcarPagosLoteMutation = useMutation({
    mutationFn: (ids: number[]) => api.marcarPagosLote(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] })
      setSelectedPayments([])
    },
  })

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendenteIds = pagamentos
        ?.filter(p => p.status === 'pendente')
        .map(p => p.id) || []
      setSelectedPayments(pendenteIds)
    } else {
      setSelectedPayments([])
    }
  }

  const handleSelectPayment = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedPayments(prev => [...prev, id])
    } else {
      setSelectedPayments(prev => prev.filter(p => p !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: { variant: "secondary" as const, icon: Clock, text: "Pendente" },
      pago: { variant: "default" as const, icon: CheckCircle, text: "Pago" },
      cancelado: { variant: "destructive" as const, icon: AlertTriangle, text: "Cancelado" },
      parcial: { variant: "outline" as const, icon: CreditCard, text: "Parcial" },
    }
    
    const config = variants[status as keyof typeof variants] || variants.pendente
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const pendentePayments = pagamentos?.filter(p => p.status === 'pendente') || []
  const allPendenteSelected = pendentePayments.length > 0 && selectedPayments.length === pendentePayments.length

  if (!['admin', 'gestor'].includes(user?.role || '')) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
        <p className="text-gray-500">Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
          <p className="text-gray-600">
            Gerencie os pagamentos dos funcionários
          </p>
        </div>
        
        {selectedPayments.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => marcarPagosLoteMutation.mutate(selectedPayments)}
              disabled={marcarPagosLoteMutation.isPending}
            >
              {marcarPagosLoteMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Marcar {selectedPayments.length} como Pago(s)
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar pagamentos..."
                  value={searchParams.get('search') || ''}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendentes</option>
              <option value="pago">Pagos</option>
              <option value="cancelado">Cancelados</option>
              <option value="parcial">Parciais</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {pendentePayments.reduce((sum, p) => sum + p.valor_liquido, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendentePayments.length} pagamentos pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {pagamentos?.filter(p => p.status === 'pago' && p.data_pagamento === new Date().toISOString().split('T')[0])
                .reduce((sum, p) => sum + p.valor_liquido, 0).toFixed(2) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Pagamentos processados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mês</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {pagamentos?.filter(p => p.status === 'pago')
                .reduce((sum, p) => sum + p.valor_liquido, 0).toFixed(2) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total pago no mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Processamento</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pagamentos?.filter(p => p.status === 'parcial').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pagamentos parciais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pagamentos Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {pagamentos?.length || 0} pagamentos encontrados
              </CardTitle>
              <CardDescription>
                {statusFilter ? `Filtrando por status: ${statusFilter}` : 'Mostrando todos os pagamentos'}
              </CardDescription>
            </div>
            
            {pendentePayments.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={allPendenteSelected}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm">
                  Selecionar Todos Pendentes
                </Label>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : pagamentos?.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pagamento encontrado</h3>
              <p className="text-gray-500">
                {searchParams.get('search') ? 'Tente ajustar os filtros ou busca.' : 'Nenhum pagamento registrado.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-900">
                      <Checkbox
                        checked={allPendenteSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">Funcionário</th>
                    <th className="text-left p-4 font-medium text-gray-900">Valor Bruto</th>
                    <th className="text-left p-4 font-medium text-gray-900">Descontos</th>
                    <th className="text-left p-4 font-medium text-gray-900">Valor Líquido</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-left p-4 font-medium text-gray-900">Data Pagamento</th>
                    <th className="text-left p-4 font-medium text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos?.map((pagamento) => (
                    <tr key={pagamento.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {pagamento.status === 'pendente' && (
                          <Checkbox
                            checked={selectedPayments.includes(pagamento.id)}
                            onCheckedChange={(checked: boolean) => handleSelectPayment(pagamento.id, checked)}
                          />
                        )}
                      </td>
                      <td className="p-4 font-medium">Funcionário #{pagamento.funcionario_id}</td>
                      <td className="p-4">R$ {pagamento.valor_bruto.toFixed(2)}</td>
                      <td className="p-4 text-red-600">R$ {pagamento.total_descontos.toFixed(2)}</td>
                      <td className="p-4 font-medium">R$ {pagamento.valor_liquido.toFixed(2)}</td>
                      <td className="p-4">{getStatusBadge(pagamento.status)}</td>
                      <td className="p-4">
                        {pagamento.data_pagamento ? (
                          format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy', { locale: ptBR })
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {pagamento.status === 'pendente' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => marcarPagoMutation.mutate({ id: pagamento.id })}
                              disabled={marcarPagoMutation.isPending}
                            >
                              {marcarPagoMutation.isPending ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900"></div>
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          
                          {pagamento.comprovante && (
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
