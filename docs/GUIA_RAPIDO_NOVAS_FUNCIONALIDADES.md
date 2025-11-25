# 🚀 Guia Rápido - Novas Funcionalidades Locais

**Atualizado:** 25 de novembro de 2025  
**Versão:** 5.0 Local Edition

---

## ⚡ Início Rápido (5 minutos)

### 1️⃣ **Iniciar o Backend**

```bash
cd backend
npm start
```

**Saída esperada:**
```
✅ WhatsApp conectado via Evolution API
OU
⚠️  WhatsApp Service rodando em MODO DEMO (Evolution API não configurado)

Servidor rodando na porta 5000
```

### 2️⃣ **Iniciar o Frontend**

```bash
cd frontend
npm start
```

**URL:** http://localhost:3000

### 3️⃣ **Testar Notificações**

#### **Opção A: Via Painel Admin** (Recomendado)

1. Acesse: http://localhost:3000/login
2. Login:
   - Email: `admin@segredodosabor.com`
   - Senha: `admin123`
3. Vá para **"Reservas em Andamento"**
4. Clique em um pedido
5. Mude o status (ex: Pendente → Confirmado)
6. **Verifique os logs do backend no terminal!**

#### **Opção B: Via Script de Teste**

```bash
cd backend
node testar-notificacoes-automaticas.js
```

Este script:
- ✅ Testa todas as 5 notificações automaticamente
- ✅ Mostra logs coloridos e detalhados
- ✅ Valida a integração completa

#### **Opção C: Via API (cURL/Postman)**

```bash
# Atualizar status para Confirmado
curl -X PUT http://localhost:5000/reserva/43/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Confirmado"}'

# Atualizar para Pronto
curl -X PUT http://localhost:5000/reserva/43/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Pronto"}'
```

---

## 📱 Notificações Implementadas

| Status | Notificação Enviada |
|--------|---------------------|
| **Pendente → Confirmado** | ✅ Pagamento Confirmado |
| **Confirmado → Preparando** | ⏳ Pedido em Preparação |
| **Preparando → Pronto** | 🎉 Pronto para Retirada |
| **Pronto → Entregue** | 💜 Agradecimento |
| **Qualquer → Cancelado** | ❌ Pedido Cancelado |

---

## 🔍 Verificar se Está Funcionando

### **Logs do Backend (Terminal onde rodou `npm start`):**

**✅ Sucesso:**
```
📱 Enviando notificação de pagamento confirmado para 5511946263047
✅ Mensagem WhatsApp enviada para 5511946263047
✅ Notificação de status Confirmado processada para reserva 43
```

**⚠️ Modo Demo (Sem Evolution API):**
```
📱 [DEMO] WhatsApp para 5511946263047: ✅ *Pagamento Confirmado!* ...
✅ Notificação de status Confirmado processada para reserva 43
```

**❌ Erro:**
```
❌ Erro ao enviar WhatsApp: ...
Erro ao enviar notificação, mas status foi atualizado: ...
```

---

## 🐳 Instalar Evolution API (Opcional)

### **Via Docker (Recomendado):**

```bash
# Instalar Evolution API
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=segredodosabor2025 \
  atendai/evolution-api:v1.8.0

# Verificar se está rodando
docker ps | grep evolution

# Ver logs
docker logs -f evolution-api
```

### **Configurar no Backend:**

Edite `backend/.env`:

```bash
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=segredodosabor2025
EVOLUTION_INSTANCE_NAME=segredodosabor
```

### **Conectar WhatsApp:**

1. Acesse: http://localhost:8080/manager
2. Crie uma instância chamada **"segredodosabor"**
3. Escaneie o QR Code com seu WhatsApp
4. Aguarde conexão (status "open")

**Pronto!** Agora as mensagens serão enviadas de verdade! 📱

---

## 🔧 Solução de Problemas

### **❌ Backend não inicia**

```bash
# Verificar se a porta 5000 está livre
netstat -an | findstr :5000

# Se estiver ocupada, matar processo
taskkill /F /PID <PID>

# Ou mudar porta no .env
PORT=5001
```

### **❌ "Reserva não encontrada"**

```sql
-- Verificar se existem pedidos no banco
mysql -u root -p segredodosabor

SELECT id, numero_pedido, status, cliente_nome 
FROM reserva 
LIMIT 5;
```

Se não houver pedidos, crie um pelo site (http://localhost:3000).

### **❌ "Cliente sem telefone"**

```sql
-- Verificar telefones
SELECT c.id, c.nome, c.telefone 
FROM clientes c
INNER JOIN reserva r ON r.idcliente = c.id
WHERE r.id = 43;

-- Se telefone estiver NULL, atualizar:
UPDATE clientes 
SET telefone = '5511946263047' 
WHERE id = X;
```

### **❌ Evolution API não conecta**

```bash
# Verificar se container está rodando
docker ps

# Se não estiver, iniciar:
docker start evolution-api

# Verificar logs de erro:
docker logs evolution-api

# Reiniciar se necessário:
docker restart evolution-api
```

---

## 📊 Comparação: Modo Demo vs. Evolution API

| Aspecto | Modo Demo | Com Evolution API |
|---------|-----------|-------------------|
| **Status atualizado** | ✅ Sim | ✅ Sim |
| **Notificação enviada** | ❌ Não (só log) | ✅ Sim (WhatsApp real) |
| **Histórico gravado** | ✅ Sim | ✅ Sim |
| **Útil para** | 🧪 Desenvolvimento | 🚀 Produção |
| **Requer WhatsApp** | ❌ Não | ✅ Sim |

---

## 🎯 Próximos Passos

1. ✅ **Testar todas as 5 notificações**
2. ✅ **Validar mensagens no console**
3. ⚙️ **Instalar Evolution API** (opcional)
4. 📱 **Conectar WhatsApp pessoal** (para testes reais)
5. 🧪 **Fazer pedido completo no site** (fluxo end-to-end)
6. 📊 **Verificar histórico de mensagens no banco**

---

## 📚 Documentos Relacionados

- **ATUALIZACOES_AZURE_PARA_LOCAL.md** - Documentação técnica completa
- **RESUMO_ATUALIZACOES.md** - Resumo executivo das mudanças
- **testar-notificacoes-automaticas.js** - Script de teste automatizado
- **README.md** - Documentação principal do projeto

---

## 💡 Dicas

### **Para Desenvolvimento:**
- Use **Modo Demo** (sem Evolution API) para desenvolver frontend
- Verifique sempre os logs do backend
- Teste um status por vez para entender o fluxo

### **Para Demonstração:**
- Instale **Evolution API**
- Use seu **WhatsApp pessoal** para receber mensagens
- Grave tela mostrando mensagens chegando em tempo real

### **Para Produção:**
- Configure **Evolution API** em servidor
- Use **número comercial** do estabelecimento
- Monitore logs com **PM2** ou similar

---

## ✅ Checklist de Validação

- [ ] Backend iniciado sem erros
- [ ] Frontend acessível em localhost:3000
- [ ] Login no painel admin funciona
- [ ] Consegue listar pedidos
- [ ] Consegue mudar status de pedido
- [ ] Logs de notificação aparecem no backend
- [ ] Script de teste executa sem erros
- [ ] Histórico de mensagens gravado no banco

---

**🎉 Pronto! Agora você tem todas as funcionalidades da VM Azure rodando localmente!**

---

**📅 Data:** 25 de novembro de 2025  
**🔖 Versão:** 5.0.0 Local  
**✅ Status:** Testado e Funcionando
