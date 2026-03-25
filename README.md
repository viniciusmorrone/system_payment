# Sistema de Controle de Pagamentos & Freelancers

## Visão Geral

Sistema completo para controle de pagamentos e gestão de freelancers, desenvolvido com arquitetura moderna e isolamento multi-tenant.

## Stack Tecnológico

### Backend
- **Python 3.12** com FastAPI
- **SQLAlchemy 2** + Alembic para ORM e migrações
- **PostgreSQL 16** (Supabase em produção)
- **JWT** para autenticação via Supabase Auth
- **Pydantic v2** para validação de dados

### Frontend
- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes UI
- **TanStack Query** para gerenciamento de estado assíncrono

### Infraestrutura
- **Docker** para desenvolvimento local
- **Railway** para deploy do backend
- **Vercel** para deploy do frontend
- **GitHub Actions** para CI/CD

## Estrutura do Projeto

```
projeto_point/
├── backend/          # API FastAPI
├── frontend/         # App Next.js
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Como Rodar Localmente

### Pré-requisitos
- Docker e Docker Compose

### Com Docker
```bash
# Clone o repositório
git clone <repositório-url>
cd projeto_point

# Inicie os serviços
docker-compose up -d

# Acesse os serviços
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# pgAdmin: http://localhost:5050
```

### Sem Docker (Desenvolvimento)
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

## Variáveis de Ambiente

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Comandos Úteis

### Backend
```bash
# Criar migração
alembic revision --autogenerate -m "Descrição da migração"

# Aplicar migrações
alembic upgrade head

# Reverter migração
alembic downgrade -1

# Rodar testes
pytest

# Verificar documentação
# http://localhost:8000/docs (Swagger)
# http://localhost:8000/redoc (ReDoc)
```

### Frontend
```bash
# Build para produção
npm run build

# Rodar testes
npm test

# Lint
npm run lint
```

## Documentação da API

A documentação automática é gerada pelo FastAPI:
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI JSON**: `/openapi.json`

## Deploy em Produção

### Backend (Railway)
1. Conectar repositório GitHub ao Railway
2. Configurar variáveis de ambiente
3. Rodar `alembic upgrade head` no primeiro deploy

### Frontend (Vercel)
1. Conectar repositório GitHub ao Vercel
2. Configurar `NEXT_PUBLIC_API_URL` para o URL do Railway
3. Deploy automático a cada push em main

## Funcionalidades Principais

- ✅ Autenticação com JWT e refresh tokens
- ✅ Sistema multi-tenant completo
- ✅ Gestão de funcionários (freelancers e fixos)
- ✅ Controle de presenças semanal
- ✅ Sistema de descontos e catálogo de itens
- ✅ Cálculo automático de pagamentos
- ✅ Dashboard com métricas financeiras
- ✅ Relatórios detalhados
- ✅ Controle de acesso por roles (RBAC)

## Licença

MIT License
