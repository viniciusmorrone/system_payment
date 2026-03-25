# 🚀 Deployment Guide

This guide covers deploying the Sistema de Controle de Pagamentos & Freelancers to production.

## 📋 Prerequisites

1. **GitHub Repository** with all code pushed
2. **Railway Account** for backend deployment
3. **Vercel Account** for frontend deployment
4. **Domain** (optional) for custom URLs

## 🔧 Required Secrets

### GitHub Repository Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions and add:

### Backend Secrets
- `RAILWAY_TOKEN`: Your Railway API token
- `RAILWAY_SERVICE_NAME`: Your Railway service name (e.g., `projeto-point-backend`)

### Frontend Secrets  
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `NEXT_PUBLIC_API_URL`: Production backend URL (after Railway deployment)

## 🚀 Backend Deployment (Railway)

### Option 1: Automatic via GitHub Actions
1. Push to `main` branch
2. GitHub Actions will automatically deploy to Railway
3. Monitor deployment in GitHub Actions tab

### Option 2: Manual via Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd backend
railway up
```

### Railway Configuration
- **Environment**: PostgreSQL 16
- **Build Command**: `pip install -e . && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Port**: 8000

## 🌐 Frontend Deployment (Vercel)

### Option 1: Automatic via GitHub Actions
1. Push to `main` branch
2. GitHub Actions will automatically deploy to Vercel
3. Monitor deployment in GitHub Actions tab

### Option 2: Manual via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

### Vercel Configuration
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`

## 🔗 Environment Variables

### Production Backend (.env)
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/database
SECRET_KEY=your-super-secret-production-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=https://yourdomain.com
ENVIRONMENT=production
DEBUG=false
```

### Production Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## 📊 Monitoring

### Railway Dashboard
- Application logs
- Resource usage
- Error tracking
- Deployment history

### Vercel Dashboard  
- Build logs
- Performance metrics
- Error tracking
- Analytics
- Deployment history

## 🔄 CI/CD Pipeline

### Workflow Triggers
- **Push to main**: Runs tests and deploys
- **Pull requests**: Runs tests only
- **Manual workflow dispatch**: Available for testing

### Quality Gates
- Tests must pass (pytest/Vitest)
- Code quality checks must pass (Ruff/ESLint)
- Type checking must pass (MyPy/TypeScript)
- Coverage reports generated automatically

## 🌍 Custom Domain Setup

### Railway (Backend)
1. Go to Railway project settings
2. Add custom domain
3. Configure DNS records as instructed
4. Update CORS_ORIGINS in backend environment

### Vercel (Frontend)
1. Go to Vercel project settings
2. Add custom domain
3. Configure DNS records as instructed
4. Update NEXT_PUBLIC_API_URL if needed

## 🔐 Security Considerations

### Production Checklist
- [ ] Change default secrets
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS properly
- [ ] Set up monitoring alerts
- [ ] Review environment variables
- [ ] Test all critical flows
- [ ] Set up backup strategy

### API Security
- JWT tokens with proper expiration
- Rate limiting considerations
- Input validation everywhere
- SQL injection prevention
- HTTPS enforcement

## 🚨 Troubleshooting

### Common Issues
1. **Build failures**: Check dependency versions
2. **Database connection**: Verify DATABASE_URL format
3. **CORS errors**: Check frontend/backend URL configuration
4. **Deployment timeouts**: Review build logs and resource limits

### Debug Commands
```bash
# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Local production testing
docker-compose -f docker-compose.prod.yml up
```

## 📞 Support

### Documentation Links
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

### Getting Help
- Check deployment logs first
- Review CI/CD pipeline status
- Test locally with production environment
- Monitor error tracking dashboards
