# 💻 Exemplos Práticos de Uso do Banco de Dados
## Sistema Segredo do Sabor

---

## 📋 Índice

1. [Operações Básicas](#operações-básicas)
2. [Gestão de Clientes](#gestão-de-clientes)
3. [Catálogo de Produtos](#catálogo-de-produtos)
4. [Pedidos e Reservas](#pedidos-e-reservas)
5. [Receitas e Custos](#receitas-e-custos)
6. [Estoque](#estoque)
7. [Relatórios](#relatórios)
8. [Manutenção](#manutenção)

---

## 🎯 Operações Básicas

### Verificar Estrutura do Banco

```sql
-- Listar todas as tabelas
SHOW TABLES;

-- Ver estrutura de uma tabela
DESCRIBE produto;
DESC cliente;

-- Ver detalhes completos
SHOW CREATE TABLE reserva;

-- Listar procedures
SHOW PROCEDURE STATUS WHERE Db = 'segredodosabor';

-- Listar views
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

-- Listar triggers
SHOW TRIGGERS;
```

### Verificar Dados Iniciais

```sql
-- Contar registros em cada tabela
SELECT 
    'cliente' AS tabela, COUNT(*) AS total FROM cliente
UNION ALL
SELECT 'produto', COUNT(*) FROM produto
UNION ALL
SELECT 'categoria', COUNT(*) FROM categoria
UNION ALL
SELECT 'ingrediente', COUNT(*) FROM ingrediente
UNION ALL
SELECT 'reserva', COUNT(*) FROM reserva;
```

---

## 👥 Gestão de Clientes

### Cadastrar Novo Cliente

```sql
-- Cliente comum
INSERT INTO cliente (nome, email, telefone, senha, tipo)
VALUES (
    'Maria Silva',
    'maria@email.com',
    '11987654321',
    '$2b$10$YourBcryptHashHere', -- Hash bcrypt da senha
    'cliente'
);

-- Administrador
INSERT INTO cliente (nome, email, telefone, senha, tipo)
VALUES (
    'Admin Sistema',
    'admin@segredodosabor.com',
    '11999999999',
    '$2b$10$YourBcryptHashHere',
    'admin'
);
```

### Buscar Cliente

```sql
-- Por email (para login)
SELECT idcliente, nome, email, senha, tipo
FROM cliente
WHERE email = 'maria@email.com';

-- Por ID
SELECT * FROM cliente WHERE idcliente = 1;

-- Clientes ativos (com pedidos)
SELECT * FROM vw_clientes_ativos
ORDER BY total_pedidos DESC;
```

### Atualizar Cliente

```sql
-- Atualizar dados cadastrais
UPDATE cliente
SET nome = 'Maria Silva Santos',
    telefone = '11988888888'
WHERE idcliente = 1;

-- Registrar último acesso
UPDATE cliente
SET ultimo_acesso = NOW()
WHERE idcliente = 1;

-- Verificar email
UPDATE cliente
SET email_verificado = TRUE
WHERE email = 'maria@email.com';
```

### Recuperação de Senha

```sql
-- Gerar token de recuperação
UPDATE cliente
SET token_recuperacao = 'token_aleatorio_123abc',
    data_token_recuperacao = DATE_ADD(NOW(), INTERVAL 1 HOUR)
WHERE email = 'maria@email.com';

-- Validar token
SELECT idcliente, nome, email
FROM cliente
WHERE token_recuperacao = 'token_aleatorio_123abc'
  AND data_token_recuperacao > NOW();

-- Atualizar senha
UPDATE cliente
SET senha = '$2b$10$NewHashHere',
    token_recuperacao = NULL,
    data_token_recuperacao = NULL
WHERE idcliente = 1;
```

### Gerenciar Tokens JWT

```sql
-- Criar refresh token
INSERT INTO refresh_tokens (idcliente_fk, token, data_expiracao)
VALUES (
    1,
    'jwt_refresh_token_here',
    DATE_ADD(NOW(), INTERVAL 7 DAY)
);

-- Buscar token válido
SELECT *
FROM refresh_tokens
WHERE token = 'jwt_refresh_token_here'
  AND data_expiracao > NOW()
  AND revogado = FALSE;

-- Revogar token (logout)
UPDATE refresh_tokens
SET revogado = TRUE
WHERE token = 'jwt_refresh_token_here';

-- Limpar tokens expirados
DELETE FROM refresh_tokens
WHERE data_expiracao < NOW() OR revogado = TRUE;
```

---

## 🛍️ Catálogo de Produtos

### Cadastrar Categoria

```sql
-- Nova categoria
INSERT INTO categoria (nome, descricao)
VALUES (
    'Cones Recheados',
    'Cones com brigadeiro e coberturas especiais'
);

-- Listar categorias ativas
SELECT * FROM categoria
WHERE ativo = 1
ORDER BY nome;
```

### Cadastrar Produto

```sql
-- Produto completo
INSERT INTO produto (
    nome, descricao, preco, quantidade, 
    img_Produto, idcategoria, codigo_produto,
    margem_lucro, tempo_preparo
)
VALUES (
    'Cone Ovomaltine',
    'Cone recheado com brigadeiro de Ovomaltine',
    12.50,
    50,
    'cone-ovomaltine.jpg',
    2,
    'PROD0001',
    45.00,
    30
);
```

### Buscar Produtos

```sql
-- Catálogo completo (produtos ativos)
SELECT 
    p.idproduto,
    p.nome,
    p.descricao,
    p.preco,
    p.quantidade,
    p.img_Produto,
    c.nome AS categoria
FROM produto p
LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
WHERE p.ativo = 1
  AND p.quantidade > 0
ORDER BY c.nome, p.nome;

-- Por categoria
SELECT * FROM produto
WHERE idcategoria = 2
  AND ativo = 1
ORDER BY nome;

-- Busca por nome
SELECT * FROM produto
WHERE nome LIKE '%cone%'
  AND ativo = 1;

-- Por código
SELECT * FROM produto
WHERE codigo_produto = 'PROD0001';
```

### Atualizar Produto

```sql
-- Atualizar preço
UPDATE produto
SET preco = 15.00
WHERE idproduto = 1;

-- Atualizar estoque
UPDATE produto
SET quantidade = quantidade + 20
WHERE idproduto = 1;

-- Ativar/Desativar
UPDATE produto
SET ativo = 0
WHERE idproduto = 1;

-- Atualizar imagem
UPDATE produto
SET img_Produto = 'nova-imagem.jpg'
WHERE idproduto = 1;
```

### Produtos com Estoque Baixo

```sql
-- Usando view
SELECT * FROM vw_produtos_estoque_baixo;

-- Query direta
SELECT 
    idproduto,
    nome,
    quantidade,
    CASE 
        WHEN quantidade = 0 THEN 'SEM ESTOQUE'
        WHEN quantidade <= 5 THEN 'CRÍTICO'
        WHEN quantidade <= 10 THEN 'BAIXO'
    END AS status
FROM produto
WHERE quantidade <= 10
  AND ativo = 1
ORDER BY quantidade;
```

---

## 🛒 Pedidos e Reservas

### Criar Pedido (Checkout)

```sql
-- Pedido completo
INSERT INTO reserva (
    idcliente_fk,
    data_entrega,
    hora_entrega,
    valor_total,
    pagamento,
    status,
    qtdReserva,
    tipo_pedido,
    observacoes
)
VALUES (
    1,                          -- ID do cliente
    '2025-10-15',              -- Data de entrega
    '14:00:00',                -- Hora de entrega
    40.00,                     -- Valor total
    'PIX',                     -- Forma de pagamento
    'Pendente',                -- Status inicial
    '[
        {"id": 2, "nome": "Cone Ovomaltine", "quantidade": 2, "preco": 12.50},
        {"id": 3, "nome": "Cone Kinder Bueno", "quantidade": 1, "preco": 15.00}
    ]',                        -- Produtos (JSON)
    'RETIRADA',                -- Tipo de pedido
    'Sem cobertura extra'      -- Observações
);

-- Com entrega
INSERT INTO reserva (
    idcliente_fk,
    data_entrega,
    hora_entrega,
    valor_total,
    pagamento,
    status,
    qtdReserva,
    tipo_pedido,
    endereco_entrega,
    taxa_entrega
)
VALUES (
    1,
    '2025-10-15',
    '18:00:00',
    48.00,  -- 40.00 + 8.00 taxa
    'Dinheiro',
    'Pendente',
    '[{"id": 2, "nome": "Cone Ovomaltine", "quantidade": 2, "preco": 12.50}]',
    'ENTREGA',
    'Rua Exemplo, 123 - Bairro - SP',
    8.00
);
```

### Buscar Pedidos

```sql
-- Pedidos de um cliente
SELECT 
    idreserva,
    codigo_pedido,
    data_entrega,
    hora_entrega,
    valor_total,
    status,
    tipo_pedido
FROM reserva
WHERE idcliente_fk = 1
ORDER BY data_entrega DESC;

-- Pedidos pendentes (painel admin)
SELECT 
    r.idreserva,
    r.codigo_pedido,
    r.data_entrega,
    r.hora_entrega,
    c.nome AS cliente,
    c.telefone,
    r.valor_total,
    r.tipo_pedido,
    r.status,
    r.pagamento
FROM reserva r
INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
WHERE r.status IN ('Pendente', 'Confirmado', 'Preparando')
ORDER BY r.data_entrega, r.hora_entrega;

-- Pedidos do dia
SELECT * FROM reserva
WHERE DATE(data_entrega) = CURDATE()
ORDER BY hora_entrega;

-- Por código de pedido
SELECT * FROM reserva
WHERE codigo_pedido = 'PED20251013001';
```

### Atualizar Status do Pedido

```sql
-- Confirmar pagamento
UPDATE reserva
SET status = 'Confirmado',
    status_pagamento = 'confirmado',
    status_pedido = 'confirmado'
WHERE idreserva = 1;

-- Marcar como em preparação
UPDATE reserva
SET status = 'Preparando',
    status_pedido = 'preparando'
WHERE idreserva = 1;

-- Marcar como pronto
UPDATE reserva
SET status = 'Pronto',
    status_pedido = 'pronto'
WHERE idreserva = 1;

-- Finalizar entrega
UPDATE reserva
SET status = 'Entregue',
    status_pedido = 'entregue'
WHERE idreserva = 1;

-- Cancelar pedido
UPDATE reserva
SET status = 'Cancelado',
    status_pedido = 'cancelado'
WHERE idreserva = 1;
```

### Extrair Produtos do Pedido (JSON)

```sql
-- Ver produtos de um pedido
SELECT 
    r.idreserva,
    r.codigo_pedido,
    JSON_EXTRACT(r.qtdReserva, '$[*].nome') AS produtos,
    r.valor_total
FROM reserva r
WHERE idreserva = 1;

-- Detalhar cada produto
SELECT 
    r.idreserva,
    jt.*
FROM reserva r,
JSON_TABLE(
    r.qtdReserva,
    '$[*]' COLUMNS (
        id INT PATH '$.id',
        nome VARCHAR(100) PATH '$.nome',
        quantidade INT PATH '$.quantidade',
        preco DECIMAL(10,2) PATH '$.preco'
    )
) AS jt
WHERE r.idreserva = 1;
```

---

## 🧪 Receitas e Custos

### Cadastrar Receita de Produto

```sql
-- Receita completa do Cone Ovomaltine
-- Produto: Cone Ovomaltine (ID: 2)

-- Ingrediente 1: Chocolate Meio Amargo (30g)
INSERT INTO receita (idproduto, idingrediente, quantidade)
VALUES (2, 6, 0.030);

-- Ingrediente 2: Ovomaltine (40g)
INSERT INTO receita (idproduto, idingrediente, quantidade)
VALUES (2, 9, 0.040);

-- Ingrediente 3: Leite Condensado (30g)
INSERT INTO receita (idproduto, idingrediente, quantidade)
VALUES (2, 1, 0.030);

-- Ingrediente 4: Cone (1 unidade)
INSERT INTO receita (idproduto, idingrediente, quantidade)
VALUES (2, 21, 1.000);

-- Ingrediente 5: Embalagem (1 unidade)
INSERT INTO receita (idproduto, idingrediente, quantidade)
VALUES (2, 22, 1.000);

-- O trigger calcula automaticamente o custo!
```

### Buscar Receita de um Produto

```sql
-- Receita completa
SELECT 
    p.nome AS produto,
    i.nome AS ingrediente,
    r.quantidade,
    i.unidade_medida,
    i.preco_unitario,
    ROUND(r.quantidade * i.preco_unitario, 2) AS custo_ingrediente
FROM receita r
INNER JOIN produto p ON r.idproduto = p.idproduto
INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
WHERE r.idproduto = 2
ORDER BY i.nome;

-- Total de custo
SELECT 
    p.idproduto,
    p.nome,
    SUM(r.quantidade * i.preco_unitario) AS custo_total
FROM produto p
INNER JOIN receita r ON p.idproduto = r.idproduto
INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
WHERE p.idproduto = 2
GROUP BY p.idproduto, p.nome;
```

### Calcular Custos

```sql
-- Calcular custo de um produto específico
CALL sp_calcular_custo_produto(2);

-- Recalcular todos os custos
CALL sp_recalcular_todos_custos();

-- Ver análise de custos (usando view)
SELECT * FROM vw_custo_produtos
WHERE ativo = 1
ORDER BY margem_lucro_real ASC;

-- Produtos com margem baixa (< 30%)
SELECT * FROM vw_custo_produtos
WHERE margem_lucro_real < 30
  AND ativo = 1;

-- Produtos mais rentáveis
SELECT * FROM vw_custo_produtos
WHERE ativo = 1
ORDER BY lucro_bruto DESC
LIMIT 10;
```

### Atualizar Receita

```sql
-- Alterar quantidade de ingrediente
UPDATE receita
SET quantidade = 0.050  -- Aumentar para 50g
WHERE idproduto = 2
  AND idingrediente = 9; -- Ovomaltine

-- Remover ingrediente da receita
DELETE FROM receita
WHERE idproduto = 2
  AND idingrediente = 9;

-- Substituir ingrediente
-- 1. Remover antigo
DELETE FROM receita WHERE idproduto = 2 AND idingrediente = 9;
-- 2. Adicionar novo
INSERT INTO receita (idproduto, idingrediente, quantidade)
VALUES (2, 12, 0.040); -- Kinder Bueno no lugar de Ovomaltine
```

---

## 📦 Estoque

### Cadastrar Ingrediente

```sql
-- Ingrediente completo
INSERT INTO ingrediente (
    nome, 
    unidade_medida, 
    preco_unitario,
    quantidade_estoque,
    estoque_minimo,
    fornecedor
)
VALUES (
    'Chocolate Belga',
    'kg',
    80.00,
    10.000,
    3.000,
    'Importadora Premium'
);
```

### Entrada de Estoque (Compra)

```sql
-- Registrar compra de ingrediente
INSERT INTO movimentacao_estoque (
    idingrediente,
    tipo,
    quantidade,
    valor_unitario,
    motivo,
    usuario
)
VALUES (
    5,              -- Chocolate ao Leite
    'ENTRADA',
    50.000,         -- 50 kg
    35.00,
    'Compra mensal',
    'admin'
);

-- Atualizar estoque
UPDATE ingrediente
SET quantidade_estoque = quantidade_estoque + 50.000
WHERE idingrediente = 5;
```

### Saída de Estoque (Venda)

```sql
-- Baixar estoque após venda (automático via procedure)
CALL sp_baixar_estoque_venda(1, 'admin');
-- Parâmetros: idreserva, usuario

-- Saída manual
INSERT INTO movimentacao_estoque (
    idingrediente,
    tipo,
    quantidade,
    motivo,
    usuario
)
VALUES (
    5,              -- Chocolate ao Leite
    'SAIDA',
    2.000,          -- 2 kg
    'Produção manual',
    'admin'
);

UPDATE ingrediente
SET quantidade_estoque = quantidade_estoque - 2.000
WHERE idingrediente = 5;
```

### Ajuste de Estoque

```sql
-- Ajuste (inventário, perda, etc)
INSERT INTO movimentacao_estoque (
    idingrediente,
    tipo,
    quantidade,
    motivo,
    usuario
)
VALUES (
    5,
    'AJUSTE',
    -1.500,  -- Negativo = perda, Positivo = encontrado
    'Ajuste de inventário - derramamento',
    'admin'
);

UPDATE ingrediente
SET quantidade_estoque = quantidade_estoque - 1.500
WHERE idingrediente = 5;
```

### Consultar Estoque

```sql
-- Estoque atual de todos ingredientes
SELECT 
    nome,
    quantidade_estoque,
    unidade_medida,
    estoque_minimo,
    CASE 
        WHEN quantidade_estoque = 0 THEN 'SEM ESTOQUE'
        WHEN quantidade_estoque <= estoque_minimo THEN 'CRÍTICO'
        WHEN quantidade_estoque <= (estoque_minimo * 1.5) THEN 'BAIXO'
        ELSE 'OK'
    END AS status
FROM ingrediente
WHERE ativo = 1
ORDER BY quantidade_estoque;

-- Ingredientes para comprar
SELECT * FROM vw_ingredientes_estoque_baixo;

-- Histórico de movimentações
SELECT 
    m.data_movimentacao,
    i.nome AS ingrediente,
    m.tipo,
    m.quantidade,
    m.motivo,
    m.usuario
FROM movimentacao_estoque m
INNER JOIN ingrediente i ON m.idingrediente = i.idingrediente
WHERE m.idingrediente = 5
ORDER BY m.data_movimentacao DESC;
```

### Lista de Compras

```sql
-- Ingredientes que precisam ser comprados
SELECT 
    nome,
    ROUND(quantidade_comprar, 3) AS quantidade,
    unidade_medida,
    ROUND(valor_estimado, 2) AS valor_total,
    fornecedor,
    status
FROM vw_ingredientes_estoque_baixo
ORDER BY status DESC, quantidade_estoque ASC;

-- Total a investir em compras
SELECT 
    SUM(valor_estimado) AS total_investimento
FROM vw_ingredientes_estoque_baixo;
```

---

## 📊 Relatórios

### Dashboard de Hoje

```sql
-- Resumo do dia
SELECT * FROM vw_vendas_hoje;

-- Detalhado
SELECT 
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento,
    AVG(valor_total) AS ticket_medio,
    MIN(valor_total) AS menor_venda,
    MAX(valor_total) AS maior_venda
FROM reserva
WHERE DATE(data_entrega) = CURDATE();

-- Por forma de pagamento
SELECT 
    pagamento,
    COUNT(*) AS qtd_pedidos,
    SUM(valor_total) AS total
FROM reserva
WHERE DATE(data_entrega) = CURDATE()
GROUP BY pagamento;

-- Por tipo de pedido
SELECT 
    tipo_pedido,
    COUNT(*) AS quantidade,
    SUM(valor_total) AS faturamento
FROM reserva
WHERE DATE(data_entrega) = CURDATE()
GROUP BY tipo_pedido;
```

### Vendas do Mês

```sql
-- Resumo mensal
SELECT * FROM vw_vendas_mes_atual;

-- Totais do mês
SELECT 
    COUNT(*) AS total_pedidos,
    SUM(valor_total) AS faturamento_mensal,
    AVG(valor_total) AS ticket_medio
FROM reserva
WHERE MONTH(data_entrega) = MONTH(CURDATE())
  AND YEAR(data_entrega) = YEAR(CURDATE())
  AND status != 'Cancelado';

-- Comparação com mês anterior
SELECT 
    'Mês Atual' AS periodo,
    COUNT(*) AS pedidos,
    SUM(valor_total) AS faturamento
FROM reserva
WHERE MONTH(data_entrega) = MONTH(CURDATE())
  AND YEAR(data_entrega) = YEAR(CURDATE())
  AND status != 'Cancelado'
UNION ALL
SELECT 
    'Mês Anterior',
    COUNT(*),
    SUM(valor_total)
FROM reserva
WHERE MONTH(data_entrega) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
  AND YEAR(data_entrega) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
  AND status != 'Cancelado';
```

### Produtos Mais Vendidos

```sql
-- Top 10 produtos
SELECT * FROM vw_produtos_mais_vendidos
LIMIT 10;

-- Detalhado com quantidade
SELECT 
    p.nome AS produto,
    COUNT(DISTINCT r.idreserva) AS qtd_pedidos,
    SUM(
        JSON_EXTRACT(
            JSON_EXTRACT(r.qtdReserva, CONCAT('$[', idx.n, '].quantidade')),
            '$'
        )
    ) AS qtd_vendida,
    SUM(
        JSON_EXTRACT(
            JSON_EXTRACT(r.qtdReserva, CONCAT('$[', idx.n, '].preco')),
            '$'
        ) * JSON_EXTRACT(
            JSON_EXTRACT(r.qtdReserva, CONCAT('$[', idx.n, '].quantidade')),
            '$'
        )
    ) AS receita_total
FROM produto p
CROSS JOIN (
    SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
    UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
) idx
INNER JOIN reserva r ON JSON_EXTRACT(
    JSON_EXTRACT(r.qtdReserva, CONCAT('$[', idx.n, '].id')), '$'
) = p.idproduto
WHERE r.status != 'Cancelado'
GROUP BY p.idproduto, p.nome
ORDER BY receita_total DESC
LIMIT 10;
```

### Análise de Clientes

```sql
-- Clientes mais fiéis
SELECT * FROM vw_clientes_ativos
ORDER BY total_pedidos DESC
LIMIT 10;

-- Clientes que mais gastaram
SELECT * FROM vw_clientes_ativos
ORDER BY valor_total_compras DESC
LIMIT 10;

-- Novos clientes do mês
SELECT 
    nome,
    email,
    telefone,
    data_cadastro
FROM cliente
WHERE MONTH(data_cadastro) = MONTH(CURDATE())
  AND YEAR(data_cadastro) = YEAR(CURDATE())
ORDER BY data_cadastro DESC;
```

### Análise Financeira

```sql
-- Custos indiretos do mês
SELECT 
    tipo,
    descricao,
    valor_mensal
FROM custo_indireto
WHERE mes_referencia = DATE_FORMAT(NOW(), '%Y-%m-01')
  AND ativo = 1;

-- Total de custos indiretos
SELECT 
    SUM(valor_mensal) AS total_custos_fixos
FROM custo_indireto
WHERE mes_referencia = DATE_FORMAT(NOW(), '%Y-%m-01')
  AND ativo = 1;

-- Análise de rentabilidade
SELECT 
    produto,
    preco_venda,
    custo_ingredientes,
    lucro_bruto,
    margem_lucro_real
FROM vw_custo_produtos
WHERE ativo = 1
ORDER BY lucro_bruto DESC;

-- Produtos com margem negativa ou baixa
SELECT * FROM vw_custo_produtos
WHERE margem_lucro_real < 20
  AND ativo = 1
ORDER BY margem_lucro_real ASC;
```

---

## 🔧 Manutenção

### Backup Manual

```sql
-- Exportar dados de uma tabela
SELECT * FROM produto
INTO OUTFILE '/tmp/produtos_backup.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

-- Via mysqldump (CLI)
-- mysqldump -u root -p segredodosabor > backup.sql
```

### Limpeza de Dados

```sql
-- Remover tokens expirados
DELETE FROM refresh_tokens
WHERE data_expiracao < NOW() OR revogado = TRUE;

-- Remover clientes sem pedidos (cuidado!)
DELETE c FROM cliente c
LEFT JOIN reserva r ON c.idcliente = r.idcliente_fk
WHERE r.idreserva IS NULL
  AND c.data_cadastro < DATE_SUB(NOW(), INTERVAL 1 YEAR)
  AND c.tipo = 'cliente';

-- Arquivar pedidos antigos
CREATE TABLE IF NOT EXISTS reserva_arquivo LIKE reserva;

INSERT INTO reserva_arquivo
SELECT * FROM reserva
WHERE data_entrega < DATE_SUB(NOW(), INTERVAL 6 MONTH)
  AND status IN ('Entregue', 'Cancelado');

-- Após confirmar o arquivo, deletar da tabela principal
-- DELETE FROM reserva WHERE ...
```

### Recalcular Dados

```sql
-- Recalcular todos os custos
CALL sp_recalcular_todos_custos();

-- Atualizar códigos de produtos
UPDATE produto
SET codigo_produto = CONCAT('PROD', LPAD(idproduto, 4, '0'))
WHERE codigo_produto IS NULL;

-- Gerar códigos de pedidos faltantes
UPDATE reserva
SET codigo_pedido = CONCAT('PED', DATE_FORMAT(data_entrega, '%Y%m%d'), LPAD(idreserva, 4, '0'))
WHERE codigo_pedido IS NULL;
```

### Verificar Integridade

```sql
-- Produtos sem categoria
SELECT idproduto, nome
FROM produto
WHERE idcategoria IS NULL
  AND ativo = 1;

-- Produtos sem receita
SELECT p.idproduto, p.nome
FROM produto p
LEFT JOIN receita r ON p.idproduto = r.idproduto
WHERE r.idreceita IS NULL
  AND p.ativo = 1;

-- Pedidos com JSON inválido
SELECT idreserva, codigo_pedido
FROM reserva
WHERE qtdReserva IS NULL
   OR qtdReserva = ''
   OR qtdReserva = '[]';

-- FKs quebradas (órfãos)
SELECT r.*
FROM reserva r
LEFT JOIN cliente c ON r.idcliente_fk = c.idcliente
WHERE c.idcliente IS NULL;
```

### Otimização

```sql
-- Analisar tabelas
ANALYZE TABLE produto, reserva, ingrediente, receita;

-- Otimizar tabelas (desfragmentar)
OPTIMIZE TABLE produto, reserva, ingrediente, receita;

-- Verificar integridade
CHECK TABLE produto, reserva, ingrediente, receita;

-- Reparar tabela (se necessário)
REPAIR TABLE produto;
```

### Estatísticas do Banco

```sql
-- Tamanho das tabelas
SELECT 
    TABLE_NAME,
    TABLE_ROWS AS registros,
    ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) AS tamanho_mb
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'segredodosabor'
  AND TABLE_TYPE = 'BASE TABLE'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- Crescimento de pedidos
SELECT 
    DATE_FORMAT(data_criacao, '%Y-%m') AS mes,
    COUNT(*) AS novos_pedidos
FROM reserva
GROUP BY DATE_FORMAT(data_criacao, '%Y-%m')
ORDER BY mes DESC;
```

---

## 🎓 Exemplos Avançados

### Calcular Produtos que Podem Ser Produzidos

```sql
-- Quantos produtos podem ser feitos com estoque atual
SELECT 
    p.idproduto,
    p.nome,
    p.quantidade AS estoque_atual,
    FLOOR(MIN(i.quantidade_estoque / r.quantidade)) AS pode_produzir
FROM produto p
INNER JOIN receita r ON p.idproduto = r.idproduto
INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
WHERE p.ativo = 1
  AND i.ativo = 1
GROUP BY p.idproduto, p.nome, p.quantidade
ORDER BY pode_produzir ASC;
```

### Sugestão de Preço Baseada em Margem

```sql
-- Sugerir preço com margem de 50%
SELECT 
    idproduto,
    produto,
    custo_ingredientes,
    preco_venda AS preco_atual,
    ROUND(custo_ingredientes * 1.5, 2) AS preco_sugerido_50pct,
    ROUND(custo_ingredientes * 2.0, 2) AS preco_sugerido_100pct
FROM vw_custo_produtos
WHERE ativo = 1
ORDER BY produto;
```

### Projeção de Vendas

```sql
-- Média de vendas dos últimos 30 dias
WITH vendas_recentes AS (
    SELECT 
        DATE(data_entrega) AS data,
        COUNT(*) AS pedidos,
        SUM(valor_total) AS faturamento
    FROM reserva
    WHERE data_entrega >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      AND status != 'Cancelado'
    GROUP BY DATE(data_entrega)
)
SELECT 
    AVG(pedidos) AS media_pedidos_dia,
    AVG(faturamento) AS media_faturamento_dia,
    AVG(pedidos) * 30 AS projecao_pedidos_mes,
    AVG(faturamento) * 30 AS projecao_faturamento_mes
FROM vendas_recentes;
```

### Análise ABC de Produtos

```sql
-- Curva ABC: quais produtos geram mais receita
WITH vendas_produto AS (
    SELECT 
        p.idproduto,
        p.nome,
        COUNT(DISTINCT r.idreserva) AS qtd_vendas,
        SUM(JSON_LENGTH(r.qtdReserva)) AS itens_vendidos,
        -- Aproximação da receita por produto
        COUNT(DISTINCT r.idreserva) * p.preco AS receita_aprox
    FROM produto p
    INNER JOIN reserva r ON JSON_CONTAINS(
        r.qtdReserva, 
        JSON_OBJECT('id', p.idproduto), 
        '$'
    )
    WHERE r.status != 'Cancelado'
    GROUP BY p.idproduto, p.nome, p.preco
),
total_vendas AS (
    SELECT SUM(receita_aprox) AS total FROM vendas_produto
)
SELECT 
    v.*,
    ROUND((receita_aprox / t.total * 100), 2) AS percentual_receita,
    CASE 
        WHEN receita_aprox / t.total >= 0.80 THEN 'A - Alto Valor'
        WHEN receita_aprox / t.total >= 0.15 THEN 'B - Médio Valor'
        ELSE 'C - Baixo Valor'
    END AS classificacao_abc
FROM vendas_produto v
CROSS JOIN total_vendas t
ORDER BY receita_aprox DESC;
```

---

## 📝 Notas Importantes

### Boas Práticas

1. **Sempre use prepared statements** no código da aplicação
2. **Não delete dados** sem backup recente
3. **Teste queries complexas** em ambiente de desenvolvimento primeiro
4. **Use transações** para operações críticas
5. **Mantenha índices atualizados** com ANALYZE TABLE
6. **Faça backup regular** do banco

### Performance

- Views são recalculadas a cada query (considere cache na aplicação)
- JSON queries são mais lentas que tabelas relacionais
- Use LIMIT em queries de teste
- Evite SELECT * em produção
- Índices ajudam em WHERE e JOIN

### Segurança

- Nunca exponha senhas em logs
- Valide todos os inputs do usuário
- Use permissões específicas por usuário do banco
- Mantenha backups criptografados
- Monitore queries suspeitas

---

**Última atualização**: 13 de Outubro de 2025  
**Versão**: 4.0 - DoceGest MVP

Para mais informações, consulte:
- `DOCUMENTACAO_BANCO_DADOS.md`
- `DIAGRAMA_ER.md`
- `BANCO_DADOS_COMPLETO.sql`
