# 🚀 Guia de Deploy - Vercel + Railway

## 📋 Pré-requisitos

- Conta Vercel (https://vercel.com)
- Conta Railway (https://railway.app)
- Repositório GitHub configurado

## 🎯 Arquitetura do Deploy

```
┌─────────────────┐         ┌──────────────────┐
│                 │         │                  │
│  Vercel         │ ──────► │  Railway         │
│  (Frontend)     │  API    │  (Backend + DB)  │
│  Next.js 14     │         │  FastAPI + PG    │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
```

---

## 🔧 Parte 1: Deploy do Backend (Railway)

### 1.1 Configurar Railway

1. Acesse https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório: `viniciusmorrone/system_payment`
5. Railway detectará automaticamente o Dockerfile

### 1.2 Configurar Variáveis de Ambiente

No painel Railway, adicione as seguintes variáveis:

```bash
# Database (Railway PostgreSQL)
DATABASE_URL=postgresql+asyncpg://postgres:password@host:5432/railway

# Security
SECRET_KEY=seu-secret-key-super-seguro-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (adicione o domínio Vercel)
ALLOWED_ORIGINS=https://seu-app.vercel.app,http://localhost:3000

# Supabase (opcional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 1.3 Adicionar PostgreSQL

1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database"** → **"PostgreSQL"**
3. Railway criará automaticamente o banco
4. Copie a **DATABASE_URL** gerada
5. Atualize a variável `DATABASE_URL` no backend

### 1.4 Executar Migrações

Após o deploy, execute as migrações:

```bash
# Via Railway CLI ou no painel
railway run alembic upgrade head
```

Ou configure um script de inicialização no `Dockerfile`:

```dockerfile
# Adicione antes do CMD
RUN echo '#!/bin/sh\nalembic upgrade head\nuvicorn app.main:app --host 0.0.0.0 --port $PORT' > /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]
```

### 1.5 Verificar Deploy

1. Railway fornecerá uma URL: `https://seu-backend.railway.app`
2. Teste: `https://seu-backend.railway.app/docs`
3. Verifique se a API está respondendo

---

## 🎨 Parte 2: Deploy do Frontend (Vercel)

### 2.1 Configurar Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em **"Add New"** → **"Project"**
3. Importe o repositório: `viniciusmorrone/system_payment`

### 2.2 Configurações de Build

Configure no painel Vercel:

```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 2.3 Configurar Variáveis de Ambiente

No painel Vercel → Settings → Environment Variables:

```bash
# API URL (Railway)
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app

# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**IMPORTANTE**: Marque todas as variáveis para:
- ✅ Production
- ✅ Preview
- ✅ Development

### 2.4 Deploy

1. Clique em **"Deploy"**
2. Vercel buildará automaticamente
3. URL gerada: `https://seu-app.vercel.app`

---

## 🔄 Parte 3: Configurar CORS no Backend

Atualize o backend para aceitar requisições do Vercel:

```python
# backend/app/main.py

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://seu-app.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Ou use variável de ambiente:

```python
import os

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## ✅ Parte 4: Verificação Final

### 4.1 Checklist Backend (Railway)

- [ ] PostgreSQL criado e conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações executadas (`alembic upgrade head`)
- [ ] API respondendo em `/docs`
- [ ] CORS configurado para Vercel

### 4.2 Checklist Frontend (Vercel)

- [ ] Build concluído com sucesso
- [ ] `NEXT_PUBLIC_API_URL` configurado
- [ ] Aplicação acessível
- [ ] Login funcionando
- [ ] Requisições à API funcionando

### 4.3 Testar Integração

1. Acesse: `https://seu-app.vercel.app`
2. Tente fazer login
3. Verifique se os dados carregam
4. Teste CRUD de funcionários/pagamentos

---

## 🐛 Troubleshooting

### Erro: "CORS policy"

**Solução**: Adicione o domínio Vercel no CORS do backend

```python
allow_origins=["https://seu-app.vercel.app"]
```

### Erro: "Network Error" ou "Failed to fetch"

**Solução**: Verifique se `NEXT_PUBLIC_API_URL` está correto

```bash
# Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
```

### Erro: Build falhou na Vercel

**Solução**: Verifique os logs de build:

```bash
# Comandos comuns de erro:
npm install  # Instalar dependências
npm run build  # Build do Next.js
```

### Erro: Database connection failed

**Solução**: Verifique a `DATABASE_URL` no Railway:

```bash
# Formato correto:
postgresql+asyncpg://user:password@host:port/database
```

### Erro: Migrations não executadas

**Solução**: Execute manualmente via Railway CLI:

```bash
railway run alembic upgrade head
```

---

## 🔐 Segurança

### Variáveis Sensíveis

**NUNCA** commite:
- `.env`
- `.env.local`
- `.env.production`
- Chaves de API
- Senhas de banco

### Configurar no Painel

Sempre configure variáveis sensíveis nos painéis:
- **Railway**: Settings → Variables
- **Vercel**: Settings → Environment Variables

---

## 🚀 Deploy Automático

### Configurar CI/CD

O deploy é automático quando você faz push:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

**Railway**: Deploy automático do backend
**Vercel**: Deploy automático do frontend

---

## 📊 Monitoramento

### Railway

- Logs: Railway Dashboard → Deployments → Logs
- Métricas: CPU, RAM, Network

### Vercel

- Analytics: Vercel Dashboard → Analytics
- Logs: Vercel Dashboard → Deployments → Logs

---

## 🎯 Próximos Passos

1. [ ] Configurar domínio customizado
2. [ ] Adicionar SSL/TLS (automático na Vercel)
3. [ ] Configurar backups do PostgreSQL
4. [ ] Implementar monitoramento (Sentry, LogRocket)
5. [ ] Configurar CI/CD avançado (GitHub Actions)

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs (Railway e Vercel)
2. Consulte a documentação
3. Abra uma issue no GitHub

**Boa sorte com o deploy! 🚀**
