# 🚀 Guia Rápido: Instalação do Assistente Virtual

## ⏱️ Tempo Estimado: 10 minutos

---

## 📋 Checklist de Arquivos

Verifique se você tem todos os arquivos criados:

```
✅ backend/src/services/assistenteVirtualService.js
✅ backend/src/controller/assistenteVirtualController.js
✅ frontend/src/components/ChatAssistente/ChatAssistente.jsx
✅ frontend/src/components/ChatAssistente/ChatAssistente.scss
✅ assistente-virtual-schema.sql
```

---

## 🗄️ PASSO 1: Banco de Dados (2 minutos)

### Opção A: Via Terminal/CMD

```bash
# Windows (CMD)
cd D:\Downloads\Segredo-do-Sabor
mysql -u root -p DoceGest < assistente-virtual-schema.sql

# Linux/Mac
cd ~/Downloads/Segredo-do-Sabor
mysql -u root -p DoceGest < assistente-virtual-schema.sql
```

### Opção B: Via MySQL Workbench

1. Abra o MySQL Workbench
2. Conecte ao servidor
3. File → Open SQL Script
4. Selecione `assistente-virtual-schema.sql`
5. Clique no ⚡ (Execute)

### Opção C: Via phpMyAdmin

1. Acesse phpMyAdmin
2. Selecione o banco `DoceGest`
3. Clique em "Import"
4. Escolha `assistente-virtual-schema.sql`
5. Clique em "Go"

### ✅ Verificar Instalação

```sql
-- Execute no MySQL
SHOW TABLES LIKE 'assistente_%';
```

**Resultado esperado:**
```
assistente_faq
assistente_feedback
assistente_interacoes
assistente_intencoes_customizadas
assistente_palavras_chave
assistente_sessoes
```

---

## 🔌 PASSO 2: Backend (1 minuto)

### Verificar Rotas

Abra: `backend/src/routes.js`

**Deve conter:**
```javascript
import assistenteVirtual from './controller/assistenteVirtualController.js';

export default function adicionarRotas(servidor) {
    // ... outras rotas ...
    servidor.use(assistenteVirtual);  // ← Esta linha
    servidor.use('/storage', express.static('./storage'));
}
```

### ✅ Verificar Instalação

**Não precisa instalar nenhum pacote novo!** O assistente usa apenas as dependências já existentes do projeto.

---

## 🎨 PASSO 3: Frontend (3 minutos)

### 3.1 Adicionar Componente

Edite o arquivo principal onde você quer o chat (ex: `frontend/src/App.jsx` ou `frontend/src/pages/Home/Home.jsx`):

```jsx
import ChatAssistente from './components/ChatAssistente/ChatAssistente';

function App() {
    return (
        <div>
            {/* Seu conteúdo existente */}
            <Header />
            <Routes>
                {/* suas rotas */}
            </Routes>
            <Footer />
            
            {/* ADICIONE AQUI - antes de fechar a última div */}
            <ChatAssistente />
        </div>
    );
}

export default App;
```

### 3.2 Verificar Importação SCSS

O arquivo `ChatAssistente.jsx` já contém:
```jsx
import './ChatAssistente.scss';
```

Se usar CSS modules, ajuste conforme necessário.

---

## ▶️ PASSO 4: Iniciar Sistema (2 minutos)

### 4.1 Backend

```bash
cd D:\Downloads\Segredo-do-Sabor\backend
npm start
```

**Aguarde ver:**
```
✓ Servidor rodando na porta 5000
✓ Conectado ao banco de dados
```

### 4.2 Frontend

**Novo terminal:**
```bash
cd D:\Downloads\Segredo-do-Sabor\frontend
npm start
```

**Aguarde ver:**
```
Compiled successfully!
Local:   http://localhost:3000
```

---

## 🧪 PASSO 5: Testar (2 minutos)

### Teste Visual

1. **Abra o navegador**: http://localhost:3000
2. **Procure o botão flutuante** (canto inferior direito): 🤖
3. **Clique no botão**
4. **Veja a saudação** aparecer

### Teste de Funcionalidade

Digite no chat:

```
1️⃣ "Olá"
   → Deve responder com saudação personalizada

2️⃣ "Como faço um pedido?"
   → Deve explicar o processo

3️⃣ "menu"
   → Deve mostrar 7 opções

4️⃣ "Qual o horário de funcionamento?"
   → Deve informar: Segunda a Sexta: 9h às 18h...

5️⃣ "xpto123" (palavra aleatória)
   → Deve dar resposta padrão com sugestões
```

### Teste de Feedback

1. Clique em 👍 ou 👎 após uma resposta
2. Verifique no banco de dados:

```sql
SELECT * FROM assistente_interacoes ORDER BY data_interacao DESC LIMIT 5;
```

