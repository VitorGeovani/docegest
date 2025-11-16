# 📚 Documentação Completa do Banco de Dados
## Sistema Segredo do Sabor - DoceGest MVP v4.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Módulos do Sistema](#módulos-do-sistema)
4. [Tabelas Detalhadas](#tabelas-detalhadas)
5. [Relacionamentos](#relacionamentos)
6. [Views](#views)
7. [Stored Procedures](#stored-procedures)
8. [Triggers](#triggers)
9. [Índices e Performance](#índices-e-performance)
10. [Segurança](#segurança)
11. [Instalação](#instalação)
12. [Manutenção](#manutenção)

---

## 🎯 Visão Geral

O sistema **Segredo do Sabor** é uma plataforma completa para gestão de confeitaria que integra:

- **E-commerce**: Catálogo de produtos, carrinho de compras, checkout
- **Gestão Operacional**: Controle de estoque, pedidos, produção
- **Gestão Financeira**: Custos, precificação, margens de lucro
- **Autenticação**: Sistema JWT para clientes e administradores
- **Comunicação**: Integração com WhatsApp para notificações

### Tecnologias
- **Banco de Dados**: MySQL 8.0+
- **Charset**: UTF8MB4 (suporte completo a emojis e caracteres especiais)
- **Engine**: InnoDB (transações ACID, foreign keys)
- **Backend**: Node.js + Express
- **Frontend**: React

---

## 🏗️ Arquitetura

### Diagrama de Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                    SEGREDO DO SABOR                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  CLIENTES &  │  │   CATÁLOGO   │  │   PEDIDOS    │      │
│  │    AUTH      │  │  & PRODUTOS  │  │  & RESERVAS  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ INGREDIENTES │  │   RECEITAS   │  │  MOVIMENTAÇÃO│      │
│  │  & ESTOQUE   │  │   (BOM)      │  │   ESTOQUE    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    CUSTOS    │  │ CONFIGURAÇÕES│  │  RELATÓRIOS  │      │
│  │  INDIRETOS   │  │    SISTEMA   │  │   & VIEWS    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados Principal

```
1. CLIENTE realiza CADASTRO → autenticação JWT
2. CLIENTE navega no CATÁLOGO → produtos ativos com estoque
3. CLIENTE adiciona ao CARRINHO → validação de estoque
4. CLIENTE finaliza PEDIDO → cria RESERVA
5. SISTEMA baixa ESTOQUE → movimenta ingredientes
6. SISTEMA envia NOTIFICAÇÃO → WhatsApp
7. ADMIN acompanha PEDIDO → atualiza status
8. SISTEMA gera RELATÓRIOS → análises e métricas
```

---

## 📦 Módulos do Sistema

### 1️⃣ MÓDULO DE CLIENTES E AUTENTICAÇÃO

**Objetivo**: Gerenciar usuários, autenticação e autorização

**Tabelas**:
- `cliente`: Dados dos usuários
- `refresh_tokens`: Tokens JWT para renovação

**Funcionalidades**:
- ✅ Cadastro de clientes
- ✅ Login com email e senha (bcrypt)
- ✅ JWT com access token e refresh token
- ✅ Recuperação de senha
- ✅ Perfis: cliente e admin
- ✅ Controle de sessões

---

### 2️⃣ MÓDULO DE CATÁLOGO

**Objetivo**: Gerenciar produtos e categorias para venda

**Tabelas**:
- `categoria`: Organização de produtos
- `produto`: Produtos disponíveis para venda

**Funcionalidades**:
- ✅ Cadastro de produtos
- ✅ Categorização
- ✅ Controle de estoque de produtos finais
- ✅ Precificação
- ✅ Imagens de produtos
- ✅ Status ativo/inativo

---

### 3️⃣ MÓDULO DE PEDIDOS

**Objetivo**: Gerenciar pedidos e reservas dos clientes

**Tabelas**:
- `reserva`: Pedidos realizados

**Funcionalidades**:
- ✅ Carrinho de compras
- ✅ Checkout
- ✅ Múltiplas formas de pagamento
- ✅ Entrega e retirada
- ✅ Rastreamento de status
- ✅ Código único de pedido
- ✅ Histórico de pedidos
- ✅ Notificações WhatsApp

---

### 4️⃣ MÓDULO DE INGREDIENTES E RECEITAS

**Objetivo**: Controlar matéria-prima e composição dos produtos

**Tabelas**:
- `ingrediente`: Matérias-primas
- `receita`: Composição dos produtos (BOM - Bill of Materials)
- `movimentacao_estoque`: Histórico de movimentações

**Funcionalidades**:
- ✅ Cadastro de ingredientes
- ✅ Controle de estoque de ingredientes
- ✅ Receitas (BOM) por produto
- ✅ Cálculo automático de custos
- ✅ Alertas de estoque baixo
- ✅ Rastreabilidade de movimentações
- ✅ Baixa automática ao vender

---

### 5️⃣ MÓDULO FINANCEIRO

**Objetivo**: Controlar custos e precificação

**Tabelas**:
- `custo_indireto`: Custos fixos mensais

**Funcionalidades**:
- ✅ Registro de custos indiretos
- ✅ Cálculo de margens de lucro
- ✅ Análise de rentabilidade por produto
- ✅ Sugestão de preços

---

### 6️⃣ MÓDULO DE CONFIGURAÇÕES

**Objetivo**: Parametrizar o sistema

**Tabelas**:
- `configuracao`: Parâmetros do sistema

**Funcionalidades**:
- ✅ Configurações gerais
- ✅ Formas de pagamento
- ✅ Taxas e margens
- ✅ Contatos (WhatsApp, email)

---

## 📊 Tabelas Detalhadas

### 👥 cliente

Armazena informações dos usuários do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idcliente` | INT (PK) | Identificador único |
| `nome` | VARCHAR(100) | Nome completo |
| `email` | VARCHAR(100) | Email único para login |
| `telefone` | VARCHAR(20) | Telefone de contato |
| `senha` | VARCHAR(255) | Hash bcrypt da senha |
| `email_verificado` | BOOLEAN | Se o email foi verificado |
| `token_recuperacao` | VARCHAR(255) | Token para recuperação de senha |
| `data_token_recuperacao` | DATETIME | Validade do token |
| `tipo` | ENUM | 'cliente' ou 'admin' |
| `data_cadastro` | DATETIME | Data de registro |
| `ultimo_acesso` | DATETIME | Último login |

**Índices**:
- `idx_cliente_email`: Busca por email
- `idx_cliente_tipo`: Filtro por tipo de usuário

**Exemplo**:
```sql
INSERT INTO cliente (nome, email, telefone, senha, tipo)
VALUES ('João Silva', 'joao@email.com', '11987654321', '$2b$10$...', 'cliente');
```

---

### 🔐 refresh_tokens

Gerencia tokens de atualização JWT.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idtoken` | INT (PK) | Identificador único |
| `idcliente_fk` | INT (FK) | Referência ao cliente |
| `token` | VARCHAR(500) | Token JWT de refresh |
| `data_criacao` | DATETIME | Quando foi criado |
| `data_expiracao` | DATETIME | Quando expira |
| `revogado` | BOOLEAN | Se foi revogado |

**Relacionamentos**:
- `idcliente_fk` → `cliente.idcliente` (CASCADE)

---

### 📂 categoria

Categorias para organização dos produtos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idcategoria` | INT (PK) | Identificador único |
| `nome` | VARCHAR(50) | Nome da categoria |
| `descricao` | VARCHAR(200) | Descrição |
| `ativo` | TINYINT | 1=ativo, 0=inativo |
| `data_cadastro` | DATETIME | Data de criação |

**Exemplo**:
```sql
INSERT INTO categoria (nome, descricao)
VALUES ('Cones Recheados', 'Cones com brigadeiro e coberturas especiais');
```

---

### 🍰 produto

Produtos disponíveis no catálogo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idproduto` | INT (PK) | Identificador único |
| `nome` | VARCHAR(100) | Nome do produto |
| `descricao` | TEXT | Descrição detalhada |
| `preco` | DECIMAL(10,2) | Preço de venda |
| `quantidade` | INT | Estoque disponível |
| `img_Produto` | VARCHAR(255) | Caminho da imagem |
| `ativo` | TINYINT | 1=ativo, 0=inativo |
| `idcategoria` | INT (FK) | Categoria do produto |
| `codigo_produto` | VARCHAR(20) | Código único (ex: PROD0001) |
| `custo_producao` | DECIMAL(10,2) | Custo calculado |
| `margem_lucro` | DECIMAL(5,2) | % de margem |
| `tempo_preparo` | INT | Tempo em minutos |

**Relacionamentos**:
- `idcategoria` → `categoria.idcategoria`

**Índices**:
- `idx_produto_categoria`: Busca por categoria
- `idx_produto_ativo`: Filtro de ativos
- `idx_produto_codigo`: Busca por código

---

### 🛒 reserva

Pedidos e reservas dos clientes.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idreserva` | INT (PK) | Identificador único |
| `idcliente_fk` | INT (FK) | Cliente que fez o pedido |
| `data_entrega` | DATE | Data de entrega/retirada |
| `hora_entrega` | TIME | Hora de entrega/retirada |
| `valor_total` | DECIMAL(10,2) | Valor total do pedido |
| `pagamento` | VARCHAR(50) | Forma de pagamento |
| `status` | VARCHAR(20) | Status do pedido |
| `qtdReserva` | JSON | Produtos do pedido |
| `status_pagamento` | ENUM | pendente/confirmado/cancelado |
| `status_pedido` | ENUM | Fluxo do pedido |
| `codigo_pedido` | VARCHAR(20) | Código único (PED20251013001) |
| `tipo_pedido` | VARCHAR(20) | RETIRADA ou ENTREGA |
| `endereco_entrega` | TEXT | Endereço (se entrega) |
| `taxa_entrega` | DECIMAL(10,2) | Taxa de entrega |
| `observacoes` | TEXT | Observações do cliente |
| `troco_para` | DECIMAL(10,2) | Valor para troco |
| `whatsapp_notificado` | BOOLEAN | Se foi notificado |
| `data_notificacao` | DATETIME | Quando foi notificado |

**Formato JSON de qtdReserva**:
```json
[
  {
    "id": 1,
    "nome": "Cone Ovomaltine",
    "quantidade": 2,
    "preco": 12.50
  },
  {
    "id": 3,
    "nome": "Cone Kinder Bueno",
    "quantidade": 1,
    "preco": 15.00
  }
]
```

**Status do Pedido (fluxo)**:
1. `pendente` - Pedido criado
2. `confirmado` - Pagamento confirmado
3. `preparando` - Em produção
4. `pronto` - Pronto para retirada/entrega
5. `entregue` - Finalizado
6. `cancelado` - Cancelado

---

### 🥚 ingrediente

Matérias-primas para produção.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idingrediente` | INT (PK) | Identificador único |
| `nome` | VARCHAR(100) | Nome do ingrediente |
| `unidade_medida` | VARCHAR(20) | kg, g, L, ml, unidade |
| `preco_unitario` | DECIMAL(10,2) | Preço por unidade |
| `quantidade_estoque` | DECIMAL(10,3) | Estoque atual |
| `estoque_minimo` | DECIMAL(10,3) | Estoque mínimo |
| `fornecedor` | VARCHAR(100) | Nome do fornecedor |
| `ativo` | TINYINT | 1=ativo, 0=inativo |

**Exemplo**:
```sql
INSERT INTO ingrediente (nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo)
VALUES ('Chocolate ao Leite', 'kg', 35.00, 20.000, 5.000);
```

---

### 📝 receita

Receitas dos produtos (BOM - Bill of Materials).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idreceita` | INT (PK) | Identificador único |
| `idproduto` | INT (FK) | Produto |
| `idingrediente` | INT (FK) | Ingrediente |
| `quantidade` | DECIMAL(10,3) | Quantidade por unidade |

**Relacionamentos**:
- `idproduto` → `produto.idproduto` (CASCADE)
- `idingrediente` → `ingrediente.idingrediente` (RESTRICT)

**Exemplo - Cone Ovomaltine**:
```sql
-- Receita para 1 unidade de Cone Ovomaltine
INSERT INTO receita (idproduto, idingrediente, quantidade) VALUES
(2, 6, 0.030),  -- 30g Chocolate Meio Amargo
(2, 9, 0.040),  -- 40g Ovomaltine
(2, 1, 0.030),  -- 30g Leite Condensado
(2, 21, 1.000), -- 1 Cone
(2, 22, 1.000); -- 1 Embalagem
```

**Cálculo de Custo**:
```
Custo = Σ(quantidade × preco_unitario do ingrediente)
Custo = (0.030×38) + (0.040×30) + (0.030×8.50) + (1×0.50) + (1×0.30)
Custo = 1.14 + 1.20 + 0.26 + 0.50 + 0.30 = 3.40
```

---

### 📦 movimentacao_estoque

Histórico de movimentações de ingredientes.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idmovimentacao` | INT (PK) | Identificador único |
| `idingrediente` | INT (FK) | Ingrediente movimentado |
| `tipo` | VARCHAR(20) | ENTRADA, SAIDA, AJUSTE |
| `quantidade` | DECIMAL(10,3) | Quantidade movimentada |
| `valor_unitario` | DECIMAL(10,2) | Valor unitário |
| `motivo` | VARCHAR(200) | Motivo da movimentação |
| `idreserva` | INT (FK) | Reserva (se saída) |
| `data_movimentacao` | DATETIME | Data/hora |
| `usuario` | VARCHAR(100) | Quem fez |

**Tipos de Movimentação**:
- `ENTRADA`: Compra de ingredientes
- `SAIDA`: Uso na produção/venda
- `AJUSTE`: Correção de estoque

---

### 💰 custo_indireto

Custos fixos mensais da operação.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idcusto` | INT (PK) | Identificador único |
| `tipo` | VARCHAR(50) | Tipo de custo |
| `descricao` | VARCHAR(200) | Descrição |
| `valor_mensal` | DECIMAL(10,2) | Valor mensal |
| `mes_referencia` | DATE | Mês de referência |
| `ativo` | TINYINT | 1=ativo, 0=inativo |

**Exemplos de Tipos**:
- Energia Elétrica
- Água
- Gás
- Internet
- Material de Limpeza
- Embalagens
- Aluguel

---

### ⚙️ configuracao

Configurações do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idconfig` | INT (PK) | Identificador único |
| `chave` | VARCHAR(100) | Chave única |
| `valor` | TEXT | Valor da configuração |
| `descricao` | VARCHAR(200) | Descrição |
| `tipo` | VARCHAR(20) | string, number, boolean, json |

**Configurações Principais**:
```sql
-- Financeiro
margem_lucro_padrao: 40 (%)
taxa_desperdicio: 5 (%)
valor_entrega: 8.00 (R$)

-- Operacional
tempo_preparo_padrao: 30 (minutos)

-- Pagamentos
aceita_pix: true
aceita_cartao: true
chave_pix: email@exemplo.com

-- Contato
telefone_whatsapp: 5511999999999
```

---

## 🔗 Relacionamentos

### Diagrama ER Simplificado

```
┌──────────┐         ┌──────────────┐
│ cliente  │────┬───▶│ reserva      │
└──────────┘    │    └──────────────┘
                │
                │    ┌──────────────┐
                └───▶│refresh_tokens│
                     └──────────────┘

┌───────────┐        ┌──────────┐
│ categoria │───────▶│ produto  │◀────┐
└───────────┘        └──────────┘     │
                          │            │
                          ▼            │
                     ┌──────────┐     │
                     │ receita  │─────┤
                     └──────────┘     │
                          │            │
                          ▼            │
                     ┌─────────────┐  │
                     │ ingrediente │──┘
                     └─────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │ movimentacao_estoque │
                └──────────────────────┘
```

### Cardinalidade

- **cliente → reserva**: 1:N (um cliente pode ter várias reservas)
- **cliente → refresh_tokens**: 1:N (um cliente pode ter vários tokens)
- **categoria → produto**: 1:N (uma categoria tem vários produtos)
- **produto → receita**: 1:N (um produto tem vários ingredientes)
- **ingrediente → receita**: 1:N (um ingrediente está em várias receitas)
- **ingrediente → movimentacao_estoque**: 1:N (um ingrediente tem várias movimentações)
- **reserva → movimentacao_estoque**: 1:N (uma reserva pode gerar várias movimentações)

---

## 📊 Views

### vw_custo_produtos

Análise completa de custos e margens dos produtos.

```sql
SELECT * FROM vw_custo_produtos
WHERE ativo = 1
ORDER BY margem_lucro_real DESC;
```

**Colunas**:
- `idproduto`, `produto`, `codigo_produto`, `categoria`
- `preco_venda`: Preço de venda atual
- `custo_ingredientes`: Custo calculado pela receita
- `custo_cadastrado`: Custo registrado
- `lucro_bruto`: Diferença entre preço e custo
- `margem_lucro_real`: % de lucro real
- `estoque_atual`: Quantidade em estoque
- `ativo`: Status do produto

---

### vw_produtos_estoque_baixo

Produtos que precisam de produção.

```sql
SELECT * FROM vw_produtos_estoque_baixo;
```

**Status**:
- `SEM ESTOQUE`: quantidade = 0
- `ESTOQUE CRÍTICO`: quantidade ≤ 5
- `ESTOQUE BAIXO`: quantidade ≤ 10

---

### vw_ingredientes_estoque_baixo

Ingredientes para comprar.

```sql
SELECT * FROM vw_ingredientes_estoque_baixo
ORDER BY quantidade_estoque ASC;
```

**Retorna**:
- Lista de ingredientes com estoque baixo
- Quantidade sugerida para compra
- Valor estimado da compra

---

### vw_vendas_hoje

Dashboard de vendas do dia.

```sql
SELECT * FROM vw_vendas_hoje;
```

**Métricas**:
- Total de pedidos
- Faturamento total
- Ticket médio
- Pedidos por status
- Entregas vs retiradas

---

### vw_vendas_mes_atual

Vendas diárias do mês.

```sql
SELECT * FROM vw_vendas_mes_atual
ORDER BY data_venda DESC;
```

---

### vw_produtos_mais_vendidos

Ranking dos produtos.

```sql
SELECT * FROM vw_produtos_mais_vendidos
LIMIT 10;
```

---

### vw_clientes_ativos

Clientes com histórico de compras.

```sql
SELECT * FROM vw_clientes_ativos
WHERE total_pedidos > 5
ORDER BY valor_total_compras DESC;
```

---

## ⚙️ Stored Procedures

### sp_calcular_custo_produto

Calcula o custo de um produto específico.

```sql
CALL sp_calcular_custo_produto(2);
-- Retorna: custo calculado baseado na receita
```

**Lógica**:
1. Soma (quantidade × preço_unitário) de todos ingredientes da receita
2. Atualiza campo `custo_producao` do produto
3. Retorna o custo calculado

---

### sp_recalcular_todos_custos

Recalcula custos de todos os produtos.

```sql
CALL sp_recalcular_todos_custos();
-- Retorna: quantidade de produtos atualizados
```

**Uso**: Executar após alterar preços de ingredientes.

---

### sp_baixar_estoque_venda

Baixa estoque de ingredientes após uma venda.

```sql
CALL sp_baixar_estoque_venda(123, 'admin');
-- Parâmetros: idreserva, usuario
```

**Processo**:
1. Lê produtos da reserva (JSON)
2. Para cada produto, busca receita
3. Registra movimentação de cada ingrediente (SAIDA)
4. Atualiza estoque de ingredientes
5. Atualiza estoque de produtos

---

### sp_adicionar_receita

Adiciona ingrediente à receita e recalcula custo.

```sql
CALL sp_adicionar_receita(2, 5, 0.030);
-- Parâmetros: idproduto, idingrediente, quantidade
```

---

### sp_gerar_codigo_pedido

Gera código único para pedido.

```sql
CALL sp_gerar_codigo_pedido();
-- Retorna: PED20251013001 (PED + YYYYMMDD + sequencial)
```

---

## 🔄 Triggers

### tr_receita_after_insert/update/delete

Recalcula automaticamente o custo do produto quando a receita é alterada.

```sql
-- Ao adicionar ingrediente na receita
INSERT INTO receita (idproduto, idingrediente, quantidade)
VALUES (2, 5, 0.030);
-- Trigger executa: CALL sp_calcular_custo_produto(2)
```

---

### tr_ingrediente_after_update

Recalcula custos dos produtos quando preço de ingrediente muda.

```sql
-- Ao alterar preço do chocolate
UPDATE ingrediente SET preco_unitario = 40.00 WHERE idingrediente = 5;
-- Trigger recalcula custos de todos produtos que usam chocolate
```

---

### tr_reserva_before_insert

Gera código automático para novos pedidos.

```sql
-- Ao criar reserva sem código
INSERT INTO reserva (idcliente_fk, data_entrega, ...)
VALUES (1, '2025-10-15', ...);
-- Trigger gera: codigo_pedido = 'PED20251013001'
```

---

## 🚀 Índices e Performance

### Índices Criados

**cliente**:
- `idx_cliente_email` (email) - Login
- `idx_cliente_tipo` (tipo) - Filtro admin/cliente

**reserva**:
- `idx_reserva_status` (status) - Dashboard
- `idx_reserva_data` (data_entrega) - Relatórios
- `idx_reserva_cliente` (idcliente_fk) - Histórico
- `idx_reserva_codigo` (codigo_pedido) - Rastreamento

**produto**:
- `idx_produto_categoria` (idcategoria) - Catálogo
- `idx_produto_ativo` (ativo) - Filtro
- `idx_produto_codigo` (codigo_produto) - Busca

**ingrediente**:
- `idx_ingrediente_ativo` (ativo) - Filtro

**movimentacao_estoque**:
- `idx_movimentacao_data` (data_movimentacao) - Relatórios
- `idx_movimentacao_tipo` (tipo) - Filtro

### Dicas de Performance

1. **Use as views** para consultas complexas
2. **Evite SELECT *** - especifique apenas colunas necessárias
3. **Use índices** em WHERE e JOIN
4. **Limite resultados** com LIMIT
5. **Cache queries** frequentes no backend

---

## 🔐 Segurança

### Autenticação

- **Senhas**: Hash bcrypt com salt (custo 10)
- **Tokens**: JWT com expiração
- **Refresh Tokens**: Armazenados no banco, podem ser revogados

### Integridade de Dados

- **Foreign Keys**: Garantem relacionamentos válidos
- **Constraints**: UNIQUE, NOT NULL
- **Transações**: Operações críticas em blocos ACID
- **Triggers**: Validações automáticas

### Proteção contra SQL Injection

- **Prepared Statements**: Todas as queries do backend usam
- **Validação**: Dados validados antes de inserção
- **Sanitização**: Remoção de caracteres perigosos

### Boas Práticas

```javascript
// ✅ CORRETO - Prepared Statement
const [rows] = await connection.query(
  'SELECT * FROM produto WHERE idproduto = ?',
  [id]
);

// ❌ ERRADO - Concatenação
const query = `SELECT * FROM produto WHERE idproduto = ${id}`;
```

---

## 📥 Instalação

### Pré-requisitos

- MySQL 8.0 ou superior
- Cliente MySQL (Workbench, phpMyAdmin, ou CLI)

### Passo a Passo

1. **Criar o banco de dados**:
```bash
# Via CLI
mysql -u root -p < BANCO_DADOS_COMPLETO.sql

# Ou via Workbench
# File → Open SQL Script → Execute
```

2. **Verificar instalação**:
```sql
USE segredodosabor;
SHOW TABLES;
-- Deve listar 10 tabelas

SHOW PROCEDURE STATUS WHERE Db = 'segredodosabor';
-- Deve listar 5 procedures

SELECT TABLE_NAME FROM information_schema.VIEWS 
WHERE TABLE_SCHEMA = 'segredodosabor';
-- Deve listar 6 views
```

3. **Configurar backend**:
```bash
# Criar arquivo .env
DB_HOST=localhost
DB_DATABASE=segredodosabor
DB_USER=root
DB_PASSWORD=sua_senha
JWT_SECRET=seu_secret_key
```

4. **Testar conexão**:
```bash
cd backend
npm install
npm run dev
# Backend deve conectar ao banco
```

---

## 🔧 Manutenção

### Backup do Banco

```bash
# Backup completo
mysqldump -u root -p segredodosabor > backup_$(date +%Y%m%d).sql

# Backup apenas estrutura
mysqldump -u root -p --no-data segredodosabor > estrutura.sql

# Backup apenas dados
mysqldump -u root -p --no-create-info segredodosabor > dados.sql
```

### Restauração

```bash
mysql -u root -p segredodosabor < backup_20251013.sql
```

### Limpeza de Dados Antigos

```sql
-- Remover tokens expirados (executar periodicamente)
DELETE FROM refresh_tokens 
WHERE data_expiracao < NOW() OR revogado = TRUE;

-- Arquivar pedidos antigos (opcional)
-- Criar tabela de arquivo primeiro
CREATE TABLE reserva_arquivo LIKE reserva;

-- Mover pedidos de 6+ meses
INSERT INTO reserva_arquivo
SELECT * FROM reserva 
WHERE data_entrega < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Remover da tabela principal
DELETE FROM reserva 
WHERE data_entrega < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

### Recalcular Custos

```sql
-- Após atualizar preços de ingredientes
CALL sp_recalcular_todos_custos();

-- Verificar produtos sem receita
SELECT p.idproduto, p.nome, p.custo_producao
FROM produto p
LEFT JOIN receita r ON p.idproduto = r.idproduto
WHERE r.idreceita IS NULL AND p.ativo = 1;
```

### Monitoramento

```sql
-- Produtos sem estoque
SELECT * FROM vw_produtos_estoque_baixo;

-- Ingredientes para comprar
SELECT * FROM vw_ingredientes_estoque_baixo;

-- Vendas do dia
SELECT * FROM vw_vendas_hoje;

-- Pedidos pendentes
SELECT COUNT(*) FROM reserva 
WHERE status IN ('Pendente', 'Confirmado', 'Preparando');
```

### Otimização

```sql
-- Analisar tabelas
ANALYZE TABLE produto, reserva, ingrediente;

-- Otimizar tabelas
OPTIMIZE TABLE produto, reserva, ingrediente;

-- Verificar índices não utilizados
SELECT * FROM sys.schema_unused_indexes 
WHERE object_schema = 'segredodosabor';
```

---

## 📞 Suporte

### Documentos Relacionados

- `API_DOCUMENTATION.md` - Endpoints da API
- `README.md` - Guia geral do projeto
- `SCRIPTS_MANUTENCAO.md` - Scripts úteis
- `BANCO_DADOS_COMPLETO.sql` - Script de criação

### Logs de Erros Comuns

**Erro: Foreign key constraint fails**
```
Causa: Tentativa de inserir registro com FK inexistente
Solução: Verificar se registro referenciado existe
```

**Erro: Duplicate entry for key 'email'**
```
Causa: Email já cadastrado
Solução: Usar email diferente ou fazer login
```

**Erro: Data truncated for column 'status'**
```
Causa: Valor inválido para ENUM
Solução: Usar apenas valores permitidos
```

---

## 📈 Estatísticas do Banco

### Tamanho Aproximado

- **Tabelas**: 10
- **Views**: 6
- **Procedures**: 5
- **Triggers**: 5
- **Índices**: ~20

### Capacidade

- **Clientes**: Até 4 bilhões (INT)
- **Produtos**: Até 4 bilhões (INT)
- **Pedidos**: Até 4 bilhões (INT)
- **Ingredientes**: Até 4 bilhões (INT)

### Performance Esperada

- **Consulta de produto**: < 10ms
- **Listagem de catálogo**: < 50ms
- **Criação de pedido**: < 100ms
- **Cálculo de custo**: < 50ms
- **Dashboard vendas**: < 200ms

---

## 🎓 Conceitos Técnicos

### BOM (Bill of Materials)

Sistema que define quais ingredientes e quantidades são necessários para produzir cada produto. Essencial para:
- Cálculo automático de custos
- Controle de estoque
- Planejamento de compras

### ACID (Transações)

- **Atomicity**: Tudo ou nada
- **Consistency**: Dados sempre válidos
- **Isolation**: Transações independentes
- **Durability**: Dados persistidos

### Normalização

O banco está na **3ª Forma Normal (3FN)**:
- Sem duplicação de dados
- Dependências funcionais corretas
- Integridade referencial

---

## 🚀 Próximos Passos

### Melhorias Futuras

- [ ] Tabela de histórico de preços
- [ ] Sistema de promoções/cupons
- [ ] Programa de fidelidade
- [ ] Múltiplos endereços por cliente
- [ ] Avaliações de produtos
- [ ] Sistema de notificações interno
- [ ] Integração com nota fiscal
- [ ] Relatórios avançados (BI)

---

## 📄 Licença

Este banco de dados faz parte do projeto **Segredo do Sabor**.  
© 2025 - Todos os direitos reservados.

---

**Última atualização**: 13 de Outubro de 2025  
**Versão**: 4.0 - DoceGest MVP
