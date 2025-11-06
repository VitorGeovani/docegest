# Documentação da API - Segredo do Sabor

## Visão Geral

Esta API REST foi desenvolvida para gerenciar o sistema de vendas e reservas de uma sorveteria artesanal. A API segue os princípios RESTful e retorna dados no formato JSON.

## Arquitetura

O projeto utiliza uma arquitetura em três camadas:

```
Cliente → Controller → Service → Repository → Banco de Dados
```

### Camadas

1. **Controller**: Responsável por receber requisições HTTP, validar entrada básica e retornar respostas adequadas
2. **Service**: Contém toda a lógica de negócio, validações complexas e regras de negócio
3. **Repository**: Gerencia o acesso aos dados, executa queries SQL e retorna dados brutos

## Padrões de Resposta

### Sucesso

```json
{
  "id": 1,
  "mensagem": "Operação realizada com sucesso"
}
```

### Erro

```json
{
  "erro": "Descrição detalhada do erro"
}
```

## Códigos de Status HTTP

| Código | Significado | Quando usar |
|--------|-------------|-------------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados de entrada inválidos |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro interno do servidor |

## Endpoints

### Produtos

#### 1. Listar Todos os Produtos

**Endpoint:** `GET /produto/listar`

**Descrição:** Retorna todos os produtos cadastrados no sistema, incluindo aqueles sem estoque.

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "nome": "Sorvete de Chocolate",
    "descricao": "Sorvete artesanal de chocolate belga",
    "preco": 15.00,
    "quantidade": 10,
    "dataCriacao": "2025-01-01T00:00:00.000Z",
    "dataValidade": "2025-06-01T00:00:00.000Z",
    "ativo": 1,
    "caminhoImagem": "1234567890-123456789.jpg"
  }
]
```

#### 2. Listar Produtos Disponíveis

**Endpoint:** `GET /produto`

**Descrição:** Retorna apenas produtos com estoque disponível (quantidade > 0).

**Resposta:** Mesmo formato do endpoint anterior, mas filtrado.

#### 3. Buscar Produto por ID

**Endpoint:** `GET /produto/:id`

**Parâmetros:**
- `id` (path): ID do produto

**Resposta de Sucesso:**
```json
{
  "id": 1,
  "nome": "Sorvete de Chocolate",
  "descricao": "Sorvete artesanal de chocolate belga",
  "preco": 15.00,
  "quantidade": 10,
  "caminhoImagem": "1234567890-123456789.jpg"
}
```

**Resposta de Erro (404):**
```json
{
  "erro": "Erro ao buscar produto: Produto não encontrado"
}
```

#### 4. Inserir Novo Produto

**Endpoint:** `POST /produto/inserir`

**Content-Type:** `multipart/form-data`

**Body:**
```
nome: "Sorvete de Morango"
descricao: "Sorvete artesanal de morango orgânico"
preco: 18.00
quantidade: 15
imagem: [arquivo de imagem]
```

**Validações:**
- Nome é obrigatório e não pode estar vazio
- Descrição é obrigatória e não pode estar vazia
- Preço deve ser um número válido maior que zero
- Quantidade deve ser um número válido maior ou igual a zero
- Imagem é obrigatória

**Resposta de Sucesso (201):**
```json
{
  "id": 2
}
```

**Resposta de Erro (400):**
```json
{
  "erro": "Erro ao inserir produto: Nome do produto é obrigatório"
}
```

#### 5. Atualizar Produto

**Endpoint:** `PUT /produto/:id`

**Content-Type:** `multipart/form-data`

**Parâmetros:**
- `id` (path): ID do produto

**Body:**
```
nome: "Sorvete de Morango Premium"
descricao: "Sorvete artesanal de morango orgânico premium"
preco: 22.00
quantidade: 20
imagem: [arquivo de imagem - opcional]
```

**Validações:** Mesmas do endpoint de inserção

**Resposta de Sucesso:**
```json
{
  "mensagem": "Produto atualizado com sucesso!"
}
```

#### 6. Remover Produto

**Endpoint:** `DELETE /produto/:id`

**Parâmetros:**
- `id` (path): ID do produto

**Resposta de Sucesso:**
```json
{
  "mensagem": "Produto removido com sucesso!"
}
```

---

### Clientes

#### 1. Listar Todos os Clientes

**Endpoint:** `GET /cliente/listar`

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999"
  }
]
```

