#!/bin/sh

# Script de inicialização para Railway
# Executa migrações e inicia o servidor

echo "🚀 Starting application..."

# Executar migrações do Alembic
echo "📦 Running database migrations..."
alembic upgrade head

# Verificar se as migrações foram bem-sucedidas
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migrations failed"
    exit 1
fi

# Iniciar o servidor Uvicorn
echo "🌐 Starting Uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
