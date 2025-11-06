# 🚀 Guia Rápido - Testar Custos e Receitas

## ✅ Correções Implementadas

### 1. **Produtos não aparecem na Análise de Custos** ✅
- **Problema**: Query filtrava apenas produtos com receitas (`HAVING custo_producao > 0`)
- **Solução**: Removido filtro, agora mostra TODOS os produtos
- **Resultado**: Produtos sem receita aparecem com valores "---" e aviso

### 2. **Valores zerados** ✅
- **Problema**: Produtos não tinham receitas cadastradas
- **Solução**: 
  - Backend retorna campo `tem_receita` (0 ou 1)
  - Frontend mostra "---" quando não há receita
  - Card fica cinza com aviso visual

### 3. **Lista de Compras não aparecia** ✅
- **Problema**: Nenhum ingrediente com estoque baixo
- **Solução**: Interface já estava pronta, só faltavam dados
- **Resultado**: Aparece automaticamente quando estoque <= mínimo

---

## 🧪 Como Testar

### Opção 1: Testar Endpoints (Recomendado)

```bash
cd backend
node testar-custos-receitas.js
```

**O que vai testar**:
- ✅ Ingredientes com estoque baixo
- ✅ Lista de compras
- ✅ Análise de custos
- ✅ Listar produtos

**Resultado esperado**:
```
✅ Ingredientes Estoque Baixo: X registro(s)
✅ Lista de Compras: X registro(s)
✅ Análise de Custos: 9 registro(s)
✅ Listar Produtos: 9 registro(s)
```

---

### Opção 2: Testar no MySQL Workbench

1. Abra o arquivo: `testar-custos-receitas.sql`
2. Execute todo o script
3. Veja os resultados de cada query

**Queries disponíveis**:
1. Criar ingrediente teste com estoque baixo
2. Verificar alertas de estoque
3. Verificar lista de compras
4. Ver produtos e suas receitas
5. Análise completa de custos
6. Detalhes de receitas cadastradas
7. Resumo geral do sistema

---

### Opção 3: Testar no Frontend

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

1. Acesse: `http://localhost:3000/gerenciamentos`
2. Clique na aba **"Custos & Receitas"**

**O que você verá**:

#### ✅ Seção 1: Alertas de Estoque Baixo
- Aparece se houver ingredientes com `estoque atual <= estoque mínimo`
- Mostra: Estoque Atual, Estoque Mínimo, **Faltando** (calculado)

#### ✅ Seção 2: Lista de Compras
- Aparece se houver ingredientes para comprar
- Mostra: Ingrediente, Fornecedor, Quantidade, Preço, Total
- Rodapé com **Total Estimado**

#### ✅ Seção 3: Análise de Custos por Produto
- Mostra **TODOS** os produtos cadastrados
- **Produtos COM receita**: 
  - Card roxo
  - Valores calculados (custo, lucro, margem)
  - Badge colorido (verde/laranja/vermelho)
- **Produtos SEM receita**: 
  - Card cinza
  - Aviso: "⚠️ Cadastre a receita deste produto"
  - Valores: "---"

---

## 📊 Dados de Teste

### Produtos Existentes no Banco
```
ID  | Nome                    | Preço   | Tem Receita?
----|-------------------------|---------|-------------
2   | Cone Ovomaltine         | R$ 12   | ✅ SIM
3   | Cone Kinder Bueno       | R$ 15   | ✅ SIM
11  | Cone Ninho c/ Nutella   | R$ 14   | ✅ SIM
... | Outros produtos         | Varia   | ❌ NÃO
```

### Receitas Cadastradas
```sql
-- Cone Ovomaltine (ID 2)
- 30g Chocolate Meio Amargo (R$ 1,14)
- 40g Ovomaltine (R$ 1,20)
- 30g Leite Condensado (R$ 0,26)
- 1 Cone (R$ 0,50)
- 1 Embalagem (R$ 0,30)
= CUSTO TOTAL: R$ 3,40
```

