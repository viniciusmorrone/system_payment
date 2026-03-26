'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth'
import type { RegisterRequest } from '@/types'

const registerSchema = z.object({
  empresa: z.object({
    nome: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
    email_contato: z.string().email('E-mail inválido'),
  }),
  usuario: z.object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('E-mail inválido'),
  }),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não conferem",
  path: ["confirmarSenha"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const registerData: RegisterRequest = {
        empresa: data.empresa,
        usuario: data.usuario,
        senha: data.senha,
      }

      const response = await api.register(registerData)
      const { usuario, empresa, tokens } = response.data

      setAuth(usuario, empresa, tokens)
      router.push('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail 
        : 'Erro ao criar conta. Tente novamente.'
      
      setError(errorMessage || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Cadastre sua empresa e comece a usar o sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados da Empresa</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="empresa.nome">Nome da Empresa</Label>
                  <Input
                    id="empresa.nome"
                    placeholder="Sua Empresa Ltda"
                    {...register('empresa.nome')}
                  />
                  {errors.empresa?.nome && (
                    <p className="text-sm text-red-600">{errors.empresa.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa.email_contato">E-mail de Contato</Label>
                  <Input
                    id="empresa.email_contato"
                    type="email"
                    placeholder="contato@empresa.com"
                    {...register('empresa.email_contato')}
                  />
                  {errors.empresa?.email_contato && (
                    <p className="text-sm text-red-600">{errors.empresa.email_contato.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados do Administrador</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="usuario.nome">Seu Nome</Label>
                  <Input
                    id="usuario.nome"
                    placeholder="João Silva"
                    {...register('usuario.nome')}
                  />
                  {errors.usuario?.nome && (
                    <p className="text-sm text-red-600">{errors.usuario.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuario.email">Seu E-mail</Label>
                  <Input
                    id="usuario.email"
                    type="email"
                    placeholder="joao@empresa.com"
                    {...register('usuario.email')}
                  />
                  {errors.usuario?.email && (
                    <p className="text-sm text-red-600">{errors.usuario.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    {...register('senha')}
                  />
                  {errors.senha && (
                    <p className="text-sm text-red-600">{errors.senha.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmarSenha')}
                  />
                  {errors.confirmarSenha && (
                    <p className="text-sm text-red-600">{errors.confirmarSenha.message}</p>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Conta
              </Button>
              
              <div className="text-center text-sm">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-500">
                  Faça login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
