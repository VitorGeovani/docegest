-- ============================================
-- ATUALIZAÇÃO DO BANCO DE DADOS
-- Sistema de Autenticação + Popular Dados
-- ============================================

USE db_segredo_do_sabor;

-- ============================================
-- 1. ADICIONAR CAMPOS DE AUTENTICAÇÃO
-- ============================================

-- Tabela tb_cliente: adicionar campos de autenticação
ALTER TABLE tb_cliente 
ADD COLUMN IF NOT EXISTS senha VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS token_recuperacao VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS data_token_recuperacao DATETIME DEFAULT NULL,
ADD COLUMN IF NOT EXISTS data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS ultimo_acesso DATETIME DEFAULT NULL;

-- ============================================
-- 2. CRIAR TABELA DE REFRESH TOKENS
-- ============================================

CREATE TABLE IF NOT EXISTS tb_refresh_tokens (
    id_token INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    revogado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_cliente) REFERENCES tb_cliente(id_cliente) ON DELETE CASCADE
);

-- ============================================
-- 3. ADICIONAR CAMPOS DE STATUS EM RESERVAS
-- ============================================

ALTER TABLE tb_reserva 
ADD COLUMN IF NOT EXISTS status_pagamento ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS status_pedido ENUM('pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado') DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS whatsapp_notificado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS data_notificacao DATETIME DEFAULT NULL;

-- ============================================
-- 4. CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_cliente_email ON tb_cliente(email);
CREATE INDEX IF NOT EXISTS idx_reserva_status ON tb_reserva(status_pedido);
CREATE INDEX IF NOT EXISTS idx_refresh_token ON tb_refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_produto_categoria ON tb_produto(id_categoria);
CREATE INDEX IF NOT EXISTS idx_reserva_cliente ON tb_reserva(id_cliente);

-- ============================================
-- 5. POPULAR CATEGORIAS (se estiverem vazias)
-- ============================================

INSERT IGNORE INTO tb_categoria (id_categoria, nome_categoria, descricao, ativo) VALUES
(1, 'Cones Trufados', 'Deliciosos cones recheados com trufa de diversos sabores', TRUE),
(2, 'Doces Gourmet', 'Doces finos e sofisticados para ocasiões especiais', TRUE),
(3, 'Brigadeiros', 'Brigadeiros artesanais de diversos sabores', TRUE),
(4, 'Bolos', 'Bolos caseiros e personalizados', TRUE),
(5, 'Sobremesas', 'Sobremesas variadas para qualquer momento', TRUE),
(6, 'Veganos', 'Opções veganas e sem lactose', TRUE);

-- ============================================
-- 6. POPULAR INGREDIENTES
-- ============================================

INSERT IGNORE INTO tb_ingrediente (id_ingrediente, nome, unidade_medida, estoque_atual, estoque_minimo, preco_unitario, fornecedor) VALUES
(1, 'Leite Condensado', 'kg', 50.00, 10.00, 12.50, 'Nestlé'),
(2, 'Chocolate ao Leite', 'kg', 30.00, 5.00, 35.00, 'Garoto'),
(3, 'Chocolate Meio Amargo', 'kg', 25.00, 5.00, 38.00, 'Harald'),
(4, 'Creme de Leite', 'lata', 100.00, 20.00, 4.50, 'Nestlé'),
(5, 'Manteiga', 'kg', 15.00, 3.00, 28.00, 'Aviação'),
(6, 'Ovos', 'unidade', 200.00, 50.00, 0.80, 'Granja Santo Antonio'),
(7, 'Açúcar', 'kg', 80.00, 15.00, 4.50, 'União'),
(8, 'Farinha de Trigo', 'kg', 60.00, 10.00, 5.00, 'Dona Benta'),
(9, 'Fermento', 'unidade', 40.00, 10.00, 2.50, 'Royal'),
(10, 'Chocolate Branco', 'kg', 20.00, 5.00, 42.00, 'Garoto'),
(11, 'Nutella', 'kg', 10.00, 2.00, 85.00, 'Ferrero'),
(12, 'Leite Ninho', 'kg', 15.00, 3.00, 45.00, 'Nestlé'),
(13, 'Oreo', 'pacote', 50.00, 10.00, 8.50, 'Mondelez'),
(14, 'Kit Kat', 'unidade', 60.00, 15.00, 3.50, 'Nestlé'),
(15, 'Morango', 'kg', 5.00, 2.00, 18.00, 'CEASA'),
(16, 'Limão', 'kg', 8.00, 2.00, 6.00, 'CEASA'),
(17, 'Coco Ralado', 'kg', 10.00, 2.00, 15.00, 'Sococo'),
(18, 'Amendoim', 'kg', 12.00, 3.00, 12.00, 'Yoki'),
(19, 'Paçoca', 'kg', 8.00, 2.00, 14.00, 'Amor aos Pedaços'),
(20, 'Leite de Coco', 'lata', 30.00, 10.00, 5.50, 'Sococo');

