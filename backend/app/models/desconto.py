from typing import Optional
from sqlalchemy import String, ForeignKey, Integer, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Desconto(Base):
    """Modelo de descontos aplicados aos funcionários"""
    
    __tablename__ = "descontos"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    funcionario_id: Mapped[int] = mapped_column(ForeignKey("funcionarios.id"), nullable=False, index=True)
    semana_id: Mapped[int] = mapped_column(ForeignKey("semanas.id"), nullable=False, index=True)
    item_consumo_id: Mapped[int] = mapped_column(ForeignKey("itens_consumo.id"), nullable=True)
    descricao: Mapped[str] = mapped_column(String(200), nullable=False)
    quantidade: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    preco_unitario: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)
    
    # Coluna gerada para valor_total
    valor_total: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        server_default='0.00',
        comment="Coluna gerada: quantidade * preco_unitario"
    )
    
    # Relacionamentos
    funcionario: Mapped["Funcionario"] = relationship("Funcionario", back_populates="descontos")
    semana: Mapped["Semana"] = relationship("Semana", back_populates="descontos")
    item_consumo: Mapped[Optional["ItemConsumo"]] = relationship("ItemConsumo", back_populates="descontos")
    
    def __repr__(self) -> str:
        return f"<Desconto(id={self.id}, descricao='{self.descricao}', valor_total={self.valor_total})>"
