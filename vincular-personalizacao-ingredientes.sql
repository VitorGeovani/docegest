-- ================================================================
-- VINCULAR PERSONALIZAÇÃO COM INGREDIENTES
-- ================================================================
-- Data: 18 de Outubro de 2025
-- Descrição: Cria vínculo entre valores de personalização e ingredientes
--            para controlar estoque ao personalizar produtos

-- 1. Criar tabela de vínculo entre valores de personalização e ingredientes
CREATE TABLE IF NOT EXISTS personalizacao_ingrediente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idvalor_fk INT NOT NULL,
    idingrediente_fk INT NOT NULL,
    quantidade_usada DECIMAL(10,3) NOT NULL COMMENT 'Quantidade do ingrediente usada nesta personalização',
    
    FOREIGN KEY (idvalor_fk) REFERENCES opcao_valores(idvalor)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (idingrediente_fk) REFERENCES ingrediente(idingrediente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    UNIQUE KEY uk_valor_ingrediente (idvalor_fk, idingrediente_fk),
    INDEX idx_valor (idvalor_fk),
    INDEX idx_ingrediente (idingrediente_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci 
COMMENT='Vincula valores de personalização aos ingredientes usados';

-- 2. Inserir vínculos de exemplo para Recheios (idopcao = 1)
-- Brigadeiro (idvalor = 1) - Usa leite condensado e chocolate
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(1, 1, 0.050),  -- 50g de Farinha de Trigo
(1, 3, 0.100),  -- 100g de Chocolate
(1, 2, 0.050);  -- 50ml de Leite

-- Doce de Leite (idvalor = 2)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(2, 2, 0.150),  -- 150ml de Leite
(1, 1, 0.030);  -- 30g de Açúcar

-- Nutella (idvalor = 3)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(3, 3, 0.080),  -- 80g de Chocolate
(3, 1, 0.020);  -- 20g de Farinha

-- Frutas Vermelhas (idvalor = 4)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(4, 1, 0.100),  -- 100g de Açúcar
(4, 2, 0.050);  -- 50ml de Leite

-- Chocolate Branco (idvalor = 5)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(5, 3, 0.090),  -- 90g de Chocolate
(5, 2, 0.060);  -- 60ml de Leite

-- Creme de Avelã (idvalor = 6)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(6, 3, 0.070),  -- 70g de Chocolate
(6, 2, 0.080);  -- 80ml de Leite

-- 3. Inserir vínculos para Coberturas (idopcao = 2)
-- Chocolate ao Leite (idvalor = 7)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(7, 3, 0.120),  -- 120g de Chocolate
(7, 2, 0.040);  -- 40ml de Leite

-- Chocolate Meio Amargo (idvalor = 8)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(8, 3, 0.150),  -- 150g de Chocolate
(8, 2, 0.030);  -- 30ml de Leite

-- Ganache (idvalor = 9)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(9, 3, 0.200),  -- 200g de Chocolate
(9, 2, 0.100);  -- 100ml de Leite

-- Chantilly (idvalor = 10)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(10, 2, 0.200),  -- 200ml de Leite
(10, 1, 0.020);  -- 20g de Açúcar

-- Glacê (idvalor = 11)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(11, 1, 0.150),  -- 150g de Açúcar
(11, 2, 0.030);  -- 30ml de Leite

-- 4. Inserir vínculos para Decorações (idopcao = 3)
-- Granulado Colorido (idvalor = 12)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(12, 1, 0.030),  -- 30g de Açúcar
(12, 3, 0.020);  -- 20g de Chocolate

-- Confete (idvalor = 13)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(13, 1, 0.040);  -- 40g de Açúcar

-- Chocolate Raspado (idvalor = 14)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(14, 3, 0.050);  -- 50g de Chocolate

-- Frutas Frescas (idvalor = 15) - sem ingredientes controlados no sistema
-- Flores Comestíveis (idvalor = 16) - sem ingredientes controlados no sistema

-- 5. View para listar valores de personalização com seus ingredientes
CREATE OR REPLACE VIEW vw_personalizacao_com_ingredientes AS
SELECT 
    o.idopcao,
    o.nome_opcao AS opcao_nome,
    v.idvalor,
    v.nome_valor AS valor_nome,
    v.preco_adicional,
    pi.id AS vinculo_id,
    pi.quantidade_usada,
    i.idingrediente,
    i.nome AS ingrediente_nome,
    i.unidade_medida,
    i.quantidade_estoque,
    i.estoque_minimo,
    CASE 
        WHEN i.quantidade_estoque < pi.quantidade_usada THEN 'INDISPONÍVEL'
        WHEN i.quantidade_estoque < (pi.quantidade_usada * 5) THEN 'ESTOQUE BAIXO'
        ELSE 'DISPONÍVEL'
    END AS status_estoque
FROM produto_opcoes_personalizacao o
INNER JOIN opcao_valores v ON o.idopcao = v.idopcao_fk
LEFT JOIN personalizacao_ingrediente pi ON v.idvalor = pi.idvalor_fk
LEFT JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
WHERE o.ativo = TRUE AND v.disponivel = TRUE
ORDER BY o.ordem_exibicao, v.ordem_exibicao;

-- 6. View para verificar disponibilidade de personalizações
CREATE OR REPLACE VIEW vw_disponibilidade_personalizacao AS
SELECT 
    v.idvalor,
    v.nome_valor,
    o.nome_opcao,
    COUNT(pi.id) AS total_ingredientes,
    SUM(CASE WHEN i.quantidade_estoque >= pi.quantidade_usada THEN 1 ELSE 0 END) AS ingredientes_disponiveis,
    CASE 
        WHEN COUNT(pi.id) = 0 THEN TRUE -- Sem ingredientes vinculados, sempre disponível
        WHEN COUNT(pi.id) = SUM(CASE WHEN i.quantidade_estoque >= pi.quantidade_usada THEN 1 ELSE 0 END) THEN TRUE
        ELSE FALSE
    END AS disponivel
FROM opcao_valores v
INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
LEFT JOIN personalizacao_ingrediente pi ON v.idvalor = pi.idvalor_fk
LEFT JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
WHERE o.ativo = TRUE AND v.disponivel = TRUE
GROUP BY v.idvalor, v.nome_valor, o.nome_opcao;

-- 7. Procedure para verificar se personalização está disponível
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS sp_verificar_disponibilidade_personalizacao(
    IN p_idvalor INT
)
BEGIN
    SELECT 
        v.idvalor,
        v.nome_valor,
        o.nome_opcao,
        CASE 
            WHEN COUNT(pi.id) = 0 THEN TRUE
            WHEN COUNT(pi.id) = SUM(CASE WHEN i.quantidade_estoque >= pi.quantidade_usada THEN 1 ELSE 0 END) THEN TRUE
            ELSE FALSE
        END AS disponivel,
        GROUP_CONCAT(
            CASE 
                WHEN i.quantidade_estoque < pi.quantidade_usada 
                THEN CONCAT(i.nome, ' (falta ', ROUND(pi.quantidade_usada - i.quantidade_estoque, 2), ' ', i.unidade_medida, ')')
                ELSE NULL
            END 
            SEPARATOR ', '
        ) AS ingredientes_faltando
    FROM opcao_valores v
    INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
    LEFT JOIN personalizacao_ingrediente pi ON v.idvalor = pi.idvalor_fk
    LEFT JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
    WHERE v.idvalor = p_idvalor
    GROUP BY v.idvalor, v.nome_valor, o.nome_opcao;
END$$

DELIMITER ;

-- 8. Mostrar resultado da criação
SELECT '✅ Tabela personalizacao_ingrediente criada!' AS status;
SELECT '✅ Views criadas com sucesso!' AS status;
SELECT '✅ Procedure sp_verificar_disponibilidade_personalizacao criada!' AS status;

-- 9. Consultas de teste
SELECT 'Vínculos Criados:' AS info;
SELECT 
    o.nome_opcao,
    v.nome_valor,
    i.nome AS ingrediente,
    pi.quantidade_usada,
    i.unidade_medida,
    i.quantidade_estoque
FROM personalizacao_ingrediente pi
INNER JOIN opcao_valores v ON pi.idvalor_fk = v.idvalor
INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
INNER JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
ORDER BY o.ordem_exibicao, v.ordem_exibicao;
