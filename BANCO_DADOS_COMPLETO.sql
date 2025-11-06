-- =========================================================
-- SEGREDO DO SABOR - DOCUMENTAÇÃO COMPLETA DO BANCO DE DADOS
-- Sistema de Gestão de Confeitaria com E-commerce
-- Versão: 4.0 FINAL - DoceGest MVP
-- Data: 13 de Outubro de 2025
-- =========================================================
-- DESCRIÇÃO:
-- Sistema completo para gestão de confeitaria incluindo:
-- - E-commerce (catálogo, carrinho, checkout)
-- - Gestão de pedidos e reservas
-- - Controle de estoque de produtos e ingredientes
-- - Sistema de receitas e custos
-- - Autenticação JWT (clientes e administradores)
-- - Notificações WhatsApp
-- - Relatórios e dashboards
-- =========================================================

-- =========================================================
-- CONFIGURAÇÃO INICIAL
-- =========================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS segredodosabor
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE segredodosabor;

-- Desabilitar verificações temporariamente para instalação
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- =========================================================
-- MÓDULO 1: GESTÃO DE CLIENTES E AUTENTICAÇÃO
-- =========================================================

-- Tabela: cliente
-- Descrição: Armazena dados dos clientes/usuários do sistema
-- Funcionalidades: Login, cadastro, recuperação de senha
CREATE TABLE IF NOT EXISTS cliente (
    idcliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    
    -- Campos de autenticação (JWT)
    senha VARCHAR(255) COMMENT 'Hash bcrypt da senha do usuário',
    email_verificado BOOLEAN DEFAULT FALSE,
    token_recuperacao VARCHAR(255),
    data_token_recuperacao DATETIME,
    tipo ENUM('cliente', 'admin') DEFAULT 'cliente',
    
    -- Campos de auditoria
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME,
    
    INDEX idx_cliente_email (email),
    INDEX idx_cliente_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Clientes do sistema com autenticação JWT';

-- Tabela: refresh_tokens
-- Descrição: Tokens de atualização para autenticação JWT
-- Funcionalidades: Refresh de tokens, controle de sessões
CREATE TABLE IF NOT EXISTS refresh_tokens (
    idtoken INT AUTO_INCREMENT PRIMARY KEY,
    idcliente_fk INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    revogado BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente) ON DELETE CASCADE,
    INDEX idx_refresh_token (token),
    INDEX idx_refresh_cliente (idcliente_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Tokens de refresh para autenticação JWT';

-- =========================================================
-- MÓDULO 2: CATÁLOGO DE PRODUTOS
-- =========================================================

-- Tabela: categoria
-- Descrição: Categorias para organização dos produtos
-- Exemplos: Cones Recheados, Sorvetes, Bolos, Doces Gourmet
CREATE TABLE IF NOT EXISTS categoria (
    idcategoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(200),
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_categoria_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Categorias de produtos para organização do catálogo';

-- Tabela: produto
-- Descrição: Produtos disponíveis no catálogo
-- Funcionalidades: E-commerce, gestão de estoque, precificação
CREATE TABLE IF NOT EXISTS produto (
    idproduto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT DEFAULT 0 COMMENT 'Estoque disponível',
    img_Produto VARCHAR(255),
    ativo TINYINT DEFAULT 1,
    
    -- Campos de gestão
    idcategoria INT,
    codigo_produto VARCHAR(20) UNIQUE,
    custo_producao DECIMAL(10,2) DEFAULT 0,
    margem_lucro DECIMAL(5,2) DEFAULT 40 COMMENT 'Porcentagem de lucro',
    tempo_preparo INT DEFAULT 30 COMMENT 'Tempo em minutos',
    
    -- Auditoria
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idcategoria) REFERENCES categoria(idcategoria),
    INDEX idx_produto_categoria (idcategoria),
    INDEX idx_produto_ativo (ativo),
    INDEX idx_produto_codigo (codigo_produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Produtos do catálogo - disponíveis para venda';

-- =========================================================
-- MÓDULO 3: PEDIDOS E RESERVAS
-- =========================================================

-- Tabela: reserva
-- Descrição: Pedidos/reservas realizados pelos clientes
-- Funcionalidades: Carrinho, checkout, acompanhamento de pedidos
CREATE TABLE IF NOT EXISTS reserva (
    idreserva INT AUTO_INCREMENT PRIMARY KEY,
    idcliente_fk INT NOT NULL,
    
    -- Dados do pedido
    data_entrega DATE NOT NULL,
    hora_entrega TIME NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    pagamento VARCHAR(50) NOT NULL COMMENT 'PIX, Dinheiro, Cartão, etc',
    status VARCHAR(20) DEFAULT 'Pendente' COMMENT 'Pendente, Confirmado, Preparando, Pronto, Entregue, Cancelado',
    
    -- Produtos do pedido (JSON)
    qtdReserva JSON NOT NULL COMMENT 'Array com {id, nome, quantidade, preco}',
    
    -- Campos adicionais de pedido
    status_pagamento ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
    status_pedido ENUM('pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado') DEFAULT 'pendente',
    codigo_pedido VARCHAR(20) UNIQUE,
    tipo_pedido VARCHAR(20) DEFAULT 'RETIRADA' COMMENT 'RETIRADA ou ENTREGA',
    
    -- Dados de entrega
    endereco_entrega TEXT,
    taxa_entrega DECIMAL(10,2) DEFAULT 0,
    tempo_preparo_estimado INT COMMENT 'Minutos',
    observacoes TEXT,
    troco_para DECIMAL(10,2),
    
    -- Notificações WhatsApp
    whatsapp_notificado BOOLEAN DEFAULT FALSE,
    data_notificacao DATETIME,
    
    -- Auditoria
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente),
    INDEX idx_reserva_status (status),
    INDEX idx_reserva_status_pagamento (status_pagamento),
    INDEX idx_reserva_status_pedido (status_pedido),
    INDEX idx_reserva_data (data_entrega),
    INDEX idx_reserva_cliente (idcliente_fk),
    INDEX idx_reserva_codigo (codigo_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Pedidos/reservas dos clientes';

-- =========================================================
-- MÓDULO 4: GESTÃO DE INGREDIENTES E RECEITAS
-- =========================================================

-- Tabela: ingrediente
-- Descrição: Ingredientes usados na produção dos produtos
-- Funcionalidades: Controle de estoque, cálculo de custos
CREATE TABLE IF NOT EXISTS ingrediente (
    idingrediente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    unidade_medida VARCHAR(20) NOT NULL COMMENT 'kg, g, L, ml, unidade',
    preco_unitario DECIMAL(10,2) NOT NULL,
    quantidade_estoque DECIMAL(10,3) NOT NULL DEFAULT 0,
    estoque_minimo DECIMAL(10,3) DEFAULT 0,
    fornecedor VARCHAR(100),
    ativo TINYINT DEFAULT 1,
    
    -- Auditoria
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_ingrediente_ativo (ativo),
    INDEX idx_ingrediente_estoque (quantidade_estoque)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Ingredientes para produção de produtos';

-- Tabela: receita
-- Descrição: Receitas que compõem cada produto (BOM - Bill of Materials)
-- Funcionalidades: Cálculo automático de custos, controle de estoque
CREATE TABLE IF NOT EXISTS receita (
    idreceita INT AUTO_INCREMENT PRIMARY KEY,
    idproduto INT NOT NULL,
    idingrediente INT NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL COMMENT 'Quantidade do ingrediente por unidade de produto',
    
    UNIQUE KEY receita_unica (idproduto, idingrediente),
    FOREIGN KEY (idproduto) REFERENCES produto(idproduto) ON DELETE CASCADE,
    FOREIGN KEY (idingrediente) REFERENCES ingrediente(idingrediente) ON DELETE RESTRICT,
    INDEX idx_receita_produto (idproduto),
    INDEX idx_receita_ingrediente (idingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Receitas - ingredientes necessários para cada produto';

-- Tabela: movimentacao_estoque
-- Descrição: Histórico de movimentações de estoque
-- Funcionalidades: Rastreabilidade, auditoria de estoque
CREATE TABLE IF NOT EXISTS movimentacao_estoque (
    idmovimentacao INT AUTO_INCREMENT PRIMARY KEY,
    idingrediente INT NOT NULL,
    tipo VARCHAR(20) NOT NULL COMMENT 'ENTRADA, SAIDA, AJUSTE',
    quantidade DECIMAL(10,3) NOT NULL,
    valor_unitario DECIMAL(10,2),
    motivo VARCHAR(200),
    idreserva INT NULL COMMENT 'Se saída for por venda',
    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(100),
    
    FOREIGN KEY (idingrediente) REFERENCES ingrediente(idingrediente),
    FOREIGN KEY (idreserva) REFERENCES reserva(idreserva),
    INDEX idx_movimentacao_data (data_movimentacao),
    INDEX idx_movimentacao_tipo (tipo),
    INDEX idx_movimentacao_ingrediente (idingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Histórico de movimentações de estoque de ingredientes';

-- =========================================================
-- MÓDULO 5: GESTÃO FINANCEIRA
-- =========================================================

-- Tabela: custo_indireto
-- Descrição: Custos fixos e indiretos da operação
-- Exemplos: Luz, água, gás, aluguel, embalagens
CREATE TABLE IF NOT EXISTS custo_indireto (
    idcusto INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL COMMENT 'luz, agua, gas, embalagem, aluguel, etc',
    descricao VARCHAR(200),
    valor_mensal DECIMAL(10,2) NOT NULL,
    mes_referencia DATE NOT NULL,
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_custo_tipo (tipo),
    INDEX idx_custo_mes (mes_referencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Custos indiretos mensais da operação';

-- =========================================================
-- MÓDULO 6: CONFIGURAÇÕES DO SISTEMA
-- =========================================================

-- Tabela: configuracao
-- Descrição: Configurações gerais do sistema
-- Exemplos: Taxa de entrega, WhatsApp, formas de pagamento
CREATE TABLE IF NOT EXISTS configuracao (
    idconfig INT AUTO_INCREMENT PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    descricao VARCHAR(200),
    tipo VARCHAR(20) DEFAULT 'string' COMMENT 'string, number, boolean, json',
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_configuracao_chave (chave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Configurações gerais do sistema';

-- =========================================================
-- VIEWS - CONSULTAS OTIMIZADAS
-- =========================================================

-- View: vw_custo_produtos
-- Descrição: Análise de custos e margem de lucro dos produtos
CREATE OR REPLACE VIEW vw_custo_produtos AS
SELECT 
    p.idproduto,
    p.nome AS produto,
    p.codigo_produto,
    c.nome AS categoria,
    p.preco AS preco_venda,
    IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS custo_ingredientes,
    p.custo_producao AS custo_cadastrado,
    p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS lucro_bruto,
    CASE 
        WHEN p.preco > 0 THEN 
            ROUND(((p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0)) / p.preco * 100), 2)
        ELSE 0
    END AS margem_lucro_real,
    p.quantidade AS estoque_atual,
    p.ativo
FROM produto p
LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
LEFT JOIN receita r ON p.idproduto = r.idproduto
LEFT JOIN ingrediente i ON r.idingrediente = i.idingrediente
WHERE p.ativo = 1
GROUP BY p.idproduto, p.nome, p.codigo_produto, c.nome, p.preco, p.custo_producao, p.quantidade, p.ativo;

-- View: vw_produtos_estoque_baixo
-- Descrição: Produtos com estoque baixo ou crítico
CREATE OR REPLACE VIEW vw_produtos_estoque_baixo AS
SELECT 
    p.idproduto,
    p.nome,
    p.codigo_produto,
    c.nome AS categoria,
    p.quantidade AS quantidade_atual,
    CASE 
        WHEN p.quantidade = 0 THEN 'SEM ESTOQUE'
        WHEN p.quantidade <= 5 THEN 'ESTOQUE CRÍTICO'
        WHEN p.quantidade <= 10 THEN 'ESTOQUE BAIXO'
        ELSE 'ESTOQUE OK'
    END AS status_estoque,
    p.preco,
    p.ativo
FROM produto p
LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
WHERE p.quantidade <= 10 AND p.ativo = 1
ORDER BY p.quantidade ASC;

-- View: vw_ingredientes_estoque_baixo
-- Descrição: Ingredientes que precisam ser repostos
CREATE OR REPLACE VIEW vw_ingredientes_estoque_baixo AS
SELECT 
    i.idingrediente,
    i.nome,
    i.quantidade_estoque,
    i.estoque_minimo,
    i.unidade_medida,
    i.preco_unitario,
    i.fornecedor,
    CASE 
        WHEN i.quantidade_estoque = 0 THEN 'SEM ESTOQUE'
        WHEN i.quantidade_estoque <= i.estoque_minimo THEN 'COMPRAR URGENTE'
        WHEN i.quantidade_estoque <= (i.estoque_minimo * 1.5) THEN 'COMPRAR EM BREVE'
        ELSE 'ESTOQUE OK'
    END AS status,
    GREATEST(0, ROUND((i.estoque_minimo * 2 - i.quantidade_estoque), 3)) AS quantidade_comprar,
    GREATEST(0, ROUND((i.estoque_minimo * 2 - i.quantidade_estoque) * i.preco_unitario, 2)) AS valor_estimado
FROM ingrediente i
WHERE i.quantidade_estoque <= (i.estoque_minimo * 1.5)
  AND i.ativo = 1
ORDER BY i.quantidade_estoque ASC;

-- View: vw_vendas_hoje
-- Descrição: Resumo das vendas do dia atual
CREATE OR REPLACE VIEW vw_vendas_hoje AS
SELECT 
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento_total,
    CASE 
        WHEN COUNT(*) > 0 THEN ROUND(AVG(valor_total), 2)
        ELSE 0
    END AS ticket_medio,
    SUM(CASE WHEN status = 'Confirmado' THEN 1 ELSE 0 END) AS pedidos_confirmados,
    SUM(CASE WHEN status = 'Pendente' THEN 1 ELSE 0 END) AS pedidos_pendentes,
    SUM(CASE WHEN status = 'Cancelado' THEN 1 ELSE 0 END) AS pedidos_cancelados,
    SUM(CASE WHEN tipo_pedido = 'ENTREGA' THEN 1 ELSE 0 END) AS entregas,
    SUM(CASE WHEN tipo_pedido = 'RETIRADA' THEN 1 ELSE 0 END) AS retiradas
FROM reserva
WHERE DATE(data_entrega) = CURDATE();

-- View: vw_vendas_mes_atual
-- Descrição: Vendas diárias do mês atual
CREATE OR REPLACE VIEW vw_vendas_mes_atual AS
SELECT 
    DATE(data_entrega) AS data_venda,
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento_dia,
    ROUND(AVG(valor_total), 2) AS ticket_medio,
    SUM(CASE WHEN tipo_pedido = 'ENTREGA' THEN 1 ELSE 0 END) AS entregas,
    SUM(CASE WHEN tipo_pedido = 'RETIRADA' THEN 1 ELSE 0 END) AS retiradas
FROM reserva
WHERE MONTH(data_entrega) = MONTH(CURDATE())
  AND YEAR(data_entrega) = YEAR(CURDATE())
  AND status != 'Cancelado'
GROUP BY DATE(data_entrega)
ORDER BY data_venda DESC;

-- View: vw_produtos_mais_vendidos
-- Descrição: Ranking dos produtos mais vendidos
CREATE OR REPLACE VIEW vw_produtos_mais_vendidos AS
SELECT 
    p.idproduto,
    p.nome,
    p.codigo_produto,
    c.nome AS categoria,
    p.preco,
    COUNT(DISTINCT r.idreserva) AS total_pedidos,
    p.quantidade AS estoque_atual
FROM produto p
LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
LEFT JOIN reserva r ON JSON_CONTAINS(r.qtdReserva, JSON_OBJECT('id', p.idproduto), '$')
WHERE r.status != 'Cancelado' OR r.status IS NULL
GROUP BY p.idproduto, p.nome, p.codigo_produto, c.nome, p.preco, p.quantidade
ORDER BY total_pedidos DESC;

-- View: vw_clientes_ativos
-- Descrição: Clientes com pedidos realizados
CREATE OR REPLACE VIEW vw_clientes_ativos AS
SELECT 
    c.idcliente,
    c.nome,
    c.email,
    c.telefone,
    c.tipo,
    COUNT(r.idreserva) AS total_pedidos,
    SUM(r.valor_total) AS valor_total_compras,
    MAX(r.data_entrega) AS ultima_compra,
    c.data_cadastro
FROM cliente c
LEFT JOIN reserva r ON c.idcliente = r.idcliente_fk
WHERE r.status != 'Cancelado' OR r.status IS NULL
GROUP BY c.idcliente, c.nome, c.email, c.telefone, c.tipo, c.data_cadastro
ORDER BY total_pedidos DESC;

-- =========================================================
-- STORED PROCEDURES
-- =========================================================

-- Procedure: sp_calcular_custo_produto
-- Descrição: Calcula o custo de produção baseado na receita
DELIMITER //
DROP PROCEDURE IF EXISTS sp_calcular_custo_produto//
CREATE PROCEDURE sp_calcular_custo_produto(IN p_idproduto INT)
BEGIN
    DECLARE v_custo DECIMAL(10,2);
    
    -- Calcular custo somando ingredientes da receita
    SELECT IFNULL(SUM(r.quantidade * i.preco_unitario), 0)
    INTO v_custo
    FROM receita r
    INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
    WHERE r.idproduto = p_idproduto
      AND i.ativo = 1;
    
    -- Atualizar custo no produto
    UPDATE produto 
    SET custo_producao = v_custo,
        data_atualizacao = NOW()
    WHERE idproduto = p_idproduto;
    
    -- Retornar resultado
    SELECT 
        p_idproduto AS produto_id,
        v_custo AS custo_calculado,
        'Custo atualizado com sucesso' AS mensagem;
END//
DELIMITER ;

-- Procedure: sp_recalcular_todos_custos
-- Descrição: Recalcula custos de todos os produtos
DELIMITER //
DROP PROCEDURE IF EXISTS sp_recalcular_todos_custos//
CREATE PROCEDURE sp_recalcular_todos_custos()
BEGIN
    DECLARE v_produtos_atualizados INT DEFAULT 0;
    
    -- Atualizar custos de todos os produtos de uma vez
    UPDATE produto p
    LEFT JOIN (
        SELECT 
            r.idproduto,
            SUM(r.quantidade * i.preco_unitario) AS custo_total
        FROM receita r
        INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
        WHERE i.ativo = 1
        GROUP BY r.idproduto
    ) custos ON p.idproduto = custos.idproduto
    SET p.custo_producao = IFNULL(custos.custo_total, 0),
        p.data_atualizacao = NOW()
    WHERE p.ativo = 1;
    
    -- Contar produtos atualizados
    SELECT ROW_COUNT() INTO v_produtos_atualizados;
    
    -- Retornar resultado
    SELECT 
        v_produtos_atualizados AS produtos_atualizados,
        'Custos recalculados com sucesso' AS mensagem,
        NOW() AS data_execucao;
END//
DELIMITER ;

-- Procedure: sp_baixar_estoque_venda
-- Descrição: Baixa estoque de ingredientes após uma venda
DELIMITER //
DROP PROCEDURE IF EXISTS sp_baixar_estoque_venda//
CREATE PROCEDURE sp_baixar_estoque_venda(
    IN p_idreserva INT,
    IN p_usuario VARCHAR(100)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_idproduto INT;
    DECLARE v_quantidade INT;
    DECLARE v_cursor CURSOR FOR 
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(item, '$.id')) AS id,
            JSON_UNQUOTE(JSON_EXTRACT(item, '$.quantidade')) AS quantidade
        FROM reserva,
        JSON_TABLE(qtdReserva, '$[*]' COLUMNS (item JSON PATH '$')) AS jt
        WHERE idreserva = p_idreserva;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Iniciar transação
    START TRANSACTION;
    
    OPEN v_cursor;
    
    read_loop: LOOP
        FETCH v_cursor INTO v_idproduto, v_quantidade;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Registrar movimentação de cada ingrediente
        INSERT INTO movimentacao_estoque 
            (idingrediente, tipo, quantidade, idreserva, motivo, usuario, valor_unitario)
        SELECT 
            r.idingrediente,
            'SAIDA',
            r.quantidade * v_quantidade,
            p_idreserva,
            CONCAT('Venda - Pedido ', p_idreserva),
            p_usuario,
            i.preco_unitario
        FROM receita r
        INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
        WHERE r.idproduto = v_idproduto;
        
        -- Atualizar estoque de ingredientes
        UPDATE ingrediente i
        INNER JOIN receita r ON i.idingrediente = r.idingrediente
        SET i.quantidade_estoque = i.quantidade_estoque - (r.quantidade * v_quantidade),
            i.data_atualizacao = NOW()
        WHERE r.idproduto = v_idproduto;
        
        -- Atualizar estoque do produto
        UPDATE produto
        SET quantidade = GREATEST(0, quantidade - v_quantidade),
            data_atualizacao = NOW()
        WHERE idproduto = v_idproduto;
        
    END LOOP;
    
    CLOSE v_cursor;
    
    -- Confirmar transação
    COMMIT;
    
    SELECT 'Estoque baixado com sucesso' AS mensagem;
END//
DELIMITER ;

-- Procedure: sp_adicionar_receita
-- Descrição: Adiciona ingrediente à receita e recalcula custo
DELIMITER //
DROP PROCEDURE IF EXISTS sp_adicionar_receita//
CREATE PROCEDURE sp_adicionar_receita(
    IN p_idproduto INT,
    IN p_idingrediente INT,
    IN p_quantidade DECIMAL(10,3)
)
BEGIN
    -- Inserir ou atualizar receita
    INSERT INTO receita (idproduto, idingrediente, quantidade)
    VALUES (p_idproduto, p_idingrediente, p_quantidade)
    ON DUPLICATE KEY UPDATE quantidade = p_quantidade;
    
    -- Recalcular custo do produto
    CALL sp_calcular_custo_produto(p_idproduto);
    
    SELECT 'Receita adicionada e custo recalculado' AS mensagem;
END//
DELIMITER ;

-- Procedure: sp_gerar_codigo_pedido
-- Descrição: Gera código único para pedido
DELIMITER //
DROP PROCEDURE IF EXISTS sp_gerar_codigo_pedido//
CREATE PROCEDURE sp_gerar_codigo_pedido()
BEGIN
    DECLARE v_codigo VARCHAR(20);
    DECLARE v_existe INT;
    
    REPEAT
        -- Gerar código: PED + YYYYMMDD + NNNN (número sequencial)
        SET v_codigo = CONCAT(
            'PED',
            DATE_FORMAT(NOW(), '%Y%m%d'),
            LPAD(FLOOR(RAND() * 10000), 4, '0')
        );
        
        -- Verificar se já existe
        SELECT COUNT(*) INTO v_existe
        FROM reserva
        WHERE codigo_pedido = v_codigo;
        
    UNTIL v_existe = 0 END REPEAT;
    
    SELECT v_codigo AS codigo_pedido;
END//
DELIMITER ;

-- =========================================================
-- TRIGGERS
-- =========================================================

-- Trigger: tr_receita_after_insert
-- Descrição: Recalcula custo do produto ao adicionar ingrediente
DELIMITER //
DROP TRIGGER IF EXISTS tr_receita_after_insert//
CREATE TRIGGER tr_receita_after_insert
AFTER INSERT ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(NEW.idproduto);
END//

-- Trigger: tr_receita_after_update
-- Descrição: Recalcula custo do produto ao atualizar quantidade
DROP TRIGGER IF EXISTS tr_receita_after_update//
CREATE TRIGGER tr_receita_after_update
AFTER UPDATE ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(NEW.idproduto);
END//

-- Trigger: tr_receita_after_delete
-- Descrição: Recalcula custo do produto ao remover ingrediente
DROP TRIGGER IF EXISTS tr_receita_after_delete//
CREATE TRIGGER tr_receita_after_delete
AFTER DELETE ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(OLD.idproduto);
END//

-- Trigger: tr_ingrediente_after_update
-- Descrição: Recalcula custos de produtos ao atualizar preço do ingrediente
DROP TRIGGER IF EXISTS tr_ingrediente_after_update//
CREATE TRIGGER tr_ingrediente_after_update
AFTER UPDATE ON ingrediente
FOR EACH ROW
BEGIN
    -- Se o preço mudou, recalcular custos dos produtos que usam este ingrediente
    IF OLD.preco_unitario != NEW.preco_unitario THEN
        UPDATE produto p
        INNER JOIN receita r ON p.idproduto = r.idproduto
        SET p.custo_producao = (
            SELECT SUM(r2.quantidade * i2.preco_unitario)
            FROM receita r2
            INNER JOIN ingrediente i2 ON r2.idingrediente = i2.idingrediente
            WHERE r2.idproduto = p.idproduto
        )
        WHERE r.idingrediente = NEW.idingrediente;
    END IF;
END//

-- Trigger: tr_reserva_before_insert
-- Descrição: Gera código do pedido automaticamente
DROP TRIGGER IF EXISTS tr_reserva_before_insert//
CREATE TRIGGER tr_reserva_before_insert
BEFORE INSERT ON reserva
FOR EACH ROW
BEGIN
    IF NEW.codigo_pedido IS NULL OR NEW.codigo_pedido = '' THEN
        SET NEW.codigo_pedido = CONCAT(
            'PED',
            DATE_FORMAT(NOW(), '%Y%m%d'),
            LPAD((SELECT COALESCE(MAX(idreserva), 0) + 1 FROM reserva), 4, '0')
        );
    END IF;
END//
DELIMITER ;

-- =========================================================
-- DADOS INICIAIS - CATEGORIAS
-- =========================================================

INSERT IGNORE INTO categoria (idcategoria, nome, descricao) VALUES 
(1, 'Sorvetes', 'Sorvetes artesanais diversos sabores'),
(2, 'Cones Recheados', 'Cones recheados com brigadeiro e coberturas especiais'),
(3, 'Picolés', 'Picolés de frutas e cremes'),
(4, 'Bolos Gelados', 'Bolos para sobremesa gelados'),
(5, 'Mousses', 'Mousses cremosos diversos sabores'),
(6, 'Sobremesas', 'Sobremesas especiais'),
(7, 'Doces Gourmet', 'Doces finos e sofisticados'),
(8, 'Brigadeiros', 'Brigadeiros tradicionais e gourmet'),
(9, 'Veganos', 'Produtos sem ingredientes de origem animal');

-- =========================================================
-- DADOS INICIAIS - INGREDIENTES
-- =========================================================

INSERT IGNORE INTO ingrediente (idingrediente, nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo, fornecedor) VALUES 
-- Bases e Laticínios
(1, 'Leite Condensado', 'kg', 8.50, 50.000, 10.000, 'Atacadão'),
(2, 'Creme de Leite', 'lata', 4.50, 100.000, 20.000, 'Atacadão'),
(3, 'Manteiga', 'kg', 25.00, 10.000, 3.000, 'Atacadão'),
(4, 'Leite em Pó Ninho', 'kg', 25.00, 15.000, 5.000, 'Distribuidora'),

-- Chocolates
(5, 'Chocolate ao Leite', 'kg', 35.00, 20.000, 5.000, 'Distribuidora Chocolates'),
(6, 'Chocolate Meio Amargo', 'kg', 38.00, 15.000, 5.000, 'Distribuidora Chocolates'),
(7, 'Chocolate Branco', 'kg', 40.00, 10.000, 3.000, 'Distribuidora Chocolates'),

-- Coberturas Premium
(8, 'Nutella', 'kg', 45.00, 8.000, 2.000, 'Importadora'),
(9, 'Ovomaltine', 'kg', 30.00, 10.000, 3.000, 'Distribuidora'),
(10, 'Oreo', 'kg', 20.00, 10.000, 3.000, 'Distribuidora'),
(11, 'Kit Kat', 'kg', 35.00, 8.000, 2.000, 'Distribuidora'),
(12, 'Kinder Bueno', 'kg', 50.00, 5.000, 1.000, 'Importadora'),
(13, 'Ferrero Rocher', 'kg', 80.00, 3.000, 1.000, 'Importadora'),

-- Frutas
(14, 'Morango', 'kg', 12.00, 10.000, 3.000, 'Hortifruti'),
(15, 'Limão Siciliano', 'kg', 8.00, 8.000, 2.000, 'Hortifruti'),
(16, 'Maracujá', 'kg', 10.00, 5.000, 2.000, 'Hortifruti'),

-- Outros Ingredientes
(17, 'Coco Ralado', 'kg', 15.00, 10.000, 3.000, 'Distribuidora'),
(18, 'Ovos', 'unidade', 0.50, 200.000, 50.000, 'Granja Local'),
(19, 'Açúcar', 'kg', 3.50, 50.000, 10.000, 'Atacadão'),
(20, 'Farinha de Trigo', 'kg', 4.00, 30.000, 10.000, 'Atacadão'),

-- Embalagens
(21, 'Casquinha/Cone', 'unidade', 0.50, 500.000, 100.000, 'Fábrica de Cones'),
(22, 'Embalagem Individual', 'unidade', 0.30, 1000.000, 200.000, 'Gráfica Rápida'),
(23, 'Caixinha Brigadeiro', 'unidade', 0.40, 500.000, 100.000, 'Gráfica Rápida'),
(24, 'Saco Plástico', 'unidade', 0.15, 1000.000, 200.000, 'Distribuidora');

-- =========================================================
-- DADOS INICIAIS - CONFIGURAÇÕES
-- =========================================================

INSERT IGNORE INTO configuracao (chave, valor, descricao, tipo) VALUES 
-- Financeiro
('margem_lucro_padrao', '40', 'Margem de lucro padrão em porcentagem', 'number'),
('taxa_desperdicio', '5', 'Taxa de desperdício em porcentagem', 'number'),
('valor_entrega', '8.00', 'Valor da taxa de entrega', 'number'),

-- Operacional
('tempo_preparo_padrao', '30', 'Tempo de preparo padrão em minutos', 'number'),

-- Pagamentos
('aceita_pix', 'true', 'Aceita pagamento via PIX', 'boolean'),
('aceita_cartao', 'true', 'Aceita pagamento com cartão', 'boolean'),
('aceita_dinheiro', 'true', 'Aceita pagamento em dinheiro', 'boolean'),
('chave_pix', '', 'Chave PIX para recebimento', 'string'),

-- Contato
('telefone_whatsapp', '', 'Número do WhatsApp para pedidos', 'string'),
('email_notificacao', 'contato@segredodosabor.com', 'Email para notificações', 'string'),

-- Sistema
('sistema_nome', 'Segredo do Sabor', 'Nome do estabelecimento', 'string'),
('sistema_versao', '4.0', 'Versão do sistema', 'string');

-- =========================================================
-- DADOS INICIAIS - CUSTOS INDIRETOS
-- =========================================================

INSERT IGNORE INTO custo_indireto (tipo, descricao, valor_mensal, mes_referencia) VALUES 
('Energia Elétrica', 'Conta de luz mensal da cozinha', 300.00, DATE_FORMAT(NOW(), '%Y-%m-01')),
('Água', 'Conta de água mensal', 80.00, DATE_FORMAT(NOW(), '%Y-%m-01')),
('Gás', 'Gás de cozinha industrial', 120.00, DATE_FORMAT(NOW(), '%Y-%m-01')),
('Internet', 'Internet e telefone fixo', 100.00, DATE_FORMAT(NOW(), '%Y-%m-01')),
('Material de Limpeza', 'Produtos de limpeza e higiene', 150.00, DATE_FORMAT(NOW(), '%Y-%m-01')),
('Embalagens', 'Caixas, sacolas e etiquetas', 200.00, DATE_FORMAT(NOW(), '%Y-%m-01'));

-- =========================================================
-- RESTAURAR CONFIGURAÇÕES
-- =========================================================

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;

-- =========================================================
-- RELATÓRIO FINAL
-- =========================================================

SELECT '========================================' AS '';
SELECT '✅ BANCO DE DADOS CRIADO COM SUCESSO!' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';

-- Estatísticas
SELECT 'TABELAS CRIADAS:' AS '';
SELECT TABLE_NAME AS Tabela, TABLE_ROWS AS 'Linhas Aprox', 
       ROUND(DATA_LENGTH/1024, 2) AS 'Tamanho (KB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'segredodosabor'
  AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

SELECT '' AS '';
SELECT 'VIEWS CRIADAS:' AS '';
SELECT TABLE_NAME AS View
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'segredodosabor'
ORDER BY TABLE_NAME;

SELECT '' AS '';
SELECT 'PROCEDURES CRIADAS:' AS '';
SELECT ROUTINE_NAME AS Procedure
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'segredodosabor'
  AND ROUTINE_TYPE = 'PROCEDURE'
ORDER BY ROUTINE_NAME;

SELECT '' AS '';
SELECT '========================================' AS '';
SELECT '🎉 SISTEMA PRONTO PARA USO!' AS '';
SELECT 'Database: segredodosabor' AS '';
SELECT 'Charset: utf8mb4' AS '';
SELECT 'Engine: InnoDB' AS '';
SELECT '========================================' AS '';

-- =========================================================
-- FIM DO SCRIPT
-- =========================================================

/*
RESUMO DO BANCO DE DADOS:

📋 TABELAS PRINCIPAIS:
- cliente: Usuários do sistema (clientes e administradores)
- refresh_tokens: Tokens JWT para autenticação
- categoria: Categorias de produtos
- produto: Produtos do catálogo
- reserva: Pedidos/reservas
- ingrediente: Ingredientes para produção
- receita: Receitas (BOM) dos produtos
- movimentacao_estoque: Histórico de movimentações
- custo_indireto: Custos fixos mensais
- configuracao: Configurações do sistema

📊 VIEWS:
- vw_custo_produtos: Análise de custos e margens
- vw_produtos_estoque_baixo: Produtos com estoque crítico
- vw_ingredientes_estoque_baixo: Ingredientes para comprar
- vw_vendas_hoje: Resumo de vendas do dia
- vw_vendas_mes_atual: Vendas diárias do mês
- vw_produtos_mais_vendidos: Ranking de produtos
- vw_clientes_ativos: Clientes com histórico de compras

⚙️ PROCEDURES:
- sp_calcular_custo_produto: Calcula custo de um produto
- sp_recalcular_todos_custos: Recalcula todos os custos
- sp_baixar_estoque_venda: Baixa estoque após venda
- sp_adicionar_receita: Adiciona ingrediente à receita
- sp_gerar_codigo_pedido: Gera código único de pedido

🔄 TRIGGERS:
- Recalculo automático de custos ao alterar receitas
- Atualização de custos ao mudar preços de ingredientes
- Geração automática de código de pedido

📈 FUNCIONALIDADES:
✅ E-commerce completo (catálogo, carrinho, checkout)
✅ Gestão de pedidos com status e rastreamento
✅ Controle de estoque de produtos e ingredientes
✅ Cálculo automático de custos e margens
✅ Sistema de autenticação JWT
✅ Notificações WhatsApp
✅ Relatórios e dashboards
✅ Gestão financeira (custos indiretos)
✅ Sistema de receitas (BOM)
✅ Movimentação de estoque com rastreabilidade

🔐 SEGURANÇA:
- Senhas com hash bcrypt
- Tokens JWT com refresh tokens
- Foreign keys para integridade referencial
- Índices para performance
- Transações para operações críticas

📞 SUPORTE:
Para dúvidas sobre o banco de dados, consulte:
- API_DOCUMENTATION.md
- README.md
- SCRIPTS_MANUTENCAO.md
*/