---

## 🔍 Verificação de Erros

### ❌ Erro: "Cannot GET /api/assistente/mensagem"

**Causa:** Rotas não registradas

**Solução:**
```javascript
// backend/src/routes.js
import assistenteVirtual from './controller/assistenteVirtualController.js';
servidor.use(assistenteVirtual);
```

Reinicie o backend: `npm start`

---

### ❌ Erro: "Table 'assistente_interacoes' doesn't exist"

**Causa:** SQL não executado

**Solução:**
```bash
mysql -u root -p DoceGest < assistente-virtual-schema.sql
```

---

### ❌ Erro: "ChatAssistente is not defined"

**Causa:** Componente não importado

**Solução:**
```jsx
import ChatAssistente from './components/ChatAssistente/ChatAssistente';
```

---

### ❌ Chat não aparece na tela

**Causa:** z-index baixo ou CSS não carregado

**Solução:**
1. Abra DevTools (F12)
2. Verifique se há erros de SCSS
3. Force recompilação: `Ctrl+Shift+R`

---

### ❌ Botão flutuante fica atrás de outros elementos

**Solução:**
```scss
// ChatAssistente.scss
.chat-assistente {
    z-index: 9999; // ← Aumentar se necessário
}
```

---

## 🎉 Pronto!

Se tudo funcionou, você verá:

```
✅ Botão flutuante no canto inferior direito
✅ Chat abre ao clicar
✅ Mensagens são enviadas e respondidas
✅ Sugestões aparecem abaixo das respostas
✅ Feedback funciona (👍👎)
```

---

## 📊 Próximos Passos

### 1. Personalizar Conteúdo

```sql
-- Adicionar mais FAQs
INSERT INTO assistente_faq (pergunta, resposta, categoria, tags)
VALUES ('Sua pergunta', 'Sua resposta', 'categoria', '["tag1", "tag2"]');
```

### 2. Adicionar Intenções Customizadas

```javascript
// Via API (Postman ou frontend admin)
POST http://localhost:5000/api/assistente/admin/adicionar-intencao

{
    "categoria": "produtos",
    "pergunta": ".*bolo.*chocolate",
    "resposta": "Temos 5 tipos de bolo de chocolate! Confira: ..."
}
```

### 3. Monitorar Estatísticas

```sql
-- Ver resumo de hoje
SELECT * FROM vw_assistente_estatisticas WHERE data = CURDATE();

-- Ver perguntas mais frequentes
SELECT mensagem_usuario, COUNT(*) as vezes
FROM assistente_interacoes
GROUP BY mensagem_usuario
ORDER BY vezes DESC
LIMIT 10;
```

### 4. Integrar com Painel Admin

Crie uma página em `frontend/src/pages/gerenciamentos/AssistenteVirtual.jsx` para:
- Ver estatísticas
- Adicionar intenções
- Visualizar conversas recentes
- Exportar relatórios

---

## 🆘 Precisa de Ajuda?

### Logs Úteis

**Backend:**
```bash
# Ver logs em tempo real
cd backend
npm start

# Procurar por:
[ASSISTENTE] Mensagem recebida
[ASSISTENTE] Intenção detectada
[ASSISTENTE] Confiança
```

**Frontend:**
```javascript
// Abra DevTools (F12) → Console
// Procure por erros vermelhos
```

**Banco de Dados:**
```sql
-- Ver últimas interações
SELECT * FROM assistente_interacoes 
ORDER BY data_interacao DESC 
LIMIT 20;

-- Ver erros (confiança 0)
SELECT * FROM assistente_interacoes 
WHERE confianca = 0
ORDER BY data_interacao DESC;
```

---

## 📚 Documentação Completa

Para informações detalhadas, consulte:
- **ASSISTENTE_VIRTUAL_DOCUMENTACAO.md** (15 páginas)
- **Seção de API** (todos os endpoints)
- **Seção de Acessibilidade** (WCAG 2.2 AAA)
- **Seção de Troubleshooting** (problemas comuns)

---

## ✅ Checklist Final

Antes de considerar concluído, verifique:

- [ ] 6 tabelas criadas no MySQL
- [ ] Backend iniciado sem erros
- [ ] Frontend compilado com sucesso
- [ ] Botão 🤖 visível na página
- [ ] Chat abre e fecha corretamente
- [ ] Mensagens são enviadas e respondidas
- [ ] Feedback funciona (👍👎)
- [ ] Responsivo no mobile (teste redimensionando)
- [ ] Acessível via teclado (teste com Tab)
- [ ] Dados salvos no banco (verifique SQL)

---

**Tempo Total:** ~10 minutos  
**Dificuldade:** ⭐⭐☆☆☆ (Fácil)  
**Status:** Produção Ready ✅

**Boa sorte! 🚀**