#### 2. Inserir Novo Cliente

**Endpoint:** `POST /cliente/inserir`

**Content-Type:** `application/json`

**Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "telefone": "11988888888"
}
```

**Validações:**
- Nome é obrigatório e não pode estar vazio
- Email deve ser válido (conter @)
- Telefone é obrigatório e não pode estar vazio

**Resposta de Sucesso (201):**
```json
{
  "id": 2
}
```

#### 3. Verificar ou Criar Cliente

**Endpoint:** `POST /cliente/verificar`

**Descrição:** Busca um cliente por email e telefone. Se não existir, cria um novo.

**Content-Type:** `application/json`

**Body:**
```json
{
  "nome": "Pedro Oliveira",
  "email": "pedro@email.com",
  "telefone": "11977777777"
}
```

**Resposta de Sucesso:**
```json
{
  "id": 3,
  "nome": "Pedro Oliveira",
  "email": "pedro@email.com",
  "telefone": "11977777777"
}
```

#### 4. Atualizar Cliente

**Endpoint:** `PUT /cliente/:id`

**Parâmetros:**
- `id` (path): ID do cliente

**Content-Type:** `application/json`

**Body:**
```json
{
  "nome": "João Silva Santos",
  "email": "joao.silva@email.com",
  "telefone": "11999999999"
}
```

**Resposta de Sucesso:**
```json
{
  "mensagem": "Cliente atualizado com sucesso!"
}
```

#### 5. Remover Cliente

**Endpoint:** `DELETE /cliente/:id`

**Parâmetros:**
- `id` (path): ID do cliente

**Resposta de Sucesso:**
```json
{
  "mensagem": "Cliente removido com sucesso!"
}
```

---

### Reservas

#### 1. Listar Todas as Reservas

**Endpoint:** `GET /reserva/listar`

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "dataEntrega": "2025-05-12",
    "horaEntrega": "16:00",
    "pontoEntrega": "P - Alimentação 1",
    "turno": "Manhã",
    "valorTotal": 48.00,
    "status": "Pendente",
    "pagamento": "Débito",
    "produtos": "[{...}]",
    "qtdReserva": "[{...}]",
    "idCliente": 1
  }
]
```

#### 2. Listar Reservas Pendentes

**Endpoint:** `GET /reserva/pendente`

