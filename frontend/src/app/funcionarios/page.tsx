'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  Eye,
  EyeOff
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth'
import type { Funcionario, CreateFuncionarioRequest } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const funcionarioSchema = z.object({
  nome_completo: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  tipo: z.enum(['freelancer', 'fixo']),
  chave_pix: z.string().optional(),
  forma_pagamento: z.enum(['PIX', 'DINHEIRO']),
  cargo: z.string().optional(),
  valor_diaria: z.number().min(0, 'Valor deve ser positivo'),
})

type FuncionarioFormData = z.infer<typeof funcionarioSchema>

export default function FuncionariosPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('')
  const [showInactive, setShowInactive] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FuncionarioFormData>({
    resolver: zodResolver(funcionarioSchema),
  })

  const { data: funcionarios, isLoading } = useQuery<Funcionario[]>({
    queryKey: ['funcionarios', { search, tipo: tipoFilter, ativo: !showInactive }],
    queryFn: () => api.getFuncionarios({ 
      busca: search, 
      tipo: tipoFilter, 
      ativo: !showInactive 
    }).then(res => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateFuncionarioRequest) => api.createFuncionario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] })
      setIsDialogOpen(false)
      reset()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateFuncionarioRequest> }) => 
      api.updateFuncionario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] })
      setIsDialogOpen(false)
      setEditingFuncionario(null)
      reset()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteFuncionario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] })
    },
  })

  const onSubmit = (data: FuncionarioFormData) => {
    if (editingFuncionario) {
      updateMutation.mutate({ id: editingFuncionario.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario)
    reset(funcionario)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingFuncionario(null)
    reset()
    setIsDialogOpen(true)
  }

  const filteredFuncionarios = funcionarios?.filter(func => 
    func.nome_completo.toLowerCase().includes(search.toLowerCase()) &&
    (tipoFilter ? func.tipo === tipoFilter : true) &&
    (showInactive ? true : func.ativo)
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
          <p className="text-gray-600">
            Gerencie os funcionários da sua empresa
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
              </DialogTitle>
              <DialogDescription>
                {editingFuncionario ? 'Atualize os dados do funcionário' : 'Cadastre um novo funcionário no sistema'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo</Label>
                <Input
                  id="nome_completo"
                  placeholder="João Silva"
                  {...register('nome_completo')}
                />
                {errors.nome_completo && (
                  <p className="text-sm text-red-600">{errors.nome_completo.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={watch('tipo') || ''} onValueChange={(value: 'freelancer' | 'fixo') => setValue('tipo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="fixo">Fixo</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && (
                    <p className="text-sm text-red-600">{errors.tipo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
                  <Select value={watch('forma_pagamento') || ''} onValueChange={(value: 'PIX' | 'DINHEIRO') => setValue('forma_pagamento', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.forma_pagamento && (
                    <p className="text-sm text-red-600">{errors.forma_pagamento.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chave_pix">Chave PIX</Label>
                <Input
                  id="chave_pix"
                  placeholder="joao@email.com"
                  {...register('chave_pix')}
                />
                {errors.chave_pix && (
                  <p className="text-sm text-red-600">{errors.chave_pix.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  placeholder="Desenvolvedor"
                  {...register('cargo')}
                />
                {errors.cargo && (
                  <p className="text-sm text-red-600">{errors.cargo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_diaria">Valor Diária (R$)</Label>
                <Input
                  id="valor_diaria"
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  {...register('valor_diaria', { valueAsNumber: true })}
                />
                {errors.valor_diaria && (
                  <p className="text-sm text-red-600">{errors.valor_diaria.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {editingFuncionario ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                  placeholder="Buscar funcionário..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="freelancer">Freelancers</SelectItem>
                <SelectItem value="fixo">Fixos</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showInactive ? "default" : "outline"}
              onClick={() => setShowInactive(!showInactive)}
              className="w-[180px]"
            >
              {showInactive ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Ativos
                </>
              ) : (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Todos
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Funcionários List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {filteredFuncionarios?.length || 0} funcionários encontrados
          </CardTitle>
          <CardDescription>
            {showInactive ? 'Mostrando todos os funcionários' : 'Mostrando apenas funcionários ativos'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredFuncionarios?.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum funcionário encontrado</h3>
              <p className="text-gray-500">
                {search ? 'Tente ajustar os filtros ou busca.' : 'Cadastre seu primeiro funcionário.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFuncionarios?.map((funcionario) => (
                <div key={funcionario.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {funcionario.nome_completo.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{funcionario.nome_completo}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Badge variant="secondary" className="capitalize">
                          {funcionario.tipo}
                        </Badge>
                        <span>•</span>
                        <span>{funcionario.cargo || 'Sem cargo'}</span>
                        <span>•</span>
                        <span>{funcionario.forma_pagamento}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        R$ {funcionario.valor_diaria.toFixed(2)}/dia
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={funcionario.ativo ? "default" : "secondary"}>
                      {funcionario.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(funcionario)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(funcionario.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
