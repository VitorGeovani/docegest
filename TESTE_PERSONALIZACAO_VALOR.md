# 🧪 GUIA DE TESTE: Personalização com Valor Acrescido

## ⚡ Teste Rápido - 3 minutos

### 📋 Pré-requisitos
- Backend rodando: `http://localhost:5000`
- Frontend compilado: `npm run build` ✅
- Navegador aberto: `http://localhost:3000`

---

## 🎯 Cenário 1: Adicionar e Personalizar

### Passos:
1. Acesse o catálogo
2. Localize "**Ferrero Rocher**" (ou qualquer produto com personalização)
3. Clique em **"Adicionar ao Carrinho"** 🛒
4. Clique no ícone flutuante do carrinho (canto direito)
5. Dentro do carrinho, clique no ícone de **paleta** 🎨
6. Selecione uma opção com acréscimo (ex: "Chantilly" → **+ R$ 2.00**)
7. Clique em **"Confirmar Personalização"**

### ✅ Resultados Esperados:

**ANTES da personalização:**
```
┌─────────────────────────────────┐
│ 🍫 Ferrero Rocher               │
│ R$ 12.00                        │
│                                 │
│ Quantidade: 1                   │
│ Subtotal: R$ 12.00              │
└─────────────────────────────────┘
```

**DEPOIS da personalização:**
```
┌─────────────────────────────────┐
│ 🍫 Ferrero Rocher               │
│ R$ 12.00                        │
│                                 │
│ ✨ Personalizações:             │
│ • Cobertura: Chantilly          │
│ + R$ 2.00                       │
│                                 │
│ Quantidade: 1                   │
│ Subtotal: R$ 14.00 ✅           │
└─────────────────────────────────┘

TOTAL: R$ 14.00 ✅
```

---

## 🔄 Cenário 2: Persistência (Recarregar)

### Passos:
1. Com o carrinho personalizado do Cenário 1
2. Pressione **F5** ou **Ctrl+R** (recarregar página)
3. Abra o carrinho novamente

### ✅ Resultados Esperados:
```
✅ Personalização ainda aparece
✅ "Chantilly" ainda está selecionado
✅ Valor continua R$ 14.00
✅ Nada foi perdido!
```

---

## ➕ Cenário 3: Adicionar Mais Unidades

### Passos:
1. Com o carrinho já tendo 1 Ferrero personalizado (R$ 14.00)
2. Volte ao catálogo
3. Adicione **outro** Ferrero Rocher (sem personalizar novamente)
4. Abra o carrinho

### ✅ Resultados Esperados:
```
┌─────────────────────────────────┐
│ 🍫 Ferrero Rocher               │
│ R$ 12.00                        │
│                                 │
│ ✨ Personalizações:             │
│ • Cobertura: Chantilly          │
│ + R$ 2.00                       │
│                                 │
│ Quantidade: 2 ✅ (aumentou!)    │
│ Subtotal: R$ 28.00 ✅           │
│            (14 × 2)             │
└─────────────────────────────────┘

TOTAL: R$ 28.00 ✅
```

**Importante:** A personalização foi **mantida** mesmo adicionando mais unidades!

---

## 🔍 Cenário 4: Verificar localStorage

### Passos:
1. Com o carrinho personalizado
2. Abra **DevTools** (F12)
3. Vá em **"Application"** (Chrome) ou **"Armazenamento"** (Firefox)
4. Clique em **"Local Storage"** → **http://localhost:3000**
5. Procure pela chave **`carrinho`**

### ✅ Resultado Esperado:
```json
{
  "itens": [
    {
      "id": 1,
      "nome": "Ferrero Rocher",
      "valor": 12.00,
      "quantidade": 1,
      "personalizacoes": [
        {
          "idopcao": 1,
          "idvalor": 4,
          "nome_opcao": "Cobertura",
          "nome_valor": "Chantilly",
          "preco": 2
        }
      ],
      "valor_acrescimo": 2.00  ✅
    }
  ]
}
```

---

## 🐛 Cenário 5: Verificar Console (Debug)

### Passos:
1. Abra **DevTools** (F12) → **Console**
2. Faça os passos do Cenário 1 (adicionar e personalizar)
3. Observe os logs

### ✅ Logs Esperados:
```javascript
🛒 Carrinho carregado do localStorage: [...]

// Ao adicionar produto:
💾 Carrinho salvo no localStorage: [{ id: 1, valor: 12, personalizacoes: [], valor_acrescimo: 0 }]

// Ao personalizar:
📝 Atualizando item no carrinho: { produtoId: 1, qtdPersonalizacoes: 1, valorAcrescimo: 2 }
✅ Item atualizado: { id: 1, valor: 12, personalizacoes: [...], valor_acrescimo: 2 }
🛒 Novo carrinho completo: [...]
💾 Carrinho salvo no localStorage: [...]
```

