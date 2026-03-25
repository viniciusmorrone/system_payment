from sqlalchemy import String, Boolean, ForeignKey, Integer, Numeric, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Funcionario(Base):
    """Modelo de funcionários (freelancers e fixos)"""
    
    __tablename__ = "funcionarios"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    empresa_id: Mapped[int] = mapped_column(ForeignKey("empresas.id"), nullable=False, index=True)
    nome_completo: Mapped[str] = mapped_column(String(100), nullable=False)
    tipo: Mapped[str] = mapped_column(String(20), nullable=False, default="freelancer", comment="freelancer ou fixo")
    chave_pix: Mapped[str] = mapped_column(String(100), nullable=True)
    forma_pagamento: Mapped[str] = mapped_column(String(20), nullable=False, default="PIX", comment="PIX ou DINHEIRO")
    cargo: Mapped[str] = mapped_column(String(50), nullable=True)
    valor_diaria: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)
    ativo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Relacionamentos
    empresa: Mapped["Empresa"] = relationship("Empresa", back_populates="funcionarios")
    presencas: Mapped[list["Presenca"]] = relationship("Presenca", back_populates="funcionario", cascade="all, delete-orphan")
    descontos: Mapped[list["Desconto"]] = relationship("Desconto", back_populates="funcionario", cascade="all, delete-orphan")
    pagamentos: Mapped[list["Pagamento"]] = relationship("Pagamento", back_populates="funcionario", cascade="all, delete-orphan")
    
    # Índice composto para busca otimizada
    __table_args__ = (
        Index('idx_empresa_nome', 'empresa_id', 'nome_completo'),
    )
    
    def __repr__(self) -> str:
        return f"<Funcionario(id={self.id}, nome='{self.nome_completo}', tipo='{self.tipo}')>"
