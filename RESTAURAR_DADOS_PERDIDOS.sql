-- =========================================================
-- RESTAURAR DADOS PERDIDOS - Produtos e Ingredientes
-- Data: 11/11/2025
-- Problema: Dados sumiram após executar INSTALACAO_BANCO_COMPLETO.sql
-- =========================================================

USE segredodosabor;

-- =========================================================
-- PARTE 1: VERIFICAR SE JÁ TEM DADOS
-- =========================================================

SELECT 
    'ANTES DA RESTAURAÇÃO' AS status,
    (SELECT COUNT(*) FROM categoria) AS categorias,
    (SELECT COUNT(*) FROM produto) AS produtos,
    (SELECT COUNT(*) FROM ingrediente) AS ingredientes,
    (SELECT COUNT(*) FROM administrador) AS admins;

-- =========================================================
-- PARTE 2: RESTAURAR ADMIN (se não existir)
-- =========================================================

-- Verificar se já existe admin
SET @admin_existe = (SELECT COUNT(*) FROM administrador WHERE email = 'admin@segredodosabor.com');

-- Se não existir, criar
INSERT INTO administrador (nome, email, cpf, senha, ativo, ultimo_acesso)
SELECT 'Administrador', 'admin@segredodosabor.com', '000.000.000-00', 
       '$2b$10$g/IYyuSsGc45zlkNVhlXAeFLYijABRXzYOSWjCe1DRTTO6.AQHSQy', 1, NOW()
WHERE @admin_existe = 0;

-- =========================================================
-- PARTE 3: VERIFICAR CATEGORIAS
-- =========================================================

-- As categorias já devem estar no banco (foram inseridas no INSTALACAO_BANCO_COMPLETO.sql)
SELECT COUNT(*) AS total_categorias FROM categoria;

-- =========================================================
-- PARTE 4: VERIFICAR INGREDIENTES
-- =========================================================

-- Os ingredientes já devem estar no banco (24 ingredientes)
SELECT COUNT(*) AS total_ingredientes FROM ingrediente;

-- =========================================================
-- PARTE 5: ADICIONAR PRODUTOS DE EXEMPLO (se não tiver)
-- =========================================================

-- Verificar se já tem produtos
SET @produtos_existe = (SELECT COUNT(*) FROM produto);

-- Se não tiver produtos, adicionar alguns exemplos
INSERT INTO produto (nome, descricao, preco, quantidade, img_Produto, ativo, idcategoria, codigo_produto, custo_producao, margem_lucro, tempo_preparo, permite_personalizacao)
SELECT * FROM (
    SELECT 'Cone Trufado - Ovomaltine' AS nome, 
           'Delicioso cone recheado com brigadeiro de Ovomaltine' AS descricao,
           15.00 AS preco, 
           50 AS quantidade, 
           'cone-ovomaltine.jpg' AS img_Produto,
           1 AS ativo,
           2 AS idcategoria, -- Cones Recheados
           'PROD-CONE-001' AS codigo_produto,
           8.00 AS custo_producao,
           40.00 AS margem_lucro,
           15 AS tempo_preparo,
           1 AS permite_personalizacao
    UNION ALL
    SELECT 'Cone Trufado - Nutella',
           'Cone recheado com brigadeiro de Nutella e cobertura especial',
           18.00, 50, 'cone-nutella.jpg', 1, 2, 'PROD-CONE-002', 10.00, 40.00, 15, 1
    UNION ALL
    SELECT 'Sorvete de Chocolate Belga',
           'Sorvete artesanal de chocolate belga premium',
           12.00, 100, 'sorvete-chocolate.jpg', 1, 1, 'PROD-SORV-001', 6.00, 40.00, 10, 1
    UNION ALL
    SELECT 'Sorvete de Morango Natural',
           'Sorvete feito com morangos frescos selecionados',
           10.00, 100, 'sorvete-morango.jpg', 1, 1, 'PROD-SORV-002', 5.50, 40.00, 10, 1
    UNION ALL
    SELECT 'Picolé de Limão Siciliano',
           'Picolé refrescante de limão siciliano',
           5.00, 200, 'picole-limao.jpg', 1, 3, 'PROD-PICO-001', 2.00, 40.00, 5, 0
    UNION ALL
    SELECT 'Bolo Gelado de Chocolate',
           'Bolo gelado recheado com mousse de chocolate',
           45.00, 20, 'bolo-chocolate.jpg', 1, 4, 'PROD-BOLO-001', 25.00, 40.00, 60, 1
    UNION ALL
    SELECT 'Mousse de Maracujá',
           'Mousse cremoso de maracujá com cobertura de chocolate branco',
           8.00, 50, 'mousse-maracuja.jpg', 1, 5, 'PROD-MOUS-001', 4.50, 40.00, 20, 0
    UNION ALL
    SELECT 'Brigadeiro Gourmet - Mix',
           'Caixa com 15 brigadeiros gourmet sortidos',
           25.00, 30, 'brigadeiro-mix.jpg', 1, 8, 'PROD-BRIG-001', 12.00, 40.00, 30, 1
) AS produtos_exemplo
WHERE @produtos_existe = 0;

