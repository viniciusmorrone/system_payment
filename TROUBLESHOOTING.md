# 🔧 Troubleshooting - Erros Comuns de Deploy

## 🚨 Erros Vercel

### Erro: "Build failed" ou "Command failed"

**Sintomas:**
```
Error: Command "npm run build" exited with 1
```

**Soluções:**

1. **Verificar Root Directory**
   ```
   Vercel Dashboard → Settings → General
   Root Directory: frontend
   ```

2. **Verificar Build Command**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Verificar Node Version**
   ```json
   // frontend/package.json
   "engines": {
     "node": ">=18.0.0",
     "npm": ">=9.0.0"
   }
   ```

4. **Limpar Cache**
   ```
   Vercel Dashboard → Deployments → [Deployment] → Redeploy
   ✅ Clear build cache and deploy
   ```

---

### Erro: "Module not found" ou "Cannot find module"

**Sintomas:**
```
Error: Cannot find module '@/components/ui/button'
Module not found: Can't resolve '@/lib/utils'
```

**Soluções:**

1. **Verificar tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **Reinstalar dependências**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verificar imports**
   ```typescript
   // ✅ Correto
   import { Button } from '@/components/ui/button'
   
   // ❌ Errado
   import { Button } from 'components/ui/button'
   ```

---

### Erro: "NEXT_PUBLIC_API_URL is undefined"

**Sintomas:**
```
TypeError: Cannot read property 'NEXT_PUBLIC_API_URL' of undefined
Network Error: Failed to fetch
```

**Soluções:**

1. **Configurar no Vercel Dashboard**
   ```
   Settings → Environment Variables
   
   Name: NEXT_PUBLIC_API_URL
   Value: https://seu-backend.railway.app
   
   ✅ Production
   ✅ Preview  
   ✅ Development
   ```

2. **Verificar código**
   ```typescript
   // ✅ Correto
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
   
   // ❌ Errado
   const API_URL = process.env.API_URL
   ```

3. **Redeploy após configurar**
   ```
   Vercel → Deployments → Redeploy
   ```

---

### Erro: "CORS policy" ou "Access-Control-Allow-Origin"

**Sintomas:**
```
Access to fetch at 'https://backend.railway.app/api/v1/auth/login' 
from origin 'https://seu-app.vercel.app' has been blocked by CORS policy
```

**Soluções:**

1. **Configurar CORS no Backend (Railway)**
   ```bash
   # Railway → Variables
   ALLOWED_ORIGINS=https://seu-app.vercel.app,http://localhost:3000
   ```

2. **Verificar backend/app/core/config.py**
   ```python
   def __init__(self, **kwargs):
       super().__init__(**kwargs)
       cors_env = os.getenv("ALLOWED_ORIGINS")
       if cors_env:
           self.CORS_ORIGINS = [origin.strip() for origin in cors_env.split(",")]
   ```

3. **Verificar backend/app/main.py**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=settings.CORS_ORIGINS,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

4. **Redeploy backend no Railway**

---

## 🚂 Erros Railway

### Erro: "Build failed" ou "Deployment failed"

**Sintomas:**
```
Error: failed to solve: failed to compute cache key
```

**Soluções:**

1. **Verificar Dockerfile**
   ```dockerfile
   # Deve estar em backend/Dockerfile
   FROM python:3.12-slim
   WORKDIR /app
   # ... resto do Dockerfile
   ```

2. **Verificar railway.json**
   ```json
   {
     "build": {
       "builder": "DOCKERFILE",
       "dockerfilePath": "backend/Dockerfile"
     }
   }
   ```

3. **Limpar e Redeploy**
   ```
   Railway → Settings → Clear Build Cache
   Railway → Deployments → Redeploy
   ```

---

### Erro: "Database connection failed"

**Sintomas:**
```
sqlalchemy.exc.OperationalError: could not connect to server
Connection refused
```

**Soluções:**

1. **Verificar DATABASE_URL**
   ```bash
   # Railway → PostgreSQL → Connect → Copy DATABASE_URL
   # Formato correto:
   postgresql+asyncpg://postgres:password@host:port/railway
   ```

