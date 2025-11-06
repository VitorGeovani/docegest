-- =========================================================
-- CORREÇÃO RÁPIDA: Ativar Produtos para Análise de Custos
-- Data: 04 de Outubro de 2025
-- =========================================================
-- INSTRUÇÕES:
-- 1. Abra este arquivo no MySQL Workbench
-- 2. Selecione o banco 'segredodosabor'
-- 3. Execute este script completo (Ctrl + Shift + Enter)
-- =========================================================

USE segredodosabor;

-- DESABILITAR MODO SEGURO
SET SQL_SAFE_UPDATES = 0;

-- =========================================================
-- PASSO 1: ATIVAR TODOS OS PRODUTOS
-- =========================================================

UPDATE produto 
SET ativo = 1 
WHERE ativo = 0 OR ativo IS NULL;

SELECT CONCAT('✅ ', ROW_COUNT(), ' produtos ativados') AS resultado;

-- =========================================================
-- PASSO 2: CORRIGIR IMAGENS INVÁLIDAS
-- =========================================================

UPDATE produto 
SET img_Produto = 'default-product.jpg' 
WHERE img_Produto IS NULL 
   OR img_Produto = '' 
   OR img_Produto = 'undefined';

SELECT CONCAT('✅ ', ROW_COUNT(), ' imagens corrigidas') AS resultado;

-- =========================================================
-- PASSO 3: GARANTIR CATEGORIAS
-- =========================================================

UPDATE produto 
SET idcategoria = 2 
WHERE idcategoria IS NULL;

SELECT CONCAT('✅ ', ROW_COUNT(), ' categorias atribuídas') AS resultado;

-- =========================================================
-- PASSO 4: RECALCULAR CUSTOS DE PRODUÇÃO
-- =========================================================

UPDATE produto p
LEFT JOIN (
    SELECT 
        r.idproduto,
        SUM(r.quantidade * i.preco_unitario) AS custo_total
    FROM receita r
    INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
    WHERE i.ativo = 1
    GROUP BY r.idproduto
) custos ON p.idproduto = custos.idproduto
SET p.custo_producao = IFNULL(custos.custo_total, 0);

SELECT CONCAT('✅ ', ROW_COUNT(), ' custos recalculados') AS resultado;

-- REABILITAR MODO SEGURO
SET SQL_SAFE_UPDATES = 1;

-- =========================================================
-- VERIFICAÇÃO FINAL
-- =========================================================

SELECT '========================================' AS '';
SELECT '✅ CORREÇÃO CONCLUÍDA!' AS '';
SELECT '========================================' AS '';

-- Mostrar produtos ativos
SELECT 
    COUNT(*) AS total_produtos,
    SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) AS produtos_ativos,
    SUM(CASE WHEN custo_producao > 0 THEN 1 ELSE 0 END) AS com_custo
FROM produto;

-- Listar produtos prontos para análise
SELECT 
    p.idproduto,
    p.nome,
    p.preco AS preco_venda,
    p.custo_producao,
    ROUND(((p.preco - p.custo_producao) / p.preco * 100), 2) AS margem_percent,
    p.ativo,
    COUNT(r.idreceita) AS total_ingredientes
FROM produto p
LEFT JOIN receita r ON p.idproduto = r.idproduto
WHERE p.ativo = 1
GROUP BY p.idproduto, p.nome, p.preco, p.custo_producao, p.ativo
ORDER BY p.idproduto
LIMIT 20;

SELECT '========================================' AS '';
SELECT '🎉 Produtos prontos para análise!' AS '';
SELECT '========================================' AS '';

-- =========================================================
-- FIM DO SCRIPT
-- =========================================================
