-- Schema do Almoxarifado Pro para PostgreSQL
-- Compatível com PHP 8.2+ e PDO pgsql

-- Tipos ENUM
DO $$ BEGIN
    CREATE TYPE tipo_movimentacao AS ENUM ('ENTRADA', 'SAIDA');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Tabela de itens do almoxarifado
CREATE TABLE IF NOT EXISTS itens (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    estoque_atual INTEGER NOT NULL DEFAULT 0,
    estoque_minimo INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de movimentações
CREATE TABLE IF NOT EXISTS movimentacoes (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES itens(id) ON DELETE RESTRICT,
    tipo tipo_movimentacao NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    tecnico_matricula VARCHAR(50),
    turno VARCHAR(20),
    data_hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para otimização de buscas
CREATE INDEX IF NOT EXISTS idx_itens_codigo ON itens(codigo);
CREATE INDEX IF NOT EXISTS idx_mov_item_id ON movimentacoes(item_id);
CREATE INDEX IF NOT EXISTS idx_mov_tecnico ON movimentacoes(tecnico_matricula);
CREATE INDEX IF NOT EXISTS idx_mov_turno ON movimentacoes(turno);
CREATE INDEX IF NOT EXISTS idx_mov_data ON movimentacoes(data_hora);

-- Dados iniciais para teste
INSERT INTO itens (codigo, nome, estoque_atual, estoque_minimo) VALUES
    ('FERR-001', 'Broca Diamantada 10mm', 50, 10),
    ('ROL-1020', 'Rolamento Esférico Duplo', 8, 10),
    ('EPI-001',  'Capacete de Segurança Classe B', 120, 20),
    ('DISC-003', 'Disco de Corte 180mm', 30, 15)
ON CONFLICT (codigo) DO NOTHING;
