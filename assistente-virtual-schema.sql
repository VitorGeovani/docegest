-- ===================================================================
-- 🤖 ASSISTENTE VIRTUAL INTELIGENTE - DOCEGEST
-- Tabelas para suporte ao chatbot com IA
-- ===================================================================

-- 1. TABELA DE INTERAÇÕES
-- Registra todas as conversas para aprendizado
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

-- 2. TABELA DE INTENÇÕES CUSTOMIZADAS
-- Permite adicionar novas respostas dinamicamente (aprendizado supervisionado)
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

-- 3. TABELA DE PALAVRAS-CHAVE
-- Mapeia palavras-chave para categorias
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

-- 4. TABELA DE SESSÕES DE CONVERSA
-- Mantém contexto da conversa
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

-- 5. TABELA DE FAQ (Perguntas Frequentes)
-- Base de conhecimento estruturada
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

-- 6. TABELA DE FEEDBACK DETALHADO
-- Feedback expandido dos usuários
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

-- ===================================================================
-- DADOS INICIAIS
-- ===================================================================

-- Inserir palavras-chave padrão
INSERT INTO assistente_palavras_chave (palavra, categoria, relevancia) VALUES
-- Pedidos
('pedido', 'pedidos', 10),
('comprar', 'pedidos', 9),
('encomendar', 'pedidos', 9),
('reservar', 'pedidos', 8),
('status', 'pedidos', 10),
('rastrear', 'pedidos', 9),
('cancelar', 'pedidos', 10),

-- Produtos
('cardápio', 'produtos', 10),
('menu', 'produtos', 10),
('produto', 'produtos', 10),
('doce', 'produtos', 8),
('bolo', 'produtos', 9),
('sorvete', 'produtos', 9),
('brigadeiro', 'produtos', 9),
('preço', 'produtos', 10),
('valor', 'produtos', 9),

-- Entrega
('entrega', 'entrega', 10),
('delivery', 'entrega', 10),
('retirar', 'entrega', 9),
('buscar', 'entrega', 8),
('prazo', 'entrega', 9),

-- Pagamento
('pagar', 'pagamento', 10),
('pagamento', 'pagamento', 10),
('pix', 'pagamento', 10),
('cartão', 'pagamento', 10),
('dinheiro', 'pagamento', 9),
('parcelar', 'pagamento', 9),

-- Contato
('contato', 'contato', 10),
('telefone', 'contato', 9),
('whatsapp', 'contato', 10),
('email', 'contato', 9),
('atendente', 'contato', 10),
('ajuda', 'contato', 10),

-- Horário
('horário', 'horario', 10),
('abre', 'horario', 9),
('fecha', 'horario', 9),
('funciona', 'horario', 9),
('aberto', 'horario', 8),

-- Acessibilidade
('acessibilidade', 'acessibilidade', 10),
('libras', 'acessibilidade', 10),
('vlibras', 'acessibilidade', 10),
('deficiente', 'acessibilidade', 9),
('inclusão', 'acessibilidade', 9);

-- Inserir FAQ padrão
INSERT INTO assistente_faq (pergunta, resposta, categoria, tags, ordem_exibicao) VALUES
(
    'Como faço para fazer um pedido?',
    'É muito fácil! Acesse nosso catálogo (https://segredodosabor.com/catalogo), escolha seus produtos, adicione ao carrinho, personalize se desejar e finalize o pedido. Você também pode pedir pelo WhatsApp: (11) 96769-6744',
    'pedidos',
    '["pedido", "como fazer", "comprar"]',
    1
),
(
    'Quais são as formas de pagamento?',
    'Aceitamos PIX (com 5% de desconto), cartão de crédito/débito, dinheiro e vale-presente. Parcelamos em até 3x sem juros!',
    'pagamento',
    '["pagamento", "pix", "cartão"]',
    2
),
(
    'Qual o prazo de entrega?',
    'Produtos prontos: retirada imediata. Sob encomenda: 24-48h. Bolos decorados: 48-72h. Para eventos, entre em contato para combinar!',
    'entrega',
    '["prazo", "entrega", "quanto tempo"]',
    3
),
(
    'Vocês fazem entrega?',
    'Sim! Oferecemos entrega em um raio de 10km. A taxa varia conforme a distância. A retirada na loja é sempre gratuita!',
    'entrega',
    '["entrega", "delivery", "frete"]',
    4
),
(
    'Qual o horário de funcionamento?',
    'Segunda a Sexta: 9h às 18h. Sábado: 9h às 14h. Domingo e feriados: fechado. Pedidos online 24/7!',
    'horario',
    '["horário", "funciona", "abre"]',
    5
),
(
    'Posso personalizar meu pedido?',
    'Sim! Você pode remover ingredientes (alergias), adicionar extras, escolher tamanhos e criar combinações únicas. O preço ajusta automaticamente!',
    'produtos',
    '["personalizar", "customizar", "mudar"]',
    6
),
(
    'Como consulto o status do meu pedido?',
    'Acesse "Meus Pedidos" no site ou envie "status" no WhatsApp. Você receberá todas as informações em tempo real!',
    'pedidos',
    '["status", "acompanhar", "onde está"]',
    7
),
(
    'O site é acessível?',
    'Sim! Somos 100% acessíveis (WCAG 2.2 AAA): VLibras integrado, navegação por teclado, leitores de tela compatíveis, alto contraste e muito mais!',
    'acessibilidade',
    '["acessibilidade", "libras", "deficiente"]',
    8
);

