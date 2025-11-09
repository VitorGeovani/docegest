-- =========================================================
-- SCRIPT DE CORREÇÃO - BANCO DE DADOS SEGREDO DO SABOR
-- Versão: 5.0 - Correções e Otimizações
-- Data: 09 de Novembro de 2025
-- =========================================================
-- DESCRIÇÃO:
-- Este script corrige redundâncias, remove dados de teste
-- e otimiza o banco de dados existente
-- =========================================================

USE segredodosabor;

-- =========================================================
-- 1. BACKUP DE SEGURANÇA (executar antes das correções)
-- =========================================================
-- Execute no terminal:
-- mysqldump -u root -p segredodosabor > backup_antes_correcoes_$(date +%Y%m%d).sql

-- =========================================================
-- 2. REMOVER DADOS DE TESTE
-- =========================================================

-- Remover categoria de teste
DELETE FROM categoria 
WHERE idcategoria = 13 
AND nome = 'Teste editado';

-- Verificar se há produtos vinculados à categoria de teste
SELECT COUNT(*) as produtos_teste 
FROM produto 
WHERE idcategoria_fk = 13;

-- =========================================================
-- 3. REMOVER CUSTOS INDIRETOS DUPLICADOS
-- =========================================================

-- Manter apenas os custos mais recentes (IDs 6-11)
-- Primeiro, verificar dependências
SELECT * FROM custo_indireto WHERE idcusto IN (1,2,3,4,5);

-- Deletar custos duplicados antigos
DELETE FROM custo_indireto 
WHERE idcusto IN (1,2,3,4,5)
AND idcusto NOT IN (
    SELECT MIN(idcusto) 
    FROM (SELECT * FROM custo_indireto) AS temp 
    GROUP BY nome
);

-- =========================================================
-- 4. CORRIGIR TRIGGER VAZIO
-- =========================================================

DROP TRIGGER IF EXISTS tr_preferencias_before_update;

DELIMITER $$

CREATE TRIGGER tr_preferencias_before_update
BEFORE UPDATE ON cliente_preferencias
FOR EACH ROW
BEGIN
    -- Salvar alterações no histórico
    IF OLD.preferencias != NEW.preferencias THEN
        INSERT INTO cliente_preferencias_historico 
        (idpreferencia, idcliente_fk, preferencias_antigas, data_alteracao)
        VALUES (OLD.idpreferencia, OLD.idcliente_fk, OLD.preferencias, NOW());
    END IF;
    
    -- Atualizar timestamp de atualização
    SET NEW.data_atualizacao = NOW();
END$$

DELIMITER ;

-- =========================================================
-- 5. ADICIONAR CONFIGURAÇÕES FALTANTES
-- =========================================================

INSERT INTO configuracao (chave, valor, descricao, tipo) VALUES
('horario_abertura', '08:00', 'Horário de abertura', 'string'),
('horario_fechamento', '18:00', 'Horário de fechamento', 'string'),
('dias_funcionamento', '["seg", "ter", "qua", "qui", "sex", "sab"]', 'Dias de funcionamento', 'json'),
('raio_entrega_km', '10', 'Raio de entrega em km', 'number'),
('tempo_minimo_reserva', '24', 'Tempo mínimo para reserva em horas', 'number'),
('aceita_retirada', 'true', 'Aceita retirada no local', 'boolean'),
('valor_minimo_pedido', '20.00', 'Valor mínimo do pedido', 'number'),
('taxa_entrega_adicional_km', '2.00', 'Taxa adicional por km extra', 'number'),
('whatsapp_ativo', 'true', 'Sistema de WhatsApp ativo', 'boolean'),
('modo_manutencao', 'false', 'Sistema em manutenção', 'boolean')
ON DUPLICATE KEY UPDATE
    valor = VALUES(valor),
    descricao = VALUES(descricao);

-- =========================================================
-- 6. ADICIONAR ÍNDICES PARA OTIMIZAÇÃO
-- =========================================================

-- Índices na tabela cliente
ALTER TABLE cliente 
ADD INDEX IF NOT EXISTS idx_telefone (telefone),
ADD INDEX IF NOT EXISTS idx_email_verificado (email_verificado);

-- Índices na tabela produto (se existir)
-- ALTER TABLE produto 
-- ADD INDEX IF NOT EXISTS idx_categoria (idcategoria_fk),
-- ADD INDEX IF NOT EXISTS idx_ativo (ativo),
-- ADD INDEX IF NOT EXISTS idx_preco (preco);

