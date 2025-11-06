# 🚀 GUIA DE INICIALIZAÇÃO - Evolution API

## ✅ Status Atual

- ✅ Evolution API clonada em: `D:\Downloads\Segredos-do-Sabor\evolution-api`
- ✅ Prisma Client gerado para MySQL
- ✅ Banco de dados `evolution_api` criado
- ✅ Schema do banco sincronizado
- ✅ Arquivo `.env` configurado

## 📋 Próximos Passos

### 1. Abra um novo terminal Git Bash
Pressione `Ctrl + Shift + '` no VS Code e selecione **Git Bash**

### 2. Navegue para a pasta evolution-api
```bash
cd /d/Downloads/Segredos-do-Sabor/evolution-api
```

### 3. Inicie a Evolution API
```bash
npm start
```

## 🎯 O que esperar

A API deve iniciar na porta **8080**. Você verá algo como:

```
[Evolution API] Server running on http://localhost:8080
```

## 🔗 Próximos Passos após Iniciar

1. **Acesse o painel**: http://localhost:8080

2. **Crie uma instância**:
   - Nome: `segredodosabor`
   - Escaneie o QR Code com seu WhatsApp Business

3. **Obtenha a API Key** gerada automaticamente

4. **Configure no backend do Segredos do Sabor**:
   Abra `D:\Downloads\Segredos-do-Sabor\backend\.env` e adicione:
   ```env
   # WhatsApp com Evolution API
   WHATSAPP_PROVIDER=evolution
   EVOLUTION_API_URL=http://localhost:8080
   EVOLUTION_API_KEY=sua_api_key_aqui
   EVOLUTION_INSTANCE=segredodosabor
   ```

5. **Reinicie o backend**:
   ```bash
   cd /d/Downloads/Segredos-do-Sabor/backend
   npm start
   ```

## 🔧 Solução de Problemas

### Erro: Porta 8080 em uso
```bash
# No arquivo .env da Evolution API, mude:
SERVER_PORT=8081
```

### Erro: Não conecta ao MySQL
Verifique se o MySQL está rodando:
```bash
# No CMD ou PowerShell:
net start MySQL80
```

### Erro: Prisma não encontra schema
```bash
cd /d/Downloads/Segredos-do-Sabor/evolution-api
npx prisma generate --schema=./prisma/mysql-schema.prisma
```

## 📱 Testando o WhatsApp

Após configurar tudo, teste enviando uma mensagem:

```bash
cd /d/Downloads/Segredos-do-Sabor/backend
node testar-whatsapp.js
```

## 🎉 Sucesso!

Quando tudo estiver funcionando, você verá no console do backend:

```
✅ WhatsApp conectado via Evolution API
```

E as mensagens serão enviadas automaticamente quando houver novos pedidos!

---

## 📝 Configuração Atual da Evolution API

**Arquivo `.env` criado em**: `D:\Downloads\Segredos-do-Sabor\evolution-api\.env`

**Credenciais MySQL**:
- Host: localhost
- Porta: 3306
- Usuário: root
- Banco: evolution_api

**API Key configurada**: `segredodosabor_evolution_key_2025`

**Porta do servidor**: 8080

---

## 🆘 Precisa de Ajuda?

Se algo não funcionar, me avise qual erro apareceu e eu te ajudo! 💜
