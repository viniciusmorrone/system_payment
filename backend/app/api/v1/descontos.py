from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_gestor
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/funcionarios/{funcionario_id}/descontos")
async def listar_descontos_funcionario(
    funcionario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Listar descontos por funcionário e semana"""
    return {"message": "Endpoint em desenvolvimento"}


@router.post("/descontos")
async def registrar_desconto(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Registrar desconto (catálogo ou avulso)"""
    return {"message": "Endpoint em desenvolvimento"}


@router.delete("/descontos/{desconto_id}")
async def remover_desconto(
    desconto_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Remover desconto"""
    return {"message": "Endpoint em desenvolvimento"}