-- =========================================================
-- PARTE 6: ADICIONAR RECEITAS BÁSICAS (BOM)
-- =========================================================

-- Receita para Cone Trufado - Ovomaltine (idproduto = 1)
INSERT IGNORE INTO receita (idproduto_fk, idingrediente_fk, quantidade)
VALUES 
    (1, 21, 1.000),   -- Casquinha/Cone (1 unidade)
    (1, 1, 0.100),    -- Leite Condensado (100g)
    (1, 9, 0.050),    -- Ovomaltine (50g)
    (1, 5, 0.030);    -- Chocolate ao Leite (30g)

-- Receita para Cone Trufado - Nutella (idproduto = 2)
INSERT IGNORE INTO receita (idproduto_fk, idingrediente_fk, quantidade)
VALUES 
    (2, 21, 1.000),   -- Casquinha/Cone (1 unidade)
    (2, 1, 0.100),    -- Leite Condensado (100g)
    (2, 8, 0.080),    -- Nutella (80g)
    (2, 5, 0.030);    -- Chocolate ao Leite (30g)

-- Receita para Sorvete de Chocolate (idproduto = 3)
INSERT IGNORE INTO receita (idproduto_fk, idingrediente_fk, quantidade)
VALUES 
    (3, 2, 1.000),    -- Creme de Leite (1 lata)
    (3, 1, 0.200),    -- Leite Condensado (200g)
    (3, 5, 0.150),    -- Chocolate ao Leite (150g)
    (3, 22, 1.000);   -- Embalagem Individual (1 unidade)

-- Receita para Brigadeiro Mix (idproduto = 8)
INSERT IGNORE INTO receita (idproduto_fk, idingrediente_fk, quantidade)
VALUES 
    (8, 1, 0.500),    -- Leite Condensado (500g)
    (8, 3, 0.050),    -- Manteiga (50g)
    (8, 5, 0.200),    -- Chocolate (200g)
    (8, 23, 1.000);   -- Caixinha Brigadeiro (1 unidade)

-- Recalcular custos automaticamente (trigger vai fazer isso)
CALL sp_recalcular_todos_custos();

-- =========================================================
-- PARTE 7: VERIFICAR RESULTADO FINAL
-- =========================================================

SELECT 
    'APÓS RESTAURAÇÃO' AS status,
    (SELECT COUNT(*) FROM categoria) AS categorias,
    (SELECT COUNT(*) FROM produto) AS produtos,
    (SELECT COUNT(*) FROM ingrediente) AS ingredientes,
    (SELECT COUNT(*) FROM receita) AS receitas,
    (SELECT COUNT(*) FROM administrador) AS admins;

-- Listar produtos criados
SELECT 
    idproduto,
    nome,
    preco,
    custo_producao,
    CONCAT(ROUND(((preco - custo_producao) / preco * 100), 2), '%') AS margem_real,
    quantidade AS estoque
FROM produto
ORDER BY idproduto;

SELECT '✅ DADOS RESTAURADOS COM SUCESSO!' AS mensagem;