---

## ❌ Problemas Possíveis

### Problema 1: Valor não atualiza
**Sintoma:** Personalização aparece, mas valor continua R$ 12.00

**Verificar:**
```javascript
// Abra Console e digite:
JSON.parse(localStorage.getItem('carrinho'))

// Verifique se tem valor_acrescimo
```

**Solução:**
1. Limpe o carrinho (botão X no item)
2. Limpe o localStorage: `localStorage.clear()`
3. Recarregue a página (F5)
4. Adicione o produto novamente

### Problema 2: Personalização desaparece ao recarregar
**Sintoma:** Após F5, personalização some

**Verificar:**
```javascript
// Console:
localStorage.getItem('carrinho')
```

**Solução:**
- Verifique se o backend está rodando
- Tente com navegador anônimo (Ctrl+Shift+N)

### Problema 3: Erro ao personalizar
**Sintoma:** Clica em confirmar e nada acontece

**Verificar:**
```javascript
// Console deve mostrar:
📝 Atualizando item no carrinho: { ... }
```

**Solução:**
- Veja se há erros no console
- Verifique se o produto tem opções de personalização

---

## 🎨 Exemplo Visual Completo

### Estado Inicial (Carrinho Vazio)
```
┌─────────────────────────────────┐
│ 🛒 Meu Carrinho                 │
│                                 │
│ Seu carrinho está vazio         │
│ Adicione produtos deliciosos!   │
└─────────────────────────────────┘
```

### Após Adicionar Produto
```
┌─────────────────────────────────┐
│ 🛒 Meu Carrinho             [1] │
│                                 │
│ 🍫 Ferrero Rocher               │
│ R$ 12.00                        │
│ [−] 1 [+]                [🎨] 🗑│
│ R$ 12.00                        │
├─────────────────────────────────┤
│ Subtotal: R$ 12.00              │
│ TOTAL: R$ 12.00                 │
│                                 │
│ [Finalizar Pedido]              │
│ [Continuar Comprando]           │
└─────────────────────────────────┘
```

### Após Personalizar
```
┌─────────────────────────────────┐
│ 🛒 Meu Carrinho             [1] │
│                                 │
│ 🍫 Ferrero Rocher               │
│ R$ 12.00                        │
│                                 │
│ ✨ Personalizações:             │
│ • Cobertura: Chantilly          │
│ + R$ 2.00                       │
│                                 │
│ [−] 1 [+]                [🎨] 🗑│
│ R$ 14.00 ✅                     │
├─────────────────────────────────┤
│ Subtotal: R$ 14.00 ✅           │
│ TOTAL: R$ 14.00 ✅              │
│                                 │
│ [Finalizar Pedido]              │
│ [Continuar Comprando]           │
└─────────────────────────────────┘
```

---

## ✅ Checklist Final

Execute todos os cenários e marque:

- [ ] **Cenário 1:** Valor atualiza ao personalizar
- [ ] **Cenário 2:** Personalização persiste após F5
- [ ] **Cenário 3:** Personalização mantida ao adicionar quantidade
- [ ] **Cenário 4:** localStorage contém `valor_acrescimo`
- [ ] **Cenário 5:** Logs aparecem corretamente no console
- [ ] **Bonus:** Modal de personalização abre corretamente
- [ ] **Bonus:** Pode remover item personalizado
- [ ] **Bonus:** Total geral calcula corretamente com múltiplos itens

---

## 🚀 Se Tudo Funcionou

Você deve ver:

✅ Valores corretos em todos os lugares  
✅ Personalizações exibidas claramente  
✅ Persistência entre recarregamentos  
✅ Cálculos precisos  

**Status:** 🎉 **PERSONALIZAÇÃO FUNCIONANDO PERFEITAMENTE!**

---

## 📞 Se Algo Não Funcionar

1. **Verifique o Console** (F12 → Console)
   - Procure por erros em vermelho
   - Copie a mensagem de erro

2. **Limpe o Cache**
   ```
   Ctrl + Shift + Delete
   → Limpar cache e cookies
   → Recarregar página
   ```

3. **Teste Novamente**
   - Limpe o carrinho
   - Adicione produto novamente
   - Personalize novamente

---

**Tempo estimado:** 3-5 minutos  
**Dificuldade:** Fácil ⭐  
**Status:** ✅ Pronto para testar
