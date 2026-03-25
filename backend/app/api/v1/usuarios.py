from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_admin
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/usuarios")
async def listar_usuarios(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_admin)
):
    """Listar usuários da empresa (admin only)"""
    return {"message": "Endpoint em desenvolvimento"}


@router.post("/usuarios/convidar", status_code=status.HTTP_201_CREATED)
async def convidar_usuario(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_admin)
):
    """Convidar usuário por e-mail (admin only)"""
    return {"message": "Endpoint em desenvolvimento"}


@router.patch("/usuarios/{usuario_id}/role")
async def alterar_role_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_admin)
):
    """Alterar role do usuário (admin only)"""
    return {"message": "Endpoint em desenvolvimento"}


@router.patch("/usuarios/{usuario_id}/status")
async def alterar_status_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_admin)
):
    """Ativar ou desativar usuário (admin only)"""
    return {"message": "Endpoint em desenvolvimento"}
