-- ================================================================
-- Criar Stored Procedures Manualmente (RF052 + RF053)
-- ================================================================

USE segredodosabor;

-- ================================================================
-- 1. Procedure para buscar opções de um produto
-- ================================================================

DROP PROCEDURE IF EXISTS sp_buscar_opcoes_produto;

DELIMITER $$

CREATE PROCEDURE sp_buscar_opcoes_produto(
    IN p_idproduto INT
)
BEGIN
    SELECT 
        poa.idopcao_fk AS idopcao,
        pop.nome,
        pop.tipo,
        pop.obrigatorio,
        pop.multipla_selecao,
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'idvalor', ov.idvalor,
                    'nome', ov.nome_valor,
                    'preco', ov.preco_adicional
                )
            )
            FROM opcao_valores ov
            WHERE ov.idopcao_fk = poa.idopcao_fk
        ) AS valores
    FROM produto_opcao_associacao poa
    INNER JOIN produto_opcoes_personalizacao pop ON poa.idopcao_fk = pop.idopcao
    WHERE poa.idproduto_fk = p_idproduto
    ORDER BY pop.ordem;
END$$

DELIMITER ;

-- ================================================================
-- 2. Procedure para calcular acréscimo total
-- ================================================================

DROP PROCEDURE IF EXISTS sp_calcular_acrescimo_personalizacao;

DELIMITER $$

CREATE PROCEDURE sp_calcular_acrescimo_personalizacao(
    IN p_personalizacoes JSON,
    OUT p_valor_acrescimo DECIMAL(10,2)
)
BEGIN
    DECLARE v_total DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_num_opcoes INT;
    DECLARE v_idx INT DEFAULT 0;
    DECLARE v_idvalor INT;
    DECLARE v_preco DECIMAL(10,2);
    
    -- Contar número de valores selecionados
    SET v_num_opcoes = JSON_LENGTH(p_personalizacoes);
    
    -- Loop por todos os valores selecionados
    WHILE v_idx < v_num_opcoes DO
        -- Extrair idvalor do JSON
        SET v_idvalor = JSON_UNQUOTE(JSON_EXTRACT(p_personalizacoes, CONCAT('$[', v_idx, '].idvalor')));
        
        -- Buscar preço adicional do valor
        SELECT preco_adicional INTO v_preco
        FROM opcao_valores
        WHERE idvalor = v_idvalor;
        
        -- Adicionar ao total
        SET v_total = v_total + COALESCE(v_preco, 0.00);
        
        SET v_idx = v_idx + 1;
    END WHILE;
    
    SET p_valor_acrescimo = v_total;
END$$

DELIMITER ;

-- ================================================================
-- 3. Procedure para salvar personalização do pedido
-- ================================================================

DROP PROCEDURE IF EXISTS sp_salvar_personalizacao_pedido;

DELIMITER $$

CREATE PROCEDURE sp_salvar_personalizacao_pedido(
    IN p_idreserva INT,
    IN p_idproduto INT,
    IN p_personalizacoes JSON
)
BEGIN
    DECLARE v_acrescimo DECIMAL(10,2) DEFAULT 0.00;
    
    -- Calcular acréscimo usando a procedure de cálculo
    CALL sp_calcular_acrescimo_personalizacao(p_personalizacoes, v_acrescimo);
    
    -- Inserir registro de personalização
    INSERT INTO pedido_personalizacoes (
        idreserva_fk,
        idproduto_fk,
        personalizacoes_json,
        valor_acrescimo
    ) VALUES (
        p_idreserva,
        p_idproduto,
        p_personalizacoes,
        v_acrescimo
    );
END$$

DELIMITER ;

-- ================================================================
-- 4. Trigger para atualizar valor do pedido
-- ================================================================

DROP TRIGGER IF EXISTS trg_atualizar_valor_com_personalizacao;

DELIMITER $$

CREATE TRIGGER trg_atualizar_valor_com_personalizacao
AFTER INSERT ON pedido_personalizacoes
FOR EACH ROW
BEGIN
    -- Atualizar o valor_total da reserva somando o acréscimo
    UPDATE tb_reserva
    SET valor_total = valor_total + NEW.valor_acrescimo
    WHERE idreserva = NEW.idreserva_fk;
END$$

DELIMITER ;

-- ================================================================
-- Validação
-- ================================================================

SELECT 'Stored Procedures criadas:' AS status;
SHOW PROCEDURE STATUS WHERE Db = 'segredodosabor' AND Name LIKE 'sp_%personalizacao%';

SELECT 'Triggers criadas:' AS status;
SHOW TRIGGERS FROM segredodosabor LIKE 'trg_%personalizacao%';
