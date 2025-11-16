-- =========================================================
-- ADIÇÕES PARA BANCO_DADOS_COMPLETO.sql VERSÃO 5.0
-- Adicionar após o MÓDULO 6: CONFIGURAÇÕES DO SISTEMA
-- =========================================================

-- =========================================================
-- MÓDULO 7: PERSONALIZAÇÃO DE PRODUTOS (RF052-RF055)
-- =========================================================

-- Tabela: produto_opcoes_personalizacao
-- Descrição: Opções de personalização disponíveis (Ex: Recheio, Cobertura, Tamanho)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Opções de personalização disponíveis';

-- Tabela: opcao_valores
-- Descrição: Valores possíveis para cada opção (Ex: Chocolate, Morango, Baunilha)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Valores possíveis para cada opção';

-- Tabela: produto_opcao_associacao
-- Descrição: Associa produtos com opções de personalização disponíveis
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Associa produtos com opções de personalização';

-- Tabela: pedido_personalizacoes
-- Descrição: Personalizações selecionadas pelo cliente em cada pedido
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Personalizações selecionadas em cada pedido';

-- Tabela: personalizacao_ingrediente
-- Descrição: Vincula valores de personalização aos ingredientes consumidos
CREATE TABLE IF NOT EXISTS personalizacao_ingrediente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idvalor_fk INT NOT NULL,
    idingrediente_fk INT NOT NULL,
    quantidade_usada DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    
    FOREIGN KEY (idvalor_fk) REFERENCES opcao_valores(idvalor)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (idingrediente_fk) REFERENCES ingrediente(idingrediente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    UNIQUE KEY uk_valor_ingrediente (idvalor_fk, idingrediente_fk),
    INDEX idx_valor (idvalor_fk),
    INDEX idx_ingrediente (idingrediente_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Vincula valores de personalização aos ingredientes usados';

-- =========================================================
-- MÓDULO 8: PREFERÊNCIAS DE CLIENTES (RF055)
-- =========================================================

-- Tabela: cliente_preferencias
-- Descrição: Salva preferências de clientes frequentes (favoritos, endereço, etc)
CREATE TABLE IF NOT EXISTS cliente_preferencias (
    idpreferencia INT PRIMARY KEY AUTO_INCREMENT,
    idcliente_fk INT NOT NULL,
    preferencias JSON NOT NULL COMMENT 'JSON com favoritos, endereço, pagamento, etc',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    INDEX idx_cliente (idcliente_fk),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Armazena preferências personalizadas de clientes frequentes';

-- Tabela: cliente_preferencias_historico
-- Descrição: Histórico de alterações de preferências
CREATE TABLE IF NOT EXISTS cliente_preferencias_historico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idpreferencia_fk INT NOT NULL,
    preferencias_antigas JSON NOT NULL,
    data_alteracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idpreferencia_fk) REFERENCES cliente_preferencias(idpreferencia)
        ON DELETE CASCADE,
    
    INDEX idx_preferencia (idpreferencia_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Histórico de alterações de preferências';

-- =========================================================
-- MÓDULO 9: ASSISTENTE VIRTUAL COM IA (RF064, RF065)
-- =========================================================

-- Tabela: assistente_interacoes
-- Descrição: Histórico completo de interações com o chatbot
CREATE TABLE IF NOT EXISTS assistente_interacoes (
    idinteracao INT PRIMARY KEY AUTO_INCREMENT,
    mensagem_usuario TEXT NOT NULL,
    resposta_assistente TEXT NOT NULL,
    categoria VARCHAR(50),
    confianca DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Confiança da resposta (0-1)',
    feedback ENUM('positivo', 'negativo', 'neutro') DEFAULT 'neutro',
    ip_usuario VARCHAR(45) COMMENT 'IP do usuário',
    user_agent TEXT COMMENT 'Navegador/dispositivo',
    data_interacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    tempo_resposta_ms INT COMMENT 'Tempo de processamento em ms',
    
    INDEX idx_categoria (categoria),
    INDEX idx_data (data_interacao),
    INDEX idx_feedback (feedback)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Histórico de interações do assistente virtual';

-- Tabela: assistente_intencoes_customizadas
-- Descrição: Intenções personalizadas para respostas customizadas
CREATE TABLE IF NOT EXISTS assistente_intencoes_customizadas (
    idintencao INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(50) NOT NULL,
    pergunta_regex TEXT NOT NULL COMMENT 'Regex para detectar a pergunta',
    resposta TEXT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    prioridade INT DEFAULT 0 COMMENT 'Prioridade na detecção (maior = mais prioritário)',
    criado_por INT COMMENT 'ID do admin que criou',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_categoria (categoria),
    INDEX idx_ativo (ativo),
    INDEX idx_prioridade (prioridade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Intenções customizadas para o assistente';

-- Tabela: assistente_palavras_chave
-- Descrição: Palavras-chave para detecção inteligente de intenções
CREATE TABLE IF NOT EXISTS assistente_palavras_chave (
    idpalavra INT PRIMARY KEY AUTO_INCREMENT,
    palavra VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    relevancia INT DEFAULT 1 COMMENT 'Peso da palavra (1-10)',
    ativo BOOLEAN DEFAULT TRUE,
    
    UNIQUE KEY uk_palavra_categoria (palavra, categoria),
    INDEX idx_categoria (categoria),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Palavras-chave para detecção de intenções';

-- Tabela: assistente_sessoes
-- Descrição: Sessões de conversa para manter contexto
CREATE TABLE IF NOT EXISTS assistente_sessoes (
    idsessao INT PRIMARY KEY AUTO_INCREMENT,
    identificador_sessao VARCHAR(100) UNIQUE NOT NULL COMMENT 'UUID da sessão',
    idcliente INT COMMENT 'ID do cliente (se logado)',
    contexto JSON COMMENT 'Contexto acumulado da conversa',
    ultima_mensagem TEXT,
    ultima_categoria VARCHAR(50),
    data_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_ultima_interacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativa BOOLEAN DEFAULT TRUE,
    
    INDEX idx_identificador (identificador_sessao),
    INDEX idx_cliente (idcliente),
    INDEX idx_ativa (ativa),
    
    FOREIGN KEY (idcliente) REFERENCES cliente(idcliente) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Sessões de conversa do assistente';

-- Tabela: assistente_faq
-- Descrição: Base de conhecimento (FAQ) do assistente
CREATE TABLE IF NOT EXISTS assistente_faq (
    idfaq INT PRIMARY KEY AUTO_INCREMENT,
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    tags JSON COMMENT 'Tags para busca ["pedido", "entrega", etc]',
    visualizacoes INT DEFAULT 0,
    util INT DEFAULT 0 COMMENT 'Quantas vezes foi marcada como útil',
    nao_util INT DEFAULT 0,
    ordem_exibicao INT DEFAULT 0 COMMENT 'Ordem de exibição no FAQ público',
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_categoria (categoria),
    INDEX idx_ativo (ativo),
    INDEX idx_ordem (ordem_exibicao),
    FULLTEXT idx_busca (pergunta, resposta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Base de conhecimento (FAQ) do assistente';

-- Tabela: assistente_feedback
-- Descrição: Feedback detalhado sobre respostas do assistente
CREATE TABLE IF NOT EXISTS assistente_feedback (
    idfeedback INT PRIMARY KEY AUTO_INCREMENT,
    idinteracao INT NOT NULL,
    tipo ENUM('positivo', 'negativo') NOT NULL,
    motivo TEXT COMMENT 'Motivo do feedback negativo',
    sugestao TEXT COMMENT 'Sugestão de melhoria',
    ip_usuario VARCHAR(45),
    data_feedback DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tipo (tipo),
    INDEX idx_data (data_feedback),
    
    FOREIGN KEY (idinteracao) REFERENCES assistente_interacoes(idinteracao) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Feedback detalhado sobre as respostas';

-- =========================================================
-- MÓDULO 10: WHATSAPP BUSINESS BOT (RF027, RF029, RF065)
-- =========================================================

-- Tabela: tb_mensagens_whatsapp
-- Descrição: Histórico de mensagens WhatsApp (enviadas e recebidas)
CREATE TABLE IF NOT EXISTS tb_mensagens_whatsapp (
    id_mensagem INT PRIMARY KEY AUTO_INCREMENT,
    id_reserva INT,
    telefone VARCHAR(20) NOT NULL,
    tipo_mensagem ENUM('enviada', 'recebida') NOT NULL,
    conteudo TEXT NOT NULL,
    status_envio ENUM('pendente', 'enviado', 'entregue', 'lido', 'falha') DEFAULT 'pendente',
    tipo_notificacao VARCHAR(50) COMMENT 'pedido_recebido, pagamento_confirmado, pedido_pronto, etc',
    whatsapp_message_id VARCHAR(100) COMMENT 'ID da mensagem retornado pela API',
    erro_mensagem TEXT,
    data_hora_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_hora_entrega DATETIME,
    data_hora_leitura DATETIME,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_reserva) REFERENCES reserva(idreserva) ON DELETE CASCADE,
    INDEX idx_telefone (telefone),
    INDEX idx_reserva (id_reserva),
    INDEX idx_tipo (tipo_mensagem),
    INDEX idx_status (status_envio),
    INDEX idx_data (data_hora_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Histórico de mensagens WhatsApp';

-- Tabela: tb_whatsapp_webhooks
-- Descrição: Webhooks recebidos da Evolution API
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
COMMENT='Webhooks recebidos da Evolution API';

-- Tabela: tb_whatsapp_bot_config
-- Descrição: Configurações do bot WhatsApp
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
COMMENT='Configurações do bot WhatsApp';

-- Tabela: tb_whatsapp_comandos
-- Descrição: Comandos e respostas automáticas do bot
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Comandos e respostas automáticas do bot';

-- Tabela: tb_whatsapp_estatisticas
-- Descrição: Estatísticas de uso do WhatsApp Bot
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
COMMENT='Estatísticas de uso do WhatsApp Bot';

-- =========================================================
-- MÓDULO 11: TABELAS AUXILIARES
-- =========================================================

-- Tabela: mensagens_whatsapp (Legacy - compatibilidade)
CREATE TABLE IF NOT EXISTS mensagens_whatsapp (
    id INT PRIMARY KEY AUTO_INCREMENT,
    telefone VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('enviada', 'recebida') NOT NULL,
    status VARCHAR(50) DEFAULT 'enviada',
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_pedido INT,
    resposta_usuario TEXT,
    data_resposta DATETIME,
    
    INDEX idx_telefone (telefone),
    INDEX idx_tipo (tipo),
    INDEX idx_pedido (id_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Mensagens WhatsApp (tabela legada)';

-- Tabela: produto_imagens
-- Descrição: Múltiplas imagens por produto (futuro)
CREATE TABLE IF NOT EXISTS produto_imagens (
    id_imagem INT PRIMARY KEY AUTO_INCREMENT,
    idproduto_fk INT NOT NULL,
    url_imagem VARCHAR(500) NOT NULL,
    ordem INT DEFAULT 0,
    principal BOOLEAN DEFAULT FALSE,
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idproduto_fk) REFERENCES produto(idproduto) ON DELETE CASCADE,
    INDEX idx_produto (idproduto_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Múltiplas imagens por produto';

-- Tabela: administrador (Legacy)
CREATE TABLE IF NOT EXISTS administrador (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nivel_acesso ENUM('master', 'gerente', 'operador') DEFAULT 'operador',
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME,
    
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Administradores do sistema (legado)';

-- Tabela: login (Legacy)
CREATE TABLE IF NOT EXISTS login (
    id_login INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Login (tabela legada)';

-- Tabela: personalizacao_produto (Legacy)
CREATE TABLE IF NOT EXISTS personalizacao_produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idproduto INT NOT NULL,
    tipo_personalizacao VARCHAR(100),
    opcao VARCHAR(100),
    valor_adicional DECIMAL(10,2) DEFAULT 0.00,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_produto (idproduto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Personalização de produtos (legado)';

-- Tabela: personalizacao_ingredientes (Legacy)
CREATE TABLE IF NOT EXISTS personalizacao_ingredientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idpersonalizacao INT NOT NULL,
    idingrediente INT NOT NULL,
    quantidade_usada DECIMAL(10,3) DEFAULT 0.000,
    custo_adicional DECIMAL(10,2) DEFAULT 0.00,
    ativo BOOLEAN DEFAULT TRUE,
    
    INDEX idx_personalizacao (idpersonalizacao),
    INDEX idx_ingrediente (idingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Ingredientes de personalização (legado)';

-- Tabela: produto_ingrediente (Legacy - usar 'receita' ao invés)
CREATE TABLE IF NOT EXISTS produto_ingrediente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idproduto INT NOT NULL,
    idingrediente INT NOT NULL,
    quantidade DECIMAL(10,3) DEFAULT 0.000,
    unidade VARCHAR(20),
    custo_unitario DECIMAL(10,2) DEFAULT 0.00,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_produto (idproduto),
    INDEX idx_ingrediente (idingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Produto-Ingrediente (legado - usar receita)';

-- =========================================================
-- FIM DAS ADIÇÕES V5.0
-- =========================================================
