-- =========================================================
-- DoceGest MVP - Script de Migração de Banco de Dados
-- Versão: 3.0
-- Data: Outubro 2025
-- =========================================================

USE segredodosabor;

-- =========================================================
-- 1. TABELA DE CATEGORIAS
-- =========================================================
DROP TABLE IF EXISTS categoria;
CREATE TABLE categoria (
  idcategoria INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  descricao VARCHAR(200),
  ativo TINYINT DEFAULT 1,
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Inserir categorias padrão
INSERT INTO categoria (nome, descricao) VALUES 
('Sorvetes', 'Sorvetes artesanais diversos sabores'),
('Cones Recheados', 'Cones recheados com brigadeiro e coberturas'),
('Picolés', 'Picolés de frutas e cremes'),
('Bolos Gelados', 'Bolos para sobremesa gelados'),
('Mousses', 'Mousses cremosos diversos sabores'),
('Sobremesas', 'Sobremesas especiais');

-- =========================================================
-- 2. TABELA DE INGREDIENTES
-- =========================================================
DROP TABLE IF EXISTS ingrediente;
CREATE TABLE ingrediente (
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

-- Inserir ingredientes padrão
INSERT INTO ingrediente (nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo) VALUES 
('Leite Condensado', 'kg', 8.50, 10.000, 2.000),
('Chocolate ao Leite', 'kg', 35.00, 5.000, 1.000),
('Chocolate Branco', 'kg', 40.00, 3.000, 1.000),
('Chocolate Meio Amargo', 'kg', 38.00, 3.000, 1.000),
('Creme de Leite', 'L', 12.00, 8.000, 2.000),
('Leite em Pó Ninho', 'kg', 25.00, 4.000, 1.000),
('Nutella', 'kg', 45.00, 2.000, 0.500),
('Ovomaltine', 'kg', 30.00, 3.000, 0.500),
('Oreo', 'kg', 20.00, 2.000, 0.500),
('Kit Kat', 'kg', 35.00, 2.000, 0.500),
('Kinder Bueno', 'kg', 50.00, 1.500, 0.300),
('Ferrero Rocher', 'kg', 80.00, 1.000, 0.200),
('Limão Siciliano', 'kg', 8.00, 5.000, 1.000),
('Coco Ralado', 'kg', 15.00, 3.000, 0.500),
('Casquinha/Cone', 'unidade', 0.50, 200.000, 50.000),
('Embalagem Individual', 'unidade', 0.30, 500.000, 100.000);

-- =========================================================
-- 3. TABELA DE RECEITAS (Ingredientes por Produto)
-- =========================================================
DROP TABLE IF EXISTS receita;
CREATE TABLE receita (
  idreceita INT AUTO_INCREMENT PRIMARY KEY,
  idproduto INT NOT NULL,
  idingrediente INT NOT NULL,
  quantidade DECIMAL(10,3) NOT NULL COMMENT 'Quantidade do ingrediente por unidade de produto',
  FOREIGN KEY (idproduto) REFERENCES produto(idproduto) ON DELETE CASCADE,
  FOREIGN KEY (idingrediente) REFERENCES ingrediente(idingrediente) ON DELETE RESTRICT,
  UNIQUE KEY receita_unica (idproduto, idingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Exemplo de receitas para produtos existentes
-- Cone Ovomaltine (ID 2): 120g
INSERT INTO receita (idproduto, idingrediente, quantidade) VALUES 
(2, 4, 0.030),  -- 30g Chocolate ao Leite (cobertura)
(2, 8, 0.040),  -- 40g Ovomaltine (recheio)
(2, 1, 0.030),  -- 30g Leite Condensado
(2, 15, 1.000), -- 1 Cone
(2, 16, 1.000); -- 1 Embalagem

-- Cone Kinder Bueno (ID 3): 120g
INSERT INTO receita (idproduto, idingrediente, quantidade) VALUES 
(3, 4, 0.030),  -- 30g Chocolate ao Leite
(3, 11, 0.035), -- 35g Kinder Bueno
(3, 7, 0.025),  -- 25g Nutella
(3, 15, 1.000), -- 1 Cone
(3, 16, 1.000); -- 1 Embalagem

-- Cone Ninho e Nutella (ID 11): 120g
INSERT INTO receita (idproduto, idingrediente, quantidade) VALUES 
(11, 4, 0.030),  -- 30g Chocolate ao Leite
(11, 6, 0.040),  -- 40g Ninho
(11, 7, 0.030),  -- 30g Nutella
(11, 15, 1.000), -- 1 Cone
(11, 16, 1.000); -- 1 Embalagem

-- =========================================================
-- 4. TABELA DE CUSTOS INDIRETOS
-- =========================================================
DROP TABLE IF EXISTS custo_indireto;
CREATE TABLE custo_indireto (
  idcusto INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL COMMENT 'luz, agua, gas, embalagem, aluguel, etc',
  descricao VARCHAR(200),
  valor_mensal DECIMAL(10,2) NOT NULL,
  mes_referencia DATE NOT NULL,
  ativo TINYINT DEFAULT 1,
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Inserir custos indiretos padrão
INSERT INTO custo_indireto (tipo, descricao, valor_mensal, mes_referencia) VALUES 
('Energia Elétrica', 'Conta de luz mensal', 300.00, '2025-10-01'),
('Água', 'Conta de água mensal', 80.00, '2025-10-01'),
('Gás', 'Gás de cozinha', 120.00, '2025-10-01'),
('Internet', 'Internet e telefone', 100.00, '2025-10-01'),
('Material de Limpeza', 'Produtos de limpeza e higiene', 150.00, '2025-10-01');

-- =========================================================
-- 5. TABELA DE MOVIMENTAÇÃO DE ESTOQUE
-- =========================================================
DROP TABLE IF EXISTS movimentacao_estoque;
CREATE TABLE movimentacao_estoque (
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
  FOREIGN KEY (idreserva) REFERENCES reserva(idreserva)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- 6. TABELA DE CONFIGURAÇÕES DO SISTEMA
-- =========================================================
DROP TABLE IF EXISTS configuracao;
CREATE TABLE configuracao (
  idconfig INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  descricao VARCHAR(200),
  tipo VARCHAR(20) DEFAULT 'string' COMMENT 'string, number, boolean, json',
  data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Inserir configurações padrão
INSERT INTO configuracao (chave, valor, descricao, tipo) VALUES 
('margem_lucro_padrao', '40', 'Margem de lucro padrão em porcentagem', 'number'),
('taxa_desperdicio', '5', 'Taxa de desperdício em porcentagem', 'number'),
('telefone_whatsapp', '5511999999999', 'Número do WhatsApp para pedidos', 'string'),
('tempo_preparo_padrao', '30', 'Tempo de preparo padrão em minutos', 'number'),
('valor_entrega', '8.00', 'Valor da taxa de entrega', 'number'),
('aceita_pix', 'true', 'Aceita pagamento via PIX', 'boolean'),
('aceita_cartao', 'true', 'Aceita pagamento com cartão', 'boolean'),
('chave_pix', 'email@exemplo.com', 'Chave PIX para recebimento', 'string');

-- =========================================================
-- 7. ALTERAÇÕES NA TABELA PRODUTO
-- =========================================================

-- Adicionar categoria aos produtos
ALTER TABLE produto 
ADD COLUMN idcategoria INT,
ADD COLUMN codigo_produto VARCHAR(20) UNIQUE,
ADD COLUMN custo_producao DECIMAL(10,2) DEFAULT 0,
ADD COLUMN margem_lucro DECIMAL(5,2) DEFAULT 40,
ADD COLUMN tempo_preparo INT DEFAULT 30 COMMENT 'Tempo em minutos',
ADD FOREIGN KEY (idcategoria) REFERENCES categoria(idcategoria);

-- Atualizar produtos existentes com categoria padrão
UPDATE produto SET idcategoria = 2 WHERE idproduto IN (2,3,11,19,20,21,22,24,25);

-- Gerar códigos de produto
UPDATE produto SET codigo_produto = CONCAT('PROD', LPAD(idproduto, 4, '0'));

-- =========================================================
-- 8. ALTERAÇÕES NA TABELA RESERVA
-- =========================================================

-- Adicionar campos para melhor controle de pedidos
ALTER TABLE reserva 
ADD COLUMN codigo_pedido VARCHAR(20) UNIQUE,
ADD COLUMN tipo_pedido VARCHAR(20) DEFAULT 'RETIRADA' COMMENT 'RETIRADA, ENTREGA',
ADD COLUMN endereco_entrega TEXT,
ADD COLUMN taxa_entrega DECIMAL(10,2) DEFAULT 0,
ADD COLUMN tempo_preparo_estimado INT,
ADD COLUMN observacoes TEXT,
ADD COLUMN troco_para DECIMAL(10,2),
ADD COLUMN data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Gerar códigos de pedido para reservas existentes
UPDATE reserva 
SET codigo_pedido = CONCAT('PED', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(idreserva, 4, '0'))
WHERE codigo_pedido IS NULL;

-- =========================================================
-- 9. ÍNDICES PARA MELHOR PERFORMANCE
-- =========================================================

-- Índices na tabela reserva
CREATE INDEX idx_reserva_status ON reserva(status);
CREATE INDEX idx_reserva_data ON reserva(data_entrega);
CREATE INDEX idx_reserva_cliente ON reserva(idcliente_fk);

-- Índices na tabela produto
CREATE INDEX idx_produto_categoria ON produto(idcategoria);
CREATE INDEX idx_produto_ativo ON produto(ativo);

-- Índices na tabela ingrediente
CREATE INDEX idx_ingrediente_ativo ON ingrediente(ativo);

-- Índices na tabela movimentacao_estoque
CREATE INDEX idx_movimentacao_data ON movimentacao_estoque(data_movimentacao);
CREATE INDEX idx_movimentacao_tipo ON movimentacao_estoque(tipo);

-- =========================================================
-- 10. VIEWS ÚTEIS
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
    ((p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0)) / p.preco * 100) AS margem_lucro_real
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
    (i.estoque_minimo * 2 - i.quantidade_estoque) AS quantidade_comprar
FROM ingrediente i
WHERE i.quantidade_estoque <= (i.estoque_minimo * 1.5)
  AND i.ativo = 1
ORDER BY i.quantidade_estoque ASC;

-- View de vendas do dia
CREATE OR REPLACE VIEW vw_vendas_hoje AS
SELECT 
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento_total,
    AVG(valor_total) AS ticket_medio,
    SUM(CASE WHEN status = 'Confirmado' THEN 1 ELSE 0 END) AS pedidos_confirmados,
    SUM(CASE WHEN status = 'Pendente' THEN 1 ELSE 0 END) AS pedidos_pendentes,
    SUM(CASE WHEN status = 'Cancelado' THEN 1 ELSE 0 END) AS pedidos_cancelados
FROM reserva
WHERE DATE(data_entrega) = CURDATE();

-- =========================================================
-- 11. STORED PROCEDURES ÚTEIS
-- =========================================================

-- Procedure para calcular custo de produção de um produto
DELIMITER //
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

-- Procedure para baixar ingredientes do estoque
DELIMITER //
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
        
        -- Baixar ingredientes
        INSERT INTO movimentacao_estoque (idingrediente, tipo, quantidade, idreserva, motivo)
        SELECT 
            r.idingrediente,
            'SAIDA',
            r.quantidade * v_quantidade,
            p_idreserva,
            CONCAT('Venda - Pedido ', p_idreserva)
        FROM receita r
        WHERE r.idproduto = v_idproduto;
        
        -- Atualizar estoque
        UPDATE ingrediente i
        INNER JOIN receita r ON i.idingrediente = r.idingrediente
        SET i.quantidade_estoque = i.quantidade_estoque - (r.quantidade * v_quantidade)
        WHERE r.idproduto = v_idproduto;
        
    END LOOP;
    
    CLOSE cur;
END//
DELIMITER ;

-- =========================================================
-- FIM DO SCRIPT
-- =========================================================

-- Reabilitar verificações
SET FOREIGN_KEY_CHECKS=1;
SET SQL_MODE=@OLD_SQL_MODE;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Mensagem de sucesso
SELECT 'Migração concluída com sucesso!' AS Resultado;

-- Verificar tabelas criadas
SHOW TABLES;
