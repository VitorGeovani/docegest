-- =========================================================
-- SEGREDO DO SABOR - BANCO DE DADOS COMPLETO
-- Sistema de Gestão de Confeitaria com E-commerce
-- Versão: 5.0 UNIFICADA - Instalação Completa
-- Data: 09 de Novembro de 2025
-- =========================================================
-- 
-- DESCRIÇÃO:
-- Este arquivo contém TODA a estrutura necessária para criar
-- o banco de dados do sistema "Segredo do Sabor" do zero.
--
-- INCLUI:
-- ✅ Todas as tabelas com estrutura completa
-- ✅ Todos os relacionamentos (foreign keys)
-- ✅ Todas as views de relatórios
-- ✅ Todas as procedures de negócio
-- ✅ Todos os triggers automáticos
-- ✅ Dados iniciais (categorias, ingredientes, configurações)
-- ✅ Integração WhatsApp completa
-- ✅ Sistema de personalização
-- ✅ Sistema de preferências de clientes
-- ✅ Administrador padrão (login: admin@segredodosabor.com, senha: Admin@123)
--
-- COMO USAR:
-- 1. Abra este arquivo no MySQL Workbench ou terminal MySQL
-- 2. Execute o arquivo completo
-- 3. Aguarde a mensagem de sucesso
-- 4. Configure o backend (.env) com as credenciais do banco
-- 5. Inicie a aplicação
--
-- REQUISITOS:
-- - MySQL 8.0 ou superior
-- - Charset: utf8mb4
-- - Engine: InnoDB
--
-- =========================================================

-- =========================================================
-- PARTE 1: CONFIGURAÇÃO INICIAL
-- =========================================================

-- Remover banco se já existir (CUIDADO EM PRODUÇÃO!)
-- Comente a linha abaixo se quiser preservar dados existentes
-- DROP DATABASE IF EXISTS segredodosabor;

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS segredodosabor
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE segredodosabor;

-- Desabilitar verificações temporariamente
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Habilitar event scheduler para limpezas automáticas
SET GLOBAL event_scheduler = ON;

-- =========================================================
-- PARTE 2: TABELAS DE AUTENTICAÇÃO E USUÁRIOS
-- =========================================================

