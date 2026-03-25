from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Empresa(Base):
    """Modelo de empresas (tenants) - isolamento multi-tenant"""
    
    __tablename__ = "empresas"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    email_contato: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    plano: Mapped[str] = mapped_column(String(20), nullable=False, default="free", comment="free ou pro")
    ativo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Relacionamentos
    usuarios: Mapped[list["Usuario"]] = relationship("Usuario", back_populates="empresa", cascade="all, delete-orphan")
    funcionarios: Mapped[list["Funcionario"]] = relationship("Funcionario", back_populates="empresa", cascade="all, delete-orphan")
    semanas: Mapped[list["Semana"]] = relationship("Semana", back_populates="empresa", cascade="all, delete-orphan")
    itens_consumo: Mapped[list["ItemConsumo"]] = relationship("ItemConsumo", back_populates="empresa", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Empresa(id={self.id}, nome='{self.nome}', plano='{self.plano}')>"
