# 🔧 Scripts de Manutenção do Sistema de Pedidos

## 📋 Descrição

Scripts para verificar, corrigir e garantir a estrutura correta do banco de dados para o sistema de gerenciamento de pedidos.

---

## 🚀 Scripts Disponíveis

### 1. **verificar-status-pedidos.js**
Verifica a estrutura da tabela e lista todos os pedidos por status.

**Uso:**
```bash
cd backend
node verificar-status-pedidos.js
```

**O que faz:**
- ✅ Verifica se a coluna `status` existe
- 📊 Conta pedidos por status
- 🔍 Identifica status inválidos
- 📋 Lista últimos 10 pedidos

---

### 2. **corrigir-status-pedidos.js**
Corrige pedidos com status inválidos.

**Uso:**
```bash
cd backend
node corrigir-status-pedidos.js
```

**O que faz:**
- 🔍 Busca pedidos com status inválido
- 🔧 Corrige para "Pendente"
- 📊 Mostra contagem atualizada

---

### 3. **garantir-estrutura-pedidos.js**
Garante que a tabela `reserva` tenha todas as colunas necessárias.

**Uso:**
```bash
cd backend
node garantir-estrutura-pedidos.js
```

**O que faz:**
- 📊 Verifica colunas existentes
- ➕ Adiciona colunas faltantes:
  - `status` (ENUM)
  - `numero_pedido` (VARCHAR)
  - `data_pedido` (DATETIME)
  - `data_atualizacao` (DATETIME)
  - `historico_status` (JSON)
  - `endereco_entrega` (TEXT)
  - `observacoes` (TEXT)
  - `tipo_pedido` (ENUM)
- 🔍 Cria índices para otimização
- 🔢 Gera números de pedido faltantes

---

## 📌 Status Válidos

O sistema trabalha com 6 status possíveis:

| Status | Descrição | Ícone |
|--------|-----------|-------|
| **Pendente** | Aguardando confirmação de pagamento | ⏳ |
| **Confirmado** | Pagamento confirmado | ✅ |
| **Preparando** | Pedido em preparação | 👨‍🍳 |
| **Pronto** | Pronto para retirada/entrega | 🎁 |
| **Entregue** | Pedido entregue ao cliente | 🚚 |
| **Cancelado** | Pedido cancelado | ❌ |

---

## 🔄 Fluxo de Status

```
Pendente → Confirmado → Preparando → Pronto → Entregue
     ↓          ↓           ↓          ↓
   Cancelado  Cancelado  Cancelado  Cancelado
```

---

## 🛠️ Quando Executar

### **Primeira Instalação:**
```bash
# 1. Garantir estrutura
node garantir-estrutura-pedidos.js

# 2. Verificar status
node verificar-status-pedidos.js
```

### **Após Migração/Atualização:**
```bash
# 1. Verificar
node verificar-status-pedidos.js

# 2. Se houver status inválidos, corrigir
node corrigir-status-pedidos.js
```

### **Manutenção Regular:**
```bash
# Verificar status periodicamente
node verificar-status-pedidos.js
```

---

## ⚠️ Notas Importantes

1. **Backup**: Sempre faça backup do banco antes de executar scripts de correção
2. **Ambiente**: Configure corretamente o arquivo `.env` com as credenciais do banco
3. **Ordem**: Execute `garantir-estrutura-pedidos.js` antes de outros scripts
4. **Logs**: Os scripts mostram logs detalhados de todas as operações

---

## 🔒 Segurança

- Scripts usam **prepared statements** para evitar SQL Injection
- Apenas leem/atualizam a tabela `reserva`
- Não deletam dados
- Validam conexão antes de executar

---

## 📝 Variáveis de Ambiente (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=segredodosabor
DB_PORT=3306
```

---

## 🐛 Troubleshooting

### Erro de Conexão
```
❌ Erro: Access denied for user
```
**Solução**: Verifique as credenciais no arquivo `.env`

### Erro de Permissão
```
❌ Erro: Access denied; you need the ALTER privilege
```
**Solução**: Use um usuário com permissões de ALTER TABLE

### Coluna já existe
```
ℹ️ Coluna status já existe, pulando...
```
**Status**: Normal, o script detecta colunas existentes automaticamente

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs detalhados
2. Confira as credenciais do banco
3. Teste a conexão com o MySQL Workbench
4. Revise as permissões do usuário

---

**Última Atualização:** 11/10/2025  
**Versão:** 2.0.0
