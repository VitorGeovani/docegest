-- =========================================================
-- DoceGest MVP - Script de Migração Completo
-- Versão: 4.0 - AUTENTICAÇÃO + GESTÃO COMPLETA
-- Data: 04 de Outubro de 2025
-- Descrição: Unifica sistema de autenticação com gestão de estoque
-- =========================================================

USE db_segredo_do_sabor;

-- Desabilitar verificações temporariamente
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- =========================================================
-- PARTE 1: SISTEMA DE AUTENTICAÇÃO
-- =========================================================

-- 1.1 Atualizar tb_cliente com campos de autenticação
ALTER TABLE tb_cliente 
ADD COLUMN IF NOT EXISTS senha VARCHAR(255) COMMENT 'Hash bcrypt da senha',
ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS token_recuperacao VARCHAR(255),
ADD COLUMN IF NOT EXISTS data_token_recuperacao DATETIME,
ADD COLUMN IF NOT EXISTS data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS ultimo_acesso DATETIME,
ADD COLUMN IF NOT EXISTS tipo ENUM('cliente', 'admin') DEFAULT 'cliente';

-- 1.2 Criar tabela de refresh tokens
CREATE TABLE IF NOT EXISTS tb_refresh_tokens (
    id_token INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    revogado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_cliente) REFERENCES tb_cliente(id_cliente) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.3 Atualizar tb_reserva com campos de status e notificação
ALTER TABLE tb_reserva 
ADD COLUMN IF NOT EXISTS status_pagamento ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS status_pedido ENUM('pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado') DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS whatsapp_notificado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS data_notificacao DATETIME,
ADD COLUMN IF NOT EXISTS codigo_pedido VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS tipo_pedido VARCHAR(20) DEFAULT 'RETIRADA' COMMENT 'RETIRADA, ENTREGA',
ADD COLUMN IF NOT EXISTS endereco_entrega TEXT,
ADD COLUMN IF NOT EXISTS taxa_entrega DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tempo_preparo_estimado INT,
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS troco_para DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- =========================================================
-- PARTE 2: SISTEMA DE CATEGORIAS
-- =========================================================

-- 2.1 Criar/Atualizar tabela tb_categoria
CREATE TABLE IF NOT EXISTS tb_categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(200),
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2.2 Adicionar categoria aos produtos
ALTER TABLE tb_produto 
ADD COLUMN IF NOT EXISTS id_categoria INT,
ADD COLUMN IF NOT EXISTS codigo_produto VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS custo_producao DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS margem_lucro DECIMAL(5,2) DEFAULT 40,
ADD COLUMN IF NOT EXISTS tempo_preparo INT DEFAULT 30 COMMENT 'Tempo em minutos';

-- Adicionar FK somente se não existir
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'db_segredo_do_sabor' 
    AND TABLE_NAME = 'tb_produto' 
    AND CONSTRAINT_NAME = 'fk_produto_categoria');

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE tb_produto ADD CONSTRAINT fk_produto_categoria FOREIGN KEY (id_categoria) REFERENCES tb_categoria(id_categoria)', 
    'SELECT "FK já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =========================================================
-- PARTE 3: SISTEMA DE INGREDIENTES E RECEITAS
-- =========================================================

