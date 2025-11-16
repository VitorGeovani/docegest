# 🎯 GUIA RÁPIDO DE TESTE - Assistente Virtual

## ✅ O QUE FOI CORRIGIDO

### 1. Botão "Fazer um Pedido" ✅
**Antes:** Exibia informações de "Consultar Status"  
**Depois:** Exibe instruções corretas de como fazer pedido

### 2. Botão "Consultar Status" ✅
**Antes:** Não funcionava corretamente  
**Depois:** Pede código do pedido ou telefone/email

### 3. Busca de Pedido #PED000038 ⚠️
**Descoberta:** O pedido PED000038 **NÃO EXISTE** no banco  
**Último pedido:** PED000037  
**Sistema:** Funcionando corretamente (informa que não encontrou)

---

## 🧪 COMO TESTAR

### **Passo 1: Backend Rodando**
```bash
# Já está rodando na porta 5000 ✅
```

### **Passo 2: Abrir o Chat**
1. Abra: `http://localhost:3000`
2. Clique no ícone do chat (canto inferior direito 💬)

### **Passo 3: Testar Botão "Fazer um Pedido"**

**Clique em:** `🛒 Fazer um pedido`

**Deve exibir:**
```
🛒 Como fazer um pedido:

1️⃣ Acesse nosso catálogo: http://localhost:3000/catalogo
2️⃣ Escolha seus produtos favoritos
3️⃣ Adicione ao carrinho
4️⃣ Personalize (se desejar)
5️⃣ Finalize o pedido

💡 Você também pode fazer pedidos pelo WhatsApp!
📱 (11) 96769-6744
```

✅ **CORRETO:** Exibe instruções de como fazer pedido  
❌ **ERRADO:** Se exibir mensagem sobre consultar status

---

### **Passo 4: Testar Botão "Consultar Status"**

**Clique em:** `📦 Consultar status`

**Deve exibir:**
```
📦 Consultar status do pedido:

Para consultar seu pedido, informe:
• O código do pedido (ex: #PED000037), OU
• Seu telefone/email de cadastro

💡 Dica: Você pode digitar o código diretamente!
Exemplo: #PED000037

📱 Dúvidas? (11) 96769-6744
```

✅ **CORRETO:** Pede código ou telefone  
❌ **ERRADO:** Se exibir outra mensagem

---

### **Passo 5: Testar Busca de Pedido EXISTENTE**

**Digite no chat:** `#PED000037`

**Deve exibir:**
```
📦 Encontrei seu pedido!

👤 Cliente: Joazinho
🔖 Código: PED000037
✨ Status: Entregue
📅 Data da Entrega: 11/11/2025
⏰ Horário: [horário]
💰 Valor Total: R$ 12.00

[Mensagem sobre o status]

💬 Posso ajudar em algo mais? 🤖
```

✅ **CORRETO:** Encontra e exibe detalhes do pedido  
❌ **ERRADO:** Se não encontrar ou exibir erro

---

### **Passo 6: Testar Busca de Pedido INEXISTENTE**

**Digite no chat:** `#PED000038`

**Deve exibir:**
```
🔍 Pedido não encontrado!

Não encontrei nenhum pedido com o código PED000038.

Por favor, verifique:
• Se o código está correto
• Se há algum erro de digitação
• Se o pedido realmente existe

💡 Exemplos de códigos válidos:
• #PED000037
• PED000042

💬 Precisa de ajuda? Fale conosco:
📱 (11) 96769-6744
```

✅ **CORRETO:** Informa que não encontrou (porque realmente não existe!)  
❌ **ERRADO:** Se encontrar o pedido ou dar erro

---

## 📊 CÓDIGOS DE PEDIDO PARA TESTAR

### ✅ CÓDIGOS QUE EXISTEM (use estes):
- `#PED000037` ✅ Entregue
- `PED000037` ✅ Entregue (sem #)
- `#PED000036` ✅ Entregue
- `PED000035` ✅ Entregue
- `#PED000034` ✅ Entregue

### ❌ CÓDIGOS QUE NÃO EXISTEM:
- `#PED000038` ❌ Não existe
- `#PED000039` ❌ Não existe
- `#PED999999` ❌ Não existe

---

## 🎯 CHECKLIST DE TESTE

Marque conforme testa:

### Botões do Chat:
- [ ] Botão "Fazer um pedido" exibe instruções corretas
- [ ] Botão "Consultar status" pede código/telefone
- [ ] Outros botões funcionam (cardápio, pagamento, etc)

### Busca de Pedidos:
- [ ] `#PED000037` encontra o pedido
- [ ] `PED000037` (sem #) encontra o pedido
- [ ] `#PED000038` informa "não encontrado"
- [ ] Pedidos com letras minúsculas funcionam (`ped000037`)

### Visual:
- [ ] Chat abre corretamente
- [ ] Mensagens aparecem formatadas
- [ ] Botões de feedback (👍👎) funcionam
- [ ] Scroll automático funciona

---

## 🐛 SE ALGO NÃO FUNCIONAR

### Problema: Botões não aparecem
**Solução:** Recarregue a página (Ctrl+F5)

### Problema: Backend não responde
**Verificar:**
```bash
# Abrir novo terminal
cd backend
npm start
```

### Problema: Mensagens estranhas
**Solução:** Abra o console do navegador (F12) e veja os logs

---

## 📱 CONTATOS DE TESTE

Para testar "Consultar por telefone":
- **Telefone:** (11) 96769-6744
- **Email:** teste@email.com

---

## ✅ RESULTADO ESPERADO

Após todos os testes:

✅ Botão "Fazer um pedido" → Instruções corretas  
✅ Botão "Consultar status" → Pede código  
✅ Busca #PED000037 → Encontra pedido  
✅ Busca #PED000038 → Informa "não encontrado" (correto!)  
✅ Todas as demais funcionalidades → Funcionando

---

## 🎉 TUDO PRONTO!

Se todos os testes passarem, o sistema está **100% funcional**! 

**Tempo estimado de teste:** 3-5 minutos  
**Última atualização:** 16/11/2025
