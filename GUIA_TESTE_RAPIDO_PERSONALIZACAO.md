# 🧪 GUIA RÁPIDO - Testar Personalização

## ⚠️ **PROBLEMA**: Modal não aparece?

### **CAUSA**: Nenhum produto foi associado às opções de personalização!

---

## ✅ **SOLUÇÃO RÁPIDA (3 passos)**

### **1. Execute a migração** (se ainda não fez)
```bash
cd backend
node executar-migracao-personalizacao.js
```
**Resultado esperado:**
- ✅ 4 tabelas criadas
- ✅ 5 opções criadas (Recheio, Cobertura, Decoração, Tamanho, Extras)
- ✅ 20+ valores com preços

---

### **2. Execute o script de teste**
```bash
node testar-personalizacao.js
```

**O que o script faz:**
1. Lista produtos disponíveis
2. Lista opções de personalização
3. **Associa automaticamente** a primeira opção ao primeiro produto
4. Testa o cálculo de acréscimo
5. Mostra instruções

**Resultado esperado:**
```
✅ Associação criada com sucesso!
✅ Produto tem 1 opção(ões) de personalização!
   - Recheio (4 valores)
     • Morango - R$ 5.00
     • Chocolate - R$ 4.00
     • Doce de Leite - R$ 6.00
```

---

### **3. Teste no frontend**

#### **Opção A: Via navegador**
1. Abra: `http://localhost:3000/catalogo`
2. **Abra o Console do navegador** (F12)
3. Clique em qualquer produto
4. Veja os logs:
   ```
   Produto Bolo de Chocolate (ID: 1) tem personalização: true
   Opções disponíveis: [...]
   ```
5. Se `tem personalização: true`, o modal deve abrir!

#### **Opção B: Via admin**
1. Acesse: `http://localhost:3000/personalizacaoAdmin`
2. Veja as opções cadastradas
3. Clique em "Produto" para associar a outros produtos
4. Digite o ID do produto quando solicitado

---

## 🔍 **DIAGNÓSTICO**

### **Verificar se backend está rodando:**
```bash
curl http://localhost:5000/personalizacao/opcoes
```
Deve retornar JSON com opções.

### **Verificar se produto tem opções:**
```bash
curl http://localhost:5000/personalizacao/produtos/1/opcoes
```
Se retornar `[]` vazio → Produto não tem opções associadas!

### **Associar manualmente via API:**
```bash
curl -X POST http://localhost:5000/personalizacao/produtos/1/opcoes \
  -H "Content-Type: application/json" \
  -d '{"idopcao": 1, "obrigatorio": true}'
```

---

## 🎯 **CHECKLIST COMPLETO**

- [ ] Backend rodando (`npm start` na pasta backend)
- [ ] Frontend rodando (`npm start` na pasta frontend)
- [ ] Migração executada (tabelas criadas)
- [ ] Opções de personalização existem (5 opções)
- [ ] Valores existem (20+ valores)
- [ ] **Produto associado a pelo menos 1 opção** ← CRÍTICO
- [ ] Console do navegador sem erros

---

## 🐛 **PROBLEMAS COMUNS**

### **Modal não abre mesmo com logs corretos**
- Verifique se importou corretamente: `import PersonalizacaoProduto from '../personalizacao'`
- Verifique se o componente está renderizado no final do JSX
- Verifique se `mostrarPersonalizacao` está sendo setado

### **Erro 404 ao buscar opções**
- Backend não está rodando
- Rota não registrada em `routes.js`

### **Produto não tem opções (array vazio)**
- Execute: `node testar-personalizacao.js`
- Ou associe manualmente via admin

### **Erro no console: "Cannot read property 'length' of undefined"**
- Backend retornou erro
- Stored procedure não existe (execute migração)

---

## 💡 **DICA RÁPIDA**

Se quiser testar AGORA sem configurar nada:

1. Execute no terminal:
```bash
cd backend
node testar-personalizacao.js
```

2. Recarregue o catálogo

3. Clique no **primeiro produto** da lista

4. Modal deve abrir! 🎉

---

## 📞 **AINDA NÃO FUNCIONA?**

Envie os logs do:
1. Console do navegador (F12)
2. Terminal do backend
3. Resultado do `node testar-personalizacao.js`
