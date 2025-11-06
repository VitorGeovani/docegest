-- ================================================================
-- RF052 + RF053: PERSONALIZAÇÃO DE PRODUTOS COM ACRÉSCIMOS
-- ================================================================
-- Data: 17 de Outubro de 2025
-- Descrição: Permite criar opções de personalização para produtos
--            e calcular acréscimos de preço automaticamente

-- 1. Criar tabela de opções de personalização
CREATE TABLE IF NOT EXISTS produto_opcoes_personalizacao (
    idopcao INT PRIMARY KEY AUTO_INCREMENT,
    nome_opcao VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo_selecao ENUM('radio', 'checkbox', 'select') DEFAULT 'radio',
    obrigatorio BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    ordem_exibicao INT DEFAULT 0,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_ativo (ativo),
    INDEX idx_ordem (ordem_exibicao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Opções de personalização disponíveis';

-- 2. Criar tabela de valores das opções
CREATE TABLE IF NOT EXISTS opcao_valores (
    idvalor INT PRIMARY KEY AUTO_INCREMENT,
    idopcao_fk INT NOT NULL,
    nome_valor VARCHAR(100) NOT NULL,
    preco_adicional DECIMAL(10,2) DEFAULT 0.00,
    disponivel BOOLEAN DEFAULT TRUE,
    ordem_exibicao INT DEFAULT 0,
    
    FOREIGN KEY (idopcao_fk) REFERENCES produto_opcoes_personalizacao(idopcao)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    INDEX idx_opcao (idopcao_fk),
    INDEX idx_disponivel (disponivel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Valores possíveis para cada opção';

-- 3. Criar tabela de associação produto-opção
CREATE TABLE IF NOT EXISTS produto_opcao_associacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idproduto_fk INT NOT NULL,
    idopcao_fk INT NOT NULL,
    obrigatorio BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (idproduto_fk) REFERENCES produto(idproduto)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (idopcao_fk) REFERENCES produto_opcoes_personalizacao(idopcao)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    UNIQUE KEY uk_produto_opcao (idproduto_fk, idopcao_fk),
    INDEX idx_produto (idproduto_fk),
    INDEX idx_opcao (idopcao_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Associa produtos com opções de personalização';

-- 4. Criar tabela para salvar personalizações do pedido
CREATE TABLE IF NOT EXISTS pedido_personalizacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idreserva_fk INT NOT NULL,
    idproduto_fk INT NOT NULL,
    personalizacoes JSON NOT NULL,
    valor_acrescimo DECIMAL(10,2) DEFAULT 0.00,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idreserva_fk) REFERENCES reserva(idreserva)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (idproduto_fk) REFERENCES produto(idproduto)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    INDEX idx_reserva (idreserva_fk),
    INDEX idx_produto (idproduto_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Personalizações selecionadas em cada pedido';

-- 5. Inserir exemplos de opções de personalização
INSERT INTO produto_opcoes_personalizacao (nome_opcao, descricao, tipo_selecao, obrigatorio, ordem_exibicao) VALUES
('Recheio', 'Escolha o recheio do seu bolo ou doce', 'radio', TRUE, 1),
('Cobertura', 'Selecione a cobertura desejada', 'radio', FALSE, 2),
('Decoração', 'Adicione decorações especiais', 'checkbox', FALSE, 3),
('Tamanho da Fatia', 'Escolha o tamanho da fatia', 'radio', TRUE, 4),
('Extras', 'Adicione extras ao seu pedido', 'checkbox', FALSE, 5);

-- 6. Inserir valores para as opções
-- Recheios (idopcao = 1)
INSERT INTO opcao_valores (idopcao_fk, nome_valor, preco_adicional, ordem_exibicao) VALUES
(1, 'Brigadeiro', 0.00, 1),
(1, 'Doce de Leite', 0.00, 2),
(1, 'Nutella', 5.00, 3),
(1, 'Frutas Vermelhas', 4.00, 4),
(1, 'Chocolate Branco', 3.00, 5),
(1, 'Creme de Avelã', 6.00, 6);

-- Coberturas (idopcao = 2)
INSERT INTO opcao_valores (idopcao_fk, nome_valor, preco_adicional, ordem_exibicao) VALUES
(2, 'Chocolate ao Leite', 0.00, 1),
(2, 'Chocolate Meio Amargo', 2.00, 2),
(2, 'Ganache', 3.00, 3),
(2, 'Chantilly', 2.00, 4),
(2, 'Glacê', 1.50, 5);

-- Decorações (idopcao = 3)
INSERT INTO opcao_valores (idopcao_fk, nome_valor, preco_adicional, ordem_exibicao) VALUES
(3, 'Granulado Colorido', 1.00, 1),
(3, 'Confete', 1.50, 2),
(3, 'Chocolate Raspado', 2.00, 3),
(3, 'Frutas Frescas', 5.00, 4),
(3, 'Flores Comestíveis', 8.00, 5);

-- Tamanhos (idopcao = 4)
INSERT INTO opcao_valores (idopcao_fk, nome_valor, preco_adicional, ordem_exibicao) VALUES
(4, 'Pequena (100g)', 0.00, 1),
(4, 'Média (200g)', 3.00, 2),
(4, 'Grande (300g)', 6.00, 3);

-- Extras (idopcao = 5)
INSERT INTO opcao_valores (idopcao_fk, nome_valor, preco_adicional, ordem_exibicao) VALUES
(5, 'Embalagem Especial', 2.50, 1),
(5, 'Cartão Personalizado', 1.50, 2),
(5, 'Vela de Aniversário', 1.00, 3);

-- 7. View para listar opções com seus valores
CREATE OR REPLACE VIEW vw_opcoes_personalizacao_completas AS
SELECT 
    o.idopcao,
    o.nome_opcao,
    o.descricao AS opcao_descricao,
    o.tipo_selecao,
    o.obrigatorio,
    o.ativo AS opcao_ativa,
    o.ordem_exibicao AS opcao_ordem,
    v.idvalor,
    v.nome_valor,
    v.preco_adicional,
    v.disponivel AS valor_disponivel,
    v.ordem_exibicao AS valor_ordem
FROM produto_opcoes_personalizacao o
LEFT JOIN opcao_valores v ON o.idopcao = v.idopcao_fk
WHERE o.ativo = TRUE
ORDER BY o.ordem_exibicao, v.ordem_exibicao;

-- 8. View para listar produtos com suas opções
CREATE OR REPLACE VIEW vw_produtos_com_opcoes AS
SELECT 
    p.idproduto,
    p.nome AS produto_nome,
    p.preco AS produto_preco,
    o.idopcao,
    o.nome_opcao,
    o.tipo_selecao,
    a.obrigatorio,
    COUNT(v.idvalor) AS total_valores
FROM produto p
INNER JOIN produto_opcao_associacao a ON p.idproduto = a.idproduto_fk
INNER JOIN produto_opcoes_personalizacao o ON a.idopcao_fk = o.idopcao
LEFT JOIN opcao_valores v ON o.idopcao = v.idopcao_fk AND v.disponivel = TRUE
WHERE p.ativo = TRUE
AND o.ativo = TRUE
GROUP BY p.idproduto, p.nome, p.preco, o.idopcao, o.nome_opcao, o.tipo_selecao, a.obrigatorio;

-- 9. Stored Procedure para buscar opções de um produto
DELIMITER $$

CREATE PROCEDURE sp_buscar_opcoes_produto(
    IN p_idproduto INT
)
BEGIN
    SELECT 
        o.idopcao,
        o.nome_opcao,
        o.descricao,
        o.tipo_selecao,
        COALESCE(a.obrigatorio, o.obrigatorio) AS obrigatorio,
        o.ordem_exibicao,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'idvalor', v.idvalor,
                'nome_valor', v.nome_valor,
                'preco_adicional', v.preco_adicional,
                'ordem_exibicao', v.ordem_exibicao
            )
        ) AS valores
    FROM produto_opcao_associacao a
    INNER JOIN produto_opcoes_personalizacao o ON a.idopcao_fk = o.idopcao
    LEFT JOIN opcao_valores v ON o.idopcao = v.idopcao_fk AND v.disponivel = TRUE
    WHERE a.idproduto_fk = p_idproduto
    AND o.ativo = TRUE
    GROUP BY o.idopcao, o.nome_opcao, o.descricao, o.tipo_selecao, a.obrigatorio, o.obrigatorio, o.ordem_exibicao
    ORDER BY o.ordem_exibicao;
END$$

DELIMITER ;

-- 10. Stored Procedure para calcular acréscimo total
DELIMITER $$

CREATE PROCEDURE sp_calcular_acrescimo_personalizacao(
    IN p_personalizacoes JSON,
    OUT p_valor_acrescimo DECIMAL(10,2)
)
BEGIN
    DECLARE v_idvalor INT;
    DECLARE v_preco DECIMAL(10,2);
    DECLARE v_done INT DEFAULT FALSE;
    DECLARE v_total DECIMAL(10,2) DEFAULT 0.00;
    
    -- Cursor para iterar pelos valores selecionados
    DECLARE cur CURSOR FOR 
        SELECT jt.idvalor
        FROM JSON_TABLE(
            p_personalizacoes,
            '$[*]' COLUMNS (
                idvalor INT PATH '$.idvalor'
            )
        ) AS jt;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_idvalor;
        IF v_done THEN
            LEAVE read_loop;
        END IF;
        
        -- Buscar preço adicional do valor
        SELECT preco_adicional INTO v_preco
        FROM opcao_valores
        WHERE idvalor = v_idvalor;
        
        SET v_total = v_total + COALESCE(v_preco, 0.00);
    END LOOP;
    
    CLOSE cur;
    
    SET p_valor_acrescimo = v_total;
END$$

DELIMITER ;

-- 11. Stored Procedure para salvar personalização do pedido
DELIMITER $$

CREATE PROCEDURE sp_salvar_personalizacao_pedido(
    IN p_idreserva INT,
    IN p_idproduto INT,
    IN p_personalizacoes JSON
)
BEGIN
    DECLARE v_valor_acrescimo DECIMAL(10,2);
    
    -- Calcular acréscimo
    CALL sp_calcular_acrescimo_personalizacao(p_personalizacoes, v_valor_acrescimo);
    
    -- Inserir personalização
    INSERT INTO pedido_personalizacoes (
        idreserva_fk,
        idproduto_fk,
        personalizacoes,
        valor_acrescimo
    ) VALUES (
        p_idreserva,
        p_idproduto,
        p_personalizacoes,
        v_valor_acrescimo
    );
    
    SELECT 
        LAST_INSERT_ID() AS id,
        v_valor_acrescimo AS valor_acrescimo,
        'Personalização salva com sucesso' AS mensagem;
END$$

DELIMITER ;

-- 12. View de relatório de personalizações
CREATE OR REPLACE VIEW vw_relatorio_personalizacoes AS
SELECT 
    r.idreserva,
    r.codigo_pedido,
    r.data_entrega,
    c.nome AS cliente_nome,
    p.nome AS produto_nome,
    p.preco AS preco_base,
    pp.valor_acrescimo,
    (p.preco + pp.valor_acrescimo) AS preco_final,
    pp.personalizacoes,
    pp.data_criacao AS data_personalizacao
FROM pedido_personalizacoes pp
INNER JOIN reserva r ON pp.idreserva_fk = r.idreserva
INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
INNER JOIN produto p ON pp.idproduto_fk = p.idproduto
ORDER BY pp.data_criacao DESC;

-- 13. Exemplo de estrutura JSON para personalizações
/*
Formato esperado para personalizacoes JSON:
[
    {
        "idopcao": 1,
        "nome_opcao": "Recheio",
        "idvalor": 3,
        "nome_valor": "Nutella",
        "preco_adicional": 5.00
    },
    {
        "idopcao": 2,
        "nome_opcao": "Cobertura",
        "idvalor": 8,
        "nome_valor": "Ganache",
        "preco_adicional": 3.00
    }
]

Total de acréscimo: R$ 8,00
*/

-- 14. Trigger para atualizar valor total do pedido com personalizações
DELIMITER $$

CREATE TRIGGER trg_atualizar_valor_com_personalizacao
AFTER INSERT ON pedido_personalizacoes
FOR EACH ROW
BEGIN
    DECLARE v_valor_atual DECIMAL(10,2);
    
    -- Buscar valor atual do pedido
    SELECT valor_total INTO v_valor_atual
    FROM reserva
    WHERE idreserva = NEW.idreserva_fk;
    
    -- Atualizar com acréscimo
    UPDATE reserva
    SET valor_total = v_valor_atual + NEW.valor_acrescimo
    WHERE idreserva = NEW.idreserva_fk;
END$$

DELIMITER ;

-- ================================================================
-- COMENTÁRIOS FINAIS
-- ================================================================

-- Esta estrutura permite:
-- ✅ Criar opções de personalização reutilizáveis
-- ✅ Associar múltiplas opções a produtos
-- ✅ Definir valores com preços adicionais
-- ✅ Calcular automaticamente acréscimos
-- ✅ Salvar personalizações em pedidos
-- ✅ Atualizar valor total automaticamente
-- ✅ Gerar relatórios de personalizações

-- Exemplo de uso:
-- 1. Admin cria opção "Recheio" com valores
-- 2. Admin associa opção ao produto "Bolo"
-- 3. Cliente seleciona "Nutella" (+R$ 5,00)
-- 4. Sistema calcula valor final automaticamente
-- 5. Pedido salva personalização completa

COMMIT;
