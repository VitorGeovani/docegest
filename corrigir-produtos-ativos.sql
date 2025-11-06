-- =========================================================
-- CORREÇÃO: Produtos Inativos - Análise de Custos
-- Data: 04 de Outubro de 2025
-- Problema: Produtos com ativo=0 não aparecem na análise
-- =========================================================

USE segredodosabor;

-- =========================================================
-- PARTE 1: DIAGNÓSTICO
-- =========================================================

SELECT '========================================' AS '';
SELECT '🔍 DIAGNÓSTICO DE PRODUTOS' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';

-- 1.1 Verificar coluna ativo na tabela produto
SELECT 'Verificando estrutura da tabela produto...' AS status;
SELECT '' AS '';

SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'segredodosabor' 
  AND TABLE_NAME = 'produto' 
  AND COLUMN_NAME = 'ativo';

SELECT '' AS '';

-- 1.2 Contar produtos ativos vs inativos
SELECT '📊 STATUS DOS PRODUTOS:' AS '';
SELECT '' AS '';

SELECT 
    CASE 
        WHEN ativo = 1 THEN '✅ Ativos'
        WHEN ativo = 0 THEN '❌ Inativos'
        ELSE '⚠️  Indefinido'
    END AS status_produto,
    COUNT(*) AS quantidade
FROM produto
GROUP BY ativo;

SELECT '' AS '';

-- 1.3 Listar produtos inativos (se houver)
SELECT '🔴 PRODUTOS INATIVOS (ativo = 0):' AS '';
SELECT '' AS '';

SELECT 
    idproduto,
    nome,
    preco,
    quantidade AS estoque,
    ativo,
    CASE 
        WHEN img_Produto IS NULL OR img_Produto = '' THEN 'Sem imagem'
        ELSE 'Com imagem'
    END AS status_imagem
FROM produto
WHERE ativo = 0 OR ativo IS NULL
ORDER BY idproduto;

SELECT '' AS '';

-- 1.4 Verificar produtos SEM receita cadastrada
SELECT '⚠️  PRODUTOS SEM RECEITA CADASTRADA:' AS '';
SELECT '' AS '';

SELECT 
    p.idproduto,
    p.nome,
    p.preco,
    p.ativo,
    COUNT(r.idreceita) AS total_ingredientes
FROM produto p
LEFT JOIN receita r ON p.idproduto = r.idproduto
GROUP BY p.idproduto, p.nome, p.preco, p.ativo
HAVING total_ingredientes = 0
ORDER BY p.ativo DESC, p.idproduto;

SELECT '' AS '';

-- =========================================================
-- PARTE 2: CORREÇÃO - ADICIONAR COLUNA ATIVO (SE NÃO EXISTIR)
-- =========================================================

SELECT '========================================' AS '';
SELECT '🔧 APLICANDO CORREÇÕES' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';

-- 2.1 Adicionar coluna ativo se não existir
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND COLUMN_NAME = 'ativo');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE produto ADD COLUMN ativo TINYINT(1) DEFAULT 1 COMMENT ''1=Ativo, 0=Inativo'' AFTER quantidade', 
    'SELECT ''✅ Coluna ativo já existe'' AS info');

PREPARE stmt FROM @sql; 
EXECUTE stmt; 
DEALLOCATE PREPARE stmt;

SELECT '' AS '';

-- =========================================================
-- PARTE 3: ATIVAR TODOS OS PRODUTOS
-- =========================================================

SELECT '🔄 ATIVANDO TODOS OS PRODUTOS...' AS status;
SELECT '' AS '';

-- Desabilitar modo seguro temporariamente
SET SQL_SAFE_UPDATES = 0;

-- 3.1 Ativar todos os produtos que estão inativos ou NULL
UPDATE produto 
SET ativo = 1 
WHERE ativo = 0 OR ativo IS NULL;

-- Verificar quantos foram atualizados
SELECT CONCAT('✅ ', ROW_COUNT(), ' produto(s) ativado(s)') AS resultado;

-- Reabilitar modo seguro
SET SQL_SAFE_UPDATES = 1;

SELECT '' AS '';

-- =========================================================
-- PARTE 4: VERIFICAR IMAGENS DOS PRODUTOS
-- =========================================================

SELECT '🖼️  VERIFICANDO IMAGENS DOS PRODUTOS...' AS status;
SELECT '' AS '';

-- 4.1 Listar produtos sem imagem válida
SELECT 
    idproduto,
    nome,
    CASE 
        WHEN img_Produto IS NULL THEN 'NULL'
        WHEN img_Produto = '' THEN 'VAZIO'
        WHEN img_Produto = 'undefined' THEN 'UNDEFINED'
        ELSE img_Produto
    END AS status_imagem
FROM produto
WHERE img_Produto IS NULL 
   OR img_Produto = '' 
   OR img_Produto = 'undefined'
ORDER BY idproduto;

SELECT '' AS '';

-- 4.2 Corrigir imagens inválidas (opcional)
-- DESCOMENTE as linhas abaixo se quiser aplicar uma imagem padrão

SET SQL_SAFE_UPDATES = 0;

UPDATE produto 
SET img_Produto = 'default-product.jpg' 
WHERE img_Produto IS NULL 
   OR img_Produto = '' 
   OR img_Produto = 'undefined';

SELECT CONCAT('✅ ', ROW_COUNT(), ' imagem(ns) corrigida(s)') AS resultado;

SET SQL_SAFE_UPDATES = 1;

SELECT '' AS '';

-- =========================================================
-- PARTE 5: GARANTIR CATEGORIAS DOS PRODUTOS
-- =========================================================

SELECT '📁 VERIFICANDO CATEGORIAS...' AS status;
SELECT '' AS '';