2. **Adicionar ao Backend**
   ```
   Railway → Backend Service → Variables
   DATABASE_URL=postgresql+asyncpg://...
   ```

3. **Verificar SSL (Supabase)**
   ```python
   # backend/alembic/env.py
   connect_args = {}
   if "supabase" in url:
       import ssl
       ssl_context = ssl.create_default_context()
       connect_args["ssl"] = ssl_context
   ```

---

### Erro: "Migrations not applied"

**Sintomas:**
```
sqlalchemy.exc.ProgrammingError: relation "usuarios" does not exist
```

**Soluções:**

1. **Executar migrations manualmente**
   ```bash
   # Via Railway CLI
   railway run alembic upgrade head
   ```

2. **Ou usar start.sh (automático)**
   ```bash
   # backend/start.sh já executa:
   alembic upgrade head
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Verificar Dockerfile**
   ```dockerfile
   # Deve usar start.sh
   CMD ["/app/start.sh"]
   ```

---

### Erro: "Port already in use"

**Sintomas:**
```
Error: Address already in use
OSError: [Errno 98] Address already in use
```

**Soluções:**

1. **Usar variável $PORT do Railway**
   ```python
   # backend/app/main.py ou start.sh
   uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
   ```

2. **Verificar Dockerfile**
   ```dockerfile
   CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
   ```

---

## 🔐 Erros de Autenticação

### Erro: "Invalid token" ou "Token expired"

**Sintomas:**
```
401 Unauthorized
{"detail": "Could not validate credentials"}
```

**Soluções:**

1. **Verificar SECRET_KEY**
   ```bash
   # Railway → Variables
   SECRET_KEY=seu-secret-key-super-seguro-aqui
   ```

2. **Verificar expiração do token**
   ```bash
   # Railway → Variables
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

3. **Limpar localStorage no frontend**
   ```javascript
   // No console do navegador
   localStorage.clear()
   ```

---

### Erro: "CORS credentials"

**Sintomas:**
```
Access to fetch has been blocked by CORS policy: 
The value of the 'Access-Control-Allow-Credentials' header is ''
```

**Soluções:**

1. **Verificar CORS no backend**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_credentials=True,  # ✅ Importante!
       allow_origins=settings.CORS_ORIGINS,
   )
   ```

2. **Verificar fetch no frontend**
   ```typescript
   axios.create({
     baseURL: API_BASE_URL,
     withCredentials: true,  // ✅ Importante!
   })
   ```

---

## 📊 Verificação de Logs

### Vercel Logs

```
Vercel Dashboard → Deployments → [Deployment] → View Function Logs
```

### Railway Logs

```
Railway Dashboard → Deployments → [Deployment] → View Logs
```

### Comandos úteis

```bash
# Ver logs em tempo real (Railway CLI)
railway logs

# Ver logs do build
railway logs --build

# Ver logs do deploy
railway logs --deployment
```

---

## ✅ Checklist de Deploy

### Frontend (Vercel)

- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] `NEXT_PUBLIC_API_URL` configurado
- [ ] Build concluído com sucesso
- [ ] Aplicação acessível

### Backend (Railway)

- [ ] PostgreSQL criado
- [ ] `DATABASE_URL` configurado
- [ ] `SECRET_KEY` configurado
- [ ] `ALLOWED_ORIGINS` configurado
- [ ] Migrations executadas
- [ ] API respondendo em `/docs`
- [ ] CORS funcionando

### Integração

- [ ] Login funcionando
- [ ] Requisições à API funcionando
- [ ] Dados carregando corretamente
- [ ] CRUD funcionando

---

## 🆘 Ainda com problemas?

1. **Verifique os logs** (Vercel e Railway)
2. **Teste localmente** primeiro
3. **Verifique variáveis de ambiente**
4. **Limpe cache** e redeploy
5. **Consulte documentação oficial**

---

## 📚 Recursos Úteis

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Alembic Docs](https://alembic.sqlalchemy.org/)

---

**Boa sorte! 🚀**
