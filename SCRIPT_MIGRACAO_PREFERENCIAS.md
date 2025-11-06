# 🔧 Script de Migração - Preferências de Clientes (RF055)

## 📋 Descrição

Este script automatiza a execução da migração SQL para criar a estrutura de preferências de clientes no banco de dados do sistema **Segredos do Sabor**.

## 📦 Arquivos

- **`executar-migracao-preferencias.js`** - Script Node.js principal
- **`executar-migracao-preferencias.bat`** - Script batch para Windows
- **`adicionar-preferencias-clientes.sql`** - Arquivo SQL com os comandos

## 🚀 Como Usar

### Método 1: Script Batch (Windows - RECOMENDADO)

Clique duplo no arquivo ou execute via terminal:

```bash
executar-migracao-preferencias.bat
```

### Método 2: Node.js Direto

```bash
cd backend
node executar-migracao-preferencias.js
```

### Método 3: MySQL CLI (Manual)

```bash
mysql -u root -p segredos_do_sabor < adicionar-preferencias-clientes.sql
```

## ✅ O Que o Script Faz

O script executa automaticamente:

1. **Conecta ao banco de dados** usando as credenciais do `.env`
2. **Lê o arquivo SQL** `adicionar-preferencias-clientes.sql`
3. **Executa os comandos** de forma sequencial:
   - 🗃️ Cria tabela `cliente_preferencias`
   - 🔧 Cria 4 Stored Procedures
   - 👁️ Cria 2 Views
   - ⚡ Cria 1 Trigger para histórico
   - 📊 Cria índices para otimização
4. **Verifica a estrutura** criada
5. **Exibe relatório** completo da migração

## 📊 Saída Esperada

```
============================================================
🚀 MIGRAÇÃO DE PREFERÊNCIAS DE CLIENTES (RF055)
============================================================

🔄 Iniciando migração de preferências de clientes...

✅ Conectado ao banco de dados

✅ Arquivo SQL carregado

📋 Total de comandos a executar: 15

⚙️  Executando [1/15]: CREATE TABLE...
✅ Sucesso: CREATE TABLE

⚙️  Executando [2/15]: CREATE PROCEDURE...
✅ Sucesso: CREATE PROCEDURE

...

============================================================
📊 RESUMO DA MIGRAÇÃO
============================================================
✅ Comandos executados com sucesso: 15
❌ Comandos com erro: 0
📋 Total processado: 15
============================================================

🔍 Verificando estrutura criada...

✅ Tabela cliente_preferencias criada com sucesso

📋 Colunas da tabela cliente_preferencias:
   - id (int) NOT NULL
   - idcliente_fk (int) NOT NULL
   - produtos_favoritos (json) NULL
   - observacoes_padrao (varchar(500)) NULL
   - forma_pagamento_preferida (varchar(50)) NULL
   - alergias_restricoes (text) NULL
   - data_criacao (timestamp) NO
   - data_atualizacao (timestamp) NO

✅ Stored Procedures criadas: 4
   - sp_buscar_preferencias_cliente
   - sp_salvar_preferencias_cliente
   - sp_buscar_produtos_favoritos
   - sp_aplicar_preferencias_pedido

✅ Views criadas: 2
   - vw_cliente_preferencias
   - vw_relatorio_clientes_preferencias

✅ Triggers criadas: 1
   - trg_historico_preferencias (AFTER UPDATE on cliente_preferencias)

🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!

📝 Próximos passos:
   1. Reinicie o backend: npm start
   2. Teste os endpoints de preferências via Postman
   3. Consulte POSTMAN_COLLECTION_RF049_RF055.md para exemplos

🔌 Conexão com o banco encerrada

✅ Script finalizado
```

## ⚙️ Configuração

