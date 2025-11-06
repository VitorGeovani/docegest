-- Script para adicionar campos necessários à tabela reserva

-- Adicionar campo endereco_entrega se não existir
SET @existe_endereco = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' 
    AND TABLE_NAME = 'reserva' 
    AND COLUMN_NAME = 'endereco_entrega'
);

SET @sql_endereco = IF(
    @existe_endereco = 0,
    'ALTER TABLE reserva ADD COLUMN endereco_entrega TEXT',
    'SELECT "Campo endereco_entrega já existe" AS resultado'
);

PREPARE stmt FROM @sql_endereco;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar campo observacoes se não existir
SET @existe_observacoes = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' 
    AND TABLE_NAME = 'reserva' 
    AND COLUMN_NAME = 'observacoes'
);

SET @sql_observacoes = IF(
    @existe_observacoes = 0,
    'ALTER TABLE reserva ADD COLUMN observacoes TEXT',
    'SELECT "Campo observacoes já existe" AS resultado'
);

PREPARE stmt FROM @sql_observacoes;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar campo tipo_pedido se não existir
SET @existe_tipo = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' 
    AND TABLE_NAME = 'reserva' 
    AND COLUMN_NAME = 'tipo_pedido'
);

SET @sql_tipo = IF(
    @existe_tipo = 0,
    'ALTER TABLE reserva ADD COLUMN tipo_pedido VARCHAR(20) DEFAULT "ENTREGA"',
    'SELECT "Campo tipo_pedido já existe" AS resultado'
);

PREPARE stmt FROM @sql_tipo;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Campos adicionados com sucesso!' AS resultado;
