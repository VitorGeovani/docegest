import connection from './src/repository/connection.js';

async function criarTabelasWhatsApp() {
    try {
        console.log('🚀 Criando tabelas WhatsApp...\n');

        // Tabela de mensagens
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tb_mensagens_whatsapp (
                id_mensagem INT PRIMARY KEY AUTO_INCREMENT,
                id_reserva INT,
                telefone VARCHAR(20) NOT NULL,
                tipo_mensagem ENUM('enviada', 'recebida') NOT NULL,
                conteudo TEXT NOT NULL,
                status_envio ENUM('pendente', 'enviado', 'entregue', 'lido', 'falha') DEFAULT 'pendente',
                tipo_notificacao VARCHAR(50),
                whatsapp_message_id VARCHAR(100),
                erro_mensagem TEXT,
                data_hora_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_hora_entrega DATETIME,
                data_hora_leitura DATETIME,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_reserva) REFERENCES reserva(idReserva) ON DELETE CASCADE,
                INDEX idx_telefone (telefone),
                INDEX idx_reserva (id_reserva),
                INDEX idx_tipo (tipo_mensagem),
                INDEX idx_status (status_envio),
                INDEX idx_data (data_hora_envio)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Tabela tb_mensagens_whatsapp criada');

        // Tabela de webhooks
        await connection.query(`
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Tabela tb_whatsapp_webhooks criada');

        // Tabela de configuração do bot
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tb_whatsapp_bot_config (
                id_config INT PRIMARY KEY AUTO_INCREMENT,
                status_bot ENUM('ativo', 'inativo', 'manutencao') DEFAULT 'ativo',
                mensagem_boas_vindas TEXT,
                mensagem_ausente TEXT,
                horario_funcionamento_inicio TIME DEFAULT '08:00:00',
                horario_funcionamento_fim TIME DEFAULT '18:00:00',
                resposta_automatica_ativa BOOLEAN DEFAULT TRUE,
                ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Tabela tb_whatsapp_bot_config criada');

        // Inserir configuração padrão
        await connection.query(`
            INSERT INTO tb_whatsapp_bot_config (
                status_bot,
                mensagem_boas_vindas,
                mensagem_ausente
            ) VALUES (
                'ativo',
                '👋 Olá! Bem-vindo ao *Segredos do Sabor*! 🍰\\n\\nComo posso te ajudar hoje?\\n\\n1️⃣ Fazer um pedido\\n2️⃣ Consultar pedido\\n3️⃣ Ver cardápio\\n4️⃣ Falar com atendente',
                '😴 No momento estamos fora do horário de atendimento.\\n\\nNosso horário é de *Segunda a Sexta, das 8h às 18h*.\\n\\nDeixe sua mensagem que responderemos em breve!'
            ) ON DUPLICATE KEY UPDATE status_bot = status_bot
        `);
        console.log('✅ Configuração padrão inserida');

        // Tabela de comandos
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tb_whatsapp_comandos (
                id_comando INT PRIMARY KEY AUTO_INCREMENT,
                palavra_chave VARCHAR(50) NOT NULL,
                tipo_resposta ENUM('texto', 'menu', 'acao') NOT NULL,
                resposta_texto TEXT,
                acao_controller VARCHAR(100),
                ativo BOOLEAN DEFAULT TRUE,
                ordem_exibicao INT DEFAULT 0,
                INDEX idx_palavra (palavra_chave),
                INDEX idx_ativo (ativo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Tabela tb_whatsapp_comandos criada');

        // Inserir comandos padrão
        await connection.query(`
            INSERT INTO tb_whatsapp_comandos (palavra_chave, tipo_resposta, resposta_texto, ordem_exibicao) VALUES
            ('pedido', 'texto', '📦 Para fazer um pedido, acesse nosso catálogo online:\\n\\nhttps://segredodosabor.com.br/catalogo\\n\\nOu se preferir, me diga o que deseja e eu te ajudo! 😊', 1),
            ('consultar', 'acao', NULL, 2),
            ('cardapio', 'texto', '📋 Confira nosso cardápio completo:\\n\\nhttps://segredodosabor.com.br/catalogo\\n\\n🧁 Bolos personalizados\\n🍰 Doces finos\\n🎂 Tortas artesanais\\n🍪 Cookies gourmet', 3),
            ('horario', 'texto', '⏰ *Horário de Funcionamento:*\\n\\nSegunda a Sexta: 8h às 18h\\nSábado: 8h às 14h\\nDomingo: Fechado', 4),
            ('endereco', 'texto', '📍 *Nosso endereço:*\\n\\nRua dos Doces, 123\\nCentro - São Paulo/SP\\nCEP: 01234-567\\n\\nEstamos te esperando! 💜', 5),
            ('ajuda', 'menu', '🤖 *Comandos disponíveis:*\\n\\n• *pedido* - Fazer um novo pedido\\n• *consultar* - Ver status do seu pedido\\n• *cardapio* - Ver nossos produtos\\n• *horario* - Horário de funcionamento\\n• *endereco* - Como chegar\\n• *contato* - Falar com atendente', 6)
            ON DUPLICATE KEY UPDATE resposta_texto = VALUES(resposta_texto)
        `);
        console.log('✅ Comandos padrão inseridos');

        // Tabela de estatísticas
        await connection.query(`
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Tabela tb_whatsapp_estatisticas criada');

        // Adicionar campos na reserva ANTES de criar a view
        try {
            await connection.query(`
                ALTER TABLE reserva 
                ADD COLUMN canal_venda ENUM('web', 'whatsapp', 'presencial') DEFAULT 'web' AFTER status_pedido
            `);
            console.log('✅ Campo canal_venda adicionado');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️  Campo canal_venda já existe');
            } else throw e;
        }

        // View para status (depois de adicionar canal_venda)
        await connection.query(`DROP VIEW IF EXISTS vw_whatsapp_status`);
        await connection.query(`
            CREATE VIEW vw_whatsapp_status AS
            SELECT 
                (SELECT COUNT(*) FROM tb_mensagens_whatsapp WHERE DATE(data_hora_envio) = CURDATE()) as mensagens_hoje,
                (SELECT COUNT(*) FROM tb_mensagens_whatsapp WHERE tipo_mensagem = 'enviada' AND status_envio = 'falha' AND DATE(data_hora_envio) = CURDATE()) as falhas_hoje,
                (SELECT COUNT(*) FROM tb_whatsapp_webhooks WHERE processado = FALSE) as webhooks_pendentes,
                (SELECT status_bot FROM tb_whatsapp_bot_config ORDER BY id_config DESC LIMIT 1) as status_bot,
                (SELECT COUNT(*) FROM reserva WHERE DATE(data_pedido) = CURDATE() AND canal_venda = 'whatsapp') as pedidos_whatsapp_hoje
        `);
        console.log('✅ View vw_whatsapp_status criada');

        console.log('\n🎉 Todas as tabelas foram criadas com sucesso!');

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await connection.end();
        process.exit(0);
    }
}

criarTabelasWhatsApp();
