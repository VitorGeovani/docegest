-- ================================================================
-- RF055: SALVAR PREFERÊNCIAS DE CLIENTES FREQUENTES
-- ================================================================
-- Data: 17 de Outubro de 2025
-- Descrição: Tabela para armazenar preferências personalizadas
--            de clientes frequentes do sistema

-- 1. Criar tabela de preferências
CREATE TABLE IF NOT EXISTS cliente_preferencias (
    idpreferencia INT PRIMARY KEY AUTO_INCREMENT,
    idcliente_fk INT NOT NULL,
    preferencias JSON NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    INDEX idx_cliente (idcliente_fk),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Comentários da tabela
ALTER TABLE cliente_preferencias 
COMMENT = 'Armazena preferências personalizadas de clientes frequentes';

-- 3. Exemplo de estrutura JSON para preferências:
/*
{
    "produtos_favoritos": [1, 3, 5, 8],
    "observacao_padrao": "Sem açúcar, embalagem reforçada",
    "endereco_entrega": {
        "rua": "Rua das Flores",
        "numero": "123",
        "complemento": "Apto 45",
        "bairro": "Centro",
        "cidade": "São Paulo",
        "cep": "01234-567"
    },
    "horario_preferido": "14:00",
    "forma_pagamento_padrao": "PIX",
    "personalizacoes_favoritas": {
        "cone_ovomaltine": {
            "sem_granulado": true,
            "extra_creme": false
        }
    },
    "alergias": ["amendoim", "lactose"],
    "notificacoes": {
        "whatsapp": true,
        "email": false,
        "promocoes": true
    }
}
*/

-- 4. Inserir exemplos de preferências para testes
INSERT INTO cliente_preferencias (idcliente_fk, preferencias) VALUES
(1, JSON_OBJECT(
    'produtos_favoritos', JSON_ARRAY(1, 3, 5),
    'observacao_padrao', 'Sem açúcar',
    'forma_pagamento_padrao', 'PIX',
    'horario_preferido', '14:00',
    'notificacoes', JSON_OBJECT(
        'whatsapp', true,
        'email', false,
        'promocoes', true
    )
)),
(2, JSON_OBJECT(
    'produtos_favoritos', JSON_ARRAY(2, 4),
    'endereco_entrega', JSON_OBJECT(
        'rua', 'Av. Paulista',
        'numero', '1000',
        'bairro', 'Bela Vista',
        'cidade', 'São Paulo'
    ),
    'forma_pagamento_padrao', 'Cartão',
    'alergias', JSON_ARRAY('amendoim')
));

-- 5. View para consultar preferências formatadas
CREATE OR REPLACE VIEW vw_cliente_preferencias AS
SELECT 
    cp.idpreferencia,
    c.idcliente,
    c.nome AS cliente_nome,
    c.email,
    c.telefone,
    JSON_EXTRACT(cp.preferencias, '$.produtos_favoritos') AS produtos_favoritos,
    JSON_UNQUOTE(JSON_EXTRACT(cp.preferencias, '$.observacao_padrao')) AS observacao_padrao,
    JSON_UNQUOTE(JSON_EXTRACT(cp.preferencias, '$.forma_pagamento_padrao')) AS forma_pagamento_padrao,
    JSON_UNQUOTE(JSON_EXTRACT(cp.preferencias, '$.horario_preferido')) AS horario_preferido,
    cp.preferencias AS preferencias_completas,
    cp.data_atualizacao AS ultima_atualizacao
FROM cliente_preferencias cp
INNER JOIN cliente c ON cp.idcliente_fk = c.idcliente
WHERE cp.ativo = TRUE;

-- 6. Procedure para buscar preferências de um cliente
DELIMITER $$

CREATE PROCEDURE sp_buscar_preferencias_cliente(
    IN p_idcliente INT
)
BEGIN
    SELECT 
        preferencias,
        data_atualizacao
    FROM cliente_preferencias
    WHERE idcliente_fk = p_idcliente
    AND ativo = TRUE
    LIMIT 1;
END$$

DELIMITER ;

-- 7. Procedure para salvar/atualizar preferências
DELIMITER $$

CREATE PROCEDURE sp_salvar_preferencias_cliente(
    IN p_idcliente INT,
    IN p_preferencias JSON
)
BEGIN
    -- Verificar se já existe preferência para este cliente
    DECLARE v_existe INT;
    
    SELECT COUNT(*) INTO v_existe
    FROM cliente_preferencias
    WHERE idcliente_fk = p_idcliente
    AND ativo = TRUE;
    
    IF v_existe > 0 THEN
        -- Atualizar preferências existentes
        UPDATE cliente_preferencias
        SET preferencias = p_preferencias,
            data_atualizacao = CURRENT_TIMESTAMP
        WHERE idcliente_fk = p_idcliente
        AND ativo = TRUE;
        
        SELECT 'Preferências atualizadas com sucesso' AS mensagem;
    ELSE
        -- Inserir novas preferências
        INSERT INTO cliente_preferencias (idcliente_fk, preferencias)
        VALUES (p_idcliente, p_preferencias);
        
        SELECT 'Preferências criadas com sucesso' AS mensagem;
    END IF;
END$$

DELIMITER ;

-- 8. Procedure para buscar produtos favoritos de um cliente
DELIMITER $$

CREATE PROCEDURE sp_buscar_produtos_favoritos(
    IN p_idcliente INT
)
BEGIN
    SELECT 
        p.idproduto,
        p.nome,
        p.preco,
        p.img_Produto,
        c.nome AS categoria
    FROM cliente_preferencias cp
    CROSS JOIN JSON_TABLE(
        cp.preferencias,
        '$.produtos_favoritos[*]' COLUMNS (idproduto INT PATH '$')
    ) AS jt
    INNER JOIN produto p ON p.idproduto = jt.idproduto
    LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
    WHERE cp.idcliente_fk = p_idcliente
    AND cp.ativo = TRUE
    AND p.ativo = TRUE;
END$$

DELIMITER ;

-- 9. Procedure para aplicar preferências em um novo pedido
DELIMITER $$

CREATE PROCEDURE sp_aplicar_preferencias_pedido(
    IN p_idcliente INT,
    OUT p_observacao VARCHAR(500),
    OUT p_forma_pagamento VARCHAR(50),
    OUT p_horario TIME
)
BEGIN
    DECLARE v_preferencias JSON;
    
    -- Buscar preferências do cliente
    SELECT preferencias INTO v_preferencias
    FROM cliente_preferencias
    WHERE idcliente_fk = p_idcliente
    AND ativo = TRUE
    LIMIT 1;
    
    -- Extrair valores das preferências
    IF v_preferencias IS NOT NULL THEN
        SET p_observacao = JSON_UNQUOTE(JSON_EXTRACT(v_preferencias, '$.observacao_padrao'));
        SET p_forma_pagamento = JSON_UNQUOTE(JSON_EXTRACT(v_preferencias, '$.forma_pagamento_padrao'));
        SET p_horario = JSON_UNQUOTE(JSON_EXTRACT(v_preferencias, '$.horario_preferido'));
    ELSE
        SET p_observacao = NULL;
        SET p_forma_pagamento = NULL;
        SET p_horario = NULL;
    END IF;
END$$

DELIMITER ;

-- 10. Trigger para registrar histórico de alterações de preferências
CREATE TABLE IF NOT EXISTS cliente_preferencias_historico (
    idhistorico INT PRIMARY KEY AUTO_INCREMENT,
    idcliente_fk INT NOT NULL,
    preferencias_antigas JSON,
    preferencias_novas JSON,
    data_alteracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_cliente (idcliente_fk),
    INDEX idx_data (data_alteracao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER $$

CREATE TRIGGER tr_preferencias_before_update
BEFORE UPDATE ON cliente_preferencias
FOR EACH ROW
BEGIN
    -- Registrar alteração no histórico
    INSERT INTO cliente_preferencias_historico (
        idcliente_fk, 
        preferencias_antigas, 
        preferencias_novas
    )
    VALUES (
        OLD.idcliente_fk,
        OLD.preferencias,
        NEW.preferencias
    );
END$$

DELIMITER ;

-- 11. View de relatório de clientes com preferências
CREATE OR REPLACE VIEW vw_relatorio_clientes_preferencias AS
SELECT 
    c.idcliente,
    c.nome,
    c.email,
    c.telefone,
    CASE 
        WHEN cp.idpreferencia IS NOT NULL THEN 'Sim'
        ELSE 'Não'
    END AS possui_preferencias,
    cp.data_criacao AS data_cadastro_preferencias,
    cp.data_atualizacao AS ultima_atualizacao_preferencias,
    JSON_LENGTH(JSON_EXTRACT(cp.preferencias, '$.produtos_favoritos')) AS total_produtos_favoritos
FROM cliente c
LEFT JOIN cliente_preferencias cp ON c.idcliente = cp.idcliente_fk AND cp.ativo = TRUE
ORDER BY cp.data_atualizacao DESC;

-- 12. Consultas úteis

-- Buscar clientes com mais produtos favoritos
SELECT 
    c.nome,
    JSON_LENGTH(JSON_EXTRACT(cp.preferencias, '$.produtos_favoritos')) AS total_favoritos
FROM cliente c
INNER JOIN cliente_preferencias cp ON c.idcliente = cp.idcliente_fk
WHERE cp.ativo = TRUE
ORDER BY total_favoritos DESC;

-- Buscar clientes com alergias registradas
SELECT 
    c.nome,
    JSON_EXTRACT(cp.preferencias, '$.alergias') AS alergias
FROM cliente c
INNER JOIN cliente_preferencias cp ON c.idcliente = cp.idcliente_fk
WHERE cp.ativo = TRUE
AND JSON_CONTAINS_PATH(cp.preferencias, 'one', '$.alergias');

-- Buscar forma de pagamento mais usada nas preferências
SELECT 
    JSON_UNQUOTE(JSON_EXTRACT(preferencias, '$.forma_pagamento_padrao')) AS forma_pagamento,
    COUNT(*) AS total
FROM cliente_preferencias
WHERE ativo = TRUE
AND JSON_CONTAINS_PATH(preferencias, 'one', '$.forma_pagamento_padrao')
GROUP BY forma_pagamento
ORDER BY total DESC;

-- 13. Índices adicionais para performance
CREATE INDEX idx_preferencias_json ON cliente_preferencias ((CAST(preferencias AS CHAR(1000))));

-- 14. Conceder permissões (ajustar conforme necessário)
-- GRANT SELECT, INSERT, UPDATE ON segredodosabor.cliente_preferencias TO 'seu_usuario'@'localhost';
-- GRANT EXECUTE ON PROCEDURE segredodosabor.sp_buscar_preferencias_cliente TO 'seu_usuario'@'localhost';
-- GRANT EXECUTE ON PROCEDURE segredodosabor.sp_salvar_preferencias_cliente TO 'seu_usuario'@'localhost';

-- ================================================================
-- FIM DO SCRIPT DE PREFERÊNCIAS DE CLIENTES
-- ================================================================

-- Verificação de instalação
SELECT 'Tabela cliente_preferencias criada com sucesso!' AS status;
SELECT 'Views criadas com sucesso!' AS status;
SELECT 'Procedures criadas com sucesso!' AS status;
SELECT 'Triggers criados com sucesso!' AS status;
SELECT 'Sistema de preferências de clientes pronto para uso!' AS status;
