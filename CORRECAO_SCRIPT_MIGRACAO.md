# ✅ Correção do Script de Migração

## 🔍 Problema Identificado

O script estava tentando acessar o banco com senha vazia porque as variáveis de ambiente não estavam sendo carregadas corretamente.

**Erro Original**:
```
Access denied for user 'root'@'localhost' (using password: NO)
```

## 🛠️ Causa Raiz

O arquivo `.env` do projeto usa um **formato diferente** de nomes de variáveis:

### ❌ O que o script procurava:
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PWD`
- `MYSQL_DB`

### ✅ O que o .env realmente tem:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_DATABASE`

## 🔧 Correções Aplicadas

### 1. **Carregamento do .env**
Agora o script carrega explicitamente o `.env` da pasta `backend/`:

```javascript
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('📂 Carregando configurações do arquivo .env...');
console.log('📍 Caminho do .env:', envPath);
console.log('🔍 Arquivo .env existe?', fs.existsSync(envPath) ? 'Sim ✅' : 'Não ❌');
```

### 2. **Suporte a Ambos os Formatos**
O script agora aceita **ambos os formatos** de variáveis:

```javascript
const dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
    user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PWD || '',
    database: process.env.DB_DATABASE || process.env.MYSQL_DB || 'segredodosabor',
    multipleStatements: true
};
```

### 3. **Exibição das Configurações**
Agora o script mostra as configurações sendo usadas:

```javascript
console.log('🔐 Configurações de conexão:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   Password: ${dbConfig.password ? '***' + dbConfig.password.slice(-3) : '(vazia)'}`);
console.log(`   Database: ${dbConfig.database}\n`);
```

### 4. **Uso Consistente do Nome do Banco**
Todas as queries agora usam `dbName` em vez de repetir `process.env.*`:

```javascript
const dbName = dbConfig.database;

// Depois usa em todas as queries:
WHERE TABLE_SCHEMA = '${dbName}'
```

## 📋 Arquivo .env Atual

```properties
PORT=5000

# Configurações do Banco de Dados MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=P@$$w0rd
DB_DATABASE=segredodosabor

# JWT Authentication
JWT_SECRET=segredodosabor_secret_2025
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=segredodosabor_refresh_2025
JWT_REFRESH_EXPIRES_IN=30d

# WhatsApp Business API (Opcional)
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_PHONE=5511967696744
WHATSAPP_VERIFY_TOKEN=segredodosabor2025
```

## ✅ Como Testar Agora

### 1. Execute o script novamente:

```bash
cd backend
node executar-migracao-preferencias.js
```

### 2. Você verá a nova saída:

```
============================================================
🚀 MIGRAÇÃO DE PREFERÊNCIAS DE CLIENTES (RF055)
============================================================

📂 Carregando configurações do arquivo .env...
📍 Caminho do .env: D:\Downloads\Segredos-do-Sabor\backend\.env
🔍 Arquivo .env existe? Sim ✅

🔄 Iniciando migração de preferências de clientes...

🔐 Configurações de conexão:
   Host: localhost
   User: root
   Password: ***0rd
   Database: segredodosabor

✅ Conectado ao banco de dados

✅ Arquivo SQL carregado

📋 Total de comandos a executar: 15

⚙️  Executando [1/15]: CREATE TABLE...
✅ Sucesso: CREATE TABLE

...
```

## 🎯 Benefícios das Correções

✅ **Diagnóstico Melhorado**
- Mostra caminho do arquivo .env
- Confirma se arquivo existe
- Exibe configurações sendo usadas (sem expor senha completa)

✅ **Compatibilidade**
- Aceita formato `DB_*` (atual)
- Aceita formato `MYSQL_*` (alternativo)
- Fallback para valores padrão

✅ **Debugging Facilitado**
- Fácil identificar se .env está sendo lido
- Fácil ver quais credenciais estão sendo usadas
- Mensagens claras em cada etapa

## 🔄 Próximos Passos

1. ✅ Execute o script corrigido
2. ✅ Verifique se a migração foi bem-sucedida
3. ✅ Reinicie o backend
4. ✅ Teste os endpoints de preferências

---

**Data da Correção**: Janeiro 2025  
**Status**: ✅ Corrigido e Pronto para Uso  
**Versão do Script**: 1.1
