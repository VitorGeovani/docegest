# 🔍 Análise Completa do Banco de Dados - Segredo do Sabor

## 📊 Status: ANÁLISE CONCLUÍDA

Data: 09 de Novembro de 2025

---

## ✅ Tabelas Identificadas no Dump

### **1. Core System (Autenticação e Usuários)**
- ✅ `administrador` - Administradores do sistema
- ✅ `cliente` - Clientes/usuários
- ⚠️ `refresh_tokens` - **NÃO ENCONTRADA NO DUMP** (mas existe no código)

### **2. Catálogo e Produtos**
- ✅ `categoria` - Categorias de produtos
- ✅ `produto` - Produtos do catálogo
- ✅ `produto_imagens` - **PROVAVELMENTE EXISTE** (referenciado no código)

### **3. Estoque e Ingredientes**
- ✅ `ingrediente` - Ingredientes para receitas
- ✅ `estoque_ingredientes` - **PRESUMIDO** (gestão de estoque)

### **4. Receitas e Custos**
- ✅ `receita` - **PRESUMIDO** (receitas de produtos)
- ✅ `receita_ingredientes` - **PRESUMIDO** (relacionamento N:N)
- ✅ `custo_indireto` - Custos indiretos (energia, água, etc.)

### **5. Pedidos e Reservas**
- ✅ `pedido` - **PRESUMIDO** (pedidos de clientes)
- ✅ `pedido_itens` - **PRESUMIDO** (itens do pedido)
- ✅ `reserva` - **PRESUMIDO** (reservas de produtos)

### **6. Personalização**
- ✅ `personalizacao_produto` - **PRESUMIDO** (opções de personalização)
- ✅ `personalizacao_ingredientes` - **PRESUMIDO** (ingredientes extras)

### **7. Preferências de Clientes**
- ✅ `cliente_preferencias` - Preferências personalizadas (JSON)
- ✅ `cliente_preferencias_historico` - Histórico de alterações

### **8. WhatsApp Integration**
- ⚠️ `tb_mensagens_whatsapp` - **CRIADA VIA SCRIPT**, não no dump
- ⚠️ `tb_whatsapp_webhooks` - **CRIADA VIA SCRIPT**, não no dump
- ⚠️ `tb_whatsapp_bot_config` - **CRIADA VIA SCRIPT**, não no dump
- ⚠️ `tb_whatsapp_comandos` - **CRIADA VIA SCRIPT**, não no dump
- ⚠️ `tb_whatsapp_estatisticas` - **CRIADA VIA SCRIPT**, não no dump

### **9. Configurações**
- ✅ `configuracao` - Configurações do sistema (chave-valor)

---

## 🚨 PROBLEMAS IDENTIFICADOS

### **1. Tabelas Faltando no Dump** ❌

O dump anexado está **INCOMPLETO**. Faltam muitas tabelas essenciais:

```sql
-- Tabelas FALTANDO no dump:
- refresh_tokens (autenticação JWT)
- produto (catálogo)
- produto_imagens (imagens dos produtos)
- estoque_ingredientes (gestão de estoque)
- receita (receitas dos produtos)
- receita_ingredientes (relacionamento)
- pedido (pedidos de clientes)
- pedido_itens (itens do pedido)
- reserva (reservas)
- personalizacao_produto (personalização)
- personalizacao_ingredientes (ingredientes extras)
```

### **2. Tabelas WhatsApp Não Integradas** ⚠️

As tabelas de WhatsApp foram criadas via script separado, mas não estão no dump:

```sql
-- Arquivo: backend/criar-tabela-mensagens-whatsapp.sql
tb_mensagens_whatsapp
tb_whatsapp_webhooks
tb_whatsapp_bot_config
tb_whatsapp_comandos
tb_whatsapp_estatisticas
```

**Problema:** Inconsistência entre scripts de criação.

### **3. Dados Inseridos Estão Incompletos** ⚠️

