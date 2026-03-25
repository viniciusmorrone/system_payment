from datetime import date
from sqlalchemy import Date, Boolean, ForeignKey, Integer, Numeric, Index, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Semana(Base):
    """Modelo de semanas de controle"""
    
    __tablename__ = "semanas"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    empresa_id: Mapped[int] = mapped_column(ForeignKey("empresas.id"), nullable=False, index=True)
    data_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    data_fim: Mapped[date] = mapped_column(Date, nullable=False)
    encerrada: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Relacionamentos
    empresa: Mapped["Empresa"] = relationship("Empresa", back_populates="semanas")
    presencas: Mapped[list["Presenca"]] = relationship("Presenca", back_populates="semana", cascade="all, delete-orphan")
    descontos: Mapped[list["Desconto"]] = relationship("Desconto", back_populates="semana", cascade="all, delete-orphan")
    pagamentos: Mapped[list["Pagamento"]] = relationship("Pagamento", back_populates="semana", cascade="all, delete-orphan")
    
    # Constraints e índices
    __table_args__ = (
        CheckConstraint('data_fim >= data_inicio', name='ck_data_fim_maior_inicio'),
        Index('idx_empresa_periodo', 'empresa_id', 'data_inicio', 'data_fim'),
    )
    
    def __repr__(self) -> str:
        return f"<Semana(id={self.id}, inicio='{self.data_inicio}', fim='{self.data_fim}', encerrada={self.encerrada})>"
