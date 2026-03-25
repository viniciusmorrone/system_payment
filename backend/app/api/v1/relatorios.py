from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/relatorios/semana/{semana_id}")
async def relatorio_semana(
    semana_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Relatório completo da semana"""
    return {"message": "Endpoint em desenvolvimento"}


@router.get("/relatorios/funcionario/{funcionario_id}")
async def relatorio_funcionario(
    funcionario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Histórico completo de pagamentos"""
    return {"message": "Endpoint em desenvolvimento"}
