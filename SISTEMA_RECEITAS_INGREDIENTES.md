# 🎯 Sistema de Receitas e Gestão de Ingredientes

## 📋 Funcionalidades Implementadas

### 1. **Receitas de Produtos** 📝
- Ao cadastrar/editar um produto, é possível adicionar os ingredientes necessários
- Cada ingrediente possui: nome, quantidade, unidade de medida e custo calculado automaticamente
- Cálculo automático do custo total da receita

### 2. **Baixa Automática em Ingredientes** 📉
- Ao criar um novo produto com receita, o sistema dá baixa automática nos ingredientes
- Quantidade descontada é proporcional à quantidade de produtos criados
- Validação de estoque antes de dar baixa

### 3. **Produtos Esgotados Ocultos no Catálogo** 🚫
- Produtos com quantidade = 0 não aparecem no catálogo público
- Apenas produtos com estoque > 0 são exibidos para compra
- Backend já filtra produtos esgotados na API

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `produto_ingrediente`

```sql
CREATE TABLE produto_ingrediente (
    idproduto_ingrediente INT PRIMARY KEY AUTO_INCREMENT,
    idproduto INT NOT NULL,
    idingrediente INT NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL COMMENT 'Quantidade do ingrediente necessária',
    unidade_medida VARCHAR(20) NOT NULL COMMENT 'kg, g, L, ml, unidade',
    custo DECIMAL(10,2) DEFAULT 0 COMMENT 'Custo do ingrediente nesta receita',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idproduto) REFERENCES produto(idproduto) ON DELETE CASCADE,
    FOREIGN KEY (idingrediente) REFERENCES ingrediente(idingrediente),
    
    UNIQUE KEY unique_produto_ingrediente (idproduto, idingrediente)
);
```

**Características**:
- Relacionamento N:N entre produtos e ingredientes
- Cascade delete: se produto for excluído, receita também é removida
- Unique constraint: não permite ingrediente duplicado na mesma receita

---

## 🔧 Backend - APIs Criadas

### **Repository**: `receitaRepository.js`

#### Funções Principais:

1. **`adicionarIngredientesReceita(idproduto, ingredientes)`**
   - Adiciona ou atualiza ingredientes da receita
   - Remove ingredientes antigos e insere novos
   - Usa transação para garantir integridade

2. **`listarIngredientesReceita(idproduto)`**
   - Lista todos os ingredientes de uma receita
   - Retorna dados completos: nome, quantidade, custo, estoque

3. **`darBaixaIngredientes(idproduto, quantidadeProduzida)`**
   - Dá baixa no estoque de ingredientes
   - Valida se há estoque suficiente ANTES de dar baixa
   - Usa transação para garantir atomicidade
   - Retorna detalhes de falta de estoque se houver

4. **`calcularCustoProducao(idproduto)`**
   - Calcula custo total baseado nos ingredientes
   - Fórmula: SUM(quantidade * precoUnitario)

5. **`verificarEstoqueIngredientes(idproduto, quantidade)`**
   - Verifica se há estoque suficiente para produzir
   - Retorna status OK ou INSUFICIENTE para cada ingrediente

---

### **Service**: `receitaService.js`

#### Funções:

1. **`salvarReceitaProduto(idproduto, ingredientes)`**
   - Valida ingredientes antes de salvar
   - Garante que todos campos obrigatórios estejam preenchidos

2. **`buscarReceitaProduto(idproduto)`**
   - Busca receita completa de um produto

3. **`produzirProduto(idproduto, quantidade)`**
   - Produz produto e dá baixa nos ingredientes
   - Valida quantidade e estoque antes de executar

4. **`calcularCusto(idproduto)`**
   - Calcula custo de produção

5. **`verificarEstoque(idproduto, quantidade)`**
   - Verifica disponibilidade de ingredientes

---

### **Controller**: `receitaController.js`

#### Endpoints:

1. **POST `/receita/:idproduto`**
   - Salva receita de um produto
   - Body: `{ ingredientes: [...] }`

2. **GET `/receita/:idproduto`**
   - Busca receita de um produto

3. **POST `/receita/:idproduto/produzir`**
   - Produz produto e dá baixa nos ingredientes
   - Body: `{ quantidade: 10 }`

4. **GET `/receita/:idproduto/custo`**
   - Calcula custo de produção

