from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1 import auth, funcionarios, semanas, presencas, descontos, pagamentos, itens_consumo, usuarios, dashboard, relatorios

app = FastAPI(
    title="Sistema de Controle de Pagamentos & Freelancers",
    description="API para gestão de pagamentos e freelancers com arquitetura multi-tenant",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas da API v1
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(funcionarios.router, prefix="/api/v1/funcionarios", tags=["funcionários"])
app.include_router(semanas.router, prefix="/api/v1/semanas", tags=["semanas"])
app.include_router(presencas.router, prefix="/api/v1/presencas", tags=["presenças"])
app.include_router(descontos.router, prefix="/api/v1/descontos", tags=["descontos"])
app.include_router(pagamentos.router, prefix="/api/v1/pagamentos", tags=["pagamentos"])
app.include_router(itens_consumo.router, prefix="/api/v1/itens-consumo", tags=["itens de consumo"])
app.include_router(usuarios.router, prefix="/api/v1/usuarios", tags=["usuários"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(relatorios.router, prefix="/api/v1/relatorios", tags=["relatórios"])


@app.get("/")
async def root():
    return {
        "message": "Sistema de Controle de Pagamentos & Freelancers",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
