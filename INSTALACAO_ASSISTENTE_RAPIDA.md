# 🚀 Instalação Rápida do Assistente Virtual

## ⚡ 3 Passos Simples

### 1️⃣ Criar Tabelas no Banco (2 min)

```bash
cd backend
node criar-tabelas-assistente.js
```

**Resultado esperado:**
```
🎉 ASSISTENTE VIRTUAL INSTALADO COM SUCESSO!
📊 TABELAS CRIADAS (6)
📈 VIEWS CRIADAS (3)
⚙️  PROCEDURES CRIADAS (2)
```

---

### 2️⃣ Iniciar Backend (1 min)

```bash
cd backend
npm start
```

**Aguarde ver:**
```
✓ Servidor rodando na porta 5000
✓ Conectado ao banco de dados
```

---

### 3️⃣ Iniciar Frontend (1 min)

**Novo terminal:**
```bash
cd frontend
npm start
```

**Aguarde ver:**
```
Compiled successfully!
Local: http://localhost:3000
```

---

## 🧪 Testar (Opcional)

### Testar Backend (APIs)

```bash
cd backend
node testar-assistente-virtual.js
```

**Deve passar todos os 8 testes:**
```
✅ Testes Passaram: 8/8 (100%)
🎉 TODOS OS TESTES PASSARAM!
```

### Testar Frontend

1. Abra http://localhost:3000
2. Procure o botão 🤖 (canto inferior direito)
3. Clique para abrir o chat
4. Digite: "Como faço um pedido?"
5. Veja a resposta aparecer

---

## ✅ Verificar Instalação

### Banco de Dados

```sql
-- Verificar tabelas
SHOW TABLES LIKE 'assistente_%';

-- Verificar dados
SELECT * FROM assistente_palavras_chave LIMIT 5;
SELECT * FROM assistente_faq LIMIT 3;
```

### Backend

Acesse: http://localhost:5000/api/assistente/menu

**Deve retornar:**
```json
{
    "sucesso": true,
    "opcoes": [
        "📦 Como fazer um pedido?",
        "🍰 Ver cardápio e preços",
        ...
    ]
}
```

### Frontend

- [ ] Botão 🤖 aparece no canto inferior direito
- [ ] Chat abre ao clicar
- [ ] Mensagens são enviadas e respondidas
- [ ] Botões 👍👎 aparecem nas respostas

---

## ❌ Problemas Comuns

### "Table doesn't exist"
```bash
# Execute novamente o script
cd backend
node criar-tabelas-assistente.js
```

### "Cannot GET /api/assistente/mensagem"
```bash
# Verifique se o backend está rodando
cd backend
npm start
```

### Chat não aparece no frontend
```bash
# Verifique o console do navegador (F12)
# Procure por erros vermelhos
```

### Erro: "app.use() requires a middleware"
- ✅ Já corrigido! O arquivo `assistenteVirtualController.js` foi atualizado

---

## 📚 Documentação Completa

- **ASSISTENTE_VIRTUAL_DOCUMENTACAO.md** - Guia completo (15 páginas)
- **ASSISTENTE_VIRTUAL_INSTALACAO_RAPIDA.md** - Instalação detalhada (8 páginas)
- **ASSISTENTE_VIRTUAL_EXEMPLOS.md** - 12 exemplos de conversas
- **ASSISTENTE_VIRTUAL_RESUMO_EXECUTIVO.md** - Status do projeto

---

## 🎯 O Que Foi Adicionado

### Backend
- ✅ `backend/src/services/assistenteVirtualService.js` (686 linhas)
- ✅ `backend/src/controller/assistenteVirtualController.js` (238 linhas)
- ✅ Rotas em `backend/src/routes.js`

### Frontend
- ✅ `frontend/src/components/ChatAssistente/ChatAssistente.jsx` (450 linhas)
- ✅ `frontend/src/components/ChatAssistente/ChatAssistente.scss` (550 linhas)
- ✅ Integrado em `frontend/src/index.js`

### Banco de Dados
- ✅ 6 tabelas
- ✅ 3 views
- ✅ 2 procedures
- ✅ 48 palavras-chave
- ✅ 8 FAQs

### Scripts
- ✅ `backend/criar-tabelas-assistente.js` - Instalação automática
- ✅ `backend/testar-assistente-virtual.js` - Testes automatizados

---

## 🆘 Precisa de Ajuda?

### Logs do Backend
```javascript
// Procure por:
[ASSISTENTE] Mensagem recebida
[ASSISTENTE] Intenção detectada
[ASSISTENTE] Confiança
```

### Logs do Frontend
- Abra DevTools (F12) → Console
- Procure por erros em vermelho

### Banco de Dados
```sql
-- Ver últimas interações
SELECT * FROM assistente_interacoes 
ORDER BY data_interacao DESC 
LIMIT 10;
```

---

## 🎉 Pronto!

Se tudo funcionou:
- ✅ Botão 🤖 visível
- ✅ Chat abre e fecha
- ✅ Mensagens são processadas
- ✅ Respostas aparecem
- ✅ Feedback funciona (👍👎)

**O Assistente Virtual está operacional!** 🚀

---

**Tempo Total:** ~5 minutos  
**Dificuldade:** ⭐⭐☆☆☆ (Fácil)  
**Status:** ✅ Produção Ready