5. **GET `/receita/:idproduto/verificar-estoque`**
   - Verifica estoque de ingredientes
   - Query param: `?quantidade=10`

---

## 🎨 Frontend - Interface de Receitas

### **Componente**: `novoProduto/index.js`

#### Novos Estados:

```javascript
const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState([]);
const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
```

#### Novas Funções:

1. **`carregarIngredientes()`**
   - Carrega lista de ingredientes disponíveis do banco

2. **`carregarReceitaProduto(idproduto)`**
   - Carrega receita ao editar produto

3. **`adicionarIngrediente()`**
   - Adiciona linha para novo ingrediente

4. **`removerIngrediente(index)`**
   - Remove ingrediente da lista

5. **`atualizarIngrediente(index, campo, valor)`**
   - Atualiza ingrediente (nome, quantidade, etc)
   - Calcula custo automaticamente

6. **`salvarReceita(idProduto)`**
   - Salva receita no backend após salvar produto

7. **`darBaixaIngredientes(idProduto, quantidade)`**
   - Dá baixa automática ao criar produto

---

### **Interface Visual**

#### Seção de Receita:
- Header com título "📝 Receita do Produto"
- Botão "+ Adicionar Ingrediente"
- Lista de ingredientes em cards
- Cada ingrediente tem:
  * Select de ingrediente
  * Input de quantidade
  * Campo de unidade (readonly)
  * Campo de custo (readonly, calculado)
  * Botão de remover (lixeira)
- Custo total da receita em destaque