-- Índices na tabela pedido (se existir)
-- ALTER TABLE pedido 
-- ADD INDEX IF NOT EXISTS idx_data_pedido (data_pedido),
-- ADD INDEX IF NOT EXISTS idx_status (status),
-- ADD INDEX IF NOT EXISTS idx_cliente (idcliente_fk);

-- Índices na tabela ingrediente
ALTER TABLE ingrediente
ADD INDEX IF NOT EXISTS idx_ativo (ativo),
ADD INDEX IF NOT EXISTS idx_estoque (estoque_minimo);

-- =========================================================
-- 7. CRIAR TABELA refresh_tokens (se não existir)
-- =========================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    idtoken INT AUTO_INCREMENT PRIMARY KEY,
    idcliente_fk INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    revogado BOOLEAN DEFAULT FALSE,
    ip_criacao VARCHAR(45),
    user_agent VARCHAR(255),
    
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_refresh_token (token),
    INDEX idx_refresh_cliente (idcliente_fk),
    INDEX idx_refresh_expiracao (data_expiracao),
    INDEX idx_refresh_revogado (revogado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
COMMENT='Tokens de refresh para autenticação JWT com controle de sessões';

-- =========================================================
-- 8. PROCEDURE PARA LIMPAR TOKENS EXPIRADOS
-- =========================================================

DROP PROCEDURE IF EXISTS limpar_tokens_expirados;

DELIMITER $$

CREATE PROCEDURE limpar_tokens_expirados()
BEGIN
    -- Deletar tokens expirados ou revogados há mais de 30 dias
    DELETE FROM refresh_tokens 
    WHERE (data_expiracao < NOW() OR revogado = TRUE)
    AND data_criacao < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    SELECT ROW_COUNT() as tokens_removidos;
END$$

DELIMITER ;

-- =========================================================
-- 9. PROCEDURE PARA LIMPAR HISTÓRICO DE PREFERÊNCIAS
-- =========================================================

DROP PROCEDURE IF EXISTS limpar_historico_preferencias;

DELIMITER $$

CREATE PROCEDURE limpar_historico_preferencias(dias INT)
BEGIN
    -- Deletar histórico mais antigo que X dias
    DELETE FROM cliente_preferencias_historico
    WHERE data_alteracao < DATE_SUB(NOW(), INTERVAL dias DAY);
    
    SELECT ROW_COUNT() as registros_removidos;
END$$

DELIMITER ;

-- =========================================================
-- 10. VIEW PARA ESTATÍSTICAS DE CLIENTES
-- =========================================================

DROP VIEW IF EXISTS vw_estatisticas_clientes;

CREATE VIEW vw_estatisticas_clientes AS
SELECT 
    c.idcliente,
    c.nome,
    c.email,
    c.telefone,
    c.data_cadastro,
    c.ultimo_acesso,
    c.email_verificado,
    COUNT(DISTINCT p.idpedido) as total_pedidos,
    SUM(p.valor_total) as valor_total_pedidos,
    MAX(p.data_pedido) as ultimo_pedido
FROM cliente c
LEFT JOIN pedido p ON c.idcliente = p.idcliente_fk
GROUP BY c.idcliente;

-- =========================================================
-- 11. VIEW PARA PRODUTOS MAIS VENDIDOS
-- =========================================================

DROP VIEW IF EXISTS vw_produtos_mais_vendidos;

CREATE VIEW vw_produtos_mais_vendidos AS
SELECT 
    pr.idproduto,
    pr.nome,
    pr.preco,
    cat.nome as categoria,
    COUNT(pi.idpedido_item) as total_vendas,
    SUM(pi.quantidade) as quantidade_total,
    SUM(pi.subtotal) as receita_total
FROM produto pr
LEFT JOIN pedido_itens pi ON pr.idproduto = pi.idproduto_fk
LEFT JOIN categoria cat ON pr.idcategoria_fk = cat.idcategoria
GROUP BY pr.idproduto
ORDER BY quantidade_total DESC;

-- =========================================================
-- 12. FUNCTION PARA CALCULAR IDADE DE CADASTRO
-- =========================================================

DROP FUNCTION IF EXISTS calcular_dias_cadastro;

DELIMITER $$

CREATE FUNCTION calcular_dias_cadastro(data_cadastro DATETIME)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN DATEDIFF(NOW(), data_cadastro);
END$$

DELIMITER ;

-- =========================================================
-- 13. VALIDAÇÃO DE DADOS JSON EM PREFERÊNCIAS
-- =========================================================

-- Criar procedure de validação
DROP PROCEDURE IF EXISTS validar_preferencias_cliente;

DELIMITER $$

CREATE PROCEDURE validar_preferencias_cliente(
    IN p_idcliente INT,
    IN p_preferencias JSON,
    OUT p_valido BOOLEAN,
    OUT p_mensagem VARCHAR(500)
)
BEGIN
    DECLARE v_notificacoes JSON;
    DECLARE v_produtos_favoritos JSON;
    
    -- Validar estrutura básica
    IF JSON_TYPE(p_preferencias) != 'OBJECT' THEN
        SET p_valido = FALSE;
        SET p_mensagem = 'Preferências devem ser um objeto JSON válido';
    ELSE
        -- Validar notificações se existir
        IF JSON_CONTAINS_PATH(p_preferencias, 'one', '$.notificacoes') THEN
            SET v_notificacoes = JSON_EXTRACT(p_preferencias, '$.notificacoes');
            IF JSON_TYPE(v_notificacoes) != 'OBJECT' THEN
                SET p_valido = FALSE;
                SET p_mensagem = 'Notificações devem ser um objeto';
            END IF;
        END IF;
        
        -- Validar produtos favoritos se existir
        IF JSON_CONTAINS_PATH(p_preferencias, 'one', '$.produtos_favoritos') THEN
            SET v_produtos_favoritos = JSON_EXTRACT(p_preferencias, '$.produtos_favoritos');
            IF JSON_TYPE(v_produtos_favoritos) != 'ARRAY' THEN
                SET p_valido = FALSE;
                SET p_mensagem = 'Produtos favoritos devem ser um array';
            END IF;
        END IF;
        
        -- Se chegou aqui, está válido
        IF p_valido IS NULL THEN
            SET p_valido = TRUE;
            SET p_mensagem = 'Preferências válidas';
        END IF;
    END IF;
END$$

DELIMITER ;

-- =========================================================
-- 14. EVENT PARA LIMPEZA AUTOMÁTICA
-- =========================================================

-- Habilitar events
SET GLOBAL event_scheduler = ON;

-- Criar event para limpar tokens expirados diariamente
DROP EVENT IF EXISTS evt_limpar_tokens_diario;

CREATE EVENT evt_limpar_tokens_diario
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL limpar_tokens_expirados();

-- Criar event para limpar histórico antigo mensalmente
DROP EVENT IF EXISTS evt_limpar_historico_mensal;

CREATE EVENT evt_limpar_historico_mensal
ON SCHEDULE EVERY 1 MONTH
STARTS CURRENT_TIMESTAMP
DO
    CALL limpar_historico_preferencias(365); -- Manter 1 ano

-- =========================================================
-- 15. VERIFICAÇÃO FINAL
-- =========================================================

-- Verificar integridade das tabelas
CHECKSUM TABLE 
    cliente,
    administrador,
    categoria,
    ingrediente,
    cliente_preferencias,
    configuracao,
    custo_indireto;

-- Verificar estatísticas das tabelas
ANALYZE TABLE 
    cliente,
    administrador,
    categoria,
    ingrediente,
    cliente_preferencias,
    configuracao,
    custo_indireto;

-- =========================================================
-- 16. RELATÓRIO DE CORREÇÕES
-- =========================================================

SELECT 'RELATÓRIO DE CORREÇÕES' as titulo;

SELECT 
    'Categorias Ativas' as tipo,
    COUNT(*) as total
FROM categoria 
WHERE ativo = 1

UNION ALL

SELECT 
    'Clientes Cadastrados' as tipo,
    COUNT(*) as total
FROM cliente

UNION ALL

SELECT 
    'Configurações Ativas' as tipo,
    COUNT(*) as total
FROM configuracao

UNION ALL

SELECT 
    'Ingredientes Ativos' as tipo,
    COUNT(*) as total
FROM ingrediente
WHERE ativo = 1

UNION ALL

SELECT 
    'Custos Indiretos' as tipo,
    COUNT(*) as total
FROM custo_indireto
WHERE ativo = 1;

-- =========================================================
-- FIM DO SCRIPT DE CORREÇÃO
-- =========================================================

SELECT 'Script de correção executado com sucesso!' as status;
SELECT NOW() as data_execucao;
