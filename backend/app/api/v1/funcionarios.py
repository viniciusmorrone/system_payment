from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_gestor
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/")
async def listar_funcionarios(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Listar funcionários com filtros e busca"""
    return {"message": "Endpoint em desenvolvimento"}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def criar_funcionario(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Cadastrar funcionário"""
    return {"message": "Endpoint em desenvolvimento"}


@router.get("/{funcionario_id}")
async def detalhar_funcionario(
    funcionario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Detalhe com histórico de pagamentos"""
    return {"message": "Endpoint em desenvolvimento"}


@router.put("/{funcionario_id}")
async def atualizar_funcionario(
    funcionario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Atualizar dados do funcionário"""
    return {"message": "Endpoint em desenvolvimento"}


@router.patch("/{funcionario_id}/status")
async def alterar_status_funcionario(
    funcionario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Ativar ou desativar (soft delete)"""
    return {"message": "Endpoint em desenvolvimento"}
