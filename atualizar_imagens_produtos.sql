-- =========================================================
-- SCRIPT PARA ATUALIZAR PRODUTOS SEM IMAGEM
-- =========================================================
-- Execute este script se tiver produtos com imagem NULL/undefined
-- Database: segredodosabor
-- =========================================================

USE segredodosabor;

-- PASSO 1: Verificar quantos produtos estão sem imagem
SELECT 
    '=== PRODUTOS SEM IMAGEM ===' AS info,
    COUNT(*) AS total
FROM produto 
WHERE img_Produto IS NULL 
   OR img_Produto = '' 
   OR img_Produto = 'undefined';

-- PASSO 2: Ver detalhes dos produtos sem imagem
SELECT 
    idproduto,
    nome,
    img_Produto,
    preco
FROM produto 
WHERE img_Produto IS NULL 
   OR img_Produto = '' 
   OR img_Produto = 'undefined';

-- =========================================================
-- OPÇÃO 1: DESABILITAR SAFE MODE E ATUALIZAR TODOS
-- =========================================================
-- Esta é a forma mais simples e rápida

SET SQL_SAFE_UPDATES = 0;

UPDATE produto 
SET img_Produto = 'default-product.jpg' 
WHERE img_Produto IS NULL 
   OR img_Produto = '' 
   OR img_Produto = 'undefined';

SET SQL_SAFE_UPDATES = 1;

-- Verificar quantos produtos foram atualizados
SELECT ROW_COUNT() AS produtos_atualizados;

-- =========================================================
-- OPÇÃO 2: ATUALIZAR USANDO CHAVE PRIMÁRIA (SAFE MODE)
-- =========================================================
-- Use esta opção se a OPÇÃO 1 não funcionar
-- Você precisa substituir os IDs pelos IDs reais dos seus produtos

/*
UPDATE produto 
SET img_Produto = 'default-product.jpg' 
WHERE idproduto = 1;  -- Substitua pelo ID real

UPDATE produto 
SET img_Produto = 'default-product.jpg' 
WHERE idproduto = 2;  -- Substitua pelo ID real

-- Continue para todos os produtos sem imagem...
*/

-- =========================================================
-- OPÇÃO 3: ATUALIZAR EM LOTE USANDO SUBQUERY
-- =========================================================
-- Esta opção contorna o safe mode usando uma subquery

/*
UPDATE produto 
SET img_Produto = 'default-product.jpg' 
WHERE idproduto IN (
    SELECT idproduto FROM (
        SELECT idproduto 
        FROM produto 
        WHERE img_Produto IS NULL 
           OR img_Produto = '' 
           OR img_Produto = 'undefined'
    ) AS temp
);
*/

-- =========================================================
-- VERIFICAÇÃO FINAL
-- =========================================================

-- Confirmar que não há mais produtos sem imagem
SELECT 
    '=== VERIFICAÇÃO FINAL ===' AS info,
    COUNT(*) AS produtos_sem_imagem
FROM produto 
WHERE img_Produto IS NULL 
   OR img_Produto = '' 
   OR img_Produto = 'undefined';

-- Listar todos os produtos com suas imagens
SELECT 
    idproduto,
    nome,
    img_Produto,
    CASE 
        WHEN img_Produto IS NOT NULL AND img_Produto != '' THEN '✓ OK'
        ELSE '✗ SEM IMAGEM'
    END AS status_imagem
FROM produto
ORDER BY idproduto;

-- =========================================================
-- FIM DO SCRIPT
-- =========================================================

-- Mensagem final
SELECT '✅ Script executado com sucesso!' AS resultado;
