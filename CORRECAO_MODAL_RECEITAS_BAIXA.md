# 🔧 Correção: Layout Modal Receitas + Baixa Automática

## 📋 Problemas Identificados

### Problema 1: Layout Quebrado no Modal

**Sintomas**:
- Coluna "Custo (R$)" saindo para fora do modal
- Botão de excluir (🗑️) não visível
- Grid muito largo para o espaço disponível
- Campos sobrepondo a borda do modal

**Imagem 1**: Modal com layout quebrado
```
┌────────────────────────────────────────────┐
│ Ingrediente | Quantidade | Unidade | Custo│🗑️ ← Saindo fora
└────────────────────────────────────────────┘
```

**Causa Raiz**:
```scss
// ❌ ANTES: Grid rígido sem minmax
.ingrediente-row {
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    gap: 1rem;
}
```

- Colunas com tamanho fixo
- Sem `min-width: 0` para permitir encolhimento
- Gap muito grande (1rem)
- Botão sem `flex-shrink: 0`

### Problema 2: Baixa de Ingredientes Incompleta

**Situação ANTES**:
- ✅ Baixa automática ao **criar** produto novo
- ❌ **SEM** baixa ao **editar** produto existente
- ❌ **SEM** baixa proporcional ao aumentar quantidade

**Cenários com Problema**:

**Cenário 1: Edição sem baixa**
```
1. Criar produto "Bolo" com 5 unidades (baixa OK)
2. Editar "Bolo" e alterar receita (adicionar mais açúcar)
3. Salvar
4. ❌ Açúcar não teve baixa da nova quantidade
```

**Cenário 2: Aumento de quantidade**
```
1. Criar produto "Brigadeiro" com 10 unidades (baixa OK)
2. Editar "Brigadeiro" e aumentar para 20 unidades
3. Salvar
4. ❌ Ingredientes não tiveram baixa das 10 unidades adicionais
```

## ✅ Soluções Implementadas

### 1. **Correção do Layout Responsivo**

#### Grid Flexível com minmax:
```scss
.ingrediente-row {
    display: grid;
    grid-template-columns: 
        minmax(150px, 2fr)    // Ingrediente
        minmax(80px, 1fr)     // Quantidade
        minmax(60px, 0.8fr)   // Unidade
        minmax(80px, 1fr)     // Custo
        auto;                 // Botão excluir
    gap: 0.75rem; // Reduzido de 1rem
    align-items: end;
}
```

**Benefícios**:
- ✅ `minmax()`: Largura mínima e máxima
- ✅ Ingrediente: min 150px, cresce até 2x
- ✅ Quantidade: min 80px, cresce até 1x
- ✅ Unidade: min 60px, cresce até 0.8x (menor)
- ✅ Custo: min 80px, cresce até 1x
- ✅ Botão: auto (se ajusta ao conteúdo)

#### Inputs Flexíveis:
```scss
.form-group-inline {
    display: flex;
    flex-direction: column;
    min-width: 0; // ✅ Permite encolhimento

    label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; // ✅ "..." se muito longo
    }

    input, select {
        width: 100%;
        min-width: 0; // ✅ Pode encolher abaixo do content-size
    }
}
```

#### Botão de Excluir Fixo:
```scss
.btn-remove-ingrediente {
    min-width: 40px;
    padding: 0.625rem 0.75rem; // Reduzido
    flex-shrink: 0; // ✅ NÃO encolhe
}
```

### 2. **Baixa Automática Completa**

#### Lógica ao Criar Produto:
```javascript
// CRIAR NOVO PRODUTO
const response = await axios.post("http://localhost:5000/produto/inserir", formData);
const idProduto = response.data.id;

// Salvar receita
if (ingredientesSelecionados.length > 0) {
    await salvarReceita(idProduto);
    
    // ✅ Dar baixa na quantidade produzida
    const quantidadeProduzida = parseInt(produto.quantidade) || 1;
    await darBaixaIngredientes(idProduto, quantidadeProduzida);
}

toast.success("Produto cadastrado com sucesso!");
```

**Exemplo**:
```
Criar "Bolo de Chocolate" com 10 unidades
Receita: 1kg açúcar, 0.5kg chocolate

✅ POST /produto/inserir → id: 35
✅ POST /receita/35 → Receita salva
✅ POST /receita/35/produzir { quantidade: 10 }
    → Açúcar: -10kg (1kg × 10)
    → Chocolate: -5kg (0.5kg × 10)
```

#### Lógica ao Editar Produto:
```javascript
// EDITAR PRODUTO EXISTENTE
await axios.put(`http://localhost:5000/produto/${produtoEditando.id}`, formData);

