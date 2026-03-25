from sqlalchemy import String, Boolean, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Usuario(Base):
    """Modelo de usuários com controle de acesso por roles"""
    
    __tablename__ = "usuarios"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    empresa_id: Mapped[int] = mapped_column(ForeignKey("empresas.id"), nullable=False, index=True)
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="viewer", comment="admin, gestor, viewer")
    ativo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Relacionamentos
    empresa: Mapped["Empresa"] = relationship("Empresa", back_populates="usuarios")
    
    def __repr__(self) -> str:
        return f"<Usuario(id={self.id}, email='{self.email}', role='{self.role}')>"
