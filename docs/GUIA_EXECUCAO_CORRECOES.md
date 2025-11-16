# 🔧 Guia de Execução - Correções do Banco de Dados

## 📋 Ordem de Execução

### **1. BACKUP OBRIGATÓRIO** ⚠️

Antes de qualquer correção, faça backup completo:

```bash
# Windows (PowerShell)
cd D:\Documents\dumps

# Backup completo com estrutura, dados, procedures e triggers
mysqldump -u root -p --routines --triggers --events --single-transaction segredodosabor > backup_antes_correcoes_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Ou simplificado:
mysqldump -u root -p segredodosabor > backup_$(Get-Date -Format "yyyyMMdd").sql
```

---

### **2. EXECUTAR SCRIPT DE CORREÇÃO**

```bash
# Navegar para pasta do projeto
cd D:\Downloads\Segredo-do-Sabor

# Executar script de correção
mysql -u root -p segredodosabor < CORRECAO_BANCO_DADOS.sql
```

**Ou via MySQL Workbench:**
1. Abrir `CORRECAO_BANCO_DADOS.sql`
2. Selecionar banco `segredodosabor`
3. Executar (Ctrl+Shift+Enter)

---

### **3. VERIFICAR RESULTADOS**

```sql
-- Conectar ao banco
USE segredodosabor;

-- Verificar categorias (deve ter 6, sem teste)
SELECT * FROM categoria WHERE ativo = 1;

-- Verificar custos (não deve ter duplicados)
SELECT nome, COUNT(*) as total 
FROM custo_indireto 
GROUP BY nome 
HAVING total > 1;

-- Verificar configurações (deve ter ~19)
SELECT COUNT(*) FROM configuracao;

-- Verificar trigger
SHOW TRIGGERS LIKE 'cliente_preferencias';

-- Verificar procedures
SHOW PROCEDURE STATUS WHERE Db = 'segredodosabor';

-- Verificar events
SHOW EVENTS;
```

---

### **4. ATUALIZAR BACKEND (Connection Pool)**

O arquivo `backend/src/repository/connection.js` já foi atualizado para usar pool de conexões.

**Testar:**

```bash
# Navegar para backend
cd backend

# Instalar dependências (se necessário)
npm install

# Testar conexão
node -e "import('./src/repository/connection.js').then(() => console.log('Pool OK!'))"
```

---

### **5. TESTAR ENDPOINTS**

```bash
# Iniciar backend
cd backend
npm start

# Em outro terminal, testar endpoints:
curl http://localhost:3000/api/categorias
curl http://localhost:3000/api/clientes
curl http://localhost:3000/api/configuracoes
```

---

### **6. GERAR DUMP ATUALIZADO**

Após todas as correções:

```bash
cd D:\Documents\dumps

# Gerar dump completo ATUALIZADO
mysqldump -u root -p --routines --triggers --events --single-transaction segredodosabor > Dump-Segredo-v3-CORRIGIDO-$(Get-Date -Format "yyyyMMdd").sql
```

---

## 📊 Checklist de Validação

### **Banco de Dados**
- [ ] Backup realizado
- [ ] Script de correção executado sem erros
- [ ] Categorias de teste removidas
- [ ] Custos duplicados removidos
- [ ] Trigger `tr_preferencias_before_update` funcionando
- [ ] Novas configurações inseridas
- [ ] Índices adicionados
- [ ] Tabela `refresh_tokens` criada
- [ ] Procedures criadas (2)
- [ ] Views criadas (2)
- [ ] Function criada (1)
- [ ] Events criados (2)

### **Backend**
- [ ] Pool de conexões implementado
- [ ] Helpers `executeQuery` e `executeTransaction` disponíveis
- [ ] Eventos do pool funcionando
- [ ] Sem erros no console

### **Testes**
- [ ] Endpoints respondendo
- [ ] Queries mais rápidas
- [ ] Logs de conexão aparecendo
- [ ] Sem erros de timeout

---

## 🐛 Troubleshooting

### **Erro: "Event Scheduler is not enabled"**

```sql
-- Habilitar event scheduler
SET GLOBAL event_scheduler = ON;

-- Verificar
SHOW VARIABLES LIKE 'event_scheduler';
```

### **Erro: "Cannot add foreign key constraint"**

```sql
-- Verificar se tabelas referenciadas existem
SHOW TABLES;

-- Verificar integridade referencial
SELECT * FROM information_schema.TABLE_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'segredodosabor'
AND CONSTRAINT_TYPE = 'FOREIGN KEY';
```

### **Erro: "Duplicate entry"**

```sql
-- Verificar duplicados antes de executar
SELECT nome, COUNT(*) 
FROM categoria 
GROUP BY nome 
HAVING COUNT(*) > 1;
```

### **Pool não conecta**

```javascript
// Verificar .env
console.log({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    port: process.env.DB_PORT
});

// Testar conexão direta
const mysql = require('mysql2/promise');
const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sua_senha',
    database: 'segredodosabor'
});
await conn.ping();
console.log('Conectado!');
```

---

## 📈 Melhorias Implementadas

### **Performance**
- ✅ Pool de conexões (10 simultâneas)
- ✅ Keep-alive para conexões
- ✅ Índices adicionados (7+)
- ✅ Views para queries complexas

### **Manutenção**
- ✅ Limpeza automática de tokens (diária)
- ✅ Limpeza automática de histórico (mensal)
- ✅ Procedures de manutenção

### **Segurança**
- ✅ Validação JSON em preferências
- ✅ Múltiplos statements desabilitados
- ✅ Transações com rollback

### **Observabilidade**
- ✅ Logs de conexões
- ✅ Views de estatísticas
- ✅ Eventos de erro
- ✅ Relatórios automáticos

---

## 📞 Suporte

### **Logs para Análise:**

```bash
# Logs do MySQL (Windows)
# C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err

# Logs do backend
cd backend
npm start > logs/backend.log 2>&1
```

### **Comandos Úteis:**

```sql
-- Ver conexões ativas
SHOW PROCESSLIST;

-- Ver status do pool
SHOW STATUS LIKE 'Threads%';

-- Ver variáveis
SHOW VARIABLES LIKE 'max_connections';

-- Ver tamanho das tabelas
SELECT 
    table_name AS 'Tabela',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Tamanho (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'segredodosabor'
ORDER BY (data_length + index_length) DESC;
```

---

## ✅ Resultado Esperado

Após executar todas as correções:

```
✅ Banco otimizado e limpo
✅ Pool de conexões funcionando
✅ Sem redundâncias
✅ Procedures e triggers ativos
✅ Events agendados
✅ Dump atualizado gerado
✅ Backend mais rápido
✅ Logs detalhados
```

---

## 🚀 Próximos Passos

1. **Monitorar performance** (primeiros dias)
2. **Ajustar connectionLimit** se necessário
3. **Implementar cache** (Redis/Memcached)
4. **Criar mais índices** conforme uso
5. **Otimizar queries lentas** (EXPLAIN)

---

**Status:** ✅ **PRONTO PARA EXECUÇÃO**

Execute os passos na ordem e verifique cada etapa antes de prosseguir.
