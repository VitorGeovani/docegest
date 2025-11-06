-- =========================================================
-- SCRIPT DE VERIFICAÇÃO E CORREÇÃO RÁPIDA
-- =========================================================
-- Execute este script no MySQL Workbench
-- Database: segredodosabor
-- =========================================================

USE segredodosabor;

-- 1. VERIFICAR ESTRUTURA DAS TABELAS
SELECT '=== VERIFICANDO TABELAS ===' AS status;

-- Verificar se categoria existe
SELECT COUNT(*) AS 'Categorias Cadastradas' FROM categoria;

-- Verificar se ingrediente existe  
SELECT COUNT(*) AS 'Ingredientes Cadastrados' FROM ingrediente;

-- Verificar produtos
SELECT COUNT(*) AS 'Produtos Cadastrados' FROM produto;

-- Verificar reservas
SELECT COUNT(*) AS 'Reservas Cadastradas' FROM reserva;

-- 2. VERIFICAR PRODUTOS SEM IMAGEM
SELECT '=== PRODUTOS SEM IMAGEM ===' AS status;

SELECT 
    idproduto,
    nome,
    img_Produto
FROM produto 
WHERE img_Produto IS NULL OR img_Produto = '' OR img_Produto = 'undefined';

-- 3. ATUALIZAR PRODUTOS SEM IMAGEM (caso necessário)
-- Execute este bloco para aplicar uma imagem padrão aos produtos sem imagem

-- Método 1: Desabilitar safe mode temporariamente (RECOMENDADO)
SET SQL_SAFE_UPDATES = 0;

UPDATE produto 
SET img_Produto = 'default-product.jpg' 
WHERE img_Produto IS NULL OR img_Produto = '' OR img_Produto = 'undefined';

SET SQL_SAFE_UPDATES = 1;

-- Método 2: Alternativa usando subquery (se o método 1 não funcionar)
-- UPDATE produto 
-- SET img_Produto = 'default-product.jpg' 
-- WHERE idproduto IN (
--     SELECT idproduto FROM (
--         SELECT idproduto FROM produto 
--         WHERE img_Produto IS NULL OR img_Produto = '' OR img_Produto = 'undefined'
--     ) AS temp
-- );

-- 4. VERIFICAR CATEGORIAS
SELECT '=== CATEGORIAS ===' AS status;

SELECT 
    idcategoria,
    nome,
    ativo,
    data_cadastro,
    (SELECT COUNT(*) FROM produto WHERE idcategoria = categoria.idcategoria) as total_produtos
FROM categoria
ORDER BY nome;

-- 5. VERIFICAR INGREDIENTES
SELECT '=== INGREDIENTES ===' AS status;

SELECT 
    idingrediente,
    nome,
    unidade_medida,
    quantidade_estoque,
    estoque_minimo,
    ativo
FROM ingrediente
ORDER BY nome
LIMIT 10;

-- 6. VERIFICAR RESERVAS RECENTES
SELECT '=== ÚLTIMAS RESERVAS ===' AS status;

SELECT 
    idreserva,
    data_entrega,
    hora_entrega,
    status,
    valor_total,
    pagamento
FROM reserva
ORDER BY idreserva DESC
LIMIT 5;

-- 7. VERIFICAR CLIENTES COM AUTENTICAÇÃO
SELECT '=== CLIENTES CADASTRADOS ===' AS status;

SELECT 
    idcliente,
    nome,
    email,
    tipo,
    CASE 
        WHEN senha IS NOT NULL AND senha != '' THEN 'Sim'
        ELSE 'Não'
    END AS tem_senha
FROM cliente
ORDER BY idcliente;

-- 8. DADOS PARA RELATÓRIOS
SELECT '=== ESTATÍSTICAS GERAIS ===' AS status;

SELECT 
    (SELECT COUNT(*) FROM categoria) AS total_categorias,
    (SELECT COUNT(*) FROM ingrediente) AS total_ingredientes,
    (SELECT COUNT(*) FROM produto) AS total_produtos,
    (SELECT COUNT(*) FROM reserva WHERE status = 'Confirmado') AS reservas_confirmadas,
    (SELECT COUNT(*) FROM cliente) AS total_clientes;

-- =========================================================
-- FIM DA VERIFICAÇÃO
-- =========================================================
