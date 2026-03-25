"""Initial migration - create all tables

Revision ID: 001
Revises: 
Create Date: 2024-03-24 01:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create empresas table
    op.create_table('empresas',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nome', sa.String(length=100), nullable=False),
        sa.Column('email_contato', sa.String(length=255), nullable=False),
        sa.Column('plano', sa.String(length=20), nullable=False),
        sa.Column('ativo', sa.Boolean(), nullable=False),
        sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email_contato')
    )
    op.create_index(op.f('ix_empresas_id'), 'empresas', ['id'], unique=False)
    op.create_index(op.f('ix_empresas_nome'), 'empresas', ['nome'], unique=False)

    # Create usuarios table
    op.create_table('usuarios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('empresa_id', sa.Integer(), nullable=False),
        sa.Column('nome', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('senha_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('ativo', sa.Boolean(), nullable=False),
        sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['empresa_id'], ['empresas.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_usuarios_id'), 'usuarios', ['id'], unique=False)
    op.create_index(op.f('ix_usuarios_email'), 'usuarios', ['email'], unique=False)

    # Create funcionarios table
    op.create_table('funcionarios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('empresa_id', sa.Integer(), nullable=False),
        sa.Column('nome_completo', sa.String(length=100), nullable=False),
        sa.Column('tipo', sa.String(length=20), nullable=False),
        sa.Column('chave_pix', sa.String(length=100), nullable=True),
        sa.Column('forma_pagamento', sa.String(length=20), nullable=False),
        sa.Column('cargo', sa.String(length=50), nullable=True),
        sa.Column('valor_diaria', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('ativo', sa.Boolean(), nullable=False),
        sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['empresa_id'], ['empresas.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_funcionarios_id'), 'funcionarios', ['id'], unique=False)
    op.create_index('idx_empresa_nome', 'funcionarios', ['empresa_id', 'nome_completo'], unique=False)

    # Create semanas table
    op.create_table('semanas',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('empresa_id', sa.Integer(), nullable=False),
        sa.Column('data_inicio', sa.Date(), nullable=False),
        sa.Column('data_fim', sa.Date(), nullable=False),
        sa.Column('encerrada', sa.Boolean(), nullable=False),
        sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['empresa_id'], ['empresas.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('data_fim >= data_inicio', name='ck_data_fim_maior_inicio')
    )
    op.create_index(op.f('ix_semanas_id'), 'semanas', ['id'], unique=False)
    op.create_index('idx_empresa_periodo', 'semanas', ['empresa_id', 'data_inicio', 'data_fim'], unique=False)

    # Create itens_consumo table
    op.create_table('itens_consumo',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('empresa_id', sa.Integer(), nullable=False),
        sa.Column('nome', sa.String(length=100), nullable=False),
        sa.Column('preco_padrao', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('ativo', sa.Boolean(), nullable=False),
        sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['empresa_id'], ['empresas.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_itens_consumo_id'), 'itens_consumo', ['id'], unique=False)

    # Create presencas table
    op.create_table('presencas',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('funcionario_id', sa.Integer(), nullable=False),
        sa.Column('semana_id', sa.Integer(), nullable=False),
        sa.Column('data_presenca', sa.Date(), nullable=False),
        sa.Column('dia_semana', sa.String(length=10), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('valor_diaria', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['funcionario_id'], ['funcionarios.id'], ),
        sa.ForeignKeyConstraint(['semana_id'], ['semanas.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('funcionario_id', 'semana_id', 'data_presenca', name='uq_funcionario_semana_data'),
        sa.CheckConstraint("status IN ('presente', 'folga', 'ponto', 'dobrar', 'falta')", name='ck_status_presenca')
    )
    op.create_index(op.f('ix_presencas_id'), 'presencas', ['id'], unique=False)

    # Create descontos table
    op.create_table('descontos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('funcionario_id', sa.Integer(), nullable=False),
        sa.Column('semana_id', sa.Integer(), nullable=False),
        sa.Column('item_consumo_id', sa.Integer(), nullable=True),
        sa.Column('descricao', sa.String(length=200), nullable=False),
        sa.Column('quantidade', sa.Integer(), nullable=False),
        sa.Column('preco_unitario', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('valor_total', sa.Numeric(precision=10, scale=2), server_default='0.00', nullable=False),
        sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['funcionario_id'], ['funcionarios.id'], ),
        sa.ForeignKeyConstraint(['item_consumo_id'], ['itens_consumo.id'], ),
        sa.ForeignKeyConstraint(['semana_id'], ['semanas.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_descontos_id'), 'descontos', ['id'], unique=False)

    # Create pagamentos table
    op.create_table('pagamentos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('funcionario_id', sa.Integer(), nullable=False),
        sa.Column('semana_id', sa.Integer(), nullable=False),
        sa.Column('valor_bruto', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('total_descontos', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('valor_liquido', sa.Numeric(precision=10, scale=2), server_default='0.00', nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('data_pagamento', sa.Date(), nullable=True),
        sa.Column('comprovante', sa.Text(), nullable=True),
        sa.Column('criado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('atualizado_em', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['funcionario_id'], ['funcionarios.id'], ),
        sa.ForeignKeyConstraint(['semana_id'], ['semanas.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('funcionario_id', 'semana_id', name='uq_funcionario_semana_pagamento'),
        sa.CheckConstraint("status IN ('pendente', 'pago', 'cancelado', 'parcial')", name='ck_status_pagamento'),
        sa.CheckConstraint('valor_liquido >= 0', name='ck_valor_liquido_nao_negativo')
    )
    op.create_index(op.f('ix_pagamentos_id'), 'pagamentos', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_pagamentos_id'), table_name='pagamentos')
    op.drop_table('pagamentos')
    op.drop_index(op.f('ix_descontos_id'), table_name='descontos')
    op.drop_table('descontos')
    op.drop_index(op.f('ix_presencas_id'), table_name='presencas')
    op.drop_table('presencas')
    op.drop_index(op.f('ix_itens_consumo_id'), table_name='itens_consumo')
    op.drop_table('itens_consumo')
    op.drop_index('idx_empresa_periodo', table_name='semanas')
    op.drop_index(op.f('ix_semanas_id'), table_name='semanas')
    op.drop_table('semanas')
    op.drop_index('idx_empresa_nome', table_name='funcionarios')
    op.drop_index(op.f('ix_funcionarios_id'), table_name='funcionarios')
    op.drop_table('funcionarios')
    op.drop_index(op.f('ix_usuarios_email'), table_name='usuarios')
    op.drop_index(op.f('ix_usuarios_id'), table_name='usuarios')
    op.drop_table('usuarios')
    op.drop_index(op.f('ix_empresas_nome'), table_name='empresas')
    op.drop_index(op.f('ix_empresas_id'), table_name='empresas')
    op.drop_table('empresas')
