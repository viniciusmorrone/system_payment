from sqlalchemy import String, Boolean, ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ItemConsumo(Base):
    """Catálogo de itens de consumo por empresa"""
    
    __tablename__ = "itens_consumo"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    empresa_id: Mapped[int] = mapped_column(ForeignKey("empresas.id"), nullable=False, index=True)
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    preco_padrao: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)
    ativo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Relacionamentos
    empresa: Mapped["Empresa"] = relationship("Empresa", back_populates="itens_consumo")
    descontos: Mapped[list["Desconto"]] = relationship("Desconto", back_populates="item_consumo")
    
    def __repr__(self) -> str:
        return f"<ItemConsumo(id={self.id}, nome='{self.nome}', preco={self.preco_padrao})>"
