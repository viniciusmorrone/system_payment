from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    create_refresh_token,
    verify_token
)
from app.core.config import settings
from app.models.empresa import Empresa
from app.models.usuario import Usuario
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    RefreshTokenRequest,
    AuthResponse,
    TokenResponse,
    UserResponse,
    EmpresaResponse
)

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """Cadastro de empresa + usuário admin"""
    
    # Verificar se e-mail já existe
    stmt = select(Usuario).where(Usuario.email == request.usuario.email)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="E-mail já cadastrado"
        )
    
    try:
        # Criar empresa
        empresa = Empresa(
            nome=request.empresa.nome,
            email_contato=request.empresa.email_contato,
            plano="free",
            ativo=True
        )
        db.add(empresa)
        await db.flush()  # Obter ID da empresa
        
        # Criar usuário admin
        usuario = Usuario(
            empresa_id=empresa.id,
            nome=request.usuario.nome,
            email=request.usuario.email,
            senha_hash=get_password_hash(request.senha),
            role="admin",
            ativo=True
        )
        db.add(usuario)
        await db.commit()
        await db.refresh(usuario)
        await db.refresh(empresa)
        
        # Gerar tokens
        access_token = create_access_token(
            data={
                "user_id": usuario.id,
                "empresa_id": empresa.id,
                "role": usuario.role
            }
        )
        refresh_token = create_refresh_token(
            data={
                "user_id": usuario.id,
                "empresa_id": empresa.id,
                "role": usuario.role
            }
        )
        
        return AuthResponse(
            usuario=UserResponse.model_validate(usuario),
            empresa=EmpresaResponse.model_validate(empresa),
            tokens=TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            )
        )
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar conta"
        )


@router.post("/login", response_model=AuthResponse)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Login com e-mail e senha"""
    
    # Buscar usuário
    stmt = select(Usuario).where(
        Usuario.email == request.email,
        Usuario.ativo == True
    )
    result = await db.execute(stmt)
    usuario = result.scalar_one_or_none()
    
    if not usuario or not verify_password(request.senha, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos"
        )
    
    # Buscar empresa
    stmt_empresa = select(Empresa).where(Empresa.id == usuario.empresa_id)
    result_empresa = await db.execute(stmt_empresa)
    empresa = result_empresa.scalar_one()
    
    if not empresa.ativo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Empresa inativa"
        )
    
    # Gerar tokens
    access_token = create_access_token(
        data={
            "user_id": usuario.id,
            "empresa_id": empresa.id,
            "role": usuario.role
        }
    )
    refresh_token = create_refresh_token(
        data={
            "user_id": usuario.id,
            "empresa_id": empresa.id,
            "role": usuario.role
        }
    )
    
    return AuthResponse(
        usuario=UserResponse.model_validate(usuario),
        empresa=EmpresaResponse.model_validate(empresa),
        tokens=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Renovar access token via refresh token"""
    
    payload = verify_token(request.refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido"
        )
    
    user_id = payload.get("user_id")
    empresa_id = payload.get("empresa_id")
    role = payload.get("role")
    
    # Verificar se usuário ainda existe e está ativo
    stmt = select(Usuario).where(
        Usuario.id == user_id,
        Usuario.empresa_id == empresa_id,
        Usuario.ativo == True
    )
    result = await db.execute(stmt)
    usuario = result.scalar_one_or_none()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado"
        )
    
    # Gerar novo access token
    access_token = create_access_token(
        data={
            "user_id": user_id,
            "empresa_id": empresa_id,
            "role": role
        }
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=request.refresh_token,  # Mantém o mesmo refresh token
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/logout")
async def logout():
    """Logout - invalida refresh token (implementação futura)"""
    return {"message": "Logout realizado com sucesso"}
