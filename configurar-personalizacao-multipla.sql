-- =================================================================
-- SCRIPT: CONFIGURAR PERSONALIZAÇÃO MÚLTIPLA (CHECKBOX)
-- Descrição: Adiciona opções de personalização com seleção múltipla
--            Permite ao usuário marcar vários itens simultaneamente
-- Data: 16/11/2025
-- =================================================================

USE segredodosabor;

-- =================================================================
-- PARTE 1: CRIAR OPÇÃO DE PERSONALIZAÇÃO COM CHECKBOX
-- =================================================================

-- Opção "Extras" com tipo checkbox (permite seleção múltipla)
INSERT INTO produto_opcoes_personalizacao (
    nome_opcao,
    descricao,
    tipo_selecao,
    obrigatorio,
    ativo,
    ordem_exibicao
) VALUES (
    'Extras',
    'Adicione extras ao seu produto (você pode escolher vários)',
    'checkbox',  -- ⭐ TIPO CHECKBOX = SELEÇÃO MÚLTIPLA
    0,           -- Não obrigatório
    1,           -- Ativo
    0            -- Ordem de exibição
);

SET @id_opcao_extras = LAST_INSERT_ID();

-- =================================================================
-- PARTE 2: CRIAR VALORES PARA A OPÇÃO (COM PREÇOS)
-- =================================================================

-- Valor 1: Chantilly (+R$ 1.50)
INSERT INTO opcao_valores (
    idopcao_fk,
    nome_valor,
    preco_adicional,
    disponivel,
    ordem_exibicao
) VALUES (
    @id_opcao_extras,
    'Cartão Personalizado',
    1.50,
    1,
    1
);
SET @id_valor_cartao = LAST_INSERT_ID();

-- Valor 2: Granulado (+R$ 1.00)
INSERT INTO opcao_valores (
    idopcao_fk,
    nome_valor,
    preco_adicional,
    disponivel,
    ordem_exibicao
) VALUES (
    @id_opcao_extras,
    'Vela de Aniversário',
    1.00,
    1,
    2
);
SET @id_valor_vela = LAST_INSERT_ID();

-- Valor 3: Paçoca (+R$ 2.00)
INSERT INTO opcao_valores (
    idopcao_fk,
    nome_valor,
    preco_adicional,
    disponivel,
    ordem_exibicao
) VALUES (
    @id_opcao_extras,
    'Paçoca Triturada',
    2.00,
    1,
    3
);
SET @id_valor_pacoca = LAST_INSERT_ID();

-- Valor 4: Morango (+R$ 3.00)
INSERT INTO opcao_valores (
    idopcao_fk,
    nome_valor,
    preco_adicional,
    disponivel,
    ordem_exibicao
) VALUES (
    @id_opcao_extras,
    'Morangos Frescos',
    3.00,
    1,
    4
);
SET @id_valor_morango = LAST_INSERT_ID();

-- =================================================================
-- PARTE 3: VINCULAR OPÇÃO A UM PRODUTO
-- =================================================================

-- Buscar ID do Mousse de Limão (ou outro produto)
SELECT idproduto INTO @id_produto_mousse
FROM produto
WHERE nome LIKE '%Mousse%Limão%'
LIMIT 1;

-- Se não encontrou o Mousse, pegar o primeiro produto ativo
SELECT COALESCE(@id_produto_mousse, (SELECT idproduto FROM produto WHERE ativo = 1 LIMIT 1)) 
INTO @id_produto_mousse;

-- Vincular opção "Extras" ao produto
INSERT INTO produto_opcao_associacao (idproduto_fk, idopcao_fk, obrigatorio)
VALUES (@id_produto_mousse, @id_opcao_extras, 0)
ON DUPLICATE KEY UPDATE obrigatorio = 0;

-- =================================================================
-- PARTE 4: VINCULAR INGREDIENTES AOS VALORES (BAIXA DE ESTOQUE)
-- =================================================================

-- Buscar IDs dos ingredientes necessários
SELECT idingrediente INTO @id_leite_condensado FROM ingrediente WHERE nome LIKE '%Leite Condensado%' LIMIT 1;
SELECT idingrediente INTO @id_acucar FROM ingrediente WHERE nome LIKE '%Açúcar%' LIMIT 1;
SELECT idingrediente INTO @id_chocolate FROM ingrediente WHERE nome LIKE '%Chocolate%Leite%' LIMIT 1;
SELECT idingrediente INTO @id_pacoca FROM ingrediente WHERE nome LIKE '%Paçoca%' OR nome LIKE '%Amendoim%' LIMIT 1;

-- Se não encontrou ingredientes, criar ingredientes genéricos
INSERT IGNORE INTO ingrediente (nome, unidade_medida, quantidade_estoque, estoque_minimo)
VALUES 
    ('Chantilly em Pó', 'kg', 5.000, 1.000),
    ('Granulado Colorido', 'kg', 3.000, 0.500),
    ('Paçoca Triturada', 'kg', 2.000, 0.300),
    ('Morango Fresco', 'kg', 10.000, 2.000);