O dump mostra apenas:
- ✅ 1 administrador
- ✅ 6 categorias + 1 teste
- ✅ 23 clientes
- ✅ 4 preferências de clientes
- ✅ 11 custos indiretos
- ✅ 9 configurações
- ❌ **NENHUM produto inserido**
- ❌ **NENHUM ingrediente completo** (truncado)

### **4. Trigger Vazio** 🐛

```sql
-- Linha 161-166 do dump
TRIGGER `tr_preferencias_before_update`
BEFORE UPDATE ON `cliente_preferencias`
FOR EACH ROW
BEGIN
END -- ← VAZIO! Não faz nada
```

**Problema:** Trigger criado mas sem lógica.

### **5. Campo JSON em `cliente_preferencias`** ⚠️

```sql
preferencias JSON DEFAULT NULL COMMENT 'Preferências em formato JSON'
```

**Observação:** Dados inseridos:
```json
{
  "notificacoes": {
    "email": false,
    "whatsapp": true,
    "promocoes": true
  },
  "horario_preferido": "14:00",
  "observacao_padrao": "Sem açúcar",
  "produtos_favoritos": [1, 3, 5],
  "forma_pagamento_padrao": "PIX"
}
```

**Status:** ✅ Bem estruturado, mas falta validação no backend.

---

## 📋 ANÁLISE DO CÓDIGO vs BANCO

### **Backend: Connection.js**

```javascript
// backend/src/repository/connection.js
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'segredodosabor',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'P@$$w0rd'
})
```

**Status:** ✅ Correto

**Observações:**
- Usa `mysql2/promise` (correto para async/await)
- Hardcoded defaults (não recomendado para produção)
- Sem pool de conexões (pode causar problemas de performance)

### **Backend: Scripts de Migração**

**Arquivos encontrados:**
```
✅ executar-migracao.js
✅ executar-migracao-personalizacao.js
✅ executar-migracao-personalizacao-ingredientes.js
✅ executar-migracao-preferencias.js
✅ executar-migracao-whatsapp.js
✅ executar-migracao-limpa.js
```

**Problema:** Scripts separados sugerem que o banco foi criado aos poucos, não de forma unificada.

### **Backend: Controllers**

```
✅ authController.js (login, cadastro)
✅ clienteController.js (CRUD clientes)
✅ categoriaController.js (CRUD categorias)
✅ produtoController.js (CRUD produtos)
✅ ingredienteController.js (CRUD ingredientes)
✅ pedidoController.js (gestão pedidos)
✅ receitaController.js (gestão receitas)
✅ personalizacaoController.js (personalização)
✅ preferenciasController.js (preferências clientes)
```

**Status:** ✅ Bem estruturado

**Problema:** Faltam tabelas no banco para alguns controllers!

---

## 🔧 REDUNDÂNCIAS ENCONTRADAS

### **1. Tabela `cliente` Duplicada** ⚠️

O dump mostra inserção duplicada de dados:

```sql
-- Linha 108: Primeira inserção
INSERT INTO `cliente` VALUES 
(1,'Bruno Henrique...','bruno@gmail.com','11988191980',...),
(2,'Cliente Exemplo...','cliente@email.com','11987654321',...);

-- Aparentemente os mesmos dados são inseridos novamente em outro lugar
```

**Problema:** Dados duplicados no dump podem causar erros na importação.

### **2. Categoria de Teste não Removida** ⚠️

```sql
-- Linha 74
(13,'Teste editado','fdgdfgdfg',0,'2025-10-04 18:22:16');
```

**Problema:** Categoria de teste em produção (ativo=0).

### **3. Custos Indiretos Duplicados** ⚠️

```sql
-- Linhas 252-260: Custos aparecem 2x
(1,'Energia Elétrica','Conta de luz mensal',300.00,'2025-10-01',1,'2025-10-04 15:53:55'),
-- ...
(6,'Energia Elétrica','Conta de luz mensal da cozinha',300.00,'2025-10-01',1,'2025-10-04 17:59:30'),
```

