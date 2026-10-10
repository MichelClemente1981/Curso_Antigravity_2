CREATE DATABASE IF NOT EXISTS almoxarifado_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE almoxarifado_pro;

CREATE TABLE IF NOT EXISTS itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    estoque_atual INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    tipo ENUM('retirada', 'reposicao') NOT NULL,
    quantidade INT NOT NULL,
    tecnico_matricula VARCHAR(50),
    turno VARCHAR(20),
    data_hora DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES itens(id) ON DELETE RESTRICT
);

-- Índices para otimização de buscas
CREATE INDEX idx_itens_codigo ON itens(codigo);
CREATE INDEX idx_mov_tecnico ON movimentacoes(tecnico_matricula);
CREATE INDEX idx_mov_turno ON movimentacoes(turno);
CREATE INDEX idx_mov_data ON movimentacoes(data_hora);

-- Inserção de dados para teste (opcional)
INSERT INTO itens (codigo, nome, estoque_atual, estoque_minimo) VALUES 
('BRO-0042', 'Broca Diamantada 10mm', 15, 5),
('ROL-1020', 'Rolamento Esférico Duplo', 3, 10),
('EPI-001', 'Capacete de Segurança Classe B', 50, 20);
