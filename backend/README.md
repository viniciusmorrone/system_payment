# Backend - Sistema de Controle de Pagamentos

API FastAPI para gestão de pagamentos e freelancers com arquitetura multi-tenant.

## Setup Local

### Com Poetry
```bash
cd backend
poetry install
poetry shell
```

### Com pip
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -e .
```

### Instalar dependências de desenvolvimento
```bash
pip install -e ".[dev]"
```

## Rodar a Aplicação

```bash
# Desenvolvimento
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Produção
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Migrações do Banco

```bash
# Criar migração
alembic revision --autogenerate -m "Descrição da migração"

# Aplicar migrações
alembic upgrade head

# Reverter última migração
alembic downgrade -1

# Verificar status
alembic current
```

## Testes

```bash
# Rodar todos os testes
pytest

# Rodar com cobertura
pytest --cov=app --cov-report=html

# Rodar teste específico
pytest tests/test_auth.py::test_login
```

## Lint e Formatação

```bash
# Formatar código
black app/ tests/

# Verificar lint
ruff check app/ tests/

# Corrigir automaticamente
ruff check --fix app/ tests/
```

## Estrutura do Projeto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── core/
│   │   ├── config.py        # Configurações
│   │   ├── database.py      # Conexão com banco
│   │   └── security.py      # JWT e senhas
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py          # Modelo base
│   │   ├── empresa.py
│   │   ├── usuario.py
│   │   ├── funcionario.py
│   │   ├── semana.py
│   │   ├── presenca.py
│   │   ├── desconto.py
│   │   ├── pagamento.py
│   │   └── item_consumo.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── empresa.py
│   │   ├── usuario.py
│   │   ├── funcionario.py
│   │   ├── semana.py
│   │   ├── presenca.py
│   │   ├── desconto.py
│   │   ├── pagamento.py
│   │   └── item_consumo.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       ├── funcionarios.py
│   │       ├── semanas.py
│   │       ├── presencas.py
│   │       ├── descontos.py
│   │       ├── pagamentos.py
│   │       ├── itens_consumo.py
│   │       ├── usuarios.py
│   │       ├── dashboard.py
│   │       └── relatorios.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── funcionario.py
│   │   ├── pagamento.py
│   │   └── empresa.py
│   └── utils/
│       ├── __init__.py
│       ├── permissions.py
│       └── validators.py
├── alembic/
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_funcionarios.py
│   └── test_pagamentos.py
├── pyproject.toml
├── .env.example
└── README.md
```

## Documentação

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI**: http://localhost:8000/openapi.json

## Variáveis de Ambiente

Copie `.env.example` para `.env` e configure as variáveis:

- `DATABASE_URL`: URL de conexão com PostgreSQL
- `SECRET_KEY`: Chave secreta para JWT
- `CORS_ORIGINS`: URLs permitidas para CORS
