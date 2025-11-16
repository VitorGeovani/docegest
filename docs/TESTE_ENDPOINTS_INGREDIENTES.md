# 🧪 Guia de Testes - Endpoints de Ingredientes

## 📡 Servidor Ativo

✅ **Backend rodando em**: `http://localhost:5000`

---

## 🔧 Ferramentas de Teste

Você pode testar os endpoints usando:
- **Postman** (recomendado)
- **Insomnia**
- **cURL** (linha de comando)
- **Thunder Client** (extensão VS Code)
- **REST Client** (extensão VS Code)

---

## 📋 Endpoints Disponíveis

### 1. **Listar Todos os Ingredientes**
```http
GET http://localhost:5000/ingrediente/listar
```

**Resposta esperada:**
```json
{
  "ingredientes": [
    {
      "idingrediente": 1,
      "nome": "Chocolate ao Leite",
      "unidadeMedida": "kg",
      "precoUnitario": 35.00,
      "quantidadeEstoque": 5.000,
      "estoqueMinimo": 1.000,
      "fornecedor": "Fornecedor XYZ",
      "ativo": 1,
      "dataCriacao": "2025-10-04T18:30:00.000Z"
    }
  ]
}
```

---

### 2. **Buscar Ingrediente por ID**
```http
GET http://localhost:5000/ingrediente/1
```

**Resposta esperada:**
```json
{
  "ingrediente": {
    "idingrediente": 1,
    "nome": "Chocolate ao Leite",
    "unidadeMedida": "kg",
    "precoUnitario": 35.00,
    "quantidadeEstoque": 5.000,
    "estoqueMinimo": 1.000,
    "fornecedor": "Fornecedor XYZ",
    "ativo": 1
  }
}
```

---

### 3. **Inserir Novo Ingrediente** ⭐
```http
POST http://localhost:5000/ingrediente/inserir
Content-Type: application/json

{
  "nome": "Leite Condensado",
  "unidadeMedida": "kg",
  "precoUnitario": 12.50,
  "quantidadeEstoque": 10.000,
  "estoqueMinimo": 2.000,
  "fornecedor": "Nestlé"
}
```

**Resposta esperada:**
```json
{
  "mensagem": "Ingrediente inserido com sucesso",
  "idIngrediente": 2
}
```

---

### 4. **Atualizar Ingrediente**
```http
PUT http://localhost:5000/ingrediente/1
Content-Type: application/json

{
  "nome": "Chocolate Meio Amargo",
  "precoUnitario": 40.00,
  "quantidadeEstoque": 8.000
}
```

**Resposta esperada:**
```json
{
  "mensagem": "Ingrediente atualizado com sucesso"
}
```

---

### 5. **Remover Ingrediente (Soft Delete)**
```http
DELETE http://localhost:5000/ingrediente/1
```

**Resposta esperada:**
```json
{
  "mensagem": "Ingrediente removido com sucesso"
}
```

---

### 6. **Ingredientes com Estoque Baixo** 🚨
```http
GET http://localhost:5000/ingrediente/estoque/baixo
```

**Resposta esperada:**
```json
{
  "ingredientes": [
    {
      "idingrediente": 3,
      "nome": "Açúcar",
      "quantidadeEstoque": 0.500,
      "estoqueMinimo": 2.000,
      "unidadeMedida": "kg",
      "quantidadeNecessaria": 1.500
    }
  ]
}
```

---

### 7. **Registrar Movimentação de Estoque** ⭐⭐⭐
```http
POST http://localhost:5000/ingrediente/movimentacao
Content-Type: application/json

{
  "idIngrediente": 1,
  "tipo": "ENTRADA",
  "quantidade": 5.000,
  "valorUnitario": 35.00,
  "motivo": "Compra mensal de chocolate"
}
```

**Para saída (uso em produção):**
```json
{
  "idIngrediente": 1,
  "tipo": "SAIDA",
  "quantidade": 0.500,
  "motivo": "Produção de 10 cones de chocolate"
}
```

**Resposta esperada:**
```json
{
  "mensagem": "Movimentação registrada com sucesso",
  "novoEstoque": 10.000
}
```

---

### 8. **Histórico de Movimentações**
```http
GET http://localhost:5000/ingrediente/movimentacao/listar?idIngrediente=1
```

**Sem filtro (todas as movimentações):**
```http
GET http://localhost:5000/ingrediente/movimentacao/listar
```

**Resposta esperada:**
```json
{
  "movimentacoes": [
    {
      "idmovimentacao": 1,
      "idingrediente": 1,
      "nomeIngrediente": "Chocolate ao Leite",
      "tipo": "ENTRADA",
      "quantidade": 5.000,
      "valorUnitario": 35.00,
      "valorTotal": 175.00,
      "saldoAnterior": 5.000,
      "saldoAtual": 10.000,
      "motivo": "Compra mensal",
      "dataMovimentacao": "2025-10-04T19:00:00.000Z"
    }
  ]
}
```

---

### 9. **Gerar Lista de Compras Automática** 🛒
```http
GET http://localhost:5000/ingrediente/lista-compras
```

**Resposta esperada:**
```json
{
  "listaCompras": [
    {
      "idingrediente": 3,
      "nome": "Açúcar",
      "quantidadeEstoque": 0.500,
      "estoqueMinimo": 2.000,
      "quantidadeComprar": 5.000,
      "unidadeMedida": "kg",
      "precoUnitario": 4.50,
      "valorEstimado": 22.50,
      "fornecedor": "Açúcar União"
    }
  ],
  "valorTotalEstimado": 22.50
}
```

---

