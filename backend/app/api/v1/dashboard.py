from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Resumo financeiro da semana atual"""
    return {"message": "Endpoint em desenvolvimento"}
