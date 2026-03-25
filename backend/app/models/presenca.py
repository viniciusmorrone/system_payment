from datetime import date
from sqlalchemy import Date, String, ForeignKey, Integer, Numeric, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Presenca(Base):
    """Modelo de presenças dos funcionários"""
    
    __tablename__ = "presencas"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    funcionario_id: Mapped[int] = mapped_column(ForeignKey("funcionarios.id"), nullable=False, index=True)
    semana_id: Mapped[int] = mapped_column(ForeignKey("semanas.id"), nullable=False, index=True)
    data_presenca: Mapped[date] = mapped_column(Date, nullable=False)
    dia_semana: Mapped[str] = mapped_column(String(10), nullable=False, comment="segunda, terça, etc.")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="presente", comment="presente, folga, ponto, dobra, falta")
    valor_diaria: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)
    
    # Relacionamentos
    funcionario: Mapped["Funcionario"] = relationship("Funcionario", back_populates="presencas")
    semana: Mapped["Semana"] = relationship("Semana", back_populates="presencas")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('funcionario_id', 'semana_id', 'data_presenca', name='uq_funcionario_semana_data'),
        CheckConstraint("status IN ('presente', 'folga', 'ponto', 'dobrar', 'falta')", name='ck_status_presenca'),
    )
    
    def __repr__(self) -> str:
        return f"<Presenca(id={self.id}, funcionario_id={self.funcionario_id}, data='{self.data_presenca}', status='{self.status}')>"