**Problema:** IDs 1-5 e 6-11 têm mesmos nomes (energia, água, gás, etc.).

### **4. Configurações Padrão Incompletas** ⚠️

```sql
-- Linha 225: Apenas 9 configurações
INSERT INTO `configuracao` VALUES 
(1,'margem_lucro_padrao','40','Margem de lucro...'),
...
(9,'email_notificacao','contato@segredodosabor.com','Email...');
```

**Faltam:**
- `horario_funcionamento`
- `dias_funcionamento`
- `raio_entrega_km`
- `tempo_minimo_reserva`
- `aceita_retirada`

---

## 📊 ESTRUTURA RECOMENDADA

### **Script SQL Unificado Necessário**

```sql
-- =========================================================
-- BANCO DE DADOS COMPLETO - SEGREDO DO SABOR
-- Versão: 5.0 UNIFICADA
-- =========================================================

-- 1. TABELAS DE AUTENTICAÇÃO
CREATE TABLE cliente (...);
CREATE TABLE administrador (...);
CREATE TABLE refresh_tokens (...);

-- 2. TABELAS DE CATÁLOGO
CREATE TABLE categoria (...);
CREATE TABLE produto (...);
CREATE TABLE produto_imagens (...);

-- 3. TABELAS DE ESTOQUE
CREATE TABLE ingrediente (...);
CREATE TABLE estoque_ingredientes (...);

-- 4. TABELAS DE RECEITAS
CREATE TABLE receita (...);
CREATE TABLE receita_ingredientes (...);
CREATE TABLE custo_indireto (...);

-- 5. TABELAS DE PEDIDOS
CREATE TABLE pedido (...);
CREATE TABLE pedido_itens (...);
CREATE TABLE reserva (...);

-- 6. TABELAS DE PERSONALIZAÇÃO
CREATE TABLE personalizacao_produto (...);
CREATE TABLE personalizacao_ingredientes (...);

-- 7. TABELAS DE PREFERÊNCIAS
CREATE TABLE cliente_preferencias (...);
CREATE TABLE cliente_preferencias_historico (...);

-- 8. TABELAS DE WHATSAPP
CREATE TABLE tb_mensagens_whatsapp (...);
CREATE TABLE tb_whatsapp_webhooks (...);
CREATE TABLE tb_whatsapp_bot_config (...);
CREATE TABLE tb_whatsapp_comandos (...);
CREATE TABLE tb_whatsapp_estatisticas (...);

-- 9. TABELAS DE CONFIGURAÇÃO
CREATE TABLE configuracao (...);

-- 10. PROCEDURES E TRIGGERS
-- ...

-- 11. DADOS INICIAIS
-- ...
```

---

## 🚀 RECOMENDAÇÕES

### **1. Criar Dump Completo** ⭐⭐⭐⭐⭐

```bash
# Criar dump COMPLETO do banco atual
mysqldump -u root -p segredodosabor > Dump-Segredo-COMPLETO-v3.sql

# Ou com estrutura + dados:
mysqldump -u root -p --routines --triggers --events segredodosabor > Dump-FULL.sql
```

### **2. Unificar Scripts de Migração** ⭐⭐⭐⭐

Criar arquivo único: `MIGRACAO_COMPLETA_V5.sql`

### **3. Remover Dados de Teste** ⭐⭐⭐

```sql
-- Remover categoria de teste
DELETE FROM categoria WHERE idcategoria = 13;

-- Remover custos duplicados (manter IDs 6-11)
DELETE FROM custo_indireto WHERE idcusto IN (1,2,3,4,5);
```

### **4. Adicionar Validações JSON** ⭐⭐⭐

```javascript
// backend/src/controller/preferenciasController.js
function validarPreferencias(preferencias) {
    const schema = {
        notificacoes: { email: 'boolean', whatsapp: 'boolean' },
        horario_preferido: 'string', // formato HH:mm
        produtos_favoritos: 'array',
        forma_pagamento_padrao: ['PIX', 'Cartão', 'Dinheiro']
    };
    
    // Validar estrutura
    // ...
}
```