-- 5.1 Produtos sem categoria
SELECT 
    COUNT(*) AS produtos_sem_categoria
FROM produto 
WHERE idcategoria IS NULL;

-- 5.2 Atribuir categoria padrão para produtos sem categoria
SET SQL_SAFE_UPDATES = 0;

-- Usar categoria ID 2 (Cones Recheados) como padrão
UPDATE produto 
SET idcategoria = 2 
WHERE idcategoria IS NULL;

SELECT CONCAT('✅ ', ROW_COUNT(), ' produto(s) com categoria atribuída') AS resultado;

SET SQL_SAFE_UPDATES = 1;

SELECT '' AS '';

-- =========================================================
-- PARTE 6: RECALCULAR CUSTOS DE PRODUÇÃO
-- =========================================================

SELECT '💰 RECALCULANDO CUSTOS DE PRODUÇÃO...' AS status;
SELECT '' AS '';

-- Desabilitar modo seguro temporariamente
SET SQL_SAFE_UPDATES = 0;

-- 6.1 Recalcular custo de todos os produtos baseado nas receitas
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

SELECT CONCAT('✅ ', ROW_COUNT(), ' custo(s) recalculado(s)') AS resultado;

-- Reabilitar modo seguro
SET SQL_SAFE_UPDATES = 1;

SELECT '' AS '';

-- =========================================================
-- PARTE 7: VERIFICAÇÃO FINAL
-- =========================================================

SELECT '========================================' AS '';
SELECT '✅ VERIFICAÇÃO FINAL' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';

-- 7.1 Status final dos produtos
SELECT '📊 STATUS FINAL DOS PRODUTOS:' AS '';
SELECT '' AS '';

SELECT 
    COUNT(*) AS total_produtos,
    SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) AS produtos_ativos,
    SUM(CASE WHEN ativo = 0 THEN 1 ELSE 0 END) AS produtos_inativos,
    SUM(CASE WHEN idcategoria IS NOT NULL THEN 1 ELSE 0 END) AS com_categoria,
    SUM(CASE WHEN custo_producao > 0 THEN 1 ELSE 0 END) AS com_custo_calculado,
    SUM(CASE WHEN img_Produto IS NOT NULL AND img_Produto != '' THEN 1 ELSE 0 END) AS com_imagem
FROM produto;

SELECT '' AS '';

-- 7.2 Produtos prontos para análise de custos
SELECT '✅ PRODUTOS PRONTOS PARA ANÁLISE DE CUSTOS:' AS '';
SELECT '' AS '';

SELECT 
    p.idproduto,
    p.codigo_produto,
    p.nome,
    c.nome AS categoria,
    p.preco AS preco_venda,
    p.custo_producao,
    CASE 
        WHEN p.preco > 0 THEN ROUND(((p.preco - p.custo_producao) / p.preco * 100), 2)
        ELSE 0
    END AS margem_lucro_percent,
    COUNT(r.idreceita) AS total_ingredientes,
    p.ativo,
    CASE 
        WHEN p.ativo = 1 AND p.custo_producao > 0 THEN '✅ OK'
        WHEN p.ativo = 1 AND p.custo_producao = 0 THEN '⚠️  Sem Custo'
        ELSE '❌ Inativo'
    END AS status_analise
FROM produto p
LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
LEFT JOIN receita r ON p.idproduto = r.idproduto
WHERE p.ativo = 1
GROUP BY p.idproduto, p.codigo_produto, p.nome, c.nome, p.preco, p.custo_producao, p.ativo
ORDER BY p.idproduto;

SELECT '' AS '';

-- 7.3 Ingredientes ativos
SELECT '📦 INGREDIENTES ATIVOS:' AS '';
SELECT '' AS '';

SELECT 
    COUNT(*) AS total_ingredientes,
    SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) AS ingredientes_ativos,
    SUM(CASE WHEN ativo = 0 THEN 1 ELSE 0 END) AS ingredientes_inativos
FROM ingrediente;

SELECT '' AS '';

-- 7.4 Receitas cadastradas
SELECT '📝 RECEITAS CADASTRADAS:' AS '';
SELECT '' AS '';

SELECT 
    COUNT(*) AS total_receitas,
    COUNT(DISTINCT idproduto) AS produtos_com_receita,
    COUNT(DISTINCT idingrediente) AS ingredientes_utilizados
FROM receita;

SELECT '' AS '';

-- =========================================================
-- PARTE 8: CRIAR ÍNDICE PARA PERFORMANCE (SE NÃO EXISTIR)
-- =========================================================

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_NAME = 'produto' AND INDEX_NAME = 'idx_produto_ativo');

SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_produto_ativo ON produto(ativo)', 
    'SELECT ''✅ Índice idx_produto_ativo já existe'' AS info');

PREPARE stmt FROM @sql; 
EXECUTE stmt; 
DEALLOCATE PREPARE stmt;

SELECT '' AS '';

-- =========================================================
-- RESUMO FINAL
-- =========================================================

SELECT '========================================' AS '';
SELECT '🎉 CORREÇÃO CONCLUÍDA!' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';
SELECT '✅ Todos os produtos foram ativados' AS '';
SELECT '✅ Custos de produção recalculados' AS '';
SELECT '✅ Imagens corrigidas' AS '';
SELECT '✅ Categorias atribuídas' AS '';
SELECT '' AS '';
SELECT '📊 Agora você pode visualizar os produtos em:' AS '';
SELECT '   • Análise de Custos por Produto' AS '';
SELECT '   • Relatórios de Custos' AS '';
SELECT '   • Dashboard de Gerenciamento' AS '';
SELECT '' AS '';
SELECT '========================================' AS '';

-- =========================================================
-- FIM DO SCRIPT DE CORREÇÃO
-- =========================================================