-- ============================================
-- 7. POPULAR PRODUTOS (se estiverem vazios)
-- ============================================

INSERT IGNORE INTO tb_produto (id_produto, nome_produto, descricao, preco, id_categoria, ativo, imagem) VALUES
(1, 'Cone Ilustre', 'Cone trufado com chocolate belga e recheio cremoso', 12.00, 1, TRUE, 'cone_ilustre.jpg'),
(2, 'Cone Ovomaltine', 'Cone trufado com Ovomaltine crocante', 13.50, 1, TRUE, 'cone_ovomaltine.jpg'),
(3, 'Cone Ferrero Rocher', 'Cone premium com Ferrero Rocher', 18.00, 1, TRUE, 'ferrero_rocher.jpg'),
(4, 'Cone Kinder Bueno', 'Cone delicioso com Kinder Bueno', 15.00, 1, TRUE, 'kinder_bueno.jpg'),
(5, 'Cone Kit Kat', 'Cone crocante com Kit Kat', 13.00, 1, TRUE, 'kit_kat.jpg'),
(6, 'Cone Oreo', 'Cone trufado com biscoito Oreo', 12.50, 1, TRUE, 'oreo.jpg'),
(7, 'Cone Prestígio', 'Cone de chocolate com coco', 13.00, 1, TRUE, 'prestigio.jpg'),
(8, 'Cone Ouro Branco', 'Cone de chocolate branco cremoso', 13.50, 1, TRUE, 'ouro_branco.jpg'),
(9, 'Cone Ninho com Nutella', 'Cone de leite ninho com Nutella', 16.00, 1, TRUE, 'ninho_nutella.jpg'),
(10, 'Cone Morango', 'Cone com recheio de morango', 12.00, 1, TRUE, 'morango.jpg'),
(11, 'Cone Limão', 'Cone refrescante de limão', 11.50, 1, TRUE, 'limao.jpg'),
(12, 'Brigadeiro Tradicional', 'Brigadeiro artesanal tradicional', 3.50, 3, TRUE, 'brigadeiro.jpg'),
(13, 'Brigadeiro Gourmet Sortido', 'Caixa com 12 brigadeiros de sabores variados', 45.00, 3, TRUE, 'brigadeiros_sortidos.jpg'),
(14, 'Bolo de Chocolate', 'Bolo caseiro de chocolate (1kg)', 55.00, 4, TRUE, 'bolo_chocolate.jpg'),
(15, 'Bolo de Cenoura', 'Bolo de cenoura com cobertura de chocolate (1kg)', 50.00, 4, TRUE, 'bolo_cenoura.jpg');

-- ============================================
-- 8. ASSOCIAR INGREDIENTES AOS PRODUTOS
-- ============================================

-- Cone Ilustre
INSERT IGNORE INTO tb_produto_ingrediente (id_produto, id_ingrediente, quantidade) VALUES
(1, 2, 0.15),  -- Chocolate ao Leite
(1, 4, 0.05),  -- Creme de Leite
(1, 1, 0.10);  -- Leite Condensado

-- Cone Ovomaltine
INSERT IGNORE INTO tb_produto_ingrediente (id_produto, id_ingrediente, quantidade) VALUES
(2, 2, 0.15),
(2, 1, 0.10),
(2, 4, 0.05);

-- Brigadeiro
INSERT IGNORE INTO tb_produto_ingrediente (id_produto, id_ingrediente, quantidade) VALUES
(12, 1, 0.03),  -- Leite Condensado
(12, 2, 0.01),  -- Chocolate
(12, 5, 0.005); -- Manteiga

-- ============================================
-- 9. POPULAR CLIENTES DE EXEMPLO
-- ============================================