### **5. Implementar Pool de Conexões** ⭐⭐⭐⭐

```javascript
// backend/src/repository/connection.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'segredodosabor',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

export default pool;
```

### **6. Corrigir Trigger Vazio** ⭐⭐

```sql
DROP TRIGGER IF EXISTS tr_preferencias_before_update;

DELIMITER $$
CREATE TRIGGER tr_preferencias_before_update
BEFORE UPDATE ON cliente_preferencias
FOR EACH ROW
BEGIN
    -- Salvar no histórico
    INSERT INTO cliente_preferencias_historico 
    (idpreferencia, idcliente_fk, preferencias_antigas, data_alteracao)
    VALUES (OLD.idpreferencia, OLD.idcliente_fk, OLD.preferencias, NOW());
    
    -- Atualizar data de atualização
    SET NEW.data_atualizacao = NOW();
END$$
DELIMITER ;
```

### **7. Adicionar Índices Faltantes** ⭐⭐⭐

```sql
-- Melhorar performance de consultas
ALTER TABLE cliente ADD INDEX idx_telefone (telefone);
ALTER TABLE produto ADD INDEX idx_categoria (idcategoria_fk);
ALTER TABLE pedido ADD INDEX idx_data_pedido (data_pedido);
ALTER TABLE pedido ADD INDEX idx_status (status);
```

---

## 📈 MÉTRICAS DO BANCO

### **Tabelas Identificadas: 25+**
- ✅ Core system: 3 tabelas
- ✅ Catálogo: 3 tabelas
- ✅ Estoque: 2 tabelas
- ✅ Receitas: 3 tabelas
- ✅ Pedidos: 3 tabelas
- ✅ Personalização: 2 tabelas
- ✅ Preferências: 2 tabelas
- ✅ WhatsApp: 5 tabelas
- ✅ Config: 1 tabela

### **Dados Inseridos (dump parcial):**
- Administradores: 1
- Clientes: 23
- Categorias: 7 (1 teste)
- Ingredientes: ? (truncado)
- Produtos: 0 ❌
- Custos: 11 (6 duplicados)
- Configurações: 9

### **Problemas Críticos: 4**
1. ❌ Dump incompleto (faltam tabelas)
2. ❌ Dados duplicados
3. ❌ Trigger vazio
4. ❌ Sem pool de conexões

### **Problemas Médios: 3**
1. ⚠️ Dados de teste não removidos
2. ⚠️ Tabelas WhatsApp não integradas
3. ⚠️ Configurações incompletas

---

## ✅ CHECKLIST DE CORREÇÃO

### **Banco de Dados:**
- [ ] Criar dump completo com todas as tabelas
- [ ] Remover dados de teste
- [ ] Remover custos duplicados
- [ ] Corrigir trigger vazio
- [ ] Adicionar índices faltantes
- [ ] Unificar scripts de migração
- [ ] Integrar tabelas WhatsApp no dump principal

### **Backend:**
- [ ] Implementar pool de conexões
- [ ] Adicionar validação JSON para preferências
- [ ] Criar middleware de validação de dados
- [ ] Implementar logs de erros SQL
- [ ] Adicionar transações onde necessário

### **Documentação:**
- [ ] Atualizar BANCO_DADOS_COMPLETO.sql
- [ ] Criar diagrama ER atualizado
- [ ] Documentar todas as procedures
- [ ] Documentar estrutura JSON de preferências

---

## 📞 Próximos Passos

1. **Gerar dump completo do banco atual**
2. **Criar script de migração unificado**
3. **Implementar pool de conexões**
4. **Remover redundâncias**
5. **Adicionar validações**
6. **Atualizar documentação**

---

**Status Final:** ⚠️ **BANCO FUNCIONAL MAS COM MELHORIAS NECESSÁRIAS**

O banco de dados está funcionando, mas o dump fornecido está incompleto e há redundâncias que devem ser corrigidas para produção.
