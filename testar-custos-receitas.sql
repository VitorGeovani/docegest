-- =========================================================
-- Script de Teste para Custos e Receitas
-- Execute este script para testar todas as funcionalidades
-- =========================================================

USE segredodosabor;

-- 1. Criar um ingrediente com estoque baixo para testar alertas
INSERT INTO ingrediente (nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo, fornecedor, ativo) 
VALUES ('Teste Estoque Baixo', 'kg', 25.00, 10.000, 20.000, 'Fornecedor Teste', 1)
ON DUPLICATE KEY UPDATE 
    quantidade_estoque = 10.000,
    estoque_minimo = 20.000;

-- 2. Verificar ingredientes com estoque baixo
SELECT 
    idingrediente,
    nome,
    quantidade_estoque,
    estoque_minimo,
    unidade_medida,
    GREATEST(0, estoque_minimo - quantidade_estoque) AS quantidade_necessaria
FROM ingrediente
WHERE quantidade_estoque <= estoque_minimo
  AND ativo = 1;

-- 3. Verificar lista de compras
SELECT 
    idingrediente,
    nome,
    unidade_medida,
    quantidade_estoque AS quantidade_atual,
    estoque_minimo,
    GREATEST(0, (estoque_minimo * 2) - quantidade_estoque) AS quantidade_comprar,
    preco_unitario,
    GREATEST(0, ((estoque_minimo * 2) - quantidade_estoque) * preco_unitario) AS valor_estimado,
    fornecedor
FROM ingrediente
WHERE quantidade_estoque <= estoque_minimo
  AND ativo = 1;

-- 4. Verificar produtos e suas receitas
SELECT 
    p.idproduto,
    p.nome AS produto,
    p.preco,
    COUNT(r.idreceita) AS qtd_ingredientes_receita,
    IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS custo_producao
FROM produto p
LEFT JOIN receita r ON p.idproduto = r.idproduto
LEFT JOIN ingrediente i ON r.idingrediente = i.idingrediente
WHERE p.ativo = 1
GROUP BY p.idproduto, p.nome, p.preco;

-- 5. Verificar análise completa de custos
SELECT 
    p.idproduto,
    p.nome,
    p.preco,
    IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS custo_producao,
    p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS lucro,
    CASE 
        WHEN p.preco > 0 THEN 
            ((p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0)) / p.preco * 100)
        ELSE 0
    END AS margem_percentual,
    CASE 
        WHEN SUM(r.quantidade * i.preco_unitario) IS NULL THEN 0
        ELSE 1
    END AS tem_receita
FROM produto p
LEFT JOIN receita r ON p.idproduto = r.idproduto
LEFT JOIN ingrediente i ON r.idingrediente = i.idingrediente
WHERE p.ativo = 1
GROUP BY p.idproduto, p.nome, p.preco
ORDER BY tem_receita DESC, p.nome;

-- 6. Detalhes das receitas cadastradas
SELECT 
    p.nome AS produto,
    i.nome AS ingrediente,
    r.quantidade,
    i.unidade_medida,
    i.preco_unitario,
    (r.quantidade * i.preco_unitario) AS custo_item
FROM receita r
INNER JOIN produto p ON r.idproduto = p.idproduto
INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
ORDER BY p.nome, i.nome;

-- 7. Resumo geral
SELECT 
    'Total de Produtos' AS metrica,
    COUNT(*) AS valor
FROM produto WHERE ativo = 1
UNION ALL
SELECT 
    'Produtos com Receita',
    COUNT(DISTINCT r.idproduto)
FROM receita r
INNER JOIN produto p ON r.idproduto = p.idproduto
WHERE p.ativo = 1
UNION ALL
SELECT 
    'Produtos sem Receita',
    COUNT(*) - (SELECT COUNT(DISTINCT r.idproduto) FROM receita r INNER JOIN produto p ON r.idproduto = p.idproduto WHERE p.ativo = 1)
FROM produto WHERE ativo = 1
UNION ALL
SELECT 
    'Ingredientes com Estoque Baixo',
    COUNT(*)
FROM ingrediente
WHERE quantidade_estoque <= estoque_minimo AND ativo = 1
UNION ALL
SELECT 
    'Total de Receitas Cadastradas',
    COUNT(*)
FROM receita;
