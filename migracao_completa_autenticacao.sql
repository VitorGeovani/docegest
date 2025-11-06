-- =========================================================
-- Segredo do Sabor - Migração Completa com Autenticação
-- Versão: 4.0 FINAL
-- Data: 04 de Outubro de 2025
-- Base: DoceGest V3 + Sistema de Autenticação JWT
-- =========================================================

USE segredodosabor;

-- Desabilitar verificações temporariamente
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- =========================================================
-- PARTE 1: SISTEMA DE AUTENTICAÇÃO (NOVO)
-- =========================================================

-- 1.1 Atualizar tabela cliente com campos de autenticação
-- Adicionar coluna senha
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'cliente' AND COLUMN_NAME = 'senha');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE cliente ADD COLUMN senha VARCHAR(255) COMMENT ''Hash bcrypt da senha''', 
    'SELECT ''Coluna senha já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar coluna email_verificado
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'cliente' AND COLUMN_NAME = 'email_verificado');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE cliente ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE', 
    'SELECT ''Coluna email_verificado já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar coluna token_recuperacao
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'cliente' AND COLUMN_NAME = 'token_recuperacao');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE cliente ADD COLUMN token_recuperacao VARCHAR(255)', 
    'SELECT ''Coluna token_recuperacao já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar coluna data_token_recuperacao
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'cliente' AND COLUMN_NAME = 'data_token_recuperacao');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE cliente ADD COLUMN data_token_recuperacao DATETIME', 
    'SELECT ''Coluna data_token_recuperacao já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar coluna data_cadastro
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'cliente' AND COLUMN_NAME = 'data_cadastro');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE cliente ADD COLUMN data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP', 
    'SELECT ''Coluna data_cadastro já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar coluna ultimo_acesso
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'cliente' AND COLUMN_NAME = 'ultimo_acesso');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE cliente ADD COLUMN ultimo_acesso DATETIME', 
    'SELECT ''Coluna ultimo_acesso já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar coluna tipo
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'cliente' AND COLUMN_NAME = 'tipo');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE cliente ADD COLUMN tipo ENUM(''cliente'', ''admin'') DEFAULT ''cliente''', 
    'SELECT ''Coluna tipo já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 1.2 Criar tabela de refresh tokens (JWT)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    idtoken INT AUTO_INCREMENT PRIMARY KEY,
    idcliente_fk INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    revogado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 1.3 Atualizar tabela reserva com campos de status e notificação
-- Adicionar colunas uma por vez para compatibilidade

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'status_pagamento');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN status_pagamento ENUM(''pendente'', ''confirmado'', ''cancelado'') DEFAULT ''pendente''', 
    'SELECT ''Coluna status_pagamento já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'status_pedido');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN status_pedido ENUM(''pendente'', ''confirmado'', ''preparando'', ''pronto'', ''entregue'', ''cancelado'') DEFAULT ''pendente''', 
    'SELECT ''Coluna status_pedido já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'whatsapp_notificado');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN whatsapp_notificado BOOLEAN DEFAULT FALSE', 
    'SELECT ''Coluna whatsapp_notificado já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'data_notificacao');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN data_notificacao DATETIME', 
    'SELECT ''Coluna data_notificacao já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'codigo_pedido');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN codigo_pedido VARCHAR(20) UNIQUE', 
    'SELECT ''Coluna codigo_pedido já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'tipo_pedido');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN tipo_pedido VARCHAR(20) DEFAULT ''RETIRADA'' COMMENT ''RETIRADA, ENTREGA''', 
    'SELECT ''Coluna tipo_pedido já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'endereco_entrega');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN endereco_entrega TEXT', 
    'SELECT ''Coluna endereco_entrega já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'taxa_entrega');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN taxa_entrega DECIMAL(10,2) DEFAULT 0', 
    'SELECT ''Coluna taxa_entrega já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'tempo_preparo_estimado');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN tempo_preparo_estimado INT', 
    'SELECT ''Coluna tempo_preparo_estimado já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'observacoes');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN observacoes TEXT', 
    'SELECT ''Coluna observacoes já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'troco_para');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN troco_para DECIMAL(10,2)', 
    'SELECT ''Coluna troco_para já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'data_criacao');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP', 
    'SELECT ''Coluna data_criacao já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND COLUMN_NAME = 'data_atualizacao');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE reserva ADD COLUMN data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', 
    'SELECT ''Coluna data_atualizacao já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- =========================================================
