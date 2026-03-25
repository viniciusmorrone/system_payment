from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_gestor
from app.models.usuario import Usuario

router = APIRouter()


@router.get("/pagamentos")
async def listar_pagamentos(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Listar pagamentos com filtros de status e semana"""
    return {"message": "Endpoint em desenvolvimento"}


@router.get("/pagamentos/{pagamento_id}")
async def detalhar_pagamento(
    pagamento_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_active_user)
):
    """Detalhe com presenças e descontos"""
    return {"message": "Endpoint em desenvolvimento"}


@router.patch("/pagamentos/{pagamento_id}/pagar")
async def marcar_pago(
    pagamento_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Marcar como pago com comprovante"""
    return {"message": "Endpoint em desenvolvimento"}


@router.post("/pagamentos/pagar-lote")
async def marcar_pagos_lote(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Marcar múltiplos como pagos"""
    return {"message": "Endpoint em desenvolvimento"}


@router.patch("/pagamentos/{pagamento_id}/cancelar")
async def cancelar_pagamento(
    pagamento_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(require_gestor)
):
    """Cancelar pagamento"""
    return {"message": "Endpoint em desenvolvimento"}
