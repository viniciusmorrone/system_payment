from datetime import date
from sqlalchemy import String, Date, Boolean, ForeignKey, Integer, Numeric, Text, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Pagamento(Base):
    """Modelo de pagamentos dos funcionários"""
    
    __tablename__ = "pagamentos"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    funcionario_id: Mapped[int] = mapped_column(ForeignKey("funcionarios.id"), nullable=False, index=True)
    semana_id: Mapped[int] = mapped_column(ForeignKey("semanas.id"), nullable=False, index=True)
    valor_bruto: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)
    total_descontos: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)
    
    # Coluna gerada para valor_liquido
    valor_liquido: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        server_default='0.00',
        comment="Coluna gerada: valor_bruto - total_descontos"
    )
    
    status: Mapped[str] = mapped_column(
        String(20), 
        nullable=False, 
        default="pendente", 
        comment="pendente, pago, cancelado, parcial"
    )
    data_pagamento: Mapped[date] = mapped_column(Date, nullable=True)
    comprovante: Mapped[str] = mapped_column(Text, nullable=True, comment="URL ou base64 do comprovante")
    
    # Relacionamentos
    funcionario: Mapped["Funcionario"] = relationship("Funcionario", back_populates="pagamentos")
    semana: Mapped["Semana"] = relationship("Semana", back_populates="pagamentos")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('funcionario_id', 'semana_id', name='uq_funcionario_semana_pagamento'),
        CheckConstraint("status IN ('pendente', 'pago', 'cancelado', 'parcial')", name='ck_status_pagamento'),
        CheckConstraint('valor_liquido >= 0', name='ck_valor_liquido_nao_negativo'),
    )
    
    def __repr__(self) -> str:
        return f"<Pagamento(id={self.id}, valor_liquido={self.valor_liquido}, status='{self.status}')>"