// Salvar receita
if (ingredientesSelecionados.length > 0) {
    await salvarReceita(produtoEditando.id);
    
    // ✅ Calcular diferença de quantidade
    const quantidadeAnterior = produtoEditando.quantidade || 0;
    const quantidadeNova = parseInt(produto.quantidade) || 0;
    const diferenca = quantidadeNova - quantidadeAnterior;
    
    // ✅ Se aumentou, dar baixa na diferença
    if (diferenca > 0) {
        await darBaixaIngredientes(produtoEditando.id, diferenca);
    }
}

toast.success("Produto atualizado com sucesso!");
```

**Exemplo 1: Aumentar Quantidade**
```
Editar "Bolo de Chocolate"
Antes: 10 unidades
Depois: 15 unidades
Diferença: +5

✅ PUT /produto/35
✅ POST /receita/35 → Receita atualizada
✅ POST /receita/35/produzir { quantidade: 5 }
    → Açúcar: -5kg (1kg × 5)
    → Chocolate: -2.5kg (0.5kg × 5)
```

**Exemplo 2: Diminuir Quantidade (sem baixa)**
```
Editar "Bolo de Chocolate"
Antes: 15 unidades
Depois: 10 unidades
Diferença: -5 (negativo)

✅ PUT /produto/35
✅ POST /receita/35 → Receita atualizada
❌ SEM baixa (diferença negativa)
```

**Exemplo 3: Alterar Receita sem Mudar Quantidade**
```
Editar "Bolo de Chocolate"
Quantidade: 10 → 10 (sem mudança)
Receita: Adicionar 0.2kg cacau

✅ PUT /produto/35
✅ POST /receita/35 → Receita atualizada (com cacau)
❌ SEM baixa (diferença = 0)
⚠️ NOTA: Para dar baixa do cacau, aumentar quantidade (ex: 10 → 11)
```

## 📊 Comparação ANTES vs DEPOIS

### Layout do Modal

| Aspecto | ANTES | DEPOIS |
|---------|-------|--------|
| **Grid** | `2fr 1fr 1fr 1fr auto` | `minmax(150px, 2fr) minmax(80px, 1fr)...` |
| **Gap** | 1rem (muito largo) | 0.75rem (reduzido) |
| **Inputs** | Largura fixa | `width: 100%` + `min-width: 0` |
| **Labels** | Quebrava em várias linhas | `text-overflow: ellipsis` |
| **Botão Excluir** | Podia encolher | `flex-shrink: 0` (fixo) |
| **Padding Botão** | 0.625rem 0.875rem | 0.625rem 0.75rem |
| **Resultado** | ❌ Saindo fora | ✅ Cabe perfeitamente |

### Baixa de Ingredientes

| Situação | ANTES | DEPOIS |
|----------|-------|--------|
| **Criar produto** | ✅ Baixa automática | ✅ Baixa automática |
| **Editar produto** | ❌ SEM baixa | ✅ Baixa se aumentar qtd |
| **Aumentar qtd** | ❌ SEM baixa | ✅ Baixa da diferença |
| **Diminuir qtd** | N/A | ❌ SEM baixa (lógica) |
| **Alterar receita** | ❌ SEM baixa | ⚠️ Requer aumento qtd |

## 🧪 Casos de Teste

### Teste 1: Layout do Modal

**Passos**:
1. Recarregar frontend: `Ctrl + Shift + R`
2. Ir em Estoque → Editar qualquer produto
3. Scroll até "Receita do Produto (Ingredientes)"
4. Adicionar 3 ingredientes
5. Observar layout

**Resultado Esperado**:
- ✅ Todas as colunas visíveis
- ✅ Ingrediente | Quantidade | Unidade | Custo | 🗑️
- ✅ Botão 🗑️ totalmente visível
- ✅ Sem scroll horizontal
- ✅ Campos alinhados

### Teste 2: Criar Produto com Receita

**Cenário**: Brigadeiro (20 unidades)

**Passos**:
1. Estoque → Novo Produto
2. Nome: "Brigadeiro"
3. Quantidade: 20
4. Adicionar ingredientes:
   - Leite Condensado: 1 lata
   - Chocolate em Pó: 0.5 kg
   - Manteiga: 0.1 kg
5. Observar "Custo Total da Receita"
6. Salvar

**Resultado Esperado**:
```
✅ Toast: "Produto cadastrado com sucesso!"
✅ Toast: "Receita salva com sucesso!"
✅ Toast: "Baixa de 20 unidade(s) realizada nos ingredientes"