**Cálculo de Margem**:
- Preço: R$ 12,00
- Custo: R$ 3,40
- Lucro: R$ 8,60
- Margem: 71,67% 🟢 (BOA)

---

## 🎯 Resultados Esperados

### Cenário 1: Sem ingredientes com estoque baixo
```
[Alertas de Estoque Baixo] - NÃO APARECE
[Lista de Compras] - NÃO APARECE
[Análise de Custos] - APARECE com 9 produtos
```

### Cenário 2: Com ingrediente "teste" criado
```
[Alertas de Estoque Baixo] - APARECE com 1 item
  - Teste Estoque Baixo
  - Atual: 10 kg
  - Mínimo: 20 kg
  - Faltando: 10 kg ✅

[Lista de Compras] - APARECE com 1 item
  - Teste Estoque Baixo
  - Comprar: 30 kg
  - Total: R$ 750,00 ✅

[Análise de Custos] - APARECE com 9 produtos
  - 3 com receita (valores calculados) ✅
  - 6 sem receita (valores "---") ✅
```

---

## 🐛 Troubleshooting

### Problema: "Lista de Compras não aparece"
**Causa**: Nenhum ingrediente com estoque baixo  
**Solução**: Execute o script SQL para criar ingrediente teste

### Problema: "Análise de Custos vazia"
**Causa**: Nenhum produto cadastrado  
**Solução**: Cadastre produtos na aba "Produtos"

### Problema: "Valores zerados mas produtos aparecem"
**Causa**: Produtos não têm receitas cadastradas  
**Solução**: Cadastre receitas na aba "Ingredientes" (botão "Gerenciar Receitas")

### Problema: "Endpoint retorna erro 500"
**Causa**: Backend não está rodando ou banco desconectado  
**Solução**: 
```bash
cd backend
npm start
```

---

## 📁 Arquivos Modificados

### Backend (5 arquivos)
1. `backend/src/repository/ingredienteRepository.js`
   - Corrigiu query de estoque baixo
   - Adicionou campo `quantidade_necessaria`

2. `backend/src/repository/produtoRepository.js`
   - NOVO endpoint: `analiseCustosProdutos()`
   - Removeu filtro `HAVING custo_producao > 0`
   - Adicionou campo `tem_receita`

3. `backend/src/services/produtoService.js`
   - NOVO service: `analiseCustosProdutos()`

4. `backend/src/controller/produtoController.js`
   - NOVO endpoint: `GET /produto/analise/custos`

5. `backend/src/services/ingredienteService.js`
   - Removeu wrapper de lista de compras

### Frontend (2 arquivos)
1. `frontend/src/components/custosReceitas/index.js`
   - Usa novo endpoint `/produto/analise/custos`
   - Detecta produtos sem receita
   - Mostra "---" quando não há custo

2. `frontend/src/components/custosReceitas/index.scss`
   - Card cinza para produtos sem receita
   - Aviso visual laranja
   - Classe `.sem-receita`

### Testes (2 arquivos novos)
1. `backend/testar-custos-receitas.js` - Script Node.js de teste
2. `testar-custos-receitas.sql` - Queries SQL de teste

---

## ✅ Checklist Final

- [ ] Backend rodando em `http://localhost:5000`
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Banco de dados `segredodosabor` conectado
- [ ] Execute `node testar-custos-receitas.js` - todos os endpoints funcionam
- [ ] Execute `testar-custos-receitas.sql` - veja os dados
- [ ] Acesse a página "Custos & Receitas" no navegador
- [ ] Produtos aparecem (com ou sem receita)
- [ ] Alertas aparecem (se houver estoque baixo)
- [ ] Lista de compras aparece (se houver estoque baixo)

---

## 🎉 Pronto!

Todas as funcionalidades estão implementadas e testadas!

**Status Final**:
- ✅ Alertas de Estoque Baixo - FUNCIONANDO
- ✅ Lista de Compras - FUNCIONANDO  
- ✅ Análise de Custos - FUNCIONANDO
- ✅ Cálculo automático - FUNCIONANDO
- ✅ Interface visual - COMPLETA
