# 🎨 GUIA RÁPIDO - Adicionar Item com Ingredientes

## 🚀 COMO USAR

### **Passo 1: Abrir Modal**
```
Gerenciamentos → Ingredientes → Itens de Personalização
Clique em: ➕ Adicionar Item
```

### **Passo 2: Preencher Dados Básicos**
```
┌─────────────────────────────────────┐
│ Categoria: [RECHEIO ▼]             │
│ Nome: [Brigadeiro]                 │
│ Preço: [8.00]                      │
└─────────────────────────────────────┘
```

### **Passo 3: Adicionar Ingredientes** (Opcional)
```
┌─────────────────────────────────────┐
│ 📦 Ingredientes Utilizados          │
│         [+ Adicionar Ingrediente]   │
├─────────────────────────────────────┤
│ Ingrediente: [Chocolate ▼]         │
│ Qtd (kg): [0.100]       [🗑️]       │
├─────────────────────────────────────┤
│ Ingrediente: [Leite Condensado ▼]  │
│ Qtd (kg): [0.050]       [🗑️]       │
└─────────────────────────────────────┘
```

### **Passo 4: Salvar**
```
[Cancelar]  [✓ Adicionar Item]
```

---

## ✅ RESULTADO

```
┌────────────────────────────────────────┐
│  RECHEIO | Brigadeiro                  │
│  + R$ 8,00                             │
│  ✏️ Editar     🗑️ Excluir              │
├────────────────────────────────────────┤
│  📦 Ingredientes Utilizados            │
│  - Chocolate ao Leite (0,100kg)        │
│    5kg | Mín: 2kg                      │
│  - Leite Condensado (0,050kg)          │
│    10kg | Mín: 3kg                     │
└────────────────────────────────────────┘
```

---

## 🎯 QUANDO ADICIONAR INGREDIENTES?

### ✅ **SIM - Adicione para:**
- Recheios (Brigadeiro, Doce de Leite, Ganache)
- Coberturas (Chantilly, Glacê, Calda)
- Decorações comestíveis (Flores de açúcar)

### ❌ **NÃO - Deixe vazio para:**
- Vela de Aniversário
- Cartão Personalizado
- Embalagem Especial
- Topper Personalizado

---

## 💡 DICAS RÁPIDAS

### **Quantidade:**
- Use ponto (.) como decimal: `0.100`
- Não use vírgula: `0,100` ❌
- Mínimo: `0.001`
- Máximo: `999.999`

### **Botões:**
- **+ Adicionar Ingrediente:** Adiciona novo campo
- **🗑️:** Remove ingrediente da lista
- **Cancelar:** Fecha modal sem salvar
- **✓ Adicionar Item:** Salva tudo de uma vez

### **Validação:**
- Ingredientes são **opcionais**
- Quantidade deve ser **maior que zero**
- Ingredientes vazios são **ignorados automaticamente**

---

## 📊 EXEMPLOS PRONTOS

### **Brigadeiro:**
```
Categoria: RECHEIO
Nome: Brigadeiro
Preço: 8.00

Ingredientes:
1. Chocolate ao Leite - 0.100 kg
2. Leite Condensado - 0.050 kg
3. Manteiga - 0.020 kg
```

### **Ganache:**
```
Categoria: COBERTURA
Nome: Ganache de Chocolate
Preço: 12.00

Ingredientes:
1. Chocolate Meio Amargo - 0.200 kg
2. Creme de Leite - 0.150 ml
```

### **Vela de Aniversário:**
```
Categoria: EXTRAS
Nome: Vela de Aniversário
Preço: 5.00

Ingredientes:
(nenhum)
```

---

## ⚡ ATALHOS

| Ação | Tecla/Botão |
|------|-------------|
| Abrir modal | `➕ Adicionar Item` |
| Adicionar ingrediente | `+ Adicionar Ingrediente` |
| Remover ingrediente | `🗑️` em cada linha |
| Salvar | `✓ Adicionar Item` |
| Cancelar | `Cancelar` ou clicar fora |
| Fechar sem salvar | `ESC` ou clicar no overlay |

---

## 🐛 PROBLEMAS COMUNS

### **"Botão Adicionar está desabilitado"**
✅ Preencha Categoria e Nome do Item

### **"Ingrediente não aparece no select"**
✅ Verifique se há ingredientes cadastrados
✅ Recarregue a página (F5)

### **"Quantidade não aceita vírgula"**
✅ Use ponto: `0.100` ✓
✅ Não use vírgula: `0,100` ✗

### **"Item salvou mas ingredientes não"**
✅ Verifique se quantidade foi preenchida
✅ Verifique se quantidade > 0
✅ Veja console do navegador (F12)

---

## 🎉 PRONTO!

Agora você pode criar itens de personalização completos em uma única tela! 🚀

**Documentação Completa:** `FEATURE_VINCULAR_INGREDIENTES_ADICIONAR.md`