O script usa as variáveis de ambiente do arquivo `.env`:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PWD=sua_senha
MYSQL_DB=segredos_do_sabor
```

## 🔍 Verificação Manual

Após executar o script, você pode verificar manualmente no MySQL:

### Verificar Tabela

```sql
DESCRIBE cliente_preferencias;
```

### Verificar Stored Procedures

```sql
SHOW PROCEDURE STATUS WHERE Db = 'segredos_do_sabor' AND Name LIKE '%preferencias%';
```

### Verificar Views

```sql
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW' AND Tables_in_segredos_do_sabor LIKE '%preferencias%';
```

### Verificar Triggers

```sql
SHOW TRIGGERS WHERE `Trigger` LIKE '%preferencias%';
```

### Testar Stored Procedure

```sql
-- Buscar preferências de um cliente
CALL sp_buscar_preferencias_cliente(1);

-- Salvar preferências
CALL sp_salvar_preferencias_cliente(
    1, 
    '[15, 23, 42]', 
    'Sem açúcar adicional', 
    'PIX', 
    'Alergia a amendoim'
);
```

## ❌ Tratamento de Erros

O script trata automaticamente os seguintes erros:

- ✅ **ER_BAD_TABLE_ERROR** - Tabela não existe (ao fazer DROP)
- ✅ **ER_SP_DOES_NOT_EXIST** - Stored Procedure não existe
- ✅ **ER_TRG_DOES_NOT_EXIST** - Trigger não existe

Esses erros são considerados "avisos" e não interrompem a execução.

## 🔧 Solução de Problemas

### Erro: "Arquivo SQL não encontrado"

**Causa**: O script não encontrou o arquivo `adicionar-preferencias-clientes.sql`

**Solução**: 
1. Verifique se está executando o script da pasta raiz do projeto
2. Confirme que o arquivo SQL existe na raiz

### Erro: "Access denied for user"

**Causa**: Credenciais incorretas no `.env`

**Solução**:
1. Verifique as credenciais em `backend/.env`
2. Confirme que o usuário tem permissões CREATE, DROP, ALTER

### Erro: "Unknown database"

**Causa**: Banco de dados não existe

**Solução**:
```sql
CREATE DATABASE segredos_do_sabor;
```

### Erro: "Table already exists"

**Causa**: A migração já foi executada antes

**Solução**: 
Isso é normal! O script continuará normalmente. Se quiser recriar:

```sql
DROP TABLE IF EXISTS cliente_preferencias;
```

Depois execute o script novamente.

## 📚 Documentação Relacionada

- **IMPLEMENTACAO_RF049_RF055_COMPLETA.md** - Guia completo de implementação
- **POSTMAN_COLLECTION_RF049_RF055.md** - Testes dos endpoints
- **ANALISE_REQUISITOS_FUNCIONAIS.md** - Análise de todos os RFs
- **adicionar-preferencias-clientes.sql** - SQL original da migração

## 🎯 Próximos Passos

Após executar a migração com sucesso:

1. ✅ **Reiniciar o Backend**
   ```bash
   cd backend
   npm start
   ```

2. ✅ **Testar Endpoints** (use Postman)
   - GET `/preferencias/:idcliente`
   - POST `/preferencias/:idcliente`
   - GET `/preferencias/:idcliente/produtos-favoritos`
   - E mais 5 endpoints...

3. ✅ **Implementar Frontend** (opcional)
   - Componente de preferências do cliente
   - Veja exemplos em `IMPLEMENTACAO_RF049_RF055_COMPLETA.md`

## ⚡ Dicas

- **Backup**: Sempre faça backup do banco antes de executar migrações
- **Logs**: O script gera logs detalhados de toda a execução
- **Idempotência**: O script pode ser executado múltiplas vezes com segurança

## 📝 Observações

- ✅ Script compatível com Windows
- ✅ Usa ES Modules (Node.js 14+)
- ✅ Trata erros automaticamente
- ✅ Verifica estrutura criada
- ✅ Exibe relatório completo

---

**Versão**: 1.0  
**Data**: Janeiro 2025  
**Projeto**: Segredos do Sabor  
**RF Implementado**: RF055 - Preferências de Clientes

**Autor**: Sistema de Migração Automatizada  
**Status**: ✅ Pronto para Produção
