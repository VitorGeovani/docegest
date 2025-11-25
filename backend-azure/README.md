# Segredo do Sabor - Backend

API REST para gerenciamento de produtos, clientes e reservas de uma sorveteria artesanal.

## 📋 Requisitos

- Node.js (versão 14 ou superior)
- MySQL 8.0 ou superior
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=5000
DB_HOST=localhost
DB_DATABASE=segredodosabor
DB_USER=root
DB_PASSWORD=sua_senha
```

4. Importe o banco de dados:

Execute o script SQL `segredodosabor.sql` no seu MySQL.

5. Inicie o servidor:
```bash
npm start
```

O servidor estará disponível em `http://localhost:5000`

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controller/         # Controllers (camada de apresentação)
│   │   ├── boasVindasController.js
│   │   ├── clienteController.js
│   │   ├── produtoController.js
│   │   ├── reservaController.js
│   │   └── relatorioController.js
│   ├── services/          # Serviços (lógica de negócio)
│   │   ├── clienteService.js
│   │   ├── produtoService.js
│   │   └── reservaService.js
│   ├── repository/        # Repositórios (acesso a dados)
│   │   ├── connection.js
│   │   ├── clienteRepository.js
│   │   ├── produtoRepository.js
│   │   ├── reservaRepository.js
│   │   └── relatorioRepository.js
│   ├── tests/            # Testes unitários
│   │   ├── clienteService.test.js
│   │   └── produtoService.test.js
│   ├── routes.js         # Configuração de rotas
│   └── server.js         # Ponto de entrada da aplicação
├── storage/              # Armazenamento de imagens
├── .env                  # Variáveis de ambiente
└── package.json
```

## 🏗️ Arquitetura

O projeto segue o padrão de arquitetura em camadas:

### Controller Layer (Camada de Controle)
- Recebe requisições HTTP
- Valida entrada básica
- Chama os serviços apropriados
- Retorna respostas HTTP formatadas

### Service Layer (Camada de Serviço)
- Contém a lógica de negócio
- Realiza validações complexas
- Coordena operações entre múltiplos repositórios
- Lança exceções em caso de erro

### Repository Layer (Camada de Repositório)
- Acessa o banco de dados
- Executa queries SQL
- Retorna dados brutos

## 🔧 API Endpoints

### Produtos

#### Listar todos os produtos
```
GET /produto/listar
```

#### Listar produtos disponíveis (com estoque)
```
GET /produto
```

#### Buscar produto por ID
```
GET /produto/:id
```

#### Inserir novo produto
```
POST /produto/inserir
Content-Type: multipart/form-data

Body:
- nome: string
- descricao: string
- preco: number
- quantidade: number
- imagem: file
```

#### Atualizar produto
```
PUT /produto/:id
Content-Type: multipart/form-data

Body:
- nome: string
- descricao: string
- preco: number
- quantidade: number
- imagem: file (opcional)
```

#### Remover produto
```
DELETE /produto/:id
```

### Clientes

#### Listar todos os clientes
```
GET /cliente/listar
```

#### Inserir novo cliente
```
POST /cliente/inserir
Content-Type: application/json

Body:
{
  "nome": "string",
  "email": "string",
  "telefone": "string"
}
```

#### Verificar ou criar cliente
```
POST /cliente/verificar
Content-Type: application/json

Body:
{
  "nome": "string",
  "email": "string",
  "telefone": "string"
}
```

#### Atualizar cliente
```
PUT /cliente/:id
Content-Type: application/json

Body:
{
  "nome": "string",
  "email": "string",
  "telefone": "string"
}
```

#### Remover cliente
```
DELETE /cliente/:id
```

### Reservas

#### Listar todas as reservas
```
GET /reserva/listar
```

#### Listar reservas pendentes
```
GET /reserva/pendente
```

#### Criar nova reserva
```
POST /reserva/inserir
Content-Type: application/json

Body:
{
  "data": "YYYY-MM-DD",
  "horario": "HH:MM",
  "pontoEntrega": "string",
  "turno": "string",
  "totalGeral": number,
  "status": "Pendente",
  "pagamento": "string",
  "produtos": [...],
  "produtosComQuantidade": [...],
  "clienteId": number
}
```

#### Confirmar reserva
```
PUT /reserva/:id/confirmar
```

#### Cancelar reserva
```
PUT /reserva/:id/cancelar
Content-Type: application/json

Body:
{
  "produtos": [
    {
      "id": number,
      "quantidadeReservados": number
    }
  ]
}
```

#### Atualizar reserva
```
PUT /reserva/:id
```

#### Remover reserva
```
DELETE /reserva/:id
```

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

## 📝 Validações

### Produtos
- Nome é obrigatório
- Descrição é obrigatória
- Preço deve ser maior que zero
- Quantidade deve ser maior ou igual a zero

### Clientes
- Nome é obrigatório
- Email deve ser válido (conter @)
- Telefone é obrigatório

### Reservas
- Data de entrega é obrigatória
- Horário de entrega é obrigatório
- Ponto de entrega é obrigatório
- Turno é obrigatório
- Valor total deve ser maior que zero
- Forma de pagamento é obrigatória
- Cliente ID é obrigatório
- Deve conter pelo menos um produto
- Valida estoque antes de criar reserva

## 🛠️ Tecnologias Utilizadas

- **Express**: Framework web para Node.js
- **MySQL2**: Driver MySQL para Node.js
- **Multer**: Middleware para upload de arquivos
- **CORS**: Middleware para habilitar CORS
- **Dotenv**: Gerenciamento de variáveis de ambiente
- **Jest**: Framework de testes
- **Nodemon**: Auto-reload durante desenvolvimento

## 📊 Tratamento de Erros

A API retorna respostas HTTP padronizadas:

- `200 OK`: Sucesso
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

Formato de erro:
```json
{
  "erro": "Mensagem descritiva do erro"
}
```

## 👥 Autores

Projeto desenvolvido para a disciplina de Projeto Integrador.

## 📄 Licença

Este projeto é privado e de uso acadêmico.
