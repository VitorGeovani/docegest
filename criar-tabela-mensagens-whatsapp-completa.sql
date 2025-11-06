-- Script SQL para criar tabela de mensagens WhatsApp
-- RF027, RF029, RF049, RF065

-- Tabela para armazenar histórico de mensagens
CREATE TABLE IF NOT EXISTS mensagens_whatsapp (
    idmensagem INT PRIMARY KEY AUTO_INCREMENT,
    telefone VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('confirmacao', 'status', 'confirmacao_reenvio', 'manual', 'recebida', 'consulta_status') NOT NULL,
    idreserva_fk INT NULL,
    data_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('enviado', 'entregue', 'lido', 'erro') DEFAULT 'enviado',
    data_status DATETIME NULL,
    direcao ENUM('entrada', 'saida') DEFAULT 'saida',
    
    INDEX idx_telefone (telefone),
    INDEX idx_reserva (idreserva_fk),
    INDEX idx_data (data_envio),
    
    FOREIGN KEY (idreserva_fk) REFERENCES reserva(idreserva) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentários das colunas
ALTER TABLE mensagens_whatsapp 
    MODIFY COLUMN telefone VARCHAR(20) COMMENT 'Número de telefone do cliente',
    MODIFY COLUMN mensagem TEXT COMMENT 'Conteúdo da mensagem enviada/recebida',
    MODIFY COLUMN tipo ENUM('confirmacao', 'status', 'confirmacao_reenvio', 'manual', 'recebida', 'consulta_status') COMMENT 'Tipo da mensagem',
    MODIFY COLUMN idreserva_fk INT COMMENT 'ID do pedido relacionado (opcional)',
    MODIFY COLUMN status ENUM('enviado', 'entregue', 'lido', 'erro') COMMENT 'Status da entrega da mensagem',
    MODIFY COLUMN direcao ENUM('entrada', 'saida') COMMENT 'Direção da mensagem: entrada (cliente->sistema) ou saida (sistema->cliente)';

-- View para estatísticas de mensagens
CREATE OR REPLACE VIEW vw_estatisticas_whatsapp AS
SELECT 
    DATE(data_envio) as data,
    COUNT(*) as total_mensagens,
    COUNT(DISTINCT telefone) as clientes_unicos,
    SUM(CASE WHEN tipo = 'confirmacao' THEN 1 ELSE 0 END) as confirmacoes,
    SUM(CASE WHEN tipo = 'status' THEN 1 ELSE 0 END) as atualizacoes_status,
    SUM(CASE WHEN tipo = 'confirmacao_reenvio' THEN 1 ELSE 0 END) as reenvios,
    SUM(CASE WHEN tipo = 'consulta_status' THEN 1 ELSE 0 END) as consultas_status,
    SUM(CASE WHEN direcao = 'entrada' THEN 1 ELSE 0 END) as mensagens_recebidas,
    SUM(CASE WHEN direcao = 'saida' THEN 1 ELSE 0 END) as mensagens_enviadas,
    SUM(CASE WHEN status = 'erro' THEN 1 ELSE 0 END) as erros
FROM mensagens_whatsapp
GROUP BY DATE(data_envio)
ORDER BY data DESC;

-- Dados de exemplo para testes
INSERT INTO mensagens_whatsapp (telefone, mensagem, tipo, data_envio, status, direcao) VALUES
('5511999999999', '✅ Pedido confirmado! Número: #PED20251101001', 'confirmacao', NOW(), 'entregue', 'saida'),
('5511999999999', '👨‍🍳 Seu pedido está sendo preparado!', 'status', NOW(), 'lido', 'saida'),
('5511999999999', 'Qual o status do meu pedido?', 'recebida', NOW(), 'lido', 'entrada'),
('5511988888888', '✅ Pedido confirmado! Número: #PED20251101002', 'confirmacao', NOW(), 'entregue', 'saida');

SELECT '✅ Tabela mensagens_whatsapp criada com sucesso!' as resultado;
SELECT '✅ View vw_estatisticas_whatsapp criada!' as resultado;
SELECT '✅ Dados de exemplo inseridos!' as resultado;