-- ===================================================================
-- VIEWS ÚTEIS
-- ===================================================================

-- View: Estatísticas do Assistente
CREATE OR REPLACE VIEW vw_assistente_estatisticas AS
SELECT 
    DATE(data_interacao) as data,
    COUNT(*) as total_interacoes,
    AVG(confianca) as confianca_media,
    SUM(CASE WHEN feedback = 'positivo' THEN 1 ELSE 0 END) as feedbacks_positivos,
    SUM(CASE WHEN feedback = 'negativo' THEN 1 ELSE 0 END) as feedbacks_negativos,
    SUM(CASE WHEN feedback = 'neutro' THEN 1 ELSE 0 END) as sem_feedback,
    AVG(tempo_resposta_ms) as tempo_medio_ms
FROM assistente_interacoes
GROUP BY DATE(data_interacao)
ORDER BY data DESC;

-- View: FAQ Mais Acessadas
CREATE OR REPLACE VIEW vw_faq_populares AS
SELECT 
    idfaq,
    pergunta,
    categoria,
    visualizacoes,
    util,
    nao_util,
    ROUND((util / NULLIF(util + nao_util, 0)) * 100, 1) as taxa_utilidade
FROM assistente_faq
WHERE ativo = TRUE
ORDER BY visualizacoes DESC, util DESC
LIMIT 10;

-- View: Categorias Mais Consultadas
CREATE OR REPLACE VIEW vw_categorias_populares AS
SELECT 
    categoria,
    COUNT(*) as total_consultas,
    AVG(confianca) as confianca_media,
    SUM(CASE WHEN feedback = 'positivo' THEN 1 ELSE 0 END) as satisfacao
FROM assistente_interacoes
WHERE categoria IS NOT NULL
GROUP BY categoria
ORDER BY total_consultas DESC;

-- ===================================================================
-- PROCEDURES ÚTEIS
-- ===================================================================

-- Procedure: Limpar interações antigas (manutenção)
DELIMITER $$
CREATE PROCEDURE sp_limpar_interacoes_antigas(IN dias_reter INT)
BEGIN
    DELETE FROM assistente_interacoes
    WHERE data_interacao < DATE_SUB(NOW(), INTERVAL dias_reter DAY);
    
    SELECT ROW_COUNT() as registros_removidos;
END$$
DELIMITER ;

-- Procedure: Obter sugestões baseadas em histórico
DELIMITER $$
CREATE PROCEDURE sp_obter_sugestoes(IN id_cliente INT)
BEGIN
    SELECT DISTINCT
        categoria,
        COUNT(*) as vezes_consultada
    FROM assistente_interacoes ai
    JOIN assistente_sessoes ases ON ai.ip_usuario = ases.identificador_sessao
    WHERE ases.idcliente = id_cliente
    AND ai.data_interacao >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY categoria
    ORDER BY vezes_consultada DESC
    LIMIT 5;
END$$
DELIMITER ;

-- ===================================================================
-- TRIGGERS
-- ===================================================================

-- Trigger: Atualizar visualizações do FAQ
DELIMITER $$
CREATE TRIGGER trg_faq_visualizacao
AFTER INSERT ON assistente_interacoes
FOR EACH ROW
BEGIN
    -- Se a categoria corresponde a um FAQ, incrementar visualização
    UPDATE assistente_faq
    SET visualizacoes = visualizacoes + 1
    WHERE categoria = NEW.categoria
    AND ativo = TRUE;
END$$
DELIMITER ;

-- ===================================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ===================================================================

-- Índice para busca full-text em interações
ALTER TABLE assistente_interacoes ADD FULLTEXT idx_busca_mensagem (mensagem_usuario, resposta_assistente);

-- ===================================================================
-- COMENTÁRIOS FINAIS
-- ===================================================================

-- Este schema suporta:
-- ✅ Aprendizado de máquina supervisionado
-- ✅ Contexto de conversa
-- ✅ Análise de satisfação
-- ✅ Base de conhecimento dinâmica
-- ✅ Performance otimizada com índices

-- Para popular com mais dados:
-- 1. Adicione mais palavras-chave relevantes
-- 2. Crie FAQs específicas do seu negócio
-- 3. Monitore as estatísticas para identificar gaps
-- 4. Use o feedback para melhorar respostas

-- Estatísticas em tempo real:
-- SELECT * FROM vw_assistente_estatisticas WHERE data >= CURDATE();
-- SELECT * FROM vw_faq_populares;
-- SELECT * FROM vw_categorias_populares;
