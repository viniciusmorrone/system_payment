'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Calendar, 
  Lock, 
  Unlock,
  Users,
  DollarSign,
  CheckCircle
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth'
import type { Semana, CreateSemanaRequest } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const semanaSchema = z.object({
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().min(1, 'Data de fim é obrigatória'),
}).refine((data) => new Date(data.data_fim) >= new Date(data.data_inicio), {
  message: "Data fim deve ser maior ou igual à data início",
  path: ["data_fim"],
})

type SemanaFormData = z.infer<typeof semanaSchema>

export default function SemanasPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SemanaFormData>({
    resolver: zodResolver(semanaSchema),
  })

  const { data: semanas, isLoading } = useQuery<Semana[]>({
    queryKey: ['semanas'],
    queryFn: () => api.getSemanas().then(res => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateSemanaRequest) => api.createSemana(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semanas'] })
      setIsDialogOpen(false)
      reset()
    },
  })

  const encerrarMutation = useMutation({
    mutationFn: (id: number) => api.encerrarSemana(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semanas'] })
    },
  })

  const onSubmit = (data: SemanaFormData) => {
    createMutation.mutate(data)
  }

  const getStatusBadge = (encerrada: boolean) => (
    <Badge variant={encerrada ? "secondary" : "default"}>
      {encerrada ? (
        <>
          <Lock className="mr-1 h-3 w-3" />
          Encerrada
        </>
      ) : (
        <>
          <Unlock className="mr-1 h-3 w-3" />
          Aberta
        </>
      )}
    </Badge>
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
          <h1 className="text-3xl font-bold text-gray-900">Semanas</h1>
          <p className="text-gray-600">
            Gerencie as semanas de trabalho e pagamentos
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Semana
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Semana</DialogTitle>
              <DialogDescription>
                Crie uma nova semana para registrar presenças e calcular pagamentos
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de Início</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  {...register('data_inicio')}
                />
                {errors.data_inicio && (
                  <p className="text-sm text-red-600">{errors.data_inicio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data de Fim</Label>
                <Input
                  id="data_fim"
                  type="date"
                  {...register('data_fim')}
                />
                {errors.data_fim && (
                  <p className="text-sm text-red-600">{errors.data_fim.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  Criar Semana
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Semanas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : semanas?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma semana encontrada</h3>
            <p className="text-gray-500">Crie sua primeira semana para começar.</p>
          </div>
        ) : (
          semanas?.map((semana) => (
            <Card key={semana.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Semana {format(new Date(semana.data_inicio), 'dd/MM', { locale: ptBR })}
                  </CardTitle>
                  {getStatusBadge(semana.encerrada)}
                </div>
                <CardDescription>
                  {format(new Date(semana.data_inicio), 'dd MMM', { locale: ptBR })} - {' '}
                  {format(new Date(semana.data_fim), 'dd MMM yyyy', { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {Math.ceil((new Date(semana.data_fim).getTime() - new Date(semana.data_inicio).getTime()) / (1000 * 60 * 60 * 24))} dias
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Funcionários
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Pagamentos
                  </span>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={`/semanas/${semana.id}`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Gerenciar Presenças
                    </a>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={`/pagamentos?semana_id=${semana.id}`}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Ver Pagamentos
                    </a>
                  </Button>
                  
                  {!semana.encerrada && (
                    <Button 
                      variant="default" 
                      className="w-full justify-start"
                      onClick={() => encerrarMutation.mutate(semana.id)}
                      disabled={encerrarMutation.isPending}
                    >
                      {encerrarMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Lock className="mr-2 h-4 w-4" />
                      )}
                      Encerrar Semana
                    </Button>
                  )}
                  
                  {semana.encerrada && (
                    <div className="flex items-center justify-center w-full text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Semana encerrada e processada
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
