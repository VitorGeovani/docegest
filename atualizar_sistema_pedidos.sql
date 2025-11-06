-- ===================================
-- ATUALIZAÇÃO SISTEMA DE PEDIDOS
-- Adiciona campos e índices para rastreamento completo
-- ===================================

USE segredodosabor;

-- Adicionar campo de data de criação do pedido
ALTER TABLE reserva 
ADD COLUMN data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
AFTER idreserva;

-- Adicionar campo de número do pedido (formato PED000001)
ALTER TABLE reserva 
ADD COLUMN numero_pedido VARCHAR(20) UNIQUE
AFTER data_pedido;

-- Adicionar campo de última atualização
ALTER TABLE reserva 
ADD COLUMN data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
AFTER numero_pedido;

-- Adicionar campo de histórico de status (JSON)
ALTER TABLE reserva 
ADD COLUMN historico_status JSON
AFTER data_atualizacao;

-- Criar índices para otimização de consultas
CREATE INDEX idx_reserva_status 
ON reserva(status);

CREATE INDEX idx_reserva_cliente 
ON reserva(idcliente_fk);

CREATE INDEX idx_reserva_data_pedido 
ON reserva(data_pedido DESC);

CREATE INDEX idx_reserva_numero_pedido 
ON reserva(numero_pedido);

-- Atualizar pedidos existentes sem número
UPDATE reserva 
SET numero_pedido = CONCAT('PED', LPAD(idreserva, 6, '0'))
WHERE numero_pedido IS NULL;

-- Inicializar histórico de status para pedidos existentes
UPDATE reserva 
SET historico_status = JSON_ARRAY(
    JSON_OBJECT(
        'status', status,
        'data', data_pedido,
        'observacao', 'Status inicial'
    )
)
WHERE historico_status IS NULL;

-- Verificar estrutura atualizada
DESCRIBE reserva;

-- Verificar dados
SELECT 
    idreserva,
    numero_pedido,
    data_pedido,
    status,
    valor_total,
    historico_status
FROM reserva
LIMIT 5;

COMMIT;

-- ===================================
-- FIM DA ATUALIZAÇÃO
-- ===================================
