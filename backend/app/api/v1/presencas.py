from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_gestor
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/semanas/{semana_id}/presencas")
async def listar_presencas_semana(
    semana_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Listar presenças da semana"""
    return {"message": "Endpoint em desenvolvimento"}


@router.post("/semanas/{semana_id}/presencas")
async def registrar_presenca(
    semana_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Registrar presença de um funcionário"""
    return {"message": "Endpoint em desenvolvimento"}


@router.post("/semanas/{semana_id}/presencas/lote")
async def registrar_presencas_lote(
    semana_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Registrar semana inteira em lote (array)"""
    return {"message": "Endpoint em desenvolvimento"}


@router.put("/presencas/{presenca_id}")
async def atualizar_presenca(
    presenca_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Atualizar valor ou status de presença"""
    return {"message": "Endpoint em desenvolvimento"}


@router.delete("/presencas/{presenca_id}")
async def remover_presenca(
    presenca_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Remover presença (semana não encerrada)"""
    return {"message": "Endpoint em desenvolvimento"}
