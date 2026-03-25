from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_gestor
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/")
async def listar_semanas(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Listar semanas com resumo de valores"""
    return {"message": "Endpoint em desenvolvimento"}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def criar_semana(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Criar nova semana de controle"""
    return {"message": "Endpoint em desenvolvimento"}


@router.get("/{semana_id}")
async def detalhar_semana(
    semana_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Detalhe da semana com tabela completa"""
    return {"message": "Endpoint em desenvolvimento"}


@router.post("/{semana_id}/encerrar")
async def encerrar_semana(
    semana_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Encerrar semana e gerar pagamentos"""
    return {"message": "Endpoint em desenvolvimento"}