-- Pegar IDs dos ingredientes recém-criados
SELECT idingrediente INTO @id_chantilly FROM ingrediente WHERE nome = 'Chantilly em Pó' LIMIT 1;
SELECT idingrediente INTO @id_granulado FROM ingrediente WHERE nome = 'Granulado Colorido' LIMIT 1;
SELECT idingrediente INTO @id_pacoca_ing FROM ingrediente WHERE nome = 'Paçoca Triturada' LIMIT 1;
SELECT idingrediente INTO @id_morango_ing FROM ingrediente WHERE nome = 'Morango Fresco' LIMIT 1;

-- Vincular Cartão Personalizado ao Chantilly (0.05kg por unidade)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada)
VALUES (@id_valor_cartao, @id_chantilly, 0.050)
ON DUPLICATE KEY UPDATE quantidade_usada = VALUES(quantidade_usada);

-- Vincular Vela a Granulado (0.03kg)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada)
VALUES (@id_valor_vela, @id_granulado, 0.030)
ON DUPLICATE KEY UPDATE quantidade_usada = VALUES(quantidade_usada);

-- Vincular Paçoca a ingrediente Paçoca (0.08kg)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada)
VALUES (@id_valor_pacoca, @id_pacoca_ing, 0.080)
ON DUPLICATE KEY UPDATE quantidade_usada = VALUES(quantidade_usada);

-- Vincular Morangos a Morango Fresco (0.15kg)
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada)
VALUES (@id_valor_morango, @id_morango_ing, 0.150)
ON DUPLICATE KEY UPDATE quantidade_usada = VALUES(quantidade_usada);

-- =================================================================
-- PARTE 5: VERIFICAR CONFIGURAÇÃO
-- =================================================================

-- Mostrar opção criada
SELECT 
    'OPÇÃO CRIADA:' AS tipo,
    idopcao,
    nome_opcao,
    descricao,
    tipo_selecao AS tipo,
    obrigatorio,
    ativo
FROM produto_opcoes_personalizacao
WHERE idopcao = @id_opcao_extras;

-- Mostrar valores da opção
SELECT 
    'VALORES DA OPÇÃO:' AS tipo,
    v.idvalor,
    o.nome_opcao AS opcao,
    v.nome_valor AS valor,
    CONCAT('R$ ', FORMAT(v.preco_adicional, 2)) AS preco,
    v.disponivel
FROM opcao_valores v
INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
WHERE v.idopcao_fk = @id_opcao_extras
ORDER BY v.ordem_exibicao;

-- Mostrar produto vinculado
SELECT 
    'PRODUTO VINCULADO:' AS tipo,
    p.idproduto,
    p.nome AS produto,
    CONCAT('R$ ', FORMAT(p.preco, 2)) AS preco_base
FROM produto_opcao_associacao poa
INNER JOIN produto p ON poa.idproduto_fk = p.idproduto
WHERE poa.idopcao_fk = @id_opcao_extras;

-- Mostrar ingredientes vinculados
SELECT 
    'INGREDIENTES VINCULADOS:' AS tipo,
    v.nome_valor AS valor_personalizacao,
    i.nome AS ingrediente,
    pi.quantidade_usada AS qtd_usada,
    i.unidade_medida AS unidade,
    i.quantidade_estoque AS estoque_disponivel
FROM personalizacao_ingrediente pi
INNER JOIN opcao_valores v ON pi.idvalor_fk = v.idvalor
INNER JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
WHERE v.idopcao_fk = @id_opcao_extras
ORDER BY v.ordem_exibicao;

-- =================================================================
-- RESULTADO ESPERADO NO FRONTEND:
-- =================================================================
/*
✅ Modal de personalização mostrará:

   Extras (pode escolher vários) ⬅️ CHECKBOXES
   ☐ Cartão Personalizado     +R$ 1,50
   ☐ Vela de Aniversário       +R$ 1,00
   ☐ Paçoca Triturada          +R$ 2,00
   ☐ Morangos Frescos          +R$ 3,00

   Valor Base:         R$ 12,00
   Personalizações:    +R$ 7,50  ⬅️ Se marcar todos
   ────────────────────────────
   TOTAL:              R$ 19,50

✅ Ao finalizar pedido:
   - Sistema calcula: R$ 1,50 + 1,00 + 2,00 + 3,00 = R$ 7,50
   - Dá baixa automática em:
     * 0.050kg de Chantilly
     * 0.030kg de Granulado
     * 0.080kg de Paçoca
     * 0.150kg de Morango
*/

SELECT '✅ CONFIGURAÇÃO CONCLUÍDA!' AS status;
SELECT 'Agora você pode testar no frontend acessando o catálogo e personalizando o produto.' AS proximos_passos;
