from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# Base schemas
class UserBase(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    email: EmailStr


class EmpresaBase(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    email_contato: EmailStr


# Request schemas
class RegisterRequest(BaseModel):
    empresa: EmpresaBase
    usuario: UserBase
    senha: str = Field(..., min_length=6, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# Response schemas
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    id: int
    nome: str
    email: str
    role: str
    ativo: bool
    empresa_id: int

    class Config:
        from_attributes = True


class EmpresaResponse(BaseModel):
    id: int
    nome: str
    email_contato: str
    plano: str
    ativo: bool

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    usuario: UserResponse
    empresa: EmpresaResponse
    tokens: TokenResponse


# Token payload
class TokenPayload(BaseModel):
    user_id: Optional[int] = None
    empresa_id: Optional[int] = None
    role: Optional[str] = None
    type: Optional[str] = None