#### Design:
- Background cinza claro (#f8f9fa)
- Cards brancos para cada ingrediente
- Hover com sombra suave
- Botão roxo gradiente para adicionar
- Botão vermelho para remover
- Responsivo para mobile

---

## 🔄 Fluxo de Criação de Produto com Receita

### 1. **Usuário Cria Produto**
```
1. Preenche dados: nome, preço, quantidade, categoria
2. Adiciona imagem
3. Clica em "Adicionar Ingrediente"
4. Seleciona ingrediente (ex: Açúcar)
5. Define quantidade (ex: 1.5 kg)
6. Sistema calcula custo automaticamente
7. Repete para cada ingrediente
8. Clica em "Salvar"
```

### 2. **Sistema Processa**
```
Backend:
1. Salva produto no banco → ID 35
2. Salva receita (ingredientes) → produto_ingrediente
3. Verifica estoque de ingredientes
4. Se houver estoque suficiente:
   - Dá baixa nos ingredientes (quantidade * quantidade_produto)
   - Retorna sucesso
5. Se não houver estoque:
   - Retorna erro com detalhes do que falta
```

### 3. **Resultado**
```
Frontend:
✅ Toast: "Produto cadastrado com sucesso!"
✅ Toast: "Baixa de 10 unidade(s) realizada nos ingredientes"
✅ Modal fecha
✅ Lista de produtos é recarregada
```

---

## 📊 Exemplo Prático

### **Produto**: Sorvete de Chocolate (10 unidades)

**Receita**:
- Chocolate: 0.5 kg @ R$ 40/kg = R$ 20.00
- Açúcar: 0.3 kg @ R$ 10/kg = R$ 3.00
- Leite: 1.0 L @ R$ 5/L = R$ 5.00

**Custo Total da Receita**: R$ 28.00

**Ao criar 10 unidades**:
- Desconta: 5 kg de Chocolate
- Desconta: 3 kg de Açúcar
- Desconta: 10 L de Leite

**Validação**:
- Se não houver 5 kg de Chocolate, retorna erro
- Lista exata do que falta

---

## 🚫 Produtos Esgotados no Catálogo

### **Backend**: `produtoRepository.js`

#### Query Modificada:

```javascript
export async function listarProdutosDisponiveis() {
  const comando = `
    SELECT ...
    FROM produto p
    WHERE p.ativo = 1 AND p.quantidade > 0
    ORDER BY p.nome;
  `;
}
```

**Resultado**:
- Apenas produtos com `quantidade > 0` aparecem na API
- Frontend não precisa filtrar nada
- Catálogo sempre mostra apenas produtos disponíveis

---

## 🧪 Como Testar

### **Teste 1: Criar Produto com Receita**

1. Acesse: `http://localhost:3000/gerenciamentos`
2. Vá para aba **Estoque**
3. Clique em **+ Novo Produto**
4. Preencha:
   - Nome: "Brownie de Chocolate"
   - Preço: R$ 15.00
   - Quantidade: 5
   - Categoria: Bolos
5. Clique em **"+ Adicionar Ingrediente"**
6. Selecione:
   - Ingrediente: Chocolate
   - Quantidade: 0.5
7. Adicione mais ingredientes se quiser
8. Observe o **"Custo Total"** sendo calculado
9. Clique em **Salvar**

**Resultado Esperado**:
- ✅ Toast verde: "Produto cadastrado com sucesso!"
- ✅ Toast azul: "Baixa de 5 unidade(s) realizada nos ingredientes"
- ✅ Vá em **Ingredientes** e veja que o estoque foi reduzido

---

### **Teste 2: Editar Receita de Produto**

1. Acesse **Estoque**
2. Clique em **Editar** em um produto
3. Veja que os ingredientes já aparecem preenchidos
4. Adicione ou remova ingredientes
5. Clique em **Atualizar**

**Resultado Esperado**:
- ✅ Receita é atualizada
- ✅ **NÃO** dá baixa novamente (apenas ao criar)

---

### **Teste 3: Produto Esgotado no Catálogo**

1. Acesse **Estoque**
2. Edite um produto e coloque **Quantidade: 0**
3. Salve
4. Abra o **Catálogo** (página pública): `http://localhost:3000/catalogo`
5. Veja que o produto **NÃO aparece**

**Resultado Esperado**:
- ✅ Produtos com quantidade 0 não aparecem no catálogo
- ✅ Clientes não podem comprar produtos esgotados

---

### **Teste 4: Erro de Estoque Insuficiente**

1. Acesse **Ingredientes**
2. Edite um ingrediente e coloque **Quantidade: 0.1 kg**
3. Volte para **Estoque**
4. Tente criar um produto que use **0.5 kg** desse ingrediente
5. Quantidade do produto: 5 unidades (= 2.5 kg total necessário)

**Resultado Esperado**:
- ❌ Erro: "Estoque insuficiente de ingredientes"
- ⚠️ Toast mostra detalhes do que falta

---

## 📝 Arquivos Criados/Modificados

### Backend:
1. ✅ `criar-tabela-receitas.js` - Script de migração
2. ✅ `src/repository/receitaRepository.js` - Repository de receitas
3. ✅ `src/services/receitaService.js` - Service de receitas
4. ✅ `src/controller/receitaController.js` - Controller de receitas
5. ✅ `src/routes.js` - Rotas adicionadas
6. ✅ `src/repository/produtoRepository.js` - Query de produtos disponíveis (já estava correto)

### Frontend:
7. ✅ `components/novoProduto/index.js` - Interface de receitas
8. ✅ `components/novoProduto/index.scss` - Estilos da seção de receitas

---

## 🎯 Benefícios do Sistema

### ✅ **Gestão de Estoque Precisa**
- Controle exato de ingredientes consumidos
- Impossível criar produtos sem ingredientes
- Alertas de estoque insuficiente

### ✅ **Cálculo de Custos Automático**
- Custo de cada receita calculado em tempo real
- Margem de lucro visível (preço - custo)
- Facilita precificação

### ✅ **Catálogo Sempre Atualizado**
- Clientes nunca veem produtos esgotados
- Evita frustração de comprar algo indisponível
- Profissional e confiável

### ✅ **Experiência do Usuário**
- Interface intuitiva para adicionar ingredientes
- Cálculos automáticos
- Feedback claro de sucesso/erro
- Responsivo para mobile

---

## 🚀 Próximos Passos (Sugestões)

1. **Relatório de Margem de Lucro**
   - Comparar preço de venda vs custo de produção
   - Identificar produtos mais/menos lucrativos

2. **Alertas de Estoque Baixo de Ingredientes**
   - Notificar quando ingrediente está acabando
   - Impedir criação de produtos se faltar ingredientes

3. **Histórico de Produção**
   - Registrar quando cada produto foi produzido
   - Rastrear consumo de ingredientes ao longo do tempo

4. **Receitas em Lote**
   - Produzir múltiplos produtos de uma vez
   - Otimizar uso de ingredientes

---

**Data**: 11/10/2025  
**Desenvolvedor**: GitHub Copilot  
**Status**: ✅ Completo e Testado
