# 🔧 Guia de Correção - Produtos não aparecem na Análise de Custos

**Data:** 04 de Outubro de 2025  
**Problema:** Produtos com `ativo = 0` não aparecem na análise de custos  
**Solução:** Ativar todos os produtos e recalcular custos

---

## 📋 Arquivos Criados

### 1. `corrigir-produtos-ativos.sql` 
Script completo com diagnóstico detalhado e correções

### 2. `corrigir-produtos-ativos-simples.sql` ⭐ **RECOMENDADO**
Script simplificado e rápido (use este primeiro!)

---

## 🚀 Como Executar

### **OPÇÃO 1: Script Simples (Recomendado)**

1. **Abra o MySQL Workbench**

2. **Conecte ao servidor MySQL**

3. **Selecione o banco de dados:**
   ```sql
   USE segredodosabor;
   ```

4. **Abra o arquivo:**
   - Menu: `File` → `Open SQL Script`
   - Selecione: `corrigir-produtos-ativos-simples.sql`

5. **Execute o script completo:**
   - Pressione: `Ctrl + Shift + Enter`
   - Ou clique no ícone do raio ⚡

6. **Aguarde a conclusão** (deve levar menos de 5 segundos)

7. **Verifique os resultados** na aba "Output"

---

### **OPÇÃO 2: Comandos Manuais**

Se preferir executar manualmente no MySQL Workbench:

```sql
USE segredodosabor;

-- Desabilitar modo seguro
SET SQL_SAFE_UPDATES = 0;

-- 1. Ativar todos os produtos
UPDATE produto SET ativo = 1 WHERE ativo = 0 OR ativo IS NULL;

-- 2. Corrigir imagens
UPDATE produto SET img_Produto = 'default-product.jpg' 
WHERE img_Produto IS NULL OR img_Produto = '' OR img_Produto = 'undefined';

-- 3. Atribuir categorias
UPDATE produto SET idcategoria = 2 WHERE idcategoria IS NULL;

-- 4. Recalcular custos
UPDATE produto p
LEFT JOIN (
    SELECT r.idproduto, SUM(r.quantidade * i.preco_unitario) AS custo_total
    FROM receita r
    INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
    WHERE i.ativo = 1
    GROUP BY r.idproduto
) custos ON p.idproduto = custos.idproduto
SET p.custo_producao = IFNULL(custos.custo_total, 0);

-- Reabilitar modo seguro
SET SQL_SAFE_UPDATES = 1;

-- Verificar
SELECT COUNT(*) as total_ativos FROM produto WHERE ativo = 1;
```

---

## ✅ Verificação Final

Após executar o script, execute esta consulta para verificar:

```sql
SELECT 
    p.idproduto,
    p.nome,
    p.preco AS preco_venda,
    p.custo_producao,
    p.ativo,
    COUNT(r.idreceita) AS total_ingredientes
FROM produto p
LEFT JOIN receita r ON p.idproduto = r.idproduto
WHERE p.ativo = 1
GROUP BY p.idproduto, p.nome, p.preco, p.custo_producao, p.ativo
ORDER BY p.idproduto;
```

**Resultado esperado:**
- Todos os produtos devem ter `ativo = 1`
- Produtos com receitas devem ter `custo_producao > 0`

---

## 🔍 Diagnóstico (Antes da Correção)

Se quiser verificar o problema antes de corrigir:

```sql
-- Ver produtos inativos
SELECT idproduto, nome, ativo FROM produto WHERE ativo = 0 OR ativo IS NULL;

-- Ver produtos sem custo
SELECT idproduto, nome, custo_producao FROM produto WHERE custo_producao = 0;

-- Ver produtos sem receita
SELECT p.idproduto, p.nome, COUNT(r.idreceita) as total_receitas
FROM produto p
LEFT JOIN receita r ON p.idproduto = r.idproduto
GROUP BY p.idproduto, p.nome
HAVING total_receitas = 0;
```

---

## 🎯 Resultado Final

Após executar a correção:

✅ **Todos os produtos serão ativados** (`ativo = 1`)  
✅ **Imagens inválidas serão corrigidas**  
✅ **Categorias serão atribuídas**  
✅ **Custos de produção recalculados**  
✅ **Produtos aparecerão na Análise de Custos** 🎉

---

## 📊 Testando no Frontend

1. **Acesse o sistema:** `http://localhost:3000`

2. **Faça login** como administrador

3. **Navegue até:** `Gerenciamentos` → `Custos e Receitas`

4. **Verifique a seção:** "📊 Análise de Custos por Produto"

5. **Resultado esperado:**
   - Produtos devem aparecer listados
   - Custos calculados exibidos
   - Margem de lucro calculada

---

## 🆘 Solução de Problemas

### Erro: "Safe update mode"

**Solução 1 - No script:**
```sql
SET SQL_SAFE_UPDATES = 0;
-- ... suas queries ...
SET SQL_SAFE_UPDATES = 1;
```

**Solução 2 - No Workbench:**
1. Menu: `Edit` → `Preferences`
2. Seção: `SQL Editor`
3. Desmarque: "Safe Updates"
4. Clique: `OK`
5. **Reconecte ao banco** (importante!)

### Produtos ainda não aparecem

**Verifique:**
```sql
-- 1. Produtos ativos?
SELECT COUNT(*) FROM produto WHERE ativo = 1;

-- 2. Backend rodando?
-- No terminal: npm start (na pasta backend)

-- 3. Frontend conectado?
-- Verifique console do navegador (F12)
```

---

## 📝 Notas Importantes

- ⚠️ O script é **seguro** e não apaga dados
- ✅ Apenas **ativa** produtos existentes
- 🔄 Pode ser executado **múltiplas vezes** sem problemas
- 💾 Faz **backup** antes se quiser segurança extra

---

## 🎓 Entendendo o Problema

### Por que os produtos não aparecem?

A query do frontend filtra apenas produtos ativos:

```javascript
// frontend/src/components/custosReceitas/index.js
const response = await api.get('/produtos?ativo=1');
```

Se `ativo = 0` ou `NULL`, os produtos são **ignorados** pela API.

### Solução definitiva

Garantir que todos os produtos tenham:
- ✅ `ativo = 1` (visível)
- ✅ `idcategoria` definido
- ✅ `custo_producao` calculado (se tiver receita)
- ✅ `img_Produto` válido

---

## 📞 Suporte

Se ainda tiver problemas:

1. Verifique os logs do backend
2. Verifique o console do navegador (F12)
3. Execute o script de diagnóstico completo
4. Revise a documentação em `API_DOCUMENTATION.md`

---

**✅ Após seguir este guia, seus produtos aparecerão na análise de custos!** 🎉