📊 Estoque Ingredientes (ANTES → DEPOIS):
- Leite Condensado: 50 latas → 30 latas (-20)
- Chocolate em Pó: 10kg → 0kg (-10kg = 0.5 × 20)
- Manteiga: 5kg → 3kg (-2kg = 0.1 × 20)
```

### Teste 3: Editar Produto e Aumentar Quantidade

**Cenário**: Bolo já existe com 10 unidades

**Passos**:
1. Estoque → Editar "Bolo de Chocolate"
2. Verificar quantidade atual: 10
3. Alterar quantidade para 15 (+5)
4. Salvar

**Resultado Esperado**:
```
✅ Toast: "Produto atualizado com sucesso!"
✅ Toast: "Receita salva com sucesso!" (se tiver receita)
✅ Toast: "Baixa de 5 unidade(s) realizada nos ingredientes"

📊 Se receita = 1kg açúcar + 0.5kg chocolate:
- Açúcar: antes - 5kg (1kg × 5)
- Chocolate: antes - 2.5kg (0.5kg × 5)
```

### Teste 4: Editar Produto Sem Mudar Quantidade

**Passos**:
1. Editar produto
2. Alterar descrição, preço, imagem
3. **NÃO** alterar quantidade
4. Salvar

**Resultado Esperado**:
```
✅ Toast: "Produto atualizado com sucesso!"
✅ Toast: "Receita salva com sucesso!" (se tiver receita)
❌ SEM toast de baixa (diferença = 0)
📊 Ingredientes: SEM alteração
```

### Teste 5: Editar Receita sem Aumentar Quantidade

**Passos**:
1. Editar "Bolo" (10 unidades)
2. Adicionar novo ingrediente: 0.2kg cacau
3. Quantidade continua 10
4. Salvar

**Resultado Esperado**:
```
✅ Receita atualizada com cacau
❌ SEM baixa do cacau (diferença qtd = 0)

⚠️ PARA DAR BAIXA DO CACAU:
- Opção 1: Aumentar quantidade (10 → 11)
- Opção 2: Manualmente dar baixa em Ingredientes
```

## 📝 Alterações Realizadas

### Arquivo: `frontend/src/components/novoProduto/index.scss`

#### Linha ~289: Grid Responsivo
```scss
// ANTES
grid-template-columns: 2fr 1fr 1fr 1fr auto;
gap: 1rem;

// DEPOIS
grid-template-columns: minmax(150px, 2fr) minmax(80px, 1fr) minmax(60px, 0.8fr) minmax(80px, 1fr) auto;
gap: 0.75rem;
```

#### Linha ~295: Inputs Flexíveis
```scss
// ADICIONADO
.form-group-inline {
    min-width: 0;
    
    label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    select, input {
        width: 100%;
        min-width: 0;
    }
}
```

#### Linha ~325: Botão Fixo
```scss
// ADICIONADO
.btn-remove-ingrediente {
    min-width: 40px;
    padding: 0.625rem 0.75rem; // Reduzido
    flex-shrink: 0; // Não encolhe
}
```

### Arquivo: `frontend/src/components/novoProduto/index.js`

#### Linha ~250: Lógica de Edição
```javascript
// ANTES
if (ingredientesSelecionados.length > 0) {
    await salvarReceita(produtoEditando.id);
}

