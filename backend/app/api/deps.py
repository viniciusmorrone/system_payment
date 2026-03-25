from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import verify_token
from app.models.usuario import Usuario

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Usuario:
    """Dependency para obter usuário atual a partir do token JWT"""
    
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id: int = payload.get("user_id")
    empresa_id: int = payload.get("empresa_id")
    role: str = payload.get("role")
    token_type: str = payload.get("type")
    
    if token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tipo de token inválido",
        )
    
    if not user_id or not empresa_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token incompleto",
        )
    
    # Buscar usuário no banco
    stmt = select(Usuario).where(
        Usuario.id == user_id,
        Usuario.empresa_id == empresa_id,
        Usuario.ativo == True
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado",
        )
    
    return user


async def get_current_active_user(
    current_user: Usuario = Depends(get_current_user),
) -> Usuario:
    """Verifica se o usuário está ativo"""
    if not current_user.ativo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário inativo"
        )
    return current_user


def require_role(required_role: str):
    """Decorator para verificar role do usuário"""
    def role_checker(current_user: Usuario = Depends(get_current_active_user)) -> Usuario:
        if current_user.role != "admin" and current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissão insuficiente"
            )
        return current_user
    return role_checker


# Role dependencies
require_admin = require_role("admin")
require_gestor = require_role("gestor")
require_viewer = require_role("viewer")  # Para consistência, todos podem acessar endpoints de leitura
