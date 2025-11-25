-- ============================================
-- TABELA PARA HISTÓRICO DE MENSAGENS WHATSAPP
-- RF029: Sincronizar Mensagens WhatsApp
-- ============================================

-- Tabela principal de mensagens
CREATE TABLE IF NOT EXISTS tb_mensagens_whatsapp (
    id_mensagem INT PRIMARY KEY AUTO_INCREMENT,
    id_reserva INT,
    telefone VARCHAR(20) NOT NULL,
    tipo_mensagem ENUM('enviada', 'recebida') NOT NULL,
    conteudo TEXT NOT NULL,
    status_envio ENUM('pendente', 'enviado', 'entregue', 'lido', 'falha') DEFAULT 'pendente',
    tipo_notificacao VARCHAR(50) COMMENT 'pedido_recebido, pagamento_confirmado, pedido_pronto, lembrete, agradecimento',
    whatsapp_message_id VARCHAR(100) COMMENT 'ID da mensagem retornado pela API',
    erro_mensagem TEXT,
    data_hora_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_hora_entrega DATETIME,
    data_hora_leitura DATETIME,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reserva) REFERENCES tb_reserva(id_reserva) ON DELETE CASCADE,
    INDEX idx_telefone (telefone),
    INDEX idx_reserva (id_reserva),
    INDEX idx_tipo (tipo_mensagem),
    INDEX idx_status (status_envio),
    INDEX idx_data (data_hora_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela para webhook events (RF027)
CREATE TABLE IF NOT EXISTS tb_whatsapp_webhooks (
    id_webhook INT PRIMARY KEY AUTO_INCREMENT,
    evento_tipo VARCHAR(50) NOT NULL,
    evento_json JSON NOT NULL,
    id_mensagem INT,
    telefone_origem VARCHAR(20),
    processado BOOLEAN DEFAULT FALSE,
    data_recebimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_processamento DATETIME,
    erro_processamento TEXT,
    FOREIGN KEY (id_mensagem) REFERENCES tb_mensagens_whatsapp(id_mensagem) ON DELETE SET NULL,
    INDEX idx_processado (processado),
    INDEX idx_tipo (evento_tipo),
    INDEX idx_telefone (telefone_origem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela para configuração do bot (RF065)
CREATE TABLE IF NOT EXISTS tb_whatsapp_bot_config (
    id_config INT PRIMARY KEY AUTO_INCREMENT,
    status_bot ENUM('ativo', 'inativo', 'manutencao') DEFAULT 'ativo',
    mensagem_boas_vindas TEXT,
    mensagem_ausente TEXT,
    horario_funcionamento_inicio TIME DEFAULT '08:00:00',
    horario_funcionamento_fim TIME DEFAULT '18:00:00',
    resposta_automatica_ativa BOOLEAN DEFAULT TRUE,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir configuração padrão
INSERT INTO tb_whatsapp_bot_config (
    status_bot,
    mensagem_boas_vindas,
    mensagem_ausente
) VALUES (
    'ativo',
    '👋 Olá! Bem-vindo ao *Segredos do Sabor*! 🍰\n\nComo posso te ajudar hoje?\n\n1️⃣ Fazer um pedido\n2️⃣ Consultar pedido\n3️⃣ Ver cardápio\n4️⃣ Falar com atendente',
    '😴 No momento estamos fora do horário de atendimento.\n\nNosso horário é de *Segunda a Sexta, das 8h às 18h*.\n\nDeixe sua mensagem que responderemos em breve!'
) ON DUPLICATE KEY UPDATE status_bot = status_bot;

-- Tabela para comandos do bot (RF027)
CREATE TABLE IF NOT EXISTS tb_whatsapp_comandos (
    id_comando INT PRIMARY KEY AUTO_INCREMENT,
    palavra_chave VARCHAR(50) NOT NULL,
    tipo_resposta ENUM('texto', 'menu', 'acao') NOT NULL,
    resposta_texto TEXT,
    acao_controller VARCHAR(100) COMMENT 'Nome do método para executar',
    ativo BOOLEAN DEFAULT TRUE,
    ordem_exibicao INT DEFAULT 0,
    INDEX idx_palavra (palavra_chave),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir comandos padrão
INSERT INTO tb_whatsapp_comandos (palavra_chave, tipo_resposta, resposta_texto, ordem_exibicao) VALUES
('pedido', 'texto', '📦 Para fazer um pedido, acesse nosso catálogo online:\n\nhttps://segredodosabor.com.br/catalogo\n\nOu se preferir, me diga o que deseja e eu te ajudo! 😊', 1),
('consultar', 'acao', NULL, 2),
('cardapio', 'texto', '📋 Confira nosso cardápio completo:\n\nhttps://segredodosabor.com.br/catalogo\n\n🧁 Bolos personalizados\n🍰 Doces finos\n🎂 Tortas artesanais\n🍪 Cookies gourmet', 3),
('horario', 'texto', '⏰ *Horário de Funcionamento:*\n\nSegunda a Sexta: 8h às 18h\nSábado: 8h às 14h\nDomingo: Fechado', 4),
('endereco', 'texto', '📍 *Nosso endereço:*\n\nRua dos Doces, 123\nCentro - São Paulo/SP\nCEP: 01234-567\n\nEstamos te esperando! 💜', 5),
('ajuda', 'menu', '🤖 *Comandos disponíveis:*\n\n• *pedido* - Fazer um novo pedido\n• *consultar* - Ver status do seu pedido\n• *cardapio* - Ver nossos produtos\n• *horario* - Horário de funcionamento\n• *endereco* - Como chegar\n• *contato* - Falar com atendente', 6)
ON DUPLICATE KEY UPDATE resposta_texto = VALUES(resposta_texto);

-- Tabela para estatísticas (RF065)
CREATE TABLE IF NOT EXISTS tb_whatsapp_estatisticas (
    id_estatistica INT PRIMARY KEY AUTO_INCREMENT,
    data_referencia DATE NOT NULL,
    total_mensagens_enviadas INT DEFAULT 0,
    total_mensagens_recebidas INT DEFAULT 0,
    total_mensagens_lidas INT DEFAULT 0,
    total_pedidos_whatsapp INT DEFAULT 0,
    tempo_medio_resposta_segundos INT DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0.00,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_data (data_referencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- View para estatísticas em tempo real (RF065)
CREATE OR REPLACE VIEW vw_whatsapp_status AS
SELECT 
    (SELECT COUNT(*) FROM tb_mensagens_whatsapp WHERE DATE(data_hora_envio) = CURDATE()) as mensagens_hoje,
    (SELECT COUNT(*) FROM tb_mensagens_whatsapp WHERE tipo_mensagem = 'enviada' AND status_envio = 'falha' AND DATE(data_hora_envio) = CURDATE()) as falhas_hoje,
    (SELECT COUNT(*) FROM tb_whatsapp_webhooks WHERE processado = FALSE) as webhooks_pendentes,
    (SELECT status_bot FROM tb_whatsapp_bot_config ORDER BY id_config DESC LIMIT 1) as status_bot,
    (SELECT COUNT(*) FROM tb_reserva WHERE DATE(data_reserva) = CURDATE() AND canal_venda = 'whatsapp') as pedidos_whatsapp_hoje;

-- Procedure para registrar mensagem enviada
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_registrar_mensagem_enviada(
    IN p_id_reserva INT,
    IN p_telefone VARCHAR(20),
    IN p_conteudo TEXT,
    IN p_tipo_notificacao VARCHAR(50),
    IN p_whatsapp_message_id VARCHAR(100)
)
BEGIN
    INSERT INTO tb_mensagens_whatsapp (
        id_reserva,
        telefone,
        tipo_mensagem,
        conteudo,
        status_envio,
        tipo_notificacao,
        whatsapp_message_id
    ) VALUES (
        p_id_reserva,
        p_telefone,
        'enviada',
        p_conteudo,
        'enviado',
        p_tipo_notificacao,
        p_whatsapp_message_id
    );
    
    SELECT LAST_INSERT_ID() as id_mensagem;
END$$

-- Procedure para registrar mensagem recebida (RF027)
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_registrar_mensagem_recebida(
    IN p_telefone VARCHAR(20),
    IN p_conteudo TEXT,
    IN p_whatsapp_message_id VARCHAR(100)
)
BEGIN
    DECLARE v_id_mensagem INT;
    
    INSERT INTO tb_mensagens_whatsapp (
        telefone,
        tipo_mensagem,
        conteudo,
        status_envio,
        whatsapp_message_id
    ) VALUES (
        p_telefone,
        'recebida',
        p_conteudo,
        'entregue',
        p_whatsapp_message_id
    );
    
    SET v_id_mensagem = LAST_INSERT_ID();
    
    -- Retornar mensagem registrada
    SELECT 
        id_mensagem,
        telefone,
        conteudo,
        data_hora_envio
    FROM tb_mensagens_whatsapp
    WHERE id_mensagem = v_id_mensagem;
END$$

-- Procedure para buscar histórico de mensagens (RF029)
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_buscar_historico_mensagens(
    IN p_telefone VARCHAR(20),
    IN p_limite INT
)
BEGIN
    SELECT 
        m.id_mensagem,
        m.id_reserva,
        m.telefone,
        m.tipo_mensagem,
        m.conteudo,
        m.status_envio,
        m.tipo_notificacao,
        m.data_hora_envio,
        m.data_hora_leitura,
        r.numero_pedido
    FROM tb_mensagens_whatsapp m
    LEFT JOIN tb_reserva r ON m.id_reserva = r.id_reserva
    WHERE m.telefone = p_telefone
    ORDER BY m.data_hora_envio DESC
    LIMIT p_limite;
END$$

-- Procedure para atualizar status de mensagem
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_atualizar_status_mensagem(
    IN p_whatsapp_message_id VARCHAR(100),
    IN p_novo_status ENUM('pendente', 'enviado', 'entregue', 'lido', 'falha')
)
BEGIN
    UPDATE tb_mensagens_whatsapp
    SET 
        status_envio = p_novo_status,
        data_hora_entrega = CASE WHEN p_novo_status = 'entregue' THEN NOW() ELSE data_hora_entrega END,
        data_hora_leitura = CASE WHEN p_novo_status = 'lido' THEN NOW() ELSE data_hora_leitura END
    WHERE whatsapp_message_id = p_whatsapp_message_id;
    
    SELECT ROW_COUNT() as linhas_afetadas;
END$$

-- Procedure para atualizar estatísticas diárias (RF065)
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_atualizar_estatisticas_whatsapp()
BEGIN
    INSERT INTO tb_whatsapp_estatisticas (
        data_referencia,
        total_mensagens_enviadas,
        total_mensagens_recebidas,
        total_mensagens_lidas,
        total_pedidos_whatsapp,
        tempo_medio_resposta_segundos
    )
    SELECT 
        CURDATE(),
        SUM(CASE WHEN tipo_mensagem = 'enviada' THEN 1 ELSE 0 END),
        SUM(CASE WHEN tipo_mensagem = 'recebida' THEN 1 ELSE 0 END),
        SUM(CASE WHEN status_envio = 'lido' THEN 1 ELSE 0 END),
        (SELECT COUNT(*) FROM tb_reserva WHERE DATE(data_reserva) = CURDATE() AND canal_venda = 'whatsapp'),
        0
    FROM tb_mensagens_whatsapp
    WHERE DATE(data_hora_envio) = CURDATE()
    ON DUPLICATE KEY UPDATE
        total_mensagens_enviadas = VALUES(total_mensagens_enviadas),
        total_mensagens_recebidas = VALUES(total_mensagens_recebidas),
        total_mensagens_lidas = VALUES(total_mensagens_lidas),
        total_pedidos_whatsapp = VALUES(total_pedidos_whatsapp);
END$$

DELIMITER ;

-- Adicionar campo canal_venda na tb_reserva se não existir
ALTER TABLE tb_reserva 
ADD COLUMN IF NOT EXISTS canal_venda ENUM('web', 'whatsapp', 'presencial') DEFAULT 'web' AFTER forma_pagamento;

-- Adicionar campo numero_pedido se não existir
ALTER TABLE tb_reserva
ADD COLUMN IF NOT EXISTS numero_pedido VARCHAR(20) UNIQUE AFTER id_reserva;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_canal_venda ON tb_reserva(canal_venda);
CREATE INDEX IF NOT EXISTS idx_numero_pedido ON tb_reserva(numero_pedido);

-- ============================================
-- TRIGGERS PARA AUTOMAÇÃO
-- ============================================

-- Trigger para atualizar estatísticas após inserir mensagem
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS trg_after_insert_mensagem
AFTER INSERT ON tb_mensagens_whatsapp
FOR EACH ROW
BEGIN
    -- Atualizar estatísticas do dia
    CALL sp_atualizar_estatisticas_whatsapp();
END$$

DELIMITER ;

SELECT '✅ Tabelas de WhatsApp criadas com sucesso!' as status;
SELECT '📊 Procedures e triggers configurados!' as status;