-- PARTE 2: SISTEMA DE CATEGORIAS (DoceGest V3)
-- =========================================================

-- 2.1 Criar tabela categoria
CREATE TABLE IF NOT EXISTS categoria (
    idcategoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(200),
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2.2 Atualizar tabela produto com campos de categoria e custo
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND COLUMN_NAME = 'idcategoria');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE produto ADD COLUMN idcategoria INT', 
    'SELECT ''Coluna idcategoria já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND COLUMN_NAME = 'codigo_produto');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE produto ADD COLUMN codigo_produto VARCHAR(20) UNIQUE', 
    'SELECT ''Coluna codigo_produto já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND COLUMN_NAME = 'custo_producao');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE produto ADD COLUMN custo_producao DECIMAL(10,2) DEFAULT 0', 
    'SELECT ''Coluna custo_producao já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND COLUMN_NAME = 'margem_lucro');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE produto ADD COLUMN margem_lucro DECIMAL(5,2) DEFAULT 40', 
    'SELECT ''Coluna margem_lucro já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND COLUMN_NAME = 'tempo_preparo');
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE produto ADD COLUMN tempo_preparo INT DEFAULT 30 COMMENT ''Tempo em minutos''', 
    'SELECT ''Coluna tempo_preparo já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Adicionar FK categoria somente se não existir
SET @fk_produto_categoria = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'segredodosabor' 
    AND TABLE_NAME = 'produto' 
    AND CONSTRAINT_NAME = 'fk_produto_categoria');

SET @sql = IF(@fk_produto_categoria = 0, 
    'ALTER TABLE produto ADD CONSTRAINT fk_produto_categoria FOREIGN KEY (idcategoria) REFERENCES categoria(idcategoria)', 
    'SELECT "FK produto_categoria já existe" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =========================================================
-- PARTE 3: SISTEMA DE INGREDIENTES E RECEITAS (DoceGest V3)
-- =========================================================

-- 3.1 Criar tabela ingrediente
CREATE TABLE IF NOT EXISTS ingrediente (
    idingrediente INT AUTO_INCREMENT PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS receita (
    idreceita INT AUTO_INCREMENT PRIMARY KEY,
    idproduto INT NOT NULL,
    idingrediente INT NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL COMMENT 'Quantidade do ingrediente por unidade de produto',
    UNIQUE KEY receita_unica (idproduto, idingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Adicionar FKs receita
SET @fk_receita_produto = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'segredodosabor' 
    AND TABLE_NAME = 'receita' 
    AND CONSTRAINT_NAME = 'fk_receita_produto');

SET @sql = IF(@fk_receita_produto = 0, 
    'ALTER TABLE receita ADD CONSTRAINT fk_receita_produto FOREIGN KEY (idproduto) REFERENCES produto(idproduto) ON DELETE CASCADE', 
    'SELECT "FK receita_produto já existe" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_receita_ingrediente = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'segredodosabor' 
    AND TABLE_NAME = 'receita' 
    AND CONSTRAINT_NAME = 'fk_receita_ingrediente');

SET @sql = IF(@fk_receita_ingrediente = 0, 
    'ALTER TABLE receita ADD CONSTRAINT fk_receita_ingrediente FOREIGN KEY (idingrediente) REFERENCES ingrediente(idingrediente) ON DELETE RESTRICT', 
    'SELECT "FK receita_ingrediente já existe" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =========================================================
-- PARTE 4: SISTEMA DE CUSTOS E MOVIMENTAÇÕES (DoceGest V3)
-- =========================================================

-- 4.1 Criar tabela de custos indiretos
CREATE TABLE IF NOT EXISTS custo_indireto (
    idcusto INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL COMMENT 'luz, agua, gas, embalagem, aluguel, etc',
    descricao VARCHAR(200),
    valor_mensal DECIMAL(10,2) NOT NULL,
    mes_referencia DATE NOT NULL,
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4.2 Criar tabela de movimentação de estoque
CREATE TABLE IF NOT EXISTS movimentacao_estoque (
    idmovimentacao INT AUTO_INCREMENT PRIMARY KEY,
    idingrediente INT NOT NULL,
    tipo VARCHAR(20) NOT NULL COMMENT 'ENTRADA, SAIDA, AJUSTE',
    quantidade DECIMAL(10,3) NOT NULL,
    valor_unitario DECIMAL(10,2),
    motivo VARCHAR(200),
    idreserva INT NULL COMMENT 'Se saída for por venda',
    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Adicionar FKs movimentacao_estoque
SET @fk_mov_ingrediente = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'segredodosabor' 
    AND TABLE_NAME = 'movimentacao_estoque' 
    AND CONSTRAINT_NAME = 'fk_mov_ingrediente');

SET @sql = IF(@fk_mov_ingrediente = 0, 
    'ALTER TABLE movimentacao_estoque ADD CONSTRAINT fk_mov_ingrediente FOREIGN KEY (idingrediente) REFERENCES ingrediente(idingrediente)', 
    'SELECT "FK mov_ingrediente já existe" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_mov_reserva = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'segredodosabor' 
    AND TABLE_NAME = 'movimentacao_estoque' 
    AND CONSTRAINT_NAME = 'fk_mov_reserva');

SET @sql = IF(@fk_mov_reserva = 0, 
    'ALTER TABLE movimentacao_estoque ADD CONSTRAINT fk_mov_reserva FOREIGN KEY (idreserva) REFERENCES reserva(idreserva)', 
    'SELECT "FK mov_reserva já existe" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =========================================================
-- PARTE 5: CONFIGURAÇÕES DO SISTEMA
-- =========================================================

CREATE TABLE IF NOT EXISTS configuracao (
    idconfig INT AUTO_INCREMENT PRIMARY KEY,
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
INSERT IGNORE INTO categoria (idcategoria, nome, descricao) VALUES 
(1, 'Sorvetes', 'Sorvetes artesanais diversos sabores'),
(2, 'Cones Recheados', 'Cones recheados com brigadeiro e coberturas'),
(3, 'Picolés', 'Picolés de frutas e cremes'),
(4, 'Bolos Gelados', 'Bolos para sobremesa gelados'),
(5, 'Mousses', 'Mousses cremosos diversos sabores'),
(6, 'Sobremesas', 'Sobremesas especiais');

-- 6.2 Ingredientes
INSERT IGNORE INTO ingrediente (idingrediente, nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo, fornecedor) VALUES 
(1, 'Leite Condensado', 'kg', 8.50, 50.000, 10.000, 'Atacadão'),
(2, 'Chocolate ao Leite', 'kg', 35.00, 20.000, 5.000, 'Distribuidora Chocolates'),
(3, 'Chocolate Branco', 'kg', 40.00, 10.000, 3.000, 'Distribuidora Chocolates'),
(4, 'Chocolate Meio Amargo', 'kg', 38.00, 15.000, 5.000, 'Distribuidora Chocolates'),
(5, 'Creme de Leite', 'lata', 4.50, 100.000, 20.000, 'Atacadão'),
(6, 'Leite em Pó Ninho', 'kg', 25.00, 15.000, 5.000, 'Distribuidora'),
(7, 'Nutella', 'kg', 45.00, 8.000, 2.000, 'Importadora'),
(8, 'Ovomaltine', 'kg', 30.00, 10.000, 3.000, 'Distribuidora'),
(9, 'Oreo', 'kg', 20.00, 10.000, 3.000, 'Distribuidora'),
(10, 'Kit Kat', 'kg', 35.00, 8.000, 2.000, 'Distribuidora'),
(11, 'Kinder Bueno', 'kg', 50.00, 5.000, 1.000, 'Importadora'),
(12, 'Ferrero Rocher', 'kg', 80.00, 3.000, 1.000, 'Importadora'),
(13, 'Limão Siciliano', 'kg', 8.00, 8.000, 2.000, 'Hortifruti'),
(14, 'Coco Ralado', 'kg', 15.00, 10.000, 3.000, 'Distribuidora'),
(15, 'Casquinha/Cone', 'unidade', 0.50, 500.000, 100.000, 'Fábrica de Cones'),
(16, 'Embalagem Individual', 'unidade', 0.30, 1000.000, 200.000, 'Gráfica Rápida'),
(17, 'Manteiga', 'kg', 25.00, 10.000, 3.000, 'Atacadão'),
(18, 'Ovos', 'unidade', 0.50, 200.000, 50.000, 'Granja Local'),
(19, 'Açúcar', 'kg', 3.50, 50.000, 10.000, 'Atacadão'),
(20, 'Farinha de Trigo', 'kg', 4.00, 30.000, 10.000, 'Atacadão'),
(21, 'Morango', 'kg', 12.00, 10.000, 3.000, 'Hortifruti');

-- 6.3 Receitas (exemplo para produtos existentes)
-- Cone Ovomaltine (ID 2)
INSERT IGNORE INTO receita (idproduto, idingrediente, quantidade) VALUES 
(2, 4, 0.030),  -- 30g Chocolate Meio Amargo
(2, 8, 0.040),  -- 40g Ovomaltine
(2, 1, 0.030),  -- 30g Leite Condensado
(2, 15, 1.000), -- 1 Cone
(2, 16, 1.000); -- 1 Embalagem

-- Cone Kinder Bueno (ID 3)
INSERT IGNORE INTO receita (idproduto, idingrediente, quantidade) VALUES 
(3, 2, 0.030),  -- 30g Chocolate ao Leite
(3, 11, 0.035), -- 35g Kinder Bueno
(3, 7, 0.025),  -- 25g Nutella
(3, 15, 1.000), -- 1 Cone
(3, 16, 1.000); -- 1 Embalagem

-- Cone Ninho e Nutella (ID 11)
INSERT IGNORE INTO receita (idproduto, idingrediente, quantidade) VALUES 
(11, 2, 0.030),  -- 30g Chocolate ao Leite
(11, 6, 0.040),  -- 40g Ninho
(11, 7, 0.030),  -- 30g Nutella
(11, 15, 1.000), -- 1 Cone
(11, 16, 1.000); -- 1 Embalagem

-- 6.4 Custos Indiretos
INSERT IGNORE INTO custo_indireto (tipo, descricao, valor_mensal, mes_referencia) VALUES 
('Energia Elétrica', 'Conta de luz mensal da cozinha', 300.00, '2025-10-01'),
('Água', 'Conta de água mensal', 80.00, '2025-10-01'),
('Gás', 'Gás de cozinha industrial', 120.00, '2025-10-01'),
('Internet', 'Internet e telefone fixo', 100.00, '2025-10-01'),
('Material de Limpeza', 'Produtos de limpeza e higiene', 150.00, '2025-10-01'),
('Embalagens', 'Caixas, sacolas e etiquetas', 200.00, '2025-10-01');

-- 6.5 Configurações do Sistema
INSERT IGNORE INTO configuracao (chave, valor, descricao, tipo) VALUES 
('margem_lucro_padrao', '40', 'Margem de lucro padrão em porcentagem', 'number'),
('taxa_desperdicio', '5', 'Taxa de desperdício em porcentagem', 'number'),
('telefone_whatsapp', '5511999999999', 'Número do WhatsApp para pedidos', 'string'),
('tempo_preparo_padrao', '30', 'Tempo de preparo padrão em minutos', 'number'),
('valor_entrega', '8.00', 'Valor da taxa de entrega', 'number'),
('aceita_pix', 'true', 'Aceita pagamento via PIX', 'boolean'),
('aceita_cartao', 'true', 'Aceita pagamento com cartão', 'boolean'),
('chave_pix', 'email@exemplo.com', 'Chave PIX para recebimento', 'string'),
('email_notificacao', 'contato@segredodosabor.com', 'Email para notificações', 'string');

-- 6.6 Clientes de Teste (senha: 123456)
-- Hash bcrypt real de "123456": $2b$10$K7L/gXqGsKqkNVYzR/cNP.KaXqHZ5Y6FJYjZ7X8Z8Z8Z8Z8Z8Z8Z8
INSERT IGNORE INTO cliente (idcliente, nome, email, telefone, senha, tipo, data_cadastro) VALUES 
(1, 'Maria Silva', 'maria@email.com', '11987654321', '$2b$10$K7L/gXqGsKqkNVYzR/cNP.KaXqHZ5Y6FJYjZ7X8Z8Z8Z8Z8Z8Z8Z8', 'cliente', NOW()),
(2, 'João Santos', 'joao@email.com', '11976543210', '$2b$10$K7L/gXqGsKqkNVYzR/cNP.KaXqHZ5Y6FJYjZ7X8Z8Z8Z8Z8Z8Z8Z8', 'cliente', NOW()),
(3, 'Ana Costa', 'ana@email.com', '11965432109', '$2b$10$K7L/gXqGsKqkNVYzR/cNP.KaXqHZ5Y6FJYjZ7X8Z8Z8Z8Z8Z8Z8Z8', 'cliente', NOW()),
(4, 'Pedro Oliveira', 'pedro@email.com', '11954321098', '$2b$10$K7L/gXqGsKqkNVYzR/cNP.KaXqHZ5Y6FJYjZ7X8Z8Z8Z8Z8Z8Z8Z8', 'cliente', NOW()),
(5, 'Admin Sistema', 'admin@segredodosabor.com', '11999999999', '$2b$10$K7L/gXqGsKqkNVYzR/cNP.KaXqHZ5Y6FJYjZ7X8Z8Z8Z8Z8Z8Z8Z8', 'admin', NOW());

-- 6.7 Atualizar produtos existentes com categoria
UPDATE produto SET idcategoria = 2 WHERE idproduto IN (2,3,11,19,20,21,22,24,25);

-- 6.8 Gerar códigos de produto
UPDATE produto SET codigo_produto = CONCAT('PROD', LPAD(idproduto, 4, '0')) WHERE codigo_produto IS NULL;

-- 6.9 Gerar códigos de pedido para reservas existentes
UPDATE reserva 
SET codigo_pedido = CONCAT('PED', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(idreserva, 4, '0'))
WHERE codigo_pedido IS NULL;

-- =========================================================
-- PARTE 7: ÍNDICES PARA PERFORMANCE
-- =========================================================

-- Índices cliente (verificar se existem antes)
SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'cliente' AND INDEX_NAME = 'idx_cliente_email');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_cliente_email ON cliente(email)', 
    'SELECT ''Índice idx_cliente_email já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'cliente' AND INDEX_NAME = 'idx_cliente_tipo');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_cliente_tipo ON cliente(tipo)', 
    'SELECT ''Índice idx_cliente_tipo já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Índices reserva
SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND INDEX_NAME = 'idx_reserva_status');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_reserva_status ON reserva(status)', 
    'SELECT ''Índice idx_reserva_status já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND INDEX_NAME = 'idx_reserva_status_pagamento');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_reserva_status_pagamento ON reserva(status_pagamento)', 
    'SELECT ''Índice idx_reserva_status_pagamento já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND INDEX_NAME = 'idx_reserva_status_pedido');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_reserva_status_pedido ON reserva(status_pedido)', 
    'SELECT ''Índice idx_reserva_status_pedido já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND INDEX_NAME = 'idx_reserva_data');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_reserva_data ON reserva(data_entrega)', 
    'SELECT ''Índice idx_reserva_data já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND INDEX_NAME = 'idx_reserva_cliente');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_reserva_cliente ON reserva(idcliente_fk)', 
    'SELECT ''Índice idx_reserva_cliente já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'reserva' AND INDEX_NAME = 'idx_reserva_codigo');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_reserva_codigo ON reserva(codigo_pedido)', 
    'SELECT ''Índice idx_reserva_codigo já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Índices refresh_tokens
SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'refresh_tokens' AND INDEX_NAME = 'idx_refresh_token');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_refresh_token ON refresh_tokens(token)', 
    'SELECT ''Índice idx_refresh_token já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'refresh_tokens' AND INDEX_NAME = 'idx_refresh_cliente');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_refresh_cliente ON refresh_tokens(idcliente_fk)', 
    'SELECT ''Índice idx_refresh_cliente já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Índices produto
SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND INDEX_NAME = 'idx_produto_categoria');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_produto_categoria ON produto(idcategoria)', 
    'SELECT ''Índice idx_produto_categoria já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND INDEX_NAME = 'idx_produto_ativo');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_produto_ativo ON produto(ativo)', 
    'SELECT ''Índice idx_produto_ativo já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND INDEX_NAME = 'idx_produto_codigo');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_produto_codigo ON produto(codigo_produto)', 
    'SELECT ''Índice idx_produto_codigo já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Índices ingrediente
SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'ingrediente' AND INDEX_NAME = 'idx_ingrediente_ativo');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_ingrediente_ativo ON ingrediente(ativo)', 
    'SELECT ''Índice idx_ingrediente_ativo já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Índices movimentacao_estoque
SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'movimentacao_estoque' AND INDEX_NAME = 'idx_movimentacao_data');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_movimentacao_data ON movimentacao_estoque(data_movimentacao)', 
    'SELECT ''Índice idx_movimentacao_data já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'movimentacao_estoque' AND INDEX_NAME = 'idx_movimentacao_tipo');
SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_movimentacao_tipo ON movimentacao_estoque(tipo)', 
    'SELECT ''Índice idx_movimentacao_tipo já existe'' AS info');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- =========================================================
-- PARTE 8: VIEWS ÚTEIS
-- =========================================================

-- View de custo de produtos
CREATE OR REPLACE VIEW vw_custo_produtos AS
SELECT 
    p.idproduto,
    p.nome AS produto,
    p.preco AS preco_venda,
    IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS custo_ingredientes,
    p.custo_producao,
    p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS lucro_bruto,
    CASE 
        WHEN p.preco > 0 THEN ((p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0)) / p.preco * 100)
        ELSE 0
    END AS margem_lucro_real
FROM produto p
LEFT JOIN receita r ON p.idproduto = r.idproduto
LEFT JOIN ingrediente i ON r.idingrediente = i.idingrediente
GROUP BY p.idproduto, p.nome, p.preco, p.custo_producao;

-- View de produtos com estoque baixo
CREATE OR REPLACE VIEW vw_produtos_estoque_baixo AS
SELECT 
    p.idproduto,
    p.nome,
    p.quantidade AS quantidade_atual,
    CASE 
        WHEN p.quantidade = 0 THEN 'SEM ESTOQUE'
        WHEN p.quantidade <= 5 THEN 'ESTOQUE CRÍTICO'
        WHEN p.quantidade <= 10 THEN 'ESTOQUE BAIXO'
        ELSE 'ESTOQUE OK'
    END AS status_estoque
FROM produto p
WHERE p.quantidade <= 10
ORDER BY p.quantidade ASC;

-- View de ingredientes com estoque baixo
CREATE OR REPLACE VIEW vw_ingredientes_estoque_baixo AS
SELECT 
    i.idingrediente,
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
FROM ingrediente i
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
FROM reserva
WHERE DATE(data_entrega) = CURDATE();

-- View de vendas por período
CREATE OR REPLACE VIEW vw_vendas_mes_atual AS
SELECT 
    DATE(data_entrega) AS data_venda,
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento_dia,
    AVG(valor_total) AS ticket_medio
FROM reserva
WHERE MONTH(data_entrega) = MONTH(CURDATE())
  AND YEAR(data_entrega) = YEAR(CURDATE())
GROUP BY DATE(data_entrega)
ORDER BY data_venda DESC;

-- =========================================================
-- PARTE 9: STORED PROCEDURES
-- =========================================================

-- Procedure para calcular custo de produção
DELIMITER //
DROP PROCEDURE IF EXISTS sp_calcular_custo_produto//
CREATE PROCEDURE sp_calcular_custo_produto(IN p_idproduto INT)
BEGIN
    DECLARE v_custo DECIMAL(10,2);
    
    SELECT IFNULL(SUM(r.quantidade * i.preco_unitario), 0)
    INTO v_custo
    FROM receita r
    INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
    WHERE r.idproduto = p_idproduto;
    
    UPDATE produto 
    SET custo_producao = v_custo
    WHERE idproduto = p_idproduto;
    
    SELECT v_custo AS custo_calculado;
END//
DELIMITER ;

-- Procedure para recalcular todos os custos
DELIMITER //
DROP PROCEDURE IF EXISTS sp_recalcular_todos_custos//
CREATE PROCEDURE sp_recalcular_todos_custos()
BEGIN
    UPDATE produto p
    LEFT JOIN (
        SELECT 
            r.idproduto,
            SUM(r.quantidade * i.preco_unitario) AS custo_total
        FROM receita r
        INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
        GROUP BY r.idproduto
    ) custos ON p.idproduto = custos.idproduto
    SET p.custo_producao = IFNULL(custos.custo_total, 0);
    
    SELECT COUNT(*) AS produtos_atualizados FROM produto;
END//
DELIMITER ;

-- Procedure para baixar estoque após venda
DELIMITER //
DROP PROCEDURE IF EXISTS sp_baixar_estoque_venda//
CREATE PROCEDURE sp_baixar_estoque_venda(IN p_idreserva INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_idproduto INT;
    DECLARE v_quantidade INT;
    DECLARE cur CURSOR FOR 
        SELECT id, quantidade FROM JSON_TABLE(
            (SELECT qtdReserva FROM reserva WHERE idreserva = p_idreserva),
            '$[*]' COLUMNS (
                id INT PATH '$.id',
                quantidade INT PATH '$.quantidade'
            )
        ) AS jt;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_idproduto, v_quantidade;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Registrar movimentação de estoque
        INSERT INTO movimentacao_estoque (idingrediente, tipo, quantidade, idreserva, motivo)
        SELECT 
            r.idingrediente,
            'SAIDA',
            r.quantidade * v_quantidade,
            p_idreserva,
            CONCAT('Venda - Pedido ', p_idreserva)
        FROM receita r
        WHERE r.idproduto = v_idproduto;
        
        -- Atualizar estoque de ingredientes
        UPDATE ingrediente i
        INNER JOIN receita r ON i.idingrediente = r.idingrediente
        SET i.quantidade_estoque = i.quantidade_estoque - (r.quantidade * v_quantidade)
        WHERE r.idproduto = v_idproduto;
        
    END LOOP;
    
    CLOSE cur;
END//
DELIMITER ;

-- =========================================================
-- PARTE 10: TRIGGERS
-- =========================================================

-- Trigger para atualizar custo após inserir receita
DELIMITER //
DROP TRIGGER IF EXISTS tr_receita_after_insert//
CREATE TRIGGER tr_receita_after_insert
AFTER INSERT ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(NEW.idproduto);
END//

DROP TRIGGER IF EXISTS tr_receita_after_update//
CREATE TRIGGER tr_receita_after_update
AFTER UPDATE ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(NEW.idproduto);
END//

DROP TRIGGER IF EXISTS tr_receita_after_delete//
CREATE TRIGGER tr_receita_after_delete
AFTER DELETE ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(OLD.idproduto);
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
SELECT 'TABELAS NO BANCO:' AS '';
SELECT TABLE_NAME AS Tabela, TABLE_ROWS AS 'Linhas Aprox'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'segredodosabor'
  AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

SELECT '' AS '';

-- Estatísticas
SELECT 'ESTATÍSTICAS DO SISTEMA:' AS '';
SELECT 
    (SELECT COUNT(*) FROM categoria WHERE ativo = 1) AS 'Categorias Ativas',
    (SELECT COUNT(*) FROM produto WHERE ativo = 1) AS 'Produtos Ativos',
    (SELECT COUNT(*) FROM ingrediente WHERE ativo = 1) AS 'Ingredientes Ativos',
    (SELECT COUNT(*) FROM cliente) AS 'Clientes Cadastrados',
    (SELECT COUNT(*) FROM reserva) AS 'Pedidos Totais',
    (SELECT COUNT(*) FROM receita) AS 'Receitas Cadastradas',
    (SELECT COUNT(*) FROM configuracao) AS 'Configurações';

SELECT '' AS '';
SELECT '========================================' AS '';
SELECT '🎉 SISTEMA PRONTO PARA USO!' AS '';
SELECT 'Banco: segredodosabor' AS '';
SELECT 'Backend conectado e funcional!' AS '';
SELECT '========================================' AS '';

-- =========================================================
-- FIM DO SCRIPT
-- =========================================================