-- Tabela: administrador
-- Gestão de administradores do sistema
DROP TABLE IF EXISTS administrador;
CREATE TABLE administrador (
    idadministrador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(20) UNIQUE,
    senha VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo TINYINT DEFAULT 1,
    
    INDEX idx_admin_email (email),
    INDEX idx_admin_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: cliente
-- Clientes/usuários do sistema (e-commerce)
DROP TABLE IF EXISTS cliente;
CREATE TABLE cliente (
    idcliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    
    -- Autenticação JWT
    senha VARCHAR(255) COMMENT 'Hash bcrypt (opcional, permite pedido sem cadastro)',
    email_verificado BOOLEAN DEFAULT FALSE,
    token_recuperacao VARCHAR(255),
    data_token_recuperacao DATETIME,
    tipo ENUM('cliente', 'admin') DEFAULT 'cliente',
    
    -- Auditoria
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME,
    
    INDEX idx_cliente_email (email),
    INDEX idx_cliente_telefone (telefone),
    INDEX idx_cliente_tipo (tipo),
    INDEX idx_cliente_email_verificado (email_verificado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: refresh_tokens
-- Tokens JWT para manter sessão ativa
DROP TABLE IF EXISTS refresh_tokens;
CREATE TABLE refresh_tokens (
    idtoken INT AUTO_INCREMENT PRIMARY KEY,
    idcliente_fk INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    revogado BOOLEAN DEFAULT FALSE,
    ip_criacao VARCHAR(45),
    user_agent VARCHAR(255),
    
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente) ON DELETE CASCADE,
    INDEX idx_refresh_token (token),
    INDEX idx_refresh_cliente (idcliente_fk),
    INDEX idx_refresh_expiracao (data_expiracao),
    INDEX idx_refresh_revogado (revogado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 3: TABELAS DE CATÁLOGO E PRODUTOS
-- =========================================================

-- Tabela: categoria
-- Categorias de produtos
DROP TABLE IF EXISTS categoria;
CREATE TABLE categoria (
    idcategoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(200),
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_categoria_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: produto
-- Produtos do catálogo
DROP TABLE IF EXISTS produto;
CREATE TABLE produto (
    idproduto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT DEFAULT 0 COMMENT 'Estoque disponível',
    img_Produto VARCHAR(255),
    ativo TINYINT DEFAULT 1,
    
    -- Relacionamentos
    idcategoria INT,
    
    -- Gestão
    codigo_produto VARCHAR(20) UNIQUE,
    custo_producao DECIMAL(10,2) DEFAULT 0,
    margem_lucro DECIMAL(5,2) DEFAULT 40,
    tempo_preparo INT DEFAULT 30 COMMENT 'Minutos',
    
    -- Personalização
    permite_personalizacao TINYINT DEFAULT 0,
    opcoes_personalizacao JSON COMMENT 'Opções de personalização disponíveis',
    
    -- Auditoria
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idcategoria) REFERENCES categoria(idcategoria) ON DELETE SET NULL,
    INDEX idx_produto_categoria (idcategoria),
    INDEX idx_produto_ativo (ativo),
    INDEX idx_produto_codigo (codigo_produto),
    INDEX idx_produto_preco (preco)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: produto_imagens
-- Múltiplas imagens por produto
DROP TABLE IF EXISTS produto_imagens;
CREATE TABLE produto_imagens (
    idimagem INT AUTO_INCREMENT PRIMARY KEY,
    idproduto_fk INT NOT NULL,
    caminho_imagem VARCHAR(255) NOT NULL,
    is_principal BOOLEAN DEFAULT FALSE,
    ordem INT DEFAULT 0,
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idproduto_fk) REFERENCES produto(idproduto) ON DELETE CASCADE,
    INDEX idx_produto_imagem (idproduto_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 4: TABELAS DE PEDIDOS E RESERVAS
-- =========================================================

-- Tabela: reserva (também usada como pedido)
-- Pedidos/reservas dos clientes
DROP TABLE IF EXISTS reserva;
CREATE TABLE reserva (
    idreserva INT AUTO_INCREMENT PRIMARY KEY,
    idcliente_fk INT NOT NULL,
    
    -- Dados do pedido
    data_entrega DATE NOT NULL,
    hora_entrega TIME NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    pagamento VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendente',
    
    -- Produtos (JSON array)
    qtdReserva JSON NOT NULL COMMENT '[{id, nome, quantidade, preco, personalizacao}]',
    
    -- Status detalhado
    status_pagamento ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
    status_pedido ENUM('pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado') DEFAULT 'pendente',
    codigo_pedido VARCHAR(20) UNIQUE,
    tipo_pedido VARCHAR(20) DEFAULT 'RETIRADA',
    
    -- Entrega
    endereco_entrega TEXT,
    taxa_entrega DECIMAL(10,2) DEFAULT 0,
    tempo_preparo_estimado INT,
    observacoes TEXT,
    troco_para DECIMAL(10,2),
    
    -- WhatsApp
    whatsapp_notificado BOOLEAN DEFAULT FALSE,
    data_notificacao DATETIME,
    canal_venda VARCHAR(20) DEFAULT 'site' COMMENT 'site, whatsapp, telefone',
    
    -- Auditoria
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente) ON DELETE CASCADE,
    INDEX idx_reserva_status (status),
    INDEX idx_reserva_status_pagamento (status_pagamento),
    INDEX idx_reserva_status_pedido (status_pedido),
    INDEX idx_reserva_data (data_entrega),
    INDEX idx_reserva_cliente (idcliente_fk),
    INDEX idx_reserva_codigo (codigo_pedido),
    INDEX idx_reserva_canal (canal_venda)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 5: TABELAS DE INGREDIENTES E RECEITAS
-- =========================================================

-- Tabela: ingrediente
-- Ingredientes para produção
DROP TABLE IF EXISTS ingrediente;
CREATE TABLE ingrediente (
    idingrediente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    unidade_medida VARCHAR(20) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    quantidade_estoque DECIMAL(10,3) NOT NULL DEFAULT 0,
    estoque_minimo DECIMAL(10,3) DEFAULT 0,
    fornecedor VARCHAR(100),
    ativo TINYINT DEFAULT 1,
    
    -- Auditoria
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_ingrediente_ativo (ativo),
    INDEX idx_ingrediente_estoque (quantidade_estoque),
    INDEX idx_ingrediente_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: receita
-- Receitas dos produtos (BOM - Bill of Materials)
DROP TABLE IF EXISTS receita;
CREATE TABLE receita (
    idreceita INT AUTO_INCREMENT PRIMARY KEY,
    idproduto_fk INT NOT NULL,
    idingrediente_fk INT NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL,
    
    UNIQUE KEY receita_unica (idproduto_fk, idingrediente_fk),
    FOREIGN KEY (idproduto_fk) REFERENCES produto(idproduto) ON DELETE CASCADE,
    FOREIGN KEY (idingrediente_fk) REFERENCES ingrediente(idingrediente) ON DELETE RESTRICT,
    INDEX idx_receita_produto (idproduto_fk),
    INDEX idx_receita_ingrediente (idingrediente_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: movimentacao_estoque
-- Histórico de movimentações
DROP TABLE IF EXISTS movimentacao_estoque;
CREATE TABLE movimentacao_estoque (
    idmovimentacao INT AUTO_INCREMENT PRIMARY KEY,
    idingrediente_fk INT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL,
    valor_unitario DECIMAL(10,2),
    motivo VARCHAR(200),
    idreserva_fk INT NULL,
    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(100),
    
    FOREIGN KEY (idingrediente_fk) REFERENCES ingrediente(idingrediente) ON DELETE CASCADE,
    FOREIGN KEY (idreserva_fk) REFERENCES reserva(idreserva) ON DELETE SET NULL,
    INDEX idx_movimentacao_data (data_movimentacao),
    INDEX idx_movimentacao_tipo (tipo),
    INDEX idx_movimentacao_ingrediente (idingrediente_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 6: TABELAS DE PERSONALIZAÇÃO
-- =========================================================

-- Tabela: personalizacao_produto
-- Opções de personalização por produto
DROP TABLE IF EXISTS personalizacao_produto;
CREATE TABLE personalizacao_produto (
    idpersonalizacao INT AUTO_INCREMENT PRIMARY KEY,
    idproduto_fk INT NOT NULL,
    tipo_personalizacao VARCHAR(50) NOT NULL COMMENT 'sabor, cobertura, tamanho, etc',
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_adicional DECIMAL(10,2) DEFAULT 0,
    ativo TINYINT DEFAULT 1,
    ordem INT DEFAULT 0,
    
    FOREIGN KEY (idproduto_fk) REFERENCES produto(idproduto) ON DELETE CASCADE,
    INDEX idx_personalizacao_produto (idproduto_fk),
    INDEX idx_personalizacao_tipo (tipo_personalizacao),
    INDEX idx_personalizacao_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: personalizacao_ingredientes
-- Ingredientes extras para personalização
DROP TABLE IF EXISTS personalizacao_ingredientes;
CREATE TABLE personalizacao_ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idproduto_fk INT NOT NULL,
    idingrediente_fk INT NOT NULL,
    quantidade_padrao DECIMAL(10,3) DEFAULT 1,
    preco_adicional DECIMAL(10,2) DEFAULT 0,
    ativo TINYINT DEFAULT 1,
    
    UNIQUE KEY personalizacao_ingrediente_unico (idproduto_fk, idingrediente_fk),
    FOREIGN KEY (idproduto_fk) REFERENCES produto(idproduto) ON DELETE CASCADE,
    FOREIGN KEY (idingrediente_fk) REFERENCES ingrediente(idingrediente) ON DELETE CASCADE,
    INDEX idx_pers_ing_produto (idproduto_fk),
    INDEX idx_pers_ing_ingrediente (idingrediente_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 7: TABELAS DE PREFERÊNCIAS DE CLIENTES
-- =========================================================

-- Tabela: cliente_preferencias
-- Preferências personalizadas dos clientes
DROP TABLE IF EXISTS cliente_preferencias;
CREATE TABLE cliente_preferencias (
    idpreferencia INT AUTO_INCREMENT PRIMARY KEY,
    idcliente_fk INT NOT NULL,
    preferencias JSON NOT NULL COMMENT 'Estrutura JSON com preferências',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo TINYINT DEFAULT 1,
    
    UNIQUE KEY preferencia_cliente_unica (idcliente_fk),
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente) ON DELETE CASCADE,
    INDEX idx_preferencias_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: cliente_preferencias_historico
-- Histórico de alterações
DROP TABLE IF EXISTS cliente_preferencias_historico;
CREATE TABLE cliente_preferencias_historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idpreferencia INT NOT NULL,
    idcliente_fk INT NOT NULL,
    preferencias_antigas JSON,
    data_alteracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_historico_cliente (idcliente_fk),
    INDEX idx_historico_data (data_alteracao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 8: TABELAS DE WHATSAPP
-- =========================================================

-- Tabela: tb_mensagens_whatsapp
-- Histórico de mensagens WhatsApp
DROP TABLE IF EXISTS tb_mensagens_whatsapp;
CREATE TABLE tb_mensagens_whatsapp (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
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
    
    FOREIGN KEY (id_reserva) REFERENCES reserva(idreserva) ON DELETE CASCADE,
    INDEX idx_whats_telefone (telefone),
    INDEX idx_whats_reserva (id_reserva),
    INDEX idx_whats_tipo (tipo_mensagem),
    INDEX idx_whats_status (status_envio),
    INDEX idx_whats_data (data_hora_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: tb_whatsapp_webhooks
-- Eventos recebidos via webhook
DROP TABLE IF EXISTS tb_whatsapp_webhooks;
CREATE TABLE tb_whatsapp_webhooks (
    id_webhook INT AUTO_INCREMENT PRIMARY KEY,
    evento_tipo VARCHAR(50) NOT NULL,
    evento_json JSON NOT NULL,
    id_mensagem INT,
    telefone_origem VARCHAR(20),
    processado BOOLEAN DEFAULT FALSE,
    data_recebimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_processamento DATETIME,
    erro_processamento TEXT,
    
    FOREIGN KEY (id_mensagem) REFERENCES tb_mensagens_whatsapp(id_mensagem) ON DELETE SET NULL,
    INDEX idx_webhook_processado (processado),
    INDEX idx_webhook_tipo (evento_tipo),
    INDEX idx_webhook_telefone (telefone_origem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: tb_whatsapp_bot_config
-- Configurações do bot
DROP TABLE IF EXISTS tb_whatsapp_bot_config;
CREATE TABLE tb_whatsapp_bot_config (
    id_config INT AUTO_INCREMENT PRIMARY KEY,
    status_bot ENUM('ativo', 'inativo', 'manutencao') DEFAULT 'ativo',
    mensagem_boas_vindas TEXT,
    mensagem_ausente TEXT,
    horario_funcionamento_inicio TIME DEFAULT '08:00:00',
    horario_funcionamento_fim TIME DEFAULT '18:00:00',
    resposta_automatica_ativa BOOLEAN DEFAULT TRUE,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: tb_whatsapp_comandos
-- Comandos do bot
DROP TABLE IF EXISTS tb_whatsapp_comandos;
CREATE TABLE tb_whatsapp_comandos (
    id_comando INT AUTO_INCREMENT PRIMARY KEY,
    palavra_chave VARCHAR(50) NOT NULL,
    tipo_resposta ENUM('texto', 'menu', 'acao') NOT NULL,
    resposta_texto TEXT,
    acao_controller VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    ordem_exibicao INT DEFAULT 0,
    
    INDEX idx_comando_palavra (palavra_chave),
    INDEX idx_comando_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: tb_whatsapp_estatisticas
-- Estatísticas de uso do WhatsApp
DROP TABLE IF EXISTS tb_whatsapp_estatisticas;
CREATE TABLE tb_whatsapp_estatisticas (
    id_estatistica INT AUTO_INCREMENT PRIMARY KEY,
    data_referencia DATE NOT NULL,
    total_mensagens_enviadas INT DEFAULT 0,
    total_mensagens_recebidas INT DEFAULT 0,
    total_mensagens_lidas INT DEFAULT 0,
    total_pedidos_whatsapp INT DEFAULT 0,
    tempo_medio_resposta_segundos INT DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0.00,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY idx_whats_stats_data (data_referencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 9: TABELAS DE GESTÃO FINANCEIRA
-- =========================================================

-- Tabela: custo_indireto
-- Custos fixos e indiretos
DROP TABLE IF EXISTS custo_indireto;
CREATE TABLE custo_indireto (
    idcusto INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    descricao VARCHAR(200),
    valor_mensal DECIMAL(10,2) NOT NULL,
    mes_referencia DATE NOT NULL,
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_custo_tipo (tipo),
    INDEX idx_custo_mes (mes_referencia),
    INDEX idx_custo_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 10: TABELA DE CONFIGURAÇÕES
-- =========================================================

-- Tabela: configuracao
-- Configurações gerais do sistema
DROP TABLE IF EXISTS configuracao;
CREATE TABLE configuracao (
    idconfig INT AUTO_INCREMENT PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    descricao VARCHAR(200),
    tipo VARCHAR(20) DEFAULT 'string',
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_config_chave (chave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- PARTE 11: VIEWS DE RELATÓRIOS
-- =========================================================

-- View: vw_custo_produtos
DROP VIEW IF EXISTS vw_custo_produtos;
CREATE VIEW vw_custo_produtos AS
SELECT 
    p.idproduto,
    p.nome AS produto,
    p.codigo_produto,
    c.nome AS categoria,
    p.preco AS preco_venda,
    IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS custo_ingredientes,
    p.custo_producao AS custo_cadastrado,
    p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS lucro_bruto,
    CASE 
        WHEN p.preco > 0 THEN 
            ROUND(((p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0)) / p.preco * 100), 2)
        ELSE 0
    END AS margem_lucro_real,
    p.quantidade AS estoque_atual,
    p.ativo
FROM produto p
LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
LEFT JOIN receita r ON p.idproduto = r.idproduto_fk
LEFT JOIN ingrediente i ON r.idingrediente_fk = i.idingrediente
WHERE p.ativo = 1
GROUP BY p.idproduto;

-- View: vw_produtos_estoque_baixo
DROP VIEW IF EXISTS vw_produtos_estoque_baixo;
CREATE VIEW vw_produtos_estoque_baixo AS
SELECT 
    p.idproduto,
    p.nome,
    p.codigo_produto,
    c.nome AS categoria,
    p.quantidade AS quantidade_atual,
    CASE 
        WHEN p.quantidade = 0 THEN 'SEM ESTOQUE'
        WHEN p.quantidade <= 5 THEN 'ESTOQUE CRÍTICO'
        WHEN p.quantidade <= 10 THEN 'ESTOQUE BAIXO'
        ELSE 'ESTOQUE OK'
    END AS status_estoque,
    p.preco,
    p.ativo
FROM produto p
LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
WHERE p.quantidade <= 10 AND p.ativo = 1
ORDER BY p.quantidade ASC;

-- View: vw_ingredientes_estoque_baixo
DROP VIEW IF EXISTS vw_ingredientes_estoque_baixo;
CREATE VIEW vw_ingredientes_estoque_baixo AS
SELECT 
    i.idingrediente,
    i.nome,
    i.quantidade_estoque,
    i.estoque_minimo,
    i.unidade_medida,
    i.preco_unitario,
    i.fornecedor,
    CASE 
        WHEN i.quantidade_estoque = 0 THEN 'SEM ESTOQUE'
        WHEN i.quantidade_estoque <= i.estoque_minimo THEN 'COMPRAR URGENTE'
        WHEN i.quantidade_estoque <= (i.estoque_minimo * 1.5) THEN 'COMPRAR EM BREVE'
        ELSE 'ESTOQUE OK'
    END AS status,
    GREATEST(0, ROUND((i.estoque_minimo * 2 - i.quantidade_estoque), 3)) AS quantidade_comprar,
    GREATEST(0, ROUND((i.estoque_minimo * 2 - i.quantidade_estoque) * i.preco_unitario, 2)) AS valor_estimado
FROM ingrediente i
WHERE i.quantidade_estoque <= (i.estoque_minimo * 1.5)
  AND i.ativo = 1
ORDER BY i.quantidade_estoque ASC;

-- View: vw_vendas_hoje
DROP VIEW IF EXISTS vw_vendas_hoje;
CREATE VIEW vw_vendas_hoje AS
SELECT 
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento_total,
    ROUND(AVG(valor_total), 2) AS ticket_medio,
    SUM(CASE WHEN status_pedido = 'confirmado' THEN 1 ELSE 0 END) AS pedidos_confirmados,
    SUM(CASE WHEN status_pedido = 'pendente' THEN 1 ELSE 0 END) AS pedidos_pendentes,
    SUM(CASE WHEN status_pedido = 'cancelado' THEN 1 ELSE 0 END) AS pedidos_cancelados,
    SUM(CASE WHEN tipo_pedido = 'ENTREGA' THEN 1 ELSE 0 END) AS entregas,
    SUM(CASE WHEN tipo_pedido = 'RETIRADA' THEN 1 ELSE 0 END) AS retiradas
FROM reserva
WHERE DATE(data_entrega) = CURDATE();

-- View: vw_vendas_mes_atual
DROP VIEW IF EXISTS vw_vendas_mes_atual;
CREATE VIEW vw_vendas_mes_atual AS
SELECT 
    DATE(data_entrega) AS data_venda,
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento_dia,
    ROUND(AVG(valor_total), 2) AS ticket_medio,
    SUM(CASE WHEN tipo_pedido = 'ENTREGA' THEN 1 ELSE 0 END) AS entregas,
    SUM(CASE WHEN tipo_pedido = 'RETIRADA' THEN 1 ELSE 0 END) AS retiradas
FROM reserva
WHERE MONTH(data_entrega) = MONTH(CURDATE())
  AND YEAR(data_entrega) = YEAR(CURDATE())
  AND status_pedido != 'cancelado'
GROUP BY DATE(data_entrega)
ORDER BY data_venda DESC;

-- View: vw_clientes_ativos
DROP VIEW IF EXISTS vw_clientes_ativos;
CREATE VIEW vw_clientes_ativos AS
SELECT 
    c.idcliente,
    c.nome,
    c.email,
    c.telefone,
    c.tipo,
    COUNT(r.idreserva) AS total_pedidos,
    SUM(r.valor_total) AS valor_total_compras,
    MAX(r.data_entrega) AS ultima_compra,
    c.data_cadastro
FROM cliente c
LEFT JOIN reserva r ON c.idcliente = r.idcliente_fk
WHERE r.status_pedido != 'cancelado' OR r.status_pedido IS NULL
GROUP BY c.idcliente
ORDER BY total_pedidos DESC;

-- View: vw_whatsapp_status
DROP VIEW IF EXISTS vw_whatsapp_status;
CREATE VIEW vw_whatsapp_status AS
SELECT 
    (SELECT COUNT(*) FROM tb_mensagens_whatsapp WHERE DATE(data_hora_envio) = CURDATE()) as mensagens_hoje,
    (SELECT COUNT(*) FROM tb_mensagens_whatsapp WHERE tipo_mensagem = 'enviada' AND status_envio = 'falha' AND DATE(data_hora_envio) = CURDATE()) as falhas_hoje,
    (SELECT COUNT(*) FROM tb_whatsapp_webhooks WHERE processado = FALSE) as webhooks_pendentes,
    (SELECT status_bot FROM tb_whatsapp_bot_config ORDER BY id_config DESC LIMIT 1) as status_bot,
    (SELECT COUNT(*) FROM reserva WHERE DATE(data_criacao) = CURDATE() AND canal_venda = 'whatsapp') as pedidos_whatsapp_hoje;

-- =========================================================
-- PARTE 12: STORED PROCEDURES
-- =========================================================

-- Procedure: sp_calcular_custo_produto
DELIMITER //
DROP PROCEDURE IF EXISTS sp_calcular_custo_produto//
CREATE PROCEDURE sp_calcular_custo_produto(IN p_idproduto INT)
BEGIN
    DECLARE v_custo DECIMAL(10,2);
    
    SELECT IFNULL(SUM(r.quantidade * i.preco_unitario), 0)
    INTO v_custo
    FROM receita r
    INNER JOIN ingrediente i ON r.idingrediente_fk = i.idingrediente
    WHERE r.idproduto_fk = p_idproduto
      AND i.ativo = 1;
    
    UPDATE produto 
    SET custo_producao = v_custo,
        data_atualizacao = NOW()
    WHERE idproduto = p_idproduto;
    
    SELECT p_idproduto AS produto_id, v_custo AS custo_calculado;
END//
DELIMITER ;

-- Procedure: sp_recalcular_todos_custos
DELIMITER //
DROP PROCEDURE IF EXISTS sp_recalcular_todos_custos//
CREATE PROCEDURE sp_recalcular_todos_custos()
BEGIN
    DECLARE v_produtos_atualizados INT DEFAULT 0;
    
    UPDATE produto p
    LEFT JOIN (
        SELECT 
            r.idproduto_fk,
            SUM(r.quantidade * i.preco_unitario) AS custo_total
        FROM receita r
        INNER JOIN ingrediente i ON r.idingrediente_fk = i.idingrediente
        WHERE i.ativo = 1
        GROUP BY r.idproduto_fk
    ) custos ON p.idproduto = custos.idproduto_fk
    SET p.custo_producao = IFNULL(custos.custo_total, 0),
        p.data_atualizacao = NOW()
    WHERE p.ativo = 1;
    
    SELECT ROW_COUNT() INTO v_produtos_atualizados;
    SELECT v_produtos_atualizados AS produtos_atualizados;
END//
DELIMITER ;

-- Procedure: sp_gerar_codigo_pedido
DELIMITER //
DROP PROCEDURE IF EXISTS sp_gerar_codigo_pedido//
CREATE PROCEDURE sp_gerar_codigo_pedido()
BEGIN
    DECLARE v_codigo VARCHAR(20);
    DECLARE v_existe INT;
    
    REPEAT
        SET v_codigo = CONCAT(
            'PED',
            DATE_FORMAT(NOW(), '%Y%m%d'),
            LPAD(FLOOR(RAND() * 10000), 4, '0')
        );
        
        SELECT COUNT(*) INTO v_existe
        FROM reserva
        WHERE codigo_pedido = v_codigo;
        
    UNTIL v_existe = 0 END REPEAT;
    
    SELECT v_codigo AS codigo_pedido;
END//
DELIMITER ;

-- Procedure: limpar_tokens_expirados
DELIMITER //
DROP PROCEDURE IF EXISTS limpar_tokens_expirados//
CREATE PROCEDURE limpar_tokens_expirados()
BEGIN
    DELETE FROM refresh_tokens 
    WHERE (data_expiracao < NOW() OR revogado = TRUE)
    AND data_criacao < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    SELECT ROW_COUNT() as tokens_removidos;
END//
DELIMITER ;

-- Procedure: limpar_historico_preferencias
DELIMITER //
DROP PROCEDURE IF EXISTS limpar_historico_preferencias//
CREATE PROCEDURE limpar_historico_preferencias(IN dias INT)
BEGIN
    DELETE FROM cliente_preferencias_historico
    WHERE data_alteracao < DATE_SUB(NOW(), INTERVAL dias DAY);
    
    SELECT ROW_COUNT() as registros_removidos;
END//
DELIMITER ;

-- =========================================================
-- PARTE 13: TRIGGERS
-- =========================================================

-- Trigger: tr_receita_after_insert
DELIMITER //
DROP TRIGGER IF EXISTS tr_receita_after_insert//
CREATE TRIGGER tr_receita_after_insert
AFTER INSERT ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(NEW.idproduto_fk);
END//

-- Trigger: tr_receita_after_update
DROP TRIGGER IF EXISTS tr_receita_after_update//
CREATE TRIGGER tr_receita_after_update
AFTER UPDATE ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(NEW.idproduto_fk);
END//

-- Trigger: tr_receita_after_delete
DROP TRIGGER IF EXISTS tr_receita_after_delete//
CREATE TRIGGER tr_receita_after_delete
AFTER DELETE ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(OLD.idproduto_fk);
END//

-- Trigger: tr_reserva_before_insert
DROP TRIGGER IF EXISTS tr_reserva_before_insert//
CREATE TRIGGER tr_reserva_before_insert
BEFORE INSERT ON reserva
FOR EACH ROW
BEGIN
    IF NEW.codigo_pedido IS NULL OR NEW.codigo_pedido = '' THEN
        SET @seq = (SELECT COALESCE(MAX(idreserva), 0) + 1 FROM reserva);
        SET NEW.codigo_pedido = CONCAT(
            'PED',
            DATE_FORMAT(NOW(), '%Y%m%d'),
            LPAD(@seq, 4, '0')
        );
    END IF;
END//

-- Trigger: tr_preferencias_before_update
DROP TRIGGER IF EXISTS tr_preferencias_before_update//
CREATE TRIGGER tr_preferencias_before_update
BEFORE UPDATE ON cliente_preferencias
FOR EACH ROW
BEGIN
    IF OLD.preferencias != NEW.preferencias THEN
        INSERT INTO cliente_preferencias_historico 
        (idpreferencia, idcliente_fk, preferencias_antigas, data_alteracao)
        VALUES (OLD.idpreferencia, OLD.idcliente_fk, OLD.preferencias, NOW());
    END IF;
    
    SET NEW.data_atualizacao = NOW();
END//
DELIMITER ;

-- =========================================================
-- PARTE 14: EVENTS (Limpeza Automática)
-- =========================================================

-- Event: limpar tokens expirados diariamente
DROP EVENT IF EXISTS evt_limpar_tokens_diario;
CREATE EVENT evt_limpar_tokens_diario
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL limpar_tokens_expirados();

-- Event: limpar histórico antigo mensalmente
DROP EVENT IF EXISTS evt_limpar_historico_mensal;
CREATE EVENT evt_limpar_historico_mensal
ON SCHEDULE EVERY 1 MONTH
STARTS CURRENT_TIMESTAMP
DO
    CALL limpar_historico_preferencias(365);

-- =========================================================
-- PARTE 15: DADOS INICIAIS
-- =========================================================

-- CATEGORIAS
INSERT INTO categoria (nome, descricao, ativo) VALUES 
('Sorvetes', 'Sorvetes artesanais diversos sabores', 1),
('Cones Recheados', 'Cones recheados com brigadeiro e coberturas especiais', 1),
('Picolés', 'Picolés de frutas e cremes', 1),
('Bolos Gelados', 'Bolos para sobremesa gelados', 1),
('Mousses', 'Mousses cremosos diversos sabores', 1),
('Sobremesas', 'Sobremesas especiais', 1),
('Doces Gourmet', 'Doces finos e sofisticados', 1),
('Brigadeiros', 'Brigadeiros tradicionais e gourmet', 1),
('Veganos', 'Produtos sem ingredientes de origem animal', 1);

-- INGREDIENTES
INSERT INTO ingrediente (nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo, fornecedor, ativo) VALUES 
-- Bases e Laticínios
('Leite Condensado', 'kg', 8.50, 50.000, 10.000, 'Atacadão', 1),
('Creme de Leite', 'lata', 4.50, 100.000, 20.000, 'Atacadão', 1),
('Manteiga', 'kg', 25.00, 10.000, 3.000, 'Atacadão', 1),
('Leite em Pó Ninho', 'kg', 25.00, 15.000, 5.000, 'Distribuidora', 1),

-- Chocolates
('Chocolate ao Leite', 'kg', 35.00, 20.000, 5.000, 'Distribuidora Chocolates', 1),
('Chocolate Meio Amargo', 'kg', 38.00, 15.000, 5.000, 'Distribuidora Chocolates', 1),
('Chocolate Branco', 'kg', 40.00, 10.000, 3.000, 'Distribuidora Chocolates', 1),

-- Coberturas Premium
('Nutella', 'kg', 45.00, 8.000, 2.000, 'Importadora', 1),
('Ovomaltine', 'kg', 30.00, 10.000, 3.000, 'Distribuidora', 1),
('Oreo', 'kg', 20.00, 10.000, 3.000, 'Distribuidora', 1),
('Kit Kat', 'kg', 35.00, 8.000, 2.000, 'Distribuidora', 1),
('Kinder Bueno', 'kg', 50.00, 5.000, 1.000, 'Importadora', 1),
('Ferrero Rocher', 'kg', 80.00, 3.000, 1.000, 'Importadora', 1),

-- Frutas
('Morango', 'kg', 12.00, 10.000, 3.000, 'Hortifruti', 1),
('Limão Siciliano', 'kg', 8.00, 8.000, 2.000, 'Hortifruti', 1),
('Maracujá', 'kg', 10.00, 5.000, 2.000, 'Hortifruti', 1),

-- Outros Ingredientes
('Coco Ralado', 'kg', 15.00, 10.000, 3.000, 'Distribuidora', 1),
('Ovos', 'unidade', 0.50, 200.000, 50.000, 'Granja Local', 1),
('Açúcar', 'kg', 3.50, 50.000, 10.000, 'Atacadão', 1),
('Farinha de Trigo', 'kg', 4.00, 30.000, 10.000, 'Atacadão', 1),

-- Embalagens
('Casquinha/Cone', 'unidade', 0.50, 500.000, 100.000, 'Fábrica de Cones', 1),
('Embalagem Individual', 'unidade', 0.30, 1000.000, 200.000, 'Gráfica Rápida', 1),
('Caixinha Brigadeiro', 'unidade', 0.40, 500.000, 100.000, 'Gráfica Rápida', 1),
('Saco Plástico', 'unidade', 0.15, 1000.000, 200.000, 'Distribuidora', 1);

-- CONFIGURAÇÕES
INSERT INTO configuracao (chave, valor, descricao, tipo) VALUES 
-- Financeiro
('margem_lucro_padrao', '40', 'Margem de lucro padrão em porcentagem', 'number'),
('taxa_desperdicio', '5', 'Taxa de desperdício em porcentagem', 'number'),
('valor_entrega', '8.00', 'Valor da taxa de entrega', 'number'),
('valor_minimo_pedido', '20.00', 'Valor mínimo do pedido', 'number'),
('taxa_entrega_adicional_km', '2.00', 'Taxa adicional por km extra', 'number'),

-- Operacional
('tempo_preparo_padrao', '30', 'Tempo de preparo padrão em minutos', 'number'),
('horario_abertura', '08:00', 'Horário de abertura', 'string'),
('horario_fechamento', '18:00', 'Horário de fechamento', 'string'),
('dias_funcionamento', '["seg", "ter", "qua", "qui", "sex", "sab"]', 'Dias de funcionamento', 'json'),
('raio_entrega_km', '10', 'Raio de entrega em km', 'number'),
('tempo_minimo_reserva', '24', 'Tempo mínimo para reserva em horas', 'number'),

-- Pagamentos
('aceita_pix', 'true', 'Aceita pagamento via PIX', 'boolean'),
('aceita_cartao', 'true', 'Aceita pagamento com cartão', 'boolean'),
('aceita_dinheiro', 'true', 'Aceita pagamento em dinheiro', 'boolean'),
('aceita_retirada', 'true', 'Aceita retirada no local', 'boolean'),
('chave_pix', '', 'Chave PIX para recebimento', 'string'),

-- Contato e Notificações
('telefone_whatsapp', '', 'Número do WhatsApp para pedidos', 'string'),
('email_notificacao', 'contato@segredodosabor.com', 'Email para notificações', 'string'),
('whatsapp_ativo', 'false', 'Sistema de WhatsApp ativo', 'boolean'),

-- Sistema
('sistema_nome', 'Segredo do Sabor', 'Nome do estabelecimento', 'string'),
('sistema_versao', '5.0', 'Versão do sistema', 'string'),
('modo_manutencao', 'false', 'Sistema em manutenção', 'boolean');

-- CUSTOS INDIRETOS
INSERT INTO custo_indireto (tipo, descricao, valor_mensal, mes_referencia, ativo) VALUES 
('Energia Elétrica', 'Conta de luz mensal da cozinha', 300.00, DATE_FORMAT(NOW(), '%Y-%m-01'), 1),
('Água', 'Conta de água mensal', 80.00, DATE_FORMAT(NOW(), '%Y-%m-01'), 1),
('Gás', 'Gás de cozinha industrial', 120.00, DATE_FORMAT(NOW(), '%Y-%m-01'), 1),
('Internet', 'Internet e telefone fixo', 100.00, DATE_FORMAT(NOW(), '%Y-%m-01'), 1),
('Material de Limpeza', 'Produtos de limpeza e higiene', 150.00, DATE_FORMAT(NOW(), '%Y-%m-01'), 1),
('Embalagens', 'Caixas, sacolas e etiquetas', 200.00, DATE_FORMAT(NOW(), '%Y-%m-01'), 1);

-- ADMINISTRADOR PADRÃO
-- Senha: Admin@123 (hash bcrypt)
INSERT INTO administrador (nome, email, cpf, senha, ativo) VALUES 
('Administrador', 'admin@segredodosabor.com', '000.000.000-00', 
'$2b$10$g/IYyuSsGc45zlkNVhlXAeFLYijABRXzYOSWjCe1DRTTO6.AQHSQy', 1);

-- CONFIGURAÇÃO DO BOT WHATSAPP
INSERT INTO tb_whatsapp_bot_config (
    status_bot,
    mensagem_boas_vindas,
    mensagem_ausente,
    resposta_automatica_ativa
) VALUES (
    'inativo',
    '👋 Olá! Bem-vindo ao *Segredos do Sabor*! 🍰\n\nComo posso te ajudar hoje?\n\n1️⃣ Fazer um pedido\n2️⃣ Consultar pedido\n3️⃣ Ver cardápio\n4️⃣ Falar com atendente',
    '😴 No momento estamos fora do horário de atendimento.\n\nNosso horário é de *Segunda a Sexta, das 8h às 18h*.\n\nDeixe sua mensagem que responderemos em breve!',
    TRUE
);

-- COMANDOS DO BOT WHATSAPP
INSERT INTO tb_whatsapp_comandos (palavra_chave, tipo_resposta, resposta_texto, ordem_exibicao, ativo) VALUES
('pedido', 'texto', '📦 Para fazer um pedido, acesse nosso catálogo online:\n\n[URL_SITE]/catalogo\n\nOu se preferir, me diga o que deseja e eu te ajudo! 😊', 1, TRUE),
('cardapio', 'texto', '📋 Confira nosso cardápio completo:\n\n[URL_SITE]/catalogo\n\n🧁 Bolos personalizados\n🍰 Doces finos\n🎂 Tortas artesanais\n🍪 Cookies gourmet', 2, TRUE),
('horario', 'texto', '⏰ *Horário de Funcionamento:*\n\nSegunda a Sexta: 8h às 18h\nSábado: 8h às 14h\nDomingo: Fechado', 3, TRUE),
('endereco', 'texto', '📍 *Nosso endereço:*\n\n[PREENCHER COM ENDEREÇO REAL]\n\nEstamos te esperando! 💜', 4, TRUE),
('ajuda', 'menu', '🤖 *Comandos disponíveis:*\n\n• *pedido* - Fazer um novo pedido\n• *consultar* - Ver status do seu pedido\n• *cardapio* - Ver nossos produtos\n• *horario* - Horário de funcionamento\n• *endereco* - Como chegar\n• *contato* - Falar com atendente', 5, TRUE);

-- =========================================================
-- PARTE 16: RESTAURAR CONFIGURAÇÕES
-- =========================================================

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;

-- =========================================================
-- PARTE 17: RELATÓRIO FINAL
-- =========================================================

SELECT '========================================' AS '';
SELECT '✅ BANCO DE DADOS CRIADO COM SUCESSO!' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';
SELECT 'DATABASE: segredodosabor' AS '';
SELECT 'CHARSET: utf8mb4' AS '';
SELECT 'ENGINE: InnoDB' AS '';
SELECT 'VERSÃO: 5.0 UNIFICADA' AS '';
SELECT '' AS '';
SELECT '========================================' AS '';
SELECT '📊 ESTATÍSTICAS' AS '';
SELECT '========================================' AS '';

-- Contar tabelas
SELECT 
    'TABELAS CRIADAS' AS tipo,
    COUNT(*) AS total
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'segredodosabor'
  AND TABLE_TYPE = 'BASE TABLE'

UNION ALL

-- Contar views
SELECT 
    'VIEWS CRIADAS' AS tipo,
    COUNT(*) AS total
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'segredodosabor'

UNION ALL

-- Contar procedures
SELECT 
    'PROCEDURES CRIADAS' AS tipo,
    COUNT(*) AS total
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'segredodosabor'
  AND ROUTINE_TYPE = 'PROCEDURE'

UNION ALL

-- Contar triggers
SELECT 
    'TRIGGERS CRIADOS' AS tipo,
    COUNT(*) AS total
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'segredodosabor'

UNION ALL

-- Contar events
SELECT 
    'EVENTS CRIADOS' AS tipo,
    COUNT(*) AS total
FROM information_schema.EVENTS
WHERE EVENT_SCHEMA = 'segredodosabor';

SELECT '' AS '';
SELECT '========================================' AS '';
SELECT '🎉 SISTEMA PRONTO PARA USO!' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';
SELECT '📝 PRÓXIMOS PASSOS:' AS '';
SELECT '1. Configure o backend (.env)' AS '';
SELECT '2. Login admin: admin@segredodosabor.com' AS '';
SELECT '3. Senha admin: Admin@123' AS '';
SELECT '4. Inicie o backend: npm start' AS '';
SELECT '5. Inicie o frontend: npm start' AS '';
SELECT '6. Acesse: http://localhost:3000' AS '';
SELECT '' AS '';
SELECT '========================================' AS '';

-- =========================================================
-- FIM DO SCRIPT
-- =========================================================

/*
====================================================================
                    BANCO DE DADOS COMPLETO
                      SEGREDO DO SABOR v5.0
====================================================================

📋 TABELAS CRIADAS (21):
✅ administrador              - Administradores do sistema
✅ cliente                    - Clientes/usuários
✅ refresh_tokens             - Tokens JWT
✅ categoria                  - Categorias de produtos
✅ produto                    - Produtos do catálogo
✅ produto_imagens            - Imagens dos produtos
✅ reserva                    - Pedidos/reservas
✅ ingrediente                - Ingredientes para produção
✅ receita                    - Receitas (BOM)
✅ movimentacao_estoque       - Histórico de movimentações
✅ personalizacao_produto     - Opções de personalização
✅ personalizacao_ingredientes - Ingredientes extras
✅ cliente_preferencias       - Preferências dos clientes
✅ cliente_preferencias_historico - Histórico de preferências
✅ tb_mensagens_whatsapp      - Mensagens WhatsApp
✅ tb_whatsapp_webhooks       - Eventos WhatsApp
✅ tb_whatsapp_bot_config     - Configuração do bot
✅ tb_whatsapp_comandos       - Comandos do bot
✅ tb_whatsapp_estatisticas   - Estatísticas WhatsApp
✅ custo_indireto            - Custos fixos
✅ configuracao              - Configurações do sistema

📊 VIEWS CRIADAS (7):
✅ vw_custo_produtos          - Análise de custos e margens
✅ vw_produtos_estoque_baixo  - Produtos com estoque crítico
✅ vw_ingredientes_estoque_baixo - Ingredientes para comprar
✅ vw_vendas_hoje             - Resumo de vendas do dia
✅ vw_vendas_mes_atual        - Vendas diárias do mês
✅ vw_clientes_ativos         - Clientes com histórico
✅ vw_whatsapp_status         - Status do WhatsApp

⚙️ PROCEDURES CRIADAS (5):
✅ sp_calcular_custo_produto  - Calcula custo de um produto
✅ sp_recalcular_todos_custos - Recalcula todos os custos
✅ sp_gerar_codigo_pedido     - Gera código único de pedido
✅ limpar_tokens_expirados    - Limpa tokens antigos
✅ limpar_historico_preferencias - Limpa histórico antigo

🔄 TRIGGERS CRIADOS (5):
✅ tr_receita_after_insert    - Recalcula custo ao adicionar
✅ tr_receita_after_update    - Recalcula custo ao atualizar
✅ tr_receita_after_delete    - Recalcula custo ao remover
✅ tr_reserva_before_insert   - Gera código do pedido
✅ tr_preferencias_before_update - Salva histórico

⏰ EVENTS CRIADOS (2):
✅ evt_limpar_tokens_diario   - Limpa tokens diários
✅ evt_limpar_historico_mensal - Limpa histórico mensal

📦 DADOS INICIAIS:
✅ 9 categorias de produtos
✅ 24 ingredientes cadastrados
✅ 21 configurações do sistema
✅ 6 custos indiretos
✅ 1 administrador padrão
✅ Configuração do bot WhatsApp
✅ 5 comandos do bot

🔐 CREDENCIAIS PADRÃO:
Email: admin@segredodosabor.com
Senha: Admin@123

⚡ FUNCIONALIDADES:
✅ E-commerce completo
✅ Gestão de pedidos e reservas
✅ Controle de estoque
✅ Sistema de receitas (BOM)
✅ Cálculo automático de custos
✅ Autenticação JWT
✅ Integração WhatsApp
✅ Personalização de produtos
✅ Preferências de clientes
✅ Relatórios e dashboards
✅ Limpeza automática

📞 SUPORTE:
Para dúvidas, consulte:
- API_DOCUMENTATION.md
- README.md
- GUIA_EXECUCAO_CORRECOES.md

====================================================================
                    INSTALAÇÃO CONCLUÍDA!
====================================================================
*/
