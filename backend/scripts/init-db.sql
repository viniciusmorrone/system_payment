-- Script de inicialização do banco de dados
-- Este script é executado automaticamente quando o container PostgreSQL inicia

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar usuário para a aplicação (se não existir)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
      CREATE ROLE app_user LOGIN PASSWORD 'app_password';
   END IF;
END
$$;

-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE projeto_point TO app_user;
GRANT ALL ON SCHEMA public TO app_user;