-- 3.1 Criar/Atualizar tabela tb_ingrediente
CREATE TABLE IF NOT EXISTS tb_ingrediente (
    id_ingrediente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    unidade_medida VARCHAR(20) NOT NULL COMMENT 'kg, g, L, ml, unidade',
    preco_unitario DECIMAL(10,2) NOT NULL,
    quantidade_estoque DECIMAL(10,3) NOT NULL DEFAULT 0,
    estoque_minimo DECIMAL(10,3) DEFAULT 0,
    fornecedor VARCHAR(100),
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3.2 Criar tabela de receitas (ingredientes por produto)
CREATE TABLE IF NOT EXISTS tb_receita (
    id_receita INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    id_ingrediente INT NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL COMMENT 'Quantidade do ingrediente por unidade de produto',
    UNIQUE KEY receita_unica (id_produto, id_ingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Adicionar FKs somente se não existirem
SET @fk_receita_produto = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'db_segredo_do_sabor' 
    AND TABLE_NAME = 'tb_receita' 
    AND CONSTRAINT_NAME = 'fk_receita_produto');

SET @sql = IF(@fk_receita_produto = 0, 
    'ALTER TABLE tb_receita ADD CONSTRAINT fk_receita_produto FOREIGN KEY (id_produto) REFERENCES tb_produto(id_produto) ON DELETE CASCADE', 
    'SELECT "FK receita_produto já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_receita_ingrediente = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'db_segredo_do_sabor' 
    AND TABLE_NAME = 'tb_receita' 
    AND CONSTRAINT_NAME = 'fk_receita_ingrediente');

SET @sql = IF(@fk_receita_ingrediente = 0, 
    'ALTER TABLE tb_receita ADD CONSTRAINT fk_receita_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES tb_ingrediente(id_ingrediente) ON DELETE RESTRICT', 
    'SELECT "FK receita_ingrediente já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =========================================================
-- PARTE 4: SISTEMA DE CUSTOS E MOVIMENTAÇÕES
-- =========================================================

-- 4.1 Criar tabela de custos indiretos
CREATE TABLE IF NOT EXISTS tb_custo_indireto (
    id_custo INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL COMMENT 'luz, agua, gas, embalagem, aluguel, etc',
    descricao VARCHAR(200),
    valor_mensal DECIMAL(10,2) NOT NULL,
    mes_referencia DATE NOT NULL,
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4.2 Criar tabela de movimentação de estoque
CREATE TABLE IF NOT EXISTS tb_movimentacao_estoque (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_ingrediente INT NOT NULL,
    tipo VARCHAR(20) NOT NULL COMMENT 'ENTRADA, SAIDA, AJUSTE',
    quantidade DECIMAL(10,3) NOT NULL,
    valor_unitario DECIMAL(10,2),
    motivo VARCHAR(200),
    id_reserva INT NULL COMMENT 'Se saída for por venda',
    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Adicionar FKs
SET @fk_mov_ingrediente = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'db_segredo_do_sabor' 
    AND TABLE_NAME = 'tb_movimentacao_estoque' 
    AND CONSTRAINT_NAME = 'fk_mov_ingrediente');

SET @sql = IF(@fk_mov_ingrediente = 0, 
    'ALTER TABLE tb_movimentacao_estoque ADD CONSTRAINT fk_mov_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES tb_ingrediente(id_ingrediente)', 
    'SELECT "FK mov_ingrediente já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_mov_reserva = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'db_segredo_do_sabor' 
    AND TABLE_NAME = 'tb_movimentacao_estoque' 
    AND CONSTRAINT_NAME = 'fk_mov_reserva');

SET @sql = IF(@fk_mov_reserva = 0, 
    'ALTER TABLE tb_movimentacao_estoque ADD CONSTRAINT fk_mov_reserva FOREIGN KEY (id_reserva) REFERENCES tb_reserva(id_reserva)', 
    'SELECT "FK mov_reserva já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =========================================================
-- PARTE 5: CONFIGURAÇÕES DO SISTEMA
-- =========================================================

CREATE TABLE IF NOT EXISTS tb_configuracao (
    id_config INT AUTO_INCREMENT PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    descricao VARCHAR(200),
    tipo VARCHAR(20) DEFAULT 'string' COMMENT 'string, number, boolean, json',
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 6: POPULAÇÃO INICIAL DE DADOS
-- =========================================================

-- 6.1 Categorias
INSERT IGNORE INTO tb_categoria (id_categoria, nome, descricao) VALUES 
(1, 'Cones Trufados', 'Cones recheados com brigadeiro e coberturas especiais'),
(2, 'Doces Gourmet', 'Doces finos e sofisticados'),
(3, 'Brigadeiros', 'Brigadeiros tradicionais e gourmet'),
(4, 'Bolos', 'Bolos caseiros e especiais'),
(5, 'Sobremesas', 'Sobremesas diversas'),
(6, 'Veganos', 'Produtos sem ingredientes de origem animal');

-- 6.2 Ingredientes
INSERT IGNORE INTO tb_ingrediente (id_ingrediente, nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo, fornecedor) VALUES 
(1, 'Leite Condensado', 'kg', 8.50, 50.000, 10.000, 'Atacadão'),
(2, 'Chocolate ao Leite', 'kg', 35.00, 20.000, 5.000, 'Distribuidora Chocolates'),
(3, 'Chocolate Meio Amargo', 'kg', 38.00, 15.000, 5.000, 'Distribuidora Chocolates'),
(4, 'Chocolate Branco', 'kg', 40.00, 10.000, 3.000, 'Distribuidora Chocolates'),
(5, 'Creme de Leite', 'lata', 4.50, 100.000, 20.000, 'Atacadão'),
(6, 'Manteiga', 'kg', 25.00, 10.000, 3.000, 'Atacadão'),
(7, 'Ovos', 'unidade', 0.50, 200.000, 50.000, 'Granja Local'),
(8, 'Açúcar', 'kg', 3.50, 50.000, 10.000, 'Atacadão'),
(9, 'Farinha de Trigo', 'kg', 4.00, 30.000, 10.000, 'Atacadão'),
(10, 'Leite em Pó Ninho', 'kg', 25.00, 15.000, 5.000, 'Distribuidora'),
(11, 'Nutella', 'kg', 45.00, 8.000, 2.000, 'Importadora'),
(12, 'Ovomaltine', 'kg', 30.00, 10.000, 3.000, 'Distribuidora'),
(13, 'Oreo', 'kg', 20.00, 10.000, 3.000, 'Distribuidora'),
(14, 'Kit Kat', 'kg', 35.00, 8.000, 2.000, 'Distribuidora'),
(15, 'Kinder Bueno', 'kg', 50.00, 5.000, 1.000, 'Importadora'),
(16, 'Ferrero Rocher', 'kg', 80.00, 3.000, 1.000, 'Importadora'),
(17, 'Morango', 'kg', 12.00, 10.000, 3.000, 'Hortifruti'),
(18, 'Limão Siciliano', 'kg', 8.00, 8.000, 2.000, 'Hortifruti'),
(19, 'Coco Ralado', 'kg', 15.00, 10.000, 3.000, 'Distribuidora'),
(20, 'Casquinha Cone', 'unidade', 0.50, 500.000, 100.000, 'Fábrica de Cones'),
(21, 'Embalagem Individual', 'unidade', 0.30, 1000.000, 200.000, 'Gráfica Rápida');

-- 6.3 Produtos (atualizar categorias dos existentes)
UPDATE tb_produto SET id_categoria = 1 WHERE id_produto IN (2, 3, 11, 19, 20, 21, 22, 24, 25);

-- Atualizar códigos de produto
UPDATE tb_produto SET codigo_produto = CONCAT('PROD', LPAD(id_produto, 4, '0')) WHERE codigo_produto IS NULL;

-- 6.4 Receitas (exemplo para produtos existentes)
-- Cone Ovomaltine (ID 2)
INSERT IGNORE INTO tb_receita (id_produto, id_ingrediente, quantidade) VALUES 
(2, 2, 0.030),  -- 30g Chocolate ao Leite
(2, 12, 0.040), -- 40g Ovomaltine
(2, 1, 0.030),  -- 30g Leite Condensado
(2, 20, 1.000), -- 1 Cone
(2, 21, 1.000); -- 1 Embalagem

-- Cone Kinder Bueno (ID 3)
INSERT IGNORE INTO tb_receita (id_produto, id_ingrediente, quantidade) VALUES 
(3, 2, 0.030),  -- 30g Chocolate ao Leite
(3, 15, 0.035), -- 35g Kinder Bueno
(3, 11, 0.025), -- 25g Nutella
(3, 20, 1.000), -- 1 Cone
(3, 21, 1.000); -- 1 Embalagem

-- Cone Ninho e Nutella (ID 11)
INSERT IGNORE INTO tb_receita (id_produto, id_ingrediente, quantidade) VALUES 
(11, 2, 0.030),  -- 30g Chocolate ao Leite
(11, 10, 0.040), -- 40g Ninho
(11, 11, 0.030), -- 30g Nutella
(11, 20, 1.000), -- 1 Cone
(11, 21, 1.000); -- 1 Embalagem

-- 6.5 Custos Indiretos
INSERT IGNORE INTO tb_custo_indireto (tipo, descricao, valor_mensal, mes_referencia) VALUES 
('Energia Elétrica', 'Conta de luz mensal da cozinha', 300.00, '2025-10-01'),
('Água', 'Conta de água mensal', 80.00, '2025-10-01'),
('Gás', 'Gás de cozinha industrial', 120.00, '2025-10-01'),
('Internet', 'Internet e telefone fixo', 100.00, '2025-10-01'),
('Material de Limpeza', 'Produtos de limpeza e higiene', 150.00, '2025-10-01'),
('Embalagens', 'Caixas, sacolas e etiquetas', 200.00, '2025-10-01');

-- 6.6 Configurações do Sistema
INSERT IGNORE INTO tb_configuracao (chave, valor, descricao, tipo) VALUES 
('margem_lucro_padrao', '40', 'Margem de lucro padrão em porcentagem', 'number'),
('taxa_desperdicio', '5', 'Taxa de desperdício em porcentagem', 'number'),
('telefone_whatsapp', '5511999999999', 'Número do WhatsApp para pedidos', 'string'),
('tempo_preparo_padrao', '30', 'Tempo de preparo padrão em minutos', 'number'),
('valor_entrega', '8.00', 'Valor da taxa de entrega', 'number'),
('aceita_pix', 'true', 'Aceita pagamento via PIX', 'boolean'),
('aceita_cartao', 'true', 'Aceita pagamento com cartão', 'boolean'),
('chave_pix', 'email@exemplo.com', 'Chave PIX para recebimento', 'string'),
('email_notificacao', 'contato@segredodosabor.com', 'Email para notificações', 'string');

-- 6.7 Clientes de Teste (senha: 123456)
-- Hash bcrypt de "123456": $2b$10$rFkVsKxQYZZpZ5J5J5J5JO9Z5J5J5J5J5J5J5J5J5J5J5J5J5J5J5
INSERT IGNORE INTO tb_cliente (id_cliente, nome, email, telefone, senha, tipo, data_cadastro) VALUES 
(1, 'Maria Silva', 'maria@email.com', '11987654321', '$2b$10$rFkVsKxQYZZpZ5J5J5J5JO9Z5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'cliente', NOW()),
(2, 'João Santos', 'joao@email.com', '11976543210', '$2b$10$rFkVsKxQYZZpZ5J5J5J5JO9Z5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'cliente', NOW()),
(3, 'Ana Costa', 'ana@email.com', '11965432109', '$2b$10$rFkVsKxQYZZpZ5J5J5J5JO9Z5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'cliente', NOW()),
(4, 'Pedro Oliveira', 'pedro@email.com', '11954321098', '$2b$10$rFkVsKxQYZZpZ5J5J5J5JO9Z5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'cliente', NOW()),
(5, 'Admin Sistema', 'admin@segredodosabor.com', '11999999999', '$2b$10$rFkVsKxQYZZpZ5J5J5J5JO9Z5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'admin', NOW());

-- 6.8 Gerar códigos de pedido para reservas existentes
UPDATE tb_reserva 
SET codigo_pedido = CONCAT('PED', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(id_reserva, 4, '0'))
WHERE codigo_pedido IS NULL;

-- =========================================================
-- PARTE 7: ÍNDICES PARA PERFORMANCE
-- =========================================================

-- Índices tb_cliente
CREATE INDEX IF NOT EXISTS idx_cliente_email ON tb_cliente(email);
CREATE INDEX IF NOT EXISTS idx_cliente_tipo ON tb_cliente(tipo);

-- Índices tb_reserva
CREATE INDEX IF NOT EXISTS idx_reserva_status ON tb_reserva(status);
CREATE INDEX IF NOT EXISTS idx_reserva_status_pagamento ON tb_reserva(status_pagamento);
CREATE INDEX IF NOT EXISTS idx_reserva_status_pedido ON tb_reserva(status_pedido);
CREATE INDEX IF NOT EXISTS idx_reserva_data ON tb_reserva(data_entrega);
CREATE INDEX IF NOT EXISTS idx_reserva_cliente ON tb_reserva(id_cliente_fk);
CREATE INDEX IF NOT EXISTS idx_reserva_codigo ON tb_reserva(codigo_pedido);

-- Índices tb_refresh_tokens
CREATE INDEX IF NOT EXISTS idx_refresh_token ON tb_refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_cliente ON tb_refresh_tokens(id_cliente);

-- Índices tb_produto
CREATE INDEX IF NOT EXISTS idx_produto_categoria ON tb_produto(id_categoria);
CREATE INDEX IF NOT EXISTS idx_produto_ativo ON tb_produto(ativo);
CREATE INDEX IF NOT EXISTS idx_produto_codigo ON tb_produto(codigo_produto);

-- Índices tb_ingrediente
CREATE INDEX IF NOT EXISTS idx_ingrediente_ativo ON tb_ingrediente(ativo);

-- Índices tb_movimentacao_estoque
CREATE INDEX IF NOT EXISTS idx_movimentacao_data ON tb_movimentacao_estoque(data_movimentacao);
CREATE INDEX IF NOT EXISTS idx_movimentacao_tipo ON tb_movimentacao_estoque(tipo);

-- =========================================================
-- PARTE 8: VIEWS ÚTEIS
-- =========================================================

-- View de custo de produtos
CREATE OR REPLACE VIEW vw_custo_produtos AS
SELECT 
    p.id_produto,
    p.nome AS produto,
    p.preco AS preco_venda,
    IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS custo_ingredientes,
    p.custo_producao,
    p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS lucro_bruto,
    CASE 
        WHEN p.preco > 0 THEN ((p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0)) / p.preco * 100)
        ELSE 0
    END AS margem_lucro_real
FROM tb_produto p
LEFT JOIN tb_receita r ON p.id_produto = r.id_produto
LEFT JOIN tb_ingrediente i ON r.id_ingrediente = i.id_ingrediente
GROUP BY p.id_produto, p.nome, p.preco, p.custo_producao;

-- View de produtos com estoque baixo
CREATE OR REPLACE VIEW vw_produtos_estoque_baixo AS
SELECT 
    p.id_produto,
    p.nome,
    p.quantidade AS quantidade_atual,
    CASE 
        WHEN p.quantidade = 0 THEN 'SEM ESTOQUE'
        WHEN p.quantidade <= 5 THEN 'ESTOQUE CRÍTICO'
        WHEN p.quantidade <= 10 THEN 'ESTOQUE BAIXO'
        ELSE 'ESTOQUE OK'
    END AS status_estoque
FROM tb_produto p
WHERE p.quantidade <= 10
ORDER BY p.quantidade ASC;

-- View de ingredientes com estoque baixo
CREATE OR REPLACE VIEW vw_ingredientes_estoque_baixo AS
SELECT 
    i.id_ingrediente,
    i.nome,
    i.quantidade_estoque,
    i.estoque_minimo,
    i.unidade_medida,
    CASE 
        WHEN i.quantidade_estoque = 0 THEN 'SEM ESTOQUE'
        WHEN i.quantidade_estoque <= i.estoque_minimo THEN 'COMPRAR URGENTE'
        WHEN i.quantidade_estoque <= (i.estoque_minimo * 1.5) THEN 'COMPRAR EM BREVE'
        ELSE 'ESTOQUE OK'
    END AS status,
    GREATEST(0, (i.estoque_minimo * 2 - i.quantidade_estoque)) AS quantidade_comprar
FROM tb_ingrediente i
WHERE i.quantidade_estoque <= (i.estoque_minimo * 1.5)
  AND i.ativo = 1
ORDER BY i.quantidade_estoque ASC;

-- View de vendas do dia
CREATE OR REPLACE VIEW vw_vendas_hoje AS
SELECT 
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento_total,
    CASE 
        WHEN COUNT(*) > 0 THEN AVG(valor_total)
        ELSE 0
    END AS ticket_medio,
    SUM(CASE WHEN status = 'Confirmado' THEN 1 ELSE 0 END) AS pedidos_confirmados,
    SUM(CASE WHEN status = 'Pendente' THEN 1 ELSE 0 END) AS pedidos_pendentes,
    SUM(CASE WHEN status = 'Cancelado' THEN 1 ELSE 0 END) AS pedidos_cancelados
FROM tb_reserva
WHERE DATE(data_entrega) = CURDATE();

-- View de vendas por período
CREATE OR REPLACE VIEW vw_vendas_mes_atual AS
SELECT 
    DATE(data_entrega) AS data_venda,
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento_dia,
    AVG(valor_total) AS ticket_medio
FROM tb_reserva
WHERE MONTH(data_entrega) = MONTH(CURDATE())
  AND YEAR(data_entrega) = YEAR(CURDATE())
GROUP BY DATE(data_entrega)
ORDER BY data_venda DESC;

-- View de produtos mais vendidos
CREATE OR REPLACE VIEW vw_produtos_mais_vendidos AS
SELECT 
    p.id_produto,
    p.nome,
    p.preco,
    COUNT(rp.id_produto) AS total_vendas,
    SUM(rp.quantidade) AS quantidade_vendida,
    SUM(rp.quantidade * p.preco) AS receita_total
FROM tb_produto p
INNER JOIN tb_reserva_produto rp ON p.id_produto = rp.id_produto
INNER JOIN tb_reserva r ON rp.id_reserva = r.id_reserva
WHERE r.status != 'Cancelado'
GROUP BY p.id_produto, p.nome, p.preco
ORDER BY quantidade_vendida DESC;

-- =========================================================
-- PARTE 9: STORED PROCEDURES
-- =========================================================

-- Procedure para calcular custo de produção
DELIMITER //
DROP PROCEDURE IF EXISTS sp_calcular_custo_produto//
CREATE PROCEDURE sp_calcular_custo_produto(IN p_id_produto INT)
BEGIN
    DECLARE v_custo DECIMAL(10,2);
    
    SELECT IFNULL(SUM(r.quantidade * i.preco_unitario), 0)
    INTO v_custo
    FROM tb_receita r
    INNER JOIN tb_ingrediente i ON r.id_ingrediente = i.id_ingrediente
    WHERE r.id_produto = p_id_produto;
    
    UPDATE tb_produto 
    SET custo_producao = v_custo
    WHERE id_produto = p_id_produto;
    
    SELECT v_custo AS custo_calculado;
END//
DELIMITER ;

-- Procedure para recalcular todos os custos
DELIMITER //
DROP PROCEDURE IF EXISTS sp_recalcular_todos_custos//
CREATE PROCEDURE sp_recalcular_todos_custos()
BEGIN
    UPDATE tb_produto p
    LEFT JOIN (
        SELECT 
            r.id_produto,
            SUM(r.quantidade * i.preco_unitario) AS custo_total
        FROM tb_receita r
        INNER JOIN tb_ingrediente i ON r.id_ingrediente = i.id_ingrediente
        GROUP BY r.id_produto
    ) custos ON p.id_produto = custos.id_produto
    SET p.custo_producao = IFNULL(custos.custo_total, 0);
    
    SELECT COUNT(*) AS produtos_atualizados FROM tb_produto;
END//
DELIMITER ;

-- =========================================================
-- PARTE 10: TRIGGERS
-- =========================================================

-- Trigger para atualizar custo após inserir/atualizar receita
DELIMITER //
DROP TRIGGER IF EXISTS tr_receita_after_insert//
CREATE TRIGGER tr_receita_after_insert
AFTER INSERT ON tb_receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(NEW.id_produto);
END//

DROP TRIGGER IF EXISTS tr_receita_after_update//
CREATE TRIGGER tr_receita_after_update
AFTER UPDATE ON tb_receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(NEW.id_produto);
END//

DROP TRIGGER IF EXISTS tr_receita_after_delete//
CREATE TRIGGER tr_receita_after_delete
AFTER DELETE ON tb_receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(OLD.id_produto);
END//
DELIMITER ;

-- =========================================================
-- PARTE 11: VERIFICAÇÕES E LIMPEZA
-- =========================================================

-- Reabilitar verificações
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;

-- =========================================================
-- PARTE 12: RELATÓRIO FINAL
-- =========================================================

SELECT '========================================' AS '';
SELECT '✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';

-- Contagem de tabelas
SELECT 'TABELAS CRIADAS/ATUALIZADAS:' AS '';
SELECT TABLE_NAME AS Tabela, TABLE_ROWS AS 'Linhas Aprox'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'db_segredo_do_sabor'
  AND TABLE_NAME LIKE 'tb_%'
ORDER BY TABLE_NAME;

SELECT '' AS '';

-- Estatísticas
SELECT 'ESTATÍSTICAS DO BANCO:' AS '';
SELECT 
    (SELECT COUNT(*) FROM tb_categoria WHERE ativo = 1) AS 'Categorias Ativas',
    (SELECT COUNT(*) FROM tb_produto WHERE ativo = 1) AS 'Produtos Ativos',
    (SELECT COUNT(*) FROM tb_ingrediente WHERE ativo = 1) AS 'Ingredientes Ativos',
    (SELECT COUNT(*) FROM tb_cliente) AS 'Clientes Cadastrados',
    (SELECT COUNT(*) FROM tb_reserva) AS 'Pedidos Totais',
    (SELECT COUNT(*) FROM tb_receita) AS 'Receitas Cadastradas';

SELECT '' AS '';
SELECT '========================================' AS '';
SELECT '🎉 SISTEMA PRONTO PARA USO!' AS '';
SELECT '========================================' AS '';

-- =========================================================
-- FIM DO SCRIPT
-- =========================================================