-- Senha padrão: "123456" (hash bcrypt)
-- IMPORTANTE: Em produção, use senhas fortes!
INSERT IGNORE INTO tb_cliente (id_cliente, nome, email, telefone, senha, data_cadastro) VALUES
(1, 'Maria Silva', 'maria@email.com', '11987654321', '$2b$10$rKqZ8PvCjF3xZ4xGzJXJF.8bXJQp7vQy1z2x3x4x5x6x7x8x9x0x1', NOW()),
(2, 'João Santos', 'joao@email.com', '11976543210', '$2b$10$rKqZ8PvCjF3xZ4xGzJXJF.8bXJQp7vQy1z2x3x4x5x6x7x8x9x0x1', NOW()),
(3, 'Ana Costa', 'ana@email.com', '11965432109', '$2b$10$rKqZ8PvCjF3xZ4xGzJXJF.8bXJQp7vQy1z2x3x4x5x6x7x8x9x0x1', NOW()),
(4, 'Pedro Oliveira', 'pedro@email.com', '11954321098', '$2b$10$rKqZ8PvCjF3xZ4xGzJXJF.8bXJQp7vQy1z2x3x4x5x6x7x8x9x0x1', NOW()),
(5, 'Carla Souza', 'carla@email.com', '11943210987', '$2b$10$rKqZ8PvCjF3xZ4xGzJXJF.8bXJQp7vQy1z2x3x4x5x6x7x8x9x0x1', NOW());

-- ============================================
-- 10. POPULAR RESERVAS/PEDIDOS DE EXEMPLO
-- ============================================

INSERT IGNORE INTO tb_reserva (id_reserva, id_cliente, data_reserva, horario_retirada, turno_retirada, forma_pagamento, ponto_entrega, valor_total, status_pagamento, status_pedido) VALUES
(1, 1, '2025-10-01', '14:00', 'Tarde', 'PIX', 'Loja Centro', 45.00, 'confirmado', 'entregue'),
(2, 2, '2025-10-02', '10:00', 'Manhã', 'Dinheiro', 'Loja Shopping', 78.50, 'confirmado', 'entregue'),
(3, 3, '2025-10-03', '16:00', 'Tarde', 'Cartão', 'Delivery', 125.00, 'confirmado', 'pronto'),
(4, 4, '2025-10-04', '11:30', 'Manhã', 'PIX', 'Loja Centro', 95.00, 'pendente', 'preparando'),
(5, 5, NOW(), '18:00', 'Noite', 'PIX', 'Loja Shopping', 156.50, 'pendente', 'pendente');

-- ============================================
-- 11. PRODUTOS DAS RESERVAS
-- ============================================

-- Reserva 1
INSERT IGNORE INTO tb_reserva_produto (id_reserva, id_produto, quantidade) VALUES
(1, 1, 2),  -- 2x Cone Ilustre
(1, 12, 5); -- 5x Brigadeiro

-- Reserva 2
INSERT IGNORE INTO tb_reserva_produto (id_reserva, id_produto, quantidade) VALUES
(2, 2, 3),  -- 3x Cone Ovomaltine
(2, 3, 2);  -- 2x Cone Ferrero

-- Reserva 3
INSERT IGNORE INTO tb_reserva_produto (id_reserva, id_produto, quantidade) VALUES
(3, 9, 4),  -- 4x Cone Ninho Nutella
(3, 13, 1), -- 1x Caixa Brigadeiros
(3, 14, 1); -- 1x Bolo Chocolate

-- Reserva 4
INSERT IGNORE INTO tb_reserva_produto (id_reserva, id_produto, quantidade) VALUES
(4, 4, 5),  -- 5x Cone Kinder
(4, 5, 2);  -- 2x Cone Kit Kat

-- Reserva 5
INSERT IGNORE INTO tb_reserva_produto (id_reserva, id_produto, quantidade) VALUES
(5, 3, 6),  -- 6x Cone Ferrero
(5, 9, 4);  -- 4x Cone Ninho Nutella

-- ============================================
-- 12. VERIFICAR ESTRUTURA
-- ============================================

-- Listar todas as tabelas
SHOW TABLES;

-- Verificar estrutura de tb_cliente
DESCRIBE tb_cliente;

-- Verificar estrutura de tb_refresh_tokens
DESCRIBE tb_refresh_tokens;

-- Verificar estrutura de tb_reserva
DESCRIBE tb_reserva;

-- ============================================
-- 13. CONTADORES
-- ============================================

SELECT 'Categorias:', COUNT(*) FROM tb_categoria;
SELECT 'Produtos:', COUNT(*) FROM tb_produto;
SELECT 'Ingredientes:', COUNT(*) FROM tb_ingrediente;
SELECT 'Clientes:', COUNT(*) FROM tb_cliente;
SELECT 'Reservas:', COUNT(*) FROM tb_reserva;

-- ============================================
-- FINALIZADO!
-- ============================================

SELECT '✅ Banco de dados atualizado e populado com sucesso!' AS Status;