**Descrição:** Retorna apenas reservas com status "Pendente", incluindo informações do cliente.

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "dataEntrega": "2025-05-12",
    "horaEntrega": "16:00",
    "pontoEntrega": "P - Alimentação 1",
    "turno": "Manhã",
    "valorTotal": 48.00,
    "status": "Pendente",
    "pagamento": "Débito",
    "produtos": "[{...}]",
    "qtdReserva": "[{...}]",
    "idCliente": 1,
    "nomeCliente": "João Silva",
    "telefoneCliente": "11999999999"
  }
]
```

#### 3. Criar Nova Reserva

**Endpoint:** `POST /reserva/inserir`

**Content-Type:** `application/json`

**Body:**
```json
{
  "data": "2025-05-15",
  "horario": "14:00",
  "pontoEntrega": "P - Alimentação 2",
  "turno": "Tarde",
  "totalGeral": 60.00,
  "status": "Pendente",
  "pagamento": "Crédito",
  "produtos": [
    {
      "id": 1,
      "nome": "Sorvete de Chocolate",
      "preco": 15.00,
      "quantidade": 4
    }
  ],
  "produtosComQuantidade": [
    {
      "id": 1,
      "quantidade": 4
    }
  ],
  "clienteId": 1
}
```

**Validações:**
- Data de entrega é obrigatória
- Horário de entrega é obrigatório
- Ponto de entrega é obrigatório
- Turno é obrigatório
- Valor total deve ser maior que zero
- Forma de pagamento é obrigatória
- Cliente ID é obrigatório
- Deve conter pelo menos um produto
- Valida se há estoque suficiente para todos os produtos

**Comportamento:**
- Valida estoque antes de criar a reserva
- Decrementa automaticamente a quantidade dos produtos em estoque
- Retorna erro se não houver estoque suficiente

**Resposta de Sucesso (201):**
```json
{
  "id": 2
}
```

**Resposta de Erro (400):**
```json
{
  "erro": "Erro ao inserir reserva: Estoque insuficiente para o produto \"Sorvete de Chocolate\". Disponível: 2, Solicitado: 4"
}
```

#### 4. Confirmar Reserva

**Endpoint:** `PUT /reserva/:id/confirmar`

**Parâmetros:**
- `id` (path): ID da reserva

**Descrição:** Altera o status da reserva de "Pendente" para "Confirmado".

**Resposta de Sucesso:**
```json
{
  "mensagem": "Reserva confirmada com sucesso!"
}
```

**Resposta de Erro (404):**
```json
{
  "erro": "Erro ao confirmar reserva: Reserva não encontrada ou já confirmada"
}
```

#### 5. Cancelar Reserva

**Endpoint:** `PUT /reserva/:id/cancelar`

**Parâmetros:**
- `id` (path): ID da reserva

**Content-Type:** `application/json`

**Body:**
```json
{
  "produtos": [
    {
      "id": 1,
      "quantidadeReservados": 4
    }
  ]
}
```

**Descrição:** 
- Altera o status da reserva para "Cancelado"
- Devolve os produtos ao estoque
- Usa transação para garantir integridade dos dados

**Resposta de Sucesso:**
```json
{
  "mensagem": "Reserva cancelada e produtos devolvidos ao estoque com sucesso!"
}
```

#### 6. Atualizar Reserva

**Endpoint:** `PUT /reserva/:id`

**Parâmetros:**
- `id` (path): ID da reserva

**Content-Type:** `application/json`

**Body:** Mesmo formato do endpoint de criação

**Resposta de Sucesso:**
```json
{
  "mensagem": "Reserva atualizada com sucesso!"
}
```

#### 7. Remover Reserva

**Endpoint:** `DELETE /reserva/:id`

**Parâmetros:**
- `id` (path): ID da reserva

**Resposta de Sucesso:**
```json
{
  "mensagem": "Reserva removida com sucesso!"
}
```

---

## Tratamento de Erros

### Tipos de Erros

#### 1. Erros de Validação (400)
Ocorrem quando os dados fornecidos não atendem aos requisitos:
```json
{
  "erro": "Erro ao inserir produto: Nome do produto é obrigatório; Preço deve ser um número válido maior que zero"
}
```

#### 2. Erros de Recurso Não Encontrado (404)
Ocorrem quando o recurso solicitado não existe:
```json
{
  "erro": "Erro ao buscar produto: Produto não encontrado"
}
```

#### 3. Erros Internos do Servidor (500)
Ocorrem quando há um problema no servidor:
```json
{
  "erro": "Erro ao listar produtos: Erro de conexão com o banco de dados"
}
```

### Boas Práticas

1. **Sempre valide os dados no cliente antes de enviar**
2. **Trate os erros apropriadamente no frontend**
3. **Use os códigos de status HTTP para determinar o tipo de erro**
4. **Leia as mensagens de erro para entender o problema**

---

## Upload de Imagens

### Configuração

- As imagens são armazenadas no diretório `/storage`
- Formato do nome: `{timestamp}-{random}.{extensão}`
- Extensões permitidas: jpg, jpeg, png, gif

### Acesso às Imagens

As imagens podem ser acessadas através da URL:
```
http://localhost:5000/storage/{nome-do-arquivo}
```

Exemplo:
```
http://localhost:5000/storage/1234567890-123456789.jpg
```

---

## Testes

### Executar Testes

```bash
npm test
```

### Cobertura de Testes

O projeto mantém uma cobertura mínima de 70% em:
- Branches
- Functions
- Lines
- Statements

### Estrutura dos Testes

Os testes estão organizados por serviço:
- `clienteService.test.js`: Testes do serviço de clientes
- `produtoService.test.js`: Testes do serviço de produtos

---

## Segurança

### Boas Práticas Implementadas

1. **Validação de Entrada**: Todos os dados são validados antes do processamento
2. **Transações de Banco**: Operações críticas usam transações para garantir integridade
3. **Tratamento de Erros**: Erros são capturados e tratados adequadamente
4. **Variáveis de Ambiente**: Credenciais sensíveis são armazenadas em variáveis de ambiente

---

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
