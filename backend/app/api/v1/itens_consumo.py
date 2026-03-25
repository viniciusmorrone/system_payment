from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_gestor
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/itens-consumo")
async def listar_itens_consumo(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Listar itens do catálogo da empresa"""
    return {"message": "Endpoint em desenvolvimento"}


@router.post("/itens-consumo", status_code=status.HTTP_201_CREATED)
async def criar_item_consumo(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Criar item no catálogo"""
    return {"message": "Endpoint em desenvolvimento"}


@router.put("/itens-consumo/{item_id}")
async def atualizar_item_consumo(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Atualizar nome ou preço"""
    return {"message": "Endpoint em desenvolvimento"}


@router.patch("/itens-consumo/{item_id}/status")
async def alterar_status_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Ativar ou desativar item"""
    return {"message": "Endpoint em desenvolvimento"}