// DEPOIS
if (ingredientesSelecionados.length > 0) {
    await salvarReceita(produtoEditando.id);
    
    // ✅ Calcular diferença e dar baixa
    const quantidadeAnterior = produtoEditando.quantidade || 0;
    const quantidadeNova = parseInt(produto.quantidade) || 0;
    const diferenca = quantidadeNova - quantidadeAnterior;
    
    if (diferenca > 0) {
        await darBaixaIngredientes(produtoEditando.id, diferenca);
    }
}
```

#### Linha ~265: Lógica de Criação (ajustada)
```javascript
// MELHORADO (já existia, mas refinado)
if (ingredientesSelecionados.length > 0) {
    await salvarReceita(idProduto);
    
    // ✅ Dar baixa da quantidade completa
    const quantidadeProduzida = parseInt(produto.quantidade) || 1;
    await darBaixaIngredientes(idProduto, quantidadeProduzida);
}
```

## 🎯 Benefícios

### 1. **Layout Profissional**
- ✅ Modal totalmente responsivo
- ✅ Todos os campos visíveis
- ✅ Botão de excluir sempre acessível
- ✅ Funciona em telas menores

### 2. **Baixa Automática Inteligente**
- ✅ Baixa ao criar produto
- ✅ Baixa ao aumentar quantidade
- ✅ Calcula diferença automaticamente
- ✅ 3 toasts informativos

### 3. **UX Melhorada**
- ✅ Feedback claro (toasts)
- ✅ Controle de estoque preciso
- ✅ Menos erros de estoque
- ✅ Processo automatizado

### 4. **Controle de Estoque**
- ✅ Estoque sempre atualizado
- ✅ Baixa proporcional à produção
- ✅ Evita estoque negativo (backend valida)
- ✅ Rastreabilidade completa

## ⚠️ Observações Importantes

### 1. Diminuir Quantidade NÃO Devolve Ingredientes

**Comportamento Atual**:
```
Editar produto: 20 → 10 unidades
❌ SEM devolução de ingredientes ao estoque
```

**Razão**: Lógica de negócio complexa
- Produto já foi produzido
- Ingredientes já foram usados
- Não faz sentido "devolver" ingredientes consumidos

**Solução Futura**: Sistema de "Desfazer Produção"
- Permitir estorno de produtos produzidos
- Devolver ingredientes ao estoque
- Requer auditoria e logs

### 2. Alterar Receita Sem Mudar Quantidade

**Comportamento Atual**:
```
Adicionar novo ingrediente à receita
Quantidade: 10 → 10 (sem mudança)
❌ SEM baixa do novo ingrediente
```

**Workaround**:
1. Aumentar quantidade temporariamente (10 → 11)
2. Sistema dá baixa de 1 unidade do novo ingrediente
3. Editar novamente e voltar para 10
4. Ajustar estoque manualmente se necessário

**Solução Futura**: Modal de confirmação
- "Detectamos mudanças na receita. Deseja dar baixa nos novos ingredientes?"
- Permitir produção avulsa de X unidades

### 3. Validação de Estoque no Backend

O backend já valida estoque insuficiente:
```javascript
// backend/src/repository/receitaRepository.js
if (estoqueAtual < quantidadeNecessaria) {
    return {
        sucesso: false,
        mensagem: 'Estoque insuficiente de ingredientes',
        faltaEstoque: [...]
    };
}
```

**Se faltar estoque**:
- ❌ Backend retorna erro
- ⚠️ Frontend mostra toast amarelo
- ✅ Produto é salvo
- ❌ Receita NÃO é salva
- ❌ Baixa NÃO é realizada

## 🔄 Fluxo Completo

### Criar Novo Produto

```
1. Preencher formulário
   ├─ Nome: "Brigadeiro Gourmet"
   ├─ Quantidade: 50
   └─ Receita:
      ├─ Leite Condensado: 1 lata
      ├─ Chocolate: 0.5kg
      └─ Manteiga: 0.1kg

2. Clicar em "Adicionar"

3. Frontend:
   ├─ Valida campos obrigatórios
   ├─ POST /produto/inserir
   ├─ Recebe id: 40
   ├─ POST /receita/40 (salvar receita)
   ├─ POST /receita/40/produzir { quantidade: 50 }
   └─ 3 toasts verdes

4. Backend:
   ├─ Salva produto no banco
   ├─ Salva receita no banco
   ├─ Verifica estoque de ingredientes
   ├─ Dá baixa:
   │  ├─ Leite Condensado: -50 latas
   │  ├─ Chocolate: -25kg (0.5 × 50)
   │  └─ Manteiga: -5kg (0.1 × 50)
   └─ Retorna sucesso

5. Usuário vê:
   ✅ "Produto cadastrado com sucesso!"
   ✅ "Receita salva com sucesso!"
   ✅ "Baixa de 50 unidade(s) realizada nos ingredientes"
```

### Editar Produto Existente

```
1. Clicar em "Editar" no produto
2. Modal abre com dados carregados
3. Alterar quantidade: 50 → 70 (+20)
4. Clicar em "Atualizar"

5. Frontend:
   ├─ PUT /produto/40
   ├─ POST /receita/40 (atualizar receita)
   ├─ Calcula diferença: 70 - 50 = 20
   ├─ POST /receita/40/produzir { quantidade: 20 }
   └─ 3 toasts

6. Backend:
   ├─ Atualiza produto
   ├─ Atualiza receita
   ├─ Dá baixa de 20 unidades:
   │  ├─ Leite Condensado: -20 latas
   │  ├─ Chocolate: -10kg
   │  └─ Manteiga: -2kg
   └─ Retorna sucesso
```

---

**Data da Correção**: 12 de outubro de 2025  
**Arquivos Modificados**:
- `frontend/src/components/novoProduto/index.scss` (+15 linhas modificadas)
- `frontend/src/components/novoProduto/index.js` (+10 linhas adicionadas)

**Tipo de Correção**: 
- Bug Fix (layout quebrado)
- Feature Enhancement (baixa automática completa)
- UX Improvement (toasts informativos)
