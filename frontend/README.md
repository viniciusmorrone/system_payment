# Frontend - Sistema de Controle de Pagamentos

Aplicação Next.js 14 para gestão de pagamentos e freelancers com interface moderna e responsiva.

## Stack Tecnológico

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes UI
- **TanStack Query** para gerenciamento de estado assíncrono
- **Zustand** para estado global
- **React Hook Form** + **Zod** para formulários

## Setup Local

### Instalar dependências
```bash
npm install
```

### Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```

Configure as variáveis em `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Rodar a aplicação
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar build em produção
npm start

# Lint
npm run lint

# Tipo checking
npm run type-check
```

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                  # App Router
│   │   ├── (auth)/          # Rotas de autenticação
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── funcionarios/    # Gestão de funcionários
│   │   ├── pagamentos/      # Gestão de pagamentos
│   │   ├── semanas/         # Gestão de semanas
│   │   ├── configuracoes/   # Configurações da empresa
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── auth/            # Componentes de autenticação
│   │   ├── dashboard/       # Componentes do dashboard
│   │   ├── forms/           # Formulários reutilizáveis
│   │   └── layout/          # Componentes de layout
│   ├── lib/
│   │   ├── api.ts           # Cliente HTTP
│   │   ├── auth.ts          # Lógica de autenticação
│   │   ├── utils.ts         # Utilitários
│   │   └── validations.ts   # Validações Zod
│   ├── hooks/
│   │   ├── useAuth.ts       # Hook de autenticação
│   │   └── useApi.ts        # Hook genérico para API
│   ├── store/
│   │   └── authStore.ts     # Zustand store
│   └── types/
│       └── index.ts         # Tipos TypeScript
├── public/
├── components.json
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Funcionalidades Principais

- ✅ Autenticação com JWT e refresh tokens
- ✅ Dashboard com métricas financeiras
- ✅ Tabela interativa de controle semanal
- ✅ Gestão de funcionários com busca e filtros
- ✅ Sistema de pagamentos com status visual
- ✅ Relatórios detalhados
- ✅ Interface responsiva e moderna

## Deploy em Produção

### Vercel
1. Conectar repositório GitHub ao Vercel
2. Configurar `NEXT_PUBLIC_API_URL` para o URL do Railway
3. Deploy automático a cada push em main

### Variáveis de Ambiente em Produção
- `NEXT_PUBLIC_API_URL`: URL da API em produção
- `NEXT_PUBLIC_SUPABASE_URL`: URL do Supabase (se aplicável)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