## 🧪 Sequência de Testes Recomendada

### Teste 1: Cadastro Básico
```bash
# 1. Inserir chocolate
POST /ingrediente/inserir
{
  "nome": "Chocolate ao Leite",
  "unidadeMedida": "kg",
  "precoUnitario": 35.00,
  "quantidadeEstoque": 5.000,
  "estoqueMinimo": 1.000,
  "fornecedor": "Garoto"
}

# 2. Inserir leite condensado
POST /ingrediente/inserir
{
  "nome": "Leite Condensado",
  "unidadeMedida": "kg",
  "precoUnitario": 12.50,
  "quantidadeEstoque": 10.000,
  "estoqueMinimo": 2.000,
  "fornecedor": "Nestlé"
}

# 3. Inserir açúcar
POST /ingrediente/inserir
{
  "nome": "Açúcar",
  "unidadeMedida": "kg",
  "precoUnitario": 4.50,
  "quantidadeEstoque": 0.500,
  "estoqueMinimo": 2.000,
  "fornecedor": "União"
}

# 4. Listar todos
GET /ingrediente/listar
```

---

### Teste 2: Controle de Estoque
```bash
# 1. Registrar entrada de chocolate (compra)
POST /ingrediente/movimentacao
{
  "idIngrediente": 1,
  "tipo": "ENTRADA",
  "quantidade": 10.000,
  "valorUnitario": 35.00,
  "motivo": "Compra mensal"
}

# 2. Registrar saída (produção)
POST /ingrediente/movimentacao
{
  "idIngrediente": 1,
  "tipo": "SAIDA",
  "quantidade": 0.300,
  "motivo": "Produção de 10 cones"
}

# 3. Ver histórico
GET /ingrediente/movimentacao/listar?idIngrediente=1
```

---

### Teste 3: Alertas e Lista de Compras
```bash
# 1. Ver ingredientes com estoque baixo
GET /ingrediente/estoque/baixo

# 2. Gerar lista de compras
GET /ingrediente/lista-compras
```

---

## 🔥 Testando com cURL (Windows PowerShell)

### Listar ingredientes:
```powershell
curl http://localhost:5000/ingrediente/listar
```

### Inserir ingrediente:
```powershell
$body = @{
    nome = "Chocolate ao Leite"
    unidadeMedida = "kg"
    precoUnitario = 35.00
    quantidadeEstoque = 5.000
    estoqueMinimo = 1.000
    fornecedor = "Garoto"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/ingrediente/inserir" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

### Registrar movimentação:
```powershell
$body = @{
    idIngrediente = 1
    tipo = "ENTRADA"
    quantidade = 10.000
    valorUnitario = 35.00
    motivo = "Compra mensal"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/ingrediente/movimentacao" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

---

## 📊 Validações Implementadas

### ✅ Nome do Ingrediente:
- Obrigatório
- Mínimo 2 caracteres
- Máximo 100 caracteres

### ✅ Unidade de Medida:
- Obrigatório
- Valores permitidos: `kg`, `g`, `L`, `ml`, `unidade`

### ✅ Preço Unitário:
- Obrigatório
- Deve ser maior que 0

### ✅ Quantidade em Estoque:
- Obrigatório
- Deve ser maior ou igual a 0

### ✅ Estoque Mínimo:
- Obrigatório
- Deve ser maior ou igual a 0

### ✅ Tipo de Movimentação:
- Obrigatório
- Valores permitidos: `ENTRADA`, `SAIDA`, `AJUSTE`

---

## 🚨 Tratamento de Erros

### Exemplo de erro de validação:
```json
{
  "erro": "Nome do ingrediente é obrigatório"
}
```

### Exemplo de ingrediente não encontrado:
```json
{
  "erro": "Ingrediente não encontrado"
}
```

### Exemplo de estoque insuficiente:
```json
{
  "erro": "Estoque insuficiente para saída"
}
```

---

## 💡 Dicas

1. **Use Postman Collections**: Salve todos os testes em uma collection
2. **Variáveis de ambiente**: Configure `{{baseUrl}}` = `http://localhost:5000`
3. **Scripts de teste**: Adicione `Tests` no Postman para validar respostas
4. **Organize**: Crie pastas por módulo (Ingredientes, Produtos, Vendas)

---

## 🎯 Próximos Testes

Após validar os endpoints de ingredientes, você pode testar:

1. ✅ **Receitas**: Criar receitas associando ingredientes aos produtos
2. ✅ **Cálculo de custos**: Calcular custo de produção automaticamente
3. ✅ **Relatórios**: Views de análise de custos
4. ✅ **Dashboard**: Visualizar dados em tempo real

---

## ✨ Status dos Endpoints

| Endpoint | Status | Testado |
|----------|--------|---------|
| GET /ingrediente/listar | ✅ Ativo | ⏳ Pendente |
| GET /ingrediente/:id | ✅ Ativo | ⏳ Pendente |
| POST /ingrediente/inserir | ✅ Ativo | ⏳ Pendente |
| PUT /ingrediente/:id | ✅ Ativo | ⏳ Pendente |
| DELETE /ingrediente/:id | ✅ Ativo | ⏳ Pendente |
| GET /ingrediente/estoque/baixo | ✅ Ativo | ⏳ Pendente |
| POST /ingrediente/movimentacao | ✅ Ativo | ⏳ Pendente |
| GET /ingrediente/movimentacao/listar | ✅ Ativo | ⏳ Pendente |
| GET /ingrediente/lista-compras | ✅ Ativo | ⏳ Pendente |

---

**Desenvolvido com ❤️ para o DoceGest MVP**  
**Outubro/2025**
