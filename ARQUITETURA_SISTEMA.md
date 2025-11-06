# 🏗️ Arquitetura da Solução - Segredo do Sabor
## Sistema Completo de Gestão de Confeitaria com E-commerce

**Versão**: 4.0 - DoceGest MVP  
**Data**: 13 de Outubro de 2025

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Arquitetura de Alto Nível](#arquitetura-de-alto-nível)
3. [Camadas da Aplicação](#camadas-da-aplicação)
4. [Fluxo de Dados](#fluxo-de-dados)
5. [Componentes Detalhados](#componentes-detalhados)
6. [Infraestrutura e Deploy](#infraestrutura-e-deploy)
7. [Segurança](#segurança)
8. [Integrações Externas](#integrações-externas)
9. [Escalabilidade](#escalabilidade)

---

## 🎯 Visão Geral da Arquitetura

O **Segredo do Sabor** é um sistema full-stack moderno desenvolvido com arquitetura cliente-servidor, seguindo os princípios de:

- **Separação de Responsabilidades** (SoC)
- **Arquitetura em Camadas** (Layered Architecture)
- **API RESTful** para comunicação
- **Stateless Authentication** com JWT
- **Responsividade** e Progressive Web App (PWA)

### Tecnologias Principais

| Camada | Tecnologia | Versão |
|--------|-----------|---------|
| **Frontend** | React | 18.x |
| **Backend** | Node.js + Express | 20.x / 4.x |
| **Banco de Dados** | MySQL | 8.0+ |
| **Autenticação** | JWT + Bcrypt | - |
| **Estilização** | SCSS | - |
| **Comunicação** | Axios (HTTP) | - |
| **Integrações** | Evolution API (WhatsApp) | - |

---

## 🏛️ Arquitetura de Alto Nível

```mermaid
graph TB
    subgraph "CAMADA DE APRESENTAÇÃO"
        USER[👤 Usuário]
        BROWSER[🌐 Navegador Web]
    end
    
    subgraph "FRONTEND - REACT SPA"
        PAGES[📄 Pages<br/>Home, Catálogo, Checkout, Admin]
        COMPONENTS[🧩 Components<br/>Cards, Headers, Modais]
        CONTEXT[🔄 Context API<br/>AuthContext]
        ROUTES[🛣️ React Router<br/>Navegação]
    end
    
    subgraph "CAMADA DE COMUNICAÇÃO"
        HTTP[📡 HTTP/HTTPS<br/>REST API]
        JWT[🔐 JWT Tokens<br/>Authentication]
    end
    
    subgraph "BACKEND - NODE.JS + EXPRESS"
        API[🚀 API Gateway<br/>Express Server]
        
        subgraph "Controllers"
            AUTH_CTRL[🔐 Auth]
            PROD_CTRL[📦 Produtos]
            PED_CTRL[🛒 Pedidos]
            ING_CTRL[🥚 Ingredientes]
            REL_CTRL[📊 Relatórios]
        end
        
        subgraph "Services"
            AUTH_SVC[Auth Service]
            PROD_SVC[Produto Service]
            RES_SVC[Reserva Service]
            ING_SVC[Ingrediente Service]
            REC_SVC[Receita Service]
        end
        
        subgraph "Repositories"
            CLIENT_REPO[Cliente Repo]
            PROD_REPO[Produto Repo]
            RES_REPO[Reserva Repo]
            ING_REPO[Ingrediente Repo]
            REC_REPO[Receita Repo]
        end
        
        MIDDLEWARE[🛡️ Middlewares<br/>Auth, Error Handler]
    end
    
    subgraph "CAMADA DE DADOS"
        DB[(🗄️ MySQL Database<br/>segredodosabor)]
        
        subgraph "Tabelas Principais"
            TB_CLIENT[cliente]
            TB_PROD[produto]
            TB_RES[reserva]
            TB_ING[ingrediente]
            TB_REC[receita]
        end
        
        subgraph "Views & Procedures"
            VIEWS[📊 Views<br/>Custos, Estoque]
            PROCS[⚙️ Procedures<br/>Cálculos]
            TRIGGERS[🔄 Triggers<br/>Automações]
        end
    end
    
    subgraph "INTEGRAÇÕES EXTERNAS"
        WHATSAPP[📱 WhatsApp<br/>Evolution API]
        EMAIL[📧 Email<br/>Nodemailer]
    end
    
    subgraph "ARMAZENAMENTO"
        STORAGE[💾 File Storage<br/>Imagens de Produtos]
    end
    
    USER --> BROWSER
    BROWSER --> PAGES
    PAGES --> COMPONENTS
    PAGES --> CONTEXT
    PAGES --> ROUTES
    
    COMPONENTS --> HTTP
    CONTEXT --> HTTP
    
    HTTP --> API
    JWT -.-> API
    
    API --> AUTH_CTRL
    API --> PROD_CTRL
    API --> PED_CTRL
    API --> ING_CTRL
    API --> REL_CTRL
    
    AUTH_CTRL --> AUTH_SVC
    PROD_CTRL --> PROD_SVC
    PED_CTRL --> RES_SVC
    ING_CTRL --> ING_SVC
    
    AUTH_SVC --> CLIENT_REPO
    PROD_SVC --> PROD_REPO
    RES_SVC --> RES_REPO
    ING_SVC --> ING_REPO
    REC_SVC --> REC_REPO
    
    API --> MIDDLEWARE
    
    CLIENT_REPO --> DB
    PROD_REPO --> DB
    RES_REPO --> DB
    ING_REPO --> DB
    REC_REPO --> DB
    
    DB --> TB_CLIENT
    DB --> TB_PROD
    DB --> TB_RES
    DB --> TB_ING
    DB --> TB_REC
    
    DB --> VIEWS
    DB --> PROCS
    DB --> TRIGGERS
    
    API --> WHATSAPP
    API --> EMAIL
    API --> STORAGE
    
    style USER fill:#e1f5ff
    style BROWSER fill:#fff3e0
    style API fill:#c8e6c9
    style DB fill:#f8bbd0
    style WHATSAPP fill:#b2dfdb
    style STORAGE fill:#d1c4e9
```

---

## 📊 Arquitetura Detalhada por Camadas

### 🎨 CAMADA 1: FRONTEND (React SPA)

```mermaid
graph LR
    subgraph "React Application"
        subgraph "Public Pages"
            HOME[🏠 Home]
            CATALOG[📚 Catálogo]
            CHECKOUT[🛒 Checkout]
            CONFIRM[✅ Confirmação]
        end
        
        subgraph "Authentication Pages"
            LOGIN[🔐 Login]
            REGISTER[📝 Cadastro]
            MY_ORDERS[📦 Meus Pedidos]
        end
        
        subgraph "Admin Pages"
            DASHBOARD[📊 Dashboard]
            MANAGE[⚙️ Gerenciamento]
            REPORTS[📈 Relatórios]
        end
        
        subgraph "Shared Components"
            HEADER[Header]
            FOOTER[Footer]
            CARDS[Cards]
            MODALS[Modais]
        end
        
        subgraph "State Management"
            AUTH_CTX[AuthContext<br/>Login/Logout]
            CART_STATE[Cart State<br/>LocalStorage]
        end
        
        subgraph "Services"
            API_CLIENT[API Client<br/>Axios]
            ROUTES_CFG[Routes Config<br/>React Router]
        end
    end
    
    HOME --> HEADER
    CATALOG --> HEADER
    CHECKOUT --> HEADER
    
    HOME --> FOOTER
    CATALOG --> FOOTER
    
    CATALOG --> CARDS
    MANAGE --> CARDS
    
    LOGIN --> AUTH_CTX
    REGISTER --> AUTH_CTX
    MY_ORDERS --> AUTH_CTX
    DASHBOARD --> AUTH_CTX
    
    CHECKOUT --> CART_STATE
    
    AUTH_CTX --> API_CLIENT
    CART_STATE --> API_CLIENT
    
    API_CLIENT -.REST API.-> BACKEND[Backend API]
    
    style HOME fill:#e1f5ff
    style DASHBOARD fill:#fff3e0
    style AUTH_CTX fill:#c8e6c9
    style API_CLIENT fill:#f8bbd0
```

#### Descrição dos Componentes Frontend

##### **Pages (Páginas)**

1. **Home** (`/`)
   - Landing page do site
   - Carrossel de produtos
   - Destaques e promoções
   - Navegação para catálogo

2. **Catálogo** (`/catalogo`)
   - Listagem de produtos disponíveis
   - Filtros por categoria
   - Busca de produtos
   - Adicionar ao carrinho

3. **Checkout** (`/checkout`)
   - Revisão do pedido
   - Seleção de entrega/retirada
   - Forma de pagamento
   - Finalização do pedido

4. **Meus Pedidos** (`/meus-pedidos`)
   - Histórico de pedidos
   - Rastreamento de status
   - Detalhes de cada pedido

5. **Dashboard Admin** (`/gerenciamentos`)
   - Visão geral do negócio
   - Pedidos pendentes
   - Estatísticas de vendas
   - Gestão de produtos, ingredientes e receitas

##### **Components (Componentes Reutilizáveis)**

- **Header/Footer**: Navegação e informações
- **Cards**: Exibição de produtos e pedidos
- **Carrinho**: Modal do carrinho de compras
- **Modais**: Diálogos para ações diversas

##### **Context API**

- **AuthContext**: Gerencia autenticação
  - Login/Logout
  - Dados do usuário
  - Token JWT
  - Verificação de admin

##### **State Management**

- **LocalStorage**: Carrinho de compras (persistência)
- **React Hooks**: useState, useEffect, useContext
- **Session Storage**: Dados temporários

---

### ⚙️ CAMADA 2: BACKEND (Node.js + Express)

```mermaid
graph TB
    subgraph "API Gateway - Express Server"
        SERVER[🚀 Express Server<br/>Port 5000]
        
        subgraph "Routing Layer"
            ROUTES[routes.js<br/>Definição de Rotas]
        end
        
        subgraph "Middleware Layer"
            AUTH_MW[authMiddleware<br/>Validação JWT]
            ERROR_MW[errorHandler<br/>Tratamento de Erros]
            CORS_MW[CORS<br/>Cross-Origin]
        end
        
        subgraph "Controller Layer"
            AUTH_C[authController<br/>Login, Registro]
            PROD_C[produtoController<br/>CRUD Produtos]
            PED_C[pedidoController<br/>Gestão Pedidos]
            ING_C[ingredienteController<br/>CRUD Ingredientes]
            REC_C[receitaController<br/>Gestão Receitas]
            REL_C[relatorioController<br/>Relatórios]
            CAT_C[categoriaController<br/>CRUD Categorias]
            WA_C[whatsappController<br/>Notificações]
        end
        
        subgraph "Service Layer"
            AUTH_S[authService<br/>Lógica de Auth]
            PROD_S[produtoService<br/>Lógica de Produtos]
            RES_S[reservaService<br/>Lógica de Pedidos]
            ING_S[ingredienteService<br/>Lógica de Ingredientes]
            REC_S[receitaService<br/>Lógica de Receitas]
            CLI_S[clienteService<br/>Lógica de Clientes]
        end
        
        subgraph "Repository Layer"
            CLI_R[clienteRepository<br/>Queries Cliente]
            PROD_R[produtoRepository<br/>Queries Produto]
            RES_R[reservaRepository<br/>Queries Reserva]
            ING_R[ingredienteRepository<br/>Queries Ingrediente]
            REC_R[receitaRepository<br/>Queries Receita]
            REL_R[relatorioRepository<br/>Queries Relatórios]
            CAT_R[categoriaRepository<br/>Queries Categoria]
        end
        
        subgraph "Database Layer"
            CONN[connection.js<br/>MySQL Connection Pool]
        end
    end
    
    REQUEST[HTTP Request] --> SERVER
    SERVER --> ROUTES
    ROUTES --> CORS_MW
    CORS_MW --> AUTH_MW
    AUTH_MW --> ERROR_MW
    
    ERROR_MW --> AUTH_C
    ERROR_MW --> PROD_C
    ERROR_MW --> PED_C
    ERROR_MW --> ING_C
    ERROR_MW --> REC_C
    ERROR_MW --> REL_C
    ERROR_MW --> CAT_C
    ERROR_MW --> WA_C
    
    AUTH_C --> AUTH_S
    PROD_C --> PROD_S
    PED_C --> RES_S
    ING_C --> ING_S
    REC_C --> REC_S
    
    AUTH_S --> CLI_R
    PROD_S --> PROD_R
    RES_S --> RES_R
    ING_S --> ING_R
    REC_S --> REC_R
    REL_C --> REL_R
    CAT_C --> CAT_R
    
    CLI_R --> CONN
    PROD_R --> CONN
    RES_R --> CONN
    ING_R --> CONN
    REC_R --> CONN
    REL_R --> CONN
    CAT_R --> CONN
    
    CONN --> DATABASE[(MySQL Database)]
    
    style SERVER fill:#c8e6c9
    style AUTH_MW fill:#fff3e0
    style AUTH_C fill:#e1f5ff
    style AUTH_S fill:#f8bbd0
    style CLI_R fill:#d1c4e9
    style CONN fill:#ffccbc
    style DATABASE fill:#f48fb1
```

#### Descrição dos Componentes Backend

##### **Routing Layer (Camada de Rotas)**

- **routes.js**: Define todas as rotas da API
  - `POST /api/auth/login` - Login
  - `POST /api/auth/register` - Cadastro
  - `GET /api/produtos` - Listar produtos
  - `POST /api/reservas` - Criar pedido
  - `GET /api/relatorios/vendas` - Relatórios
  - E muitas outras...

##### **Middleware Layer (Camada de Middlewares)**

1. **authMiddleware**
   - Valida token JWT
   - Verifica autenticação
   - Extrai dados do usuário
   - Protege rotas privadas

2. **errorHandler**
   - Captura erros
   - Formata respostas de erro
   - Log de erros
   - Status HTTP adequados

3. **CORS**
   - Permite requisições do frontend
   - Configuração de origens permitidas

##### **Controller Layer (Camada de Controle)**

Responsável por receber requisições HTTP e chamar os services apropriados.

- **authController**: Login, registro, recuperação de senha
- **produtoController**: CRUD de produtos
- **pedidoController**: Gestão de pedidos
- **ingredienteController**: CRUD de ingredientes
- **receitaController**: Gestão de receitas
- **relatorioController**: Geração de relatórios
- **categoriaController**: CRUD de categorias
- **whatsappController**: Envio de notificações

##### **Service Layer (Camada de Negócio)**

Contém a lógica de negócio da aplicação.

- **authService**: Hash de senhas, geração de tokens
- **produtoService**: Validações de produtos
- **reservaService**: Validações de pedidos, cálculos
- **ingredienteService**: Controle de estoque
- **receitaService**: Cálculo de custos

##### **Repository Layer (Camada de Dados)**

Responsável pelas queries SQL e interação com o banco.

- **clienteRepository**: Queries de clientes
- **produtoRepository**: Queries de produtos
- **reservaRepository**: Queries de pedidos
- **ingredienteRepository**: Queries de ingredientes
- **receitaRepository**: Queries de receitas

##### **Database Layer**

- **connection.js**: Pool de conexões MySQL
  - Configuração de conexão
  - Gerenciamento de pool
  - Tratamento de erros de conexão

---

### 🗄️ CAMADA 3: BANCO DE DADOS (MySQL)

```mermaid
graph TB
    subgraph "MySQL Database - segredodosabor"
        subgraph "Módulo de Autenticação"
            TB_CLIENTE[📋 cliente<br/>Usuários do Sistema]
            TB_TOKENS[🔐 refresh_tokens<br/>Tokens JWT]
        end
        
        subgraph "Módulo de Catálogo"
            TB_CATEGORIA[📂 categoria<br/>Categorias]
            TB_PRODUTO[📦 produto<br/>Produtos]
        end
        
        subgraph "Módulo de Pedidos"
            TB_RESERVA[🛒 reserva<br/>Pedidos]
        end
        
        subgraph "Módulo de Receitas"
            TB_INGREDIENTE[🥚 ingrediente<br/>Matéria-Prima]
            TB_RECEITA[📝 receita<br/>BOM - Composição]
            TB_MOVIMENTACAO[📊 movimentacao_estoque<br/>Histórico]
        end
        
        subgraph "Módulo Financeiro"
            TB_CUSTO[💰 custo_indireto<br/>Custos Fixos]
        end
        
        subgraph "Módulo de Configuração"
            TB_CONFIG[⚙️ configuracao<br/>Parâmetros]
        end
        
        subgraph "Views Calculadas"
            VW_CUSTOS[📊 vw_custo_produtos]
            VW_ESTOQUE[📉 vw_produtos_estoque_baixo]
            VW_VENDAS[💵 vw_vendas_hoje]
        end
        
        subgraph "Procedures & Triggers"
            SP_CALC[⚙️ sp_calcular_custo_produto]
            SP_ESTOQUE[⚙️ sp_baixar_estoque_venda]
            TR_RECEITA[🔄 Triggers Receita]
        end
    end
    
    TB_CLIENTE -->|1:N| TB_RESERVA
    TB_CLIENTE -->|1:N| TB_TOKENS
    TB_CATEGORIA -->|1:N| TB_PRODUTO
    TB_PRODUTO -->|1:N| TB_RECEITA
    TB_INGREDIENTE -->|1:N| TB_RECEITA
    TB_INGREDIENTE -->|1:N| TB_MOVIMENTACAO
    TB_RESERVA -->|1:N| TB_MOVIMENTACAO
    
    TB_PRODUTO --> VW_CUSTOS
    TB_RECEITA --> VW_CUSTOS
    TB_INGREDIENTE --> VW_CUSTOS
    
    TB_PRODUTO --> VW_ESTOQUE
    TB_RESERVA --> VW_VENDAS
    
    TB_RECEITA --> SP_CALC
    TB_PRODUTO --> SP_CALC
    
    TB_RESERVA --> SP_ESTOQUE
    TB_INGREDIENTE --> SP_ESTOQUE
    
    TB_RECEITA -.trigger.-> TR_RECEITA
    TR_RECEITA -.chama.-> SP_CALC
    
    style TB_CLIENTE fill:#e1f5ff
    style TB_PRODUTO fill:#fff3e0
    style TB_RESERVA fill:#c8e6c9
    style TB_RECEITA fill:#f8bbd0
    style VW_CUSTOS fill:#d1c4e9
    style SP_CALC fill:#ffccbc
```

#### Descrição das Tabelas e Objetos

##### **Tabelas Principais**

1. **cliente**: Usuários (clientes e administradores)
2. **refresh_tokens**: Tokens JWT para renovação
3. **categoria**: Categorias de produtos
4. **produto**: Produtos do catálogo
5. **reserva**: Pedidos dos clientes
6. **ingrediente**: Matérias-primas
7. **receita**: Composição dos produtos (BOM)
8. **movimentacao_estoque**: Histórico de movimentações
9. **custo_indireto**: Custos fixos mensais
10. **configuracao**: Configurações do sistema

##### **Views (Consultas Otimizadas)**

1. **vw_custo_produtos**: Análise de custos e margens
2. **vw_produtos_estoque_baixo**: Produtos com estoque crítico
3. **vw_ingredientes_estoque_baixo**: Ingredientes para comprar
4. **vw_vendas_hoje**: Dashboard de vendas do dia
5. **vw_vendas_mes_atual**: Vendas diárias do mês
6. **vw_produtos_mais_vendidos**: Ranking de produtos

##### **Procedures (Procedimentos Armazenados)**

1. **sp_calcular_custo_produto**: Calcula custo baseado na receita
2. **sp_recalcular_todos_custos**: Recalcula todos os custos
3. **sp_baixar_estoque_venda**: Baixa estoque após venda
4. **sp_adicionar_receita**: Adiciona ingrediente à receita
5. **sp_gerar_codigo_pedido**: Gera código único de pedido

##### **Triggers (Gatilhos Automáticos)**

1. **tr_receita_after_insert**: Recalcula custo ao adicionar ingrediente
2. **tr_receita_after_update**: Recalcula custo ao alterar quantidade
3. **tr_receita_after_delete**: Recalcula custo ao remover ingrediente
4. **tr_ingrediente_after_update**: Atualiza custos ao mudar preço
5. **tr_reserva_before_insert**: Gera código do pedido automaticamente

---

## 🔄 Fluxo de Dados Completo

### Fluxo 1: Autenticação de Usuário

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant F as 🎨 Frontend
    participant API as ⚙️ API Backend
    participant DB as 🗄️ Database
    
    U->>F: Preenche login (email/senha)
    F->>F: Valida formato
    F->>API: POST /api/auth/login
    API->>API: authController.login()
    API->>API: authService.login()
    API->>DB: SELECT cliente WHERE email
    DB-->>API: Dados do cliente + hash senha
    API->>API: bcrypt.compare(senha, hash)
    alt Senha correta
        API->>API: Gera Access Token (JWT)
        API->>API: Gera Refresh Token
        API->>DB: INSERT refresh_tokens
        DB-->>API: Token salvo
        API-->>F: 200 OK + tokens + dados usuário
        F->>F: Salva token em Context
        F->>F: Salva em localStorage
        F-->>U: Redireciona para Dashboard/Home
    else Senha incorreta
        API-->>F: 401 Unauthorized
        F-->>U: Exibe erro "Credenciais inválidas"
    end
```

### Fluxo 2: Criação de Pedido (Checkout)

```mermaid
sequenceDiagram
    participant U as 👤 Cliente
    participant F as 🎨 Frontend
    participant API as ⚙️ API Backend
    participant DB as 🗄️ Database
    participant WA as 📱 WhatsApp
    
    U->>F: Adiciona produtos ao carrinho
    F->>F: Salva em LocalStorage
    U->>F: Vai para checkout
    F->>F: Valida carrinho
    U->>F: Preenche dados (data, hora, pagamento)
    U->>F: Finaliza pedido
    
    F->>API: POST /api/reservas + JWT Token
    API->>API: authMiddleware valida token
    API->>API: pedidoController.criar()
    API->>API: reservaService.criar()
    
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO reserva
    DB-->>API: idreserva, codigo_pedido
    
    API->>DB: SELECT produtos do pedido
    API->>DB: CALL sp_baixar_estoque_venda(idreserva)
    DB->>DB: Para cada produto
    DB->>DB: Busca receita
    DB->>DB: INSERT movimentacao_estoque (SAIDA)
    DB->>DB: UPDATE ingrediente (baixa estoque)
    DB->>DB: UPDATE produto (baixa estoque)
    DB-->>API: Estoque baixado
    
    API->>DB: COMMIT TRANSACTION
    
    API->>WA: Envia notificação
    WA-->>API: Notificação enviada
    
    API->>DB: UPDATE reserva SET whatsapp_notificado
    
    API-->>F: 201 Created + dados do pedido
    F->>F: Limpa carrinho
    F-->>U: Redireciona para confirmação
    U->>U: Vê código do pedido
```

### Fluxo 3: Cálculo de Custos Automático

```mermaid
sequenceDiagram
    participant ADMIN as 👨‍💼 Admin
    participant F as 🎨 Frontend
    participant API as ⚙️ API Backend
    participant DB as 🗄️ Database
    
    ADMIN->>F: Adiciona ingrediente à receita
    F->>API: POST /api/receitas
    API->>API: receitaController.criar()
    API->>API: receitaService.criar()
    
    API->>DB: INSERT INTO receita
    Note over DB: Trigger ativado!
    DB->>DB: tr_receita_after_insert
    DB->>DB: CALL sp_calcular_custo_produto
    DB->>DB: SELECT SUM(qtd * preco_unit)
    DB->>DB: UPDATE produto SET custo_producao
    DB-->>API: Receita criada + custo atualizado
    
    API-->>F: 201 Created + novo custo
    F->>F: Atualiza tabela
    F-->>ADMIN: Exibe novo custo calculado
    
    Note over ADMIN,DB: Cálculo automático!<br/>Admin não precisa calcular manualmente
```

### Fluxo 4: Consulta de Produtos (Catálogo)

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant F as 🎨 Frontend
    participant API as ⚙️ API Backend
    participant DB as 🗄️ Database
    
    U->>F: Acessa /catalogo
    F->>API: GET /api/produtos?ativo=1
    API->>API: produtoController.listar()
    API->>API: produtoService.listar()
    API->>DB: SELECT produto<br/>JOIN categoria<br/>WHERE ativo=1 AND quantidade>0
    DB-->>API: Lista de produtos
    API-->>F: 200 OK + produtos[]
    F->>F: Renderiza cards de produtos
    F-->>U: Exibe catálogo
    
    U->>F: Filtra por categoria
    F->>API: GET /api/produtos?categoria=2
    API->>DB: SELECT ... WHERE idcategoria=2
    DB-->>API: Produtos filtrados
    API-->>F: 200 OK + produtos[]
    F-->>U: Atualiza visualização
```

---

## 🔐 Segurança da Aplicação

```mermaid
graph TB
    subgraph "Camadas de Segurança"
        subgraph "Frontend Security"
            HTTPS[🔒 HTTPS<br/>Criptografia em trânsito]
            XSS[🛡️ XSS Protection<br/>Sanitização de inputs]
            CSRF[🛡️ CSRF Protection<br/>Tokens de formulário]
        end
        
        subgraph "Authentication & Authorization"
            JWT[🔐 JWT Tokens<br/>Stateless Auth]
            BCRYPT[🔒 Bcrypt<br/>Hash de senhas]
            REFRESH[♻️ Refresh Tokens<br/>Renovação segura]
            RBAC[👮 Role-Based<br/>Admin vs Cliente]
        end
        
        subgraph "API Security"
            CORS[🌐 CORS<br/>Origens permitidas]
            RATE[⏱️ Rate Limiting<br/>Proteção DDoS]
            VALID[✅ Validação<br/>Inputs sanitizados]
            SQL[🛡️ SQL Injection<br/>Prepared Statements]
        end
        
        subgraph "Database Security"
            ENCRYPT[🔒 Encryption at Rest<br/>Dados criptografados]
            FK[🔗 Foreign Keys<br/>Integridade referencial]
            TRANS[🔄 Transactions<br/>ACID]
            BACKUP[💾 Backups<br/>Recuperação]
        end
    end
    
    USER[👤 Usuário] --> HTTPS
    HTTPS --> JWT
    JWT --> CORS
    CORS --> VALID
    VALID --> SQL
    SQL --> ENCRYPT
    
    BCRYPT -.hash.-> SQL
    REFRESH -.valida.-> JWT
    RBAC -.autoriza.-> CORS
    
    style HTTPS fill:#c8e6c9
    style JWT fill:#e1f5ff
    style SQL fill:#fff3e0
    style ENCRYPT fill:#f8bbd0
```

### Implementações de Segurança

#### **Frontend**
- **HTTPS**: Conexão criptografada
- **XSS Protection**: Sanitização de inputs
- **CSRF**: Tokens em formulários
- **Content Security Policy**: Restrição de scripts

#### **Autenticação**
- **JWT**: Tokens assinados com secret
- **Bcrypt**: Hash de senhas (cost 10)
- **Refresh Tokens**: Armazenados no banco, revogáveis
- **Expiração**: Access token 1h, Refresh token 7 dias

#### **API**
- **CORS**: Apenas origens permitidas
- **Rate Limiting**: Proteção contra DDoS
- **Validação**: Todos os inputs validados
- **Prepared Statements**: Proteção SQL Injection

#### **Banco de Dados**
- **Encryption**: Dados sensíveis criptografados
- **Foreign Keys**: Integridade referencial
- **Transactions**: Operações ACID
- **Backups**: Automáticos e regulares

---

## 🔌 Integrações Externas

```mermaid
graph LR
    subgraph "Sistema Segredo do Sabor"
        API[⚙️ Backend API]
    end
    
    subgraph "Integrações"
        WA[📱 WhatsApp<br/>Evolution API]
        EMAIL[📧 Email<br/>Nodemailer + SMTP]
        STORAGE[💾 File Storage<br/>Sistema de Arquivos]
        PAYMENT[💳 Pagamento<br/>Futuro: Gateway]
    end
    
    API -->|POST /message| WA
    WA -->|Notificação| CLIENT[📱 Cliente WhatsApp]
    
    API -->|SMTP| EMAIL
    EMAIL -->|Email| INBOX[📧 Email Cliente]
    
    API -->|Upload| STORAGE
    STORAGE -->|URL| IMG[🖼️ Imagem Produto]
    
    API -.futuro.-> PAYMENT
    PAYMENT -.webhook.-> API
    
    style API fill:#c8e6c9
    style WA fill:#25D366
    style EMAIL fill:#EA4335
    style STORAGE fill:#FFA000
    style PAYMENT fill:#2196F3
```

### Descrição das Integrações

#### **1. WhatsApp (Evolution API)**

**Função**: Envio de notificações automáticas para clientes

**Fluxo**:
1. Cliente finaliza pedido
2. Backend chama Evolution API
3. Mensagem enviada para WhatsApp do cliente
4. Cliente recebe notificação com código do pedido

**Mensagens Enviadas**:
- Confirmação de pedido
- Mudança de status
- Pedido pronto para retirada
- Pedido saiu para entrega

**Implementação**:
```javascript
// whatsappService.js
async function enviarNotificacao(telefone, mensagem) {
  await axios.post(`${EVOLUTION_API_URL}/message/sendText`, {
    number: telefone,
    text: mensagem
  });
}
```

#### **2. Email (Nodemailer)**

**Função**: Envio de emails transacionais

**Casos de Uso**:
- Recuperação de senha
- Confirmação de cadastro
- Relatórios periódicos
- Notificações importantes

**Implementação**:
```javascript
// emailService.js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL, pass: PASSWORD }
});
```

#### **3. File Storage (Sistema de Arquivos)**

**Função**: Armazenamento de imagens de produtos

**Estrutura**:
```
backend/
  storage/
    {hash_unico}.jpg
    {hash_unico}.png
```

**Fluxo**:
1. Admin faz upload de imagem
2. Backend salva com nome único (hash)
3. Caminho salvo no banco de dados
4. Frontend acessa via URL

**Exemplo**:
```javascript
// Multer configuration
const storage = multer.diskStorage({
  destination: './storage/',
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(16).toString('hex');
    cb(null, hash + path.extname(file.originalname));
  }
});
```

#### **4. Gateway de Pagamento (Futuro)**

**Planejado**: Integração com Mercado Pago, PagSeguro ou similar

**Funcionalidades Futuras**:
- Pagamento online (PIX, Cartão)
- Webhooks de confirmação
- Geração de QR Code PIX
- Controle de estornos

---

## ☁️ Infraestrutura e Deploy

```mermaid
graph TB
    subgraph "Ambiente de Desenvolvimento"
        DEV_FE[💻 Frontend<br/>localhost:3000<br/>React Dev Server]
        DEV_BE[💻 Backend<br/>localhost:5000<br/>Node.js]
        DEV_DB[(💻 Database<br/>MySQL local)]
    end
    
    subgraph "Ambiente de Produção"
        subgraph "Frontend Hosting"
            FE_HOST[☁️ Vercel / Netlify<br/>Static Hosting]
            CDN[🌐 CDN<br/>Distribuição Global]
        end
        
        subgraph "Backend Hosting"
            BE_HOST[☁️ AWS / Heroku / VPS<br/>Node.js Server]
            LB[⚖️ Load Balancer<br/>Futuro]
        end
        
        subgraph "Database Hosting"
            DB_HOST[☁️ AWS RDS / ClearDB<br/>MySQL Managed]
            DB_BACKUP[💾 Automated Backups]
        end
        
        subgraph "Monitoring & Logs"
            MONITOR[📊 Monitoring<br/>Uptime, Performance]
            LOGS[📝 Logs<br/>Erros, Acessos]
        end
    end
    
    DEV_FE -.develop.-> FE_HOST
    DEV_BE -.deploy.-> BE_HOST
    DEV_DB -.migrate.-> DB_HOST
    
    FE_HOST --> CDN
    CDN --> USER[👤 Usuário]
    
    USER --> BE_HOST
    BE_HOST --> DB_HOST
    DB_HOST --> DB_BACKUP
    
    BE_HOST --> MONITOR
    BE_HOST --> LOGS
    
    style FE_HOST fill:#00BCD4
    style BE_HOST fill:#4CAF50
    style DB_HOST fill:#F44336
    style MONITOR fill:#FF9800
```

### Configurações de Deploy

#### **Frontend (React)**

**Opções de Hospedagem**:
- **Vercel** (Recomendado)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

**Build**:
```bash
npm run build
# Gera pasta /build com arquivos estáticos
```

**Variáveis de Ambiente**:
```
REACT_APP_API_URL=https://api.segredodosabor.com
REACT_APP_WHATSAPP=5511999999999
```

#### **Backend (Node.js)**

**Opções de Hospedagem**:
- **AWS EC2** (Controle total)
- **Heroku** (Simples)
- **DigitalOcean** (VPS)
- **Railway** (Moderno)

**Configuração**:
```bash
# .env production
PORT=5000
DB_HOST=prod-database.region.rds.amazonaws.com
DB_DATABASE=segredodosabor
DB_USER=admin
DB_PASSWORD=***
JWT_SECRET=***
NODE_ENV=production
```

**PM2 (Process Manager)**:
```bash
pm2 start src/server.js --name "segredo-do-sabor-api"
pm2 startup
pm2 save
```

#### **Banco de Dados (MySQL)**

**Opções de Hospedagem**:
- **AWS RDS** (Recomendado para produção)
- **ClearDB** (Heroku)
- **PlanetScale** (Serverless MySQL)
- **VPS próprio**

**Configuração**:
- Backup automático diário
- Replicação (futuro)
- Monitoramento de performance
- Firewall: apenas IPs permitidos

---

## 📈 Escalabilidade

```mermaid
graph TB
    subgraph "Atual - Monolítico"
        FE1[Frontend]
        BE1[Backend]
        DB1[(Database)]
        
        FE1 --> BE1
        BE1 --> DB1
    end
    
    subgraph "Futuro - Escalável"
        FE2[Frontend<br/>CDN Global]
        
        subgraph "Backend Cluster"
            BE2[Backend 1]
            BE3[Backend 2]
            BE4[Backend N]
        end
        
        LB2[Load Balancer]
        
        subgraph "Database Cluster"
            DB2[(Master)]
            DB3[(Replica 1)]
            DB4[(Replica N)]
        end
        
        CACHE[Redis Cache]
        QUEUE[Fila de Jobs<br/>RabbitMQ]
        
        FE2 --> LB2
        LB2 --> BE2
        LB2 --> BE3
        LB2 --> BE4
        
        BE2 --> CACHE
        BE3 --> CACHE
        BE4 --> CACHE
        
        BE2 --> DB2
        BE3 --> DB2
        BE4 --> DB2
        
        DB2 --> DB3
        DB2 --> DB4
        
        BE2 --> QUEUE
        QUEUE --> WORKER[Workers]
    end
    
    style FE2 fill:#00BCD4
    style LB2 fill:#FF9800
    style CACHE fill:#E91E63
    style DB2 fill:#F44336
```

### Estratégias de Escalabilidade

#### **Escalabilidade Horizontal (Recomendado)**

**Frontend**:
- CDN para distribuição global
- Cache de assets (imagens, CSS, JS)
- Service Workers (PWA)

**Backend**:
- Múltiplas instâncias atrás de Load Balancer
- Stateless (JWT em vez de sessions)
- Cache de consultas frequentes (Redis)

**Database**:
- Master-Slave replication
- Read replicas para consultas
- Particionamento de tabelas grandes
- Índices otimizados

#### **Otimizações Atuais**

1. **Connection Pooling**: Reutilização de conexões MySQL
2. **Índices**: Otimização de queries
3. **Views**: Queries complexas pré-calculadas
4. **Procedures**: Lógica no banco para reduzir round-trips
5. **Caching Frontend**: LocalStorage para carrinho

#### **Próximos Passos**

1. **Redis**: Cache de sessões e dados frequentes
2. **Queue**: Processamento assíncrono (emails, relatórios)
3. **Microserviços**: Separar módulos críticos
4. **Monitoring**: Ferramentas de APM (New Relic, DataDog)
5. **Auto-scaling**: Aumentar recursos automaticamente

---

## 📊 Diagramas de Contexto

### Diagrama C4 - Nível 1: Contexto do Sistema

```mermaid
graph TB
    subgraph "Atores Externos"
        CLIENTE[👤 Cliente<br/>Compra produtos]
        ADMIN[👨‍💼 Administrador<br/>Gerencia sistema]
    end
    
    SISTEMA[🍰 Sistema Segredo do Sabor<br/>E-commerce + Gestão<br/>de Confeitaria]
    
    subgraph "Sistemas Externos"
        WHATSAPP_SYS[📱 WhatsApp<br/>Notificações]
        EMAIL_SYS[📧 Sistema de Email<br/>SMTP]
    end
    
    CLIENTE -->|Navega catálogo<br/>Faz pedidos| SISTEMA
    ADMIN -->|Gerencia produtos<br/>Controla estoque<br/>Gera relatórios| SISTEMA
    
    SISTEMA -->|Envia notificações| WHATSAPP_SYS
    SISTEMA -->|Envia emails| EMAIL_SYS
    
    style SISTEMA fill:#4CAF50,color:#fff
    style CLIENTE fill:#2196F3,color:#fff
    style ADMIN fill:#FF9800,color:#fff
    style WHATSAPP_SYS fill:#25D366,color:#fff
    style EMAIL_SYS fill:#EA4335,color:#fff
```

### Diagrama C4 - Nível 2: Containers

```mermaid
graph TB
    USUARIO[👤 Usuário]
    
    subgraph "Sistema Segredo do Sabor"
        SPA[🎨 Single Page Application<br/>React<br/>Interface do usuário]
        
        API_APP[⚙️ API Application<br/>Node.js + Express<br/>Lógica de negócio]
        
        DATABASE[(🗄️ Database<br/>MySQL<br/>Armazenamento de dados)]
        
        FILE_SYS[💾 File System<br/>Armazenamento<br/>de imagens]
    end
    
    WHATSAPP[📱 WhatsApp API]
    EMAIL[📧 Email Server]
    
    USUARIO -->|HTTPS| SPA
    SPA -->|JSON/HTTPS<br/>REST API| API_APP
    API_APP -->|SQL<br/>TCP| DATABASE
    API_APP -->|Read/Write| FILE_SYS
    API_APP -->|HTTPS| WHATSAPP
    API_APP -->|SMTP| EMAIL
    
    style SPA fill:#00BCD4,color:#fff
    style API_APP fill:#4CAF50,color:#fff
    style DATABASE fill:#F44336,color:#fff
```

---

## 🎯 Principais Características da Arquitetura

### ✅ Pontos Fortes

1. **Separação de Responsabilidades**
   - Frontend focado em UI/UX
   - Backend focado em lógica de negócio
   - Database focado em persistência

2. **Arquitetura em Camadas**
   - Controllers: Recebem requisições
   - Services: Lógica de negócio
   - Repositories: Acesso a dados
   - Fácil manutenção e teste

3. **Stateless Authentication**
   - JWT permite escalabilidade horizontal
   - Não depende de sessões no servidor
   - Refresh tokens para segurança

4. **Automações no Banco**
   - Triggers para cálculos automáticos
   - Procedures para operações complexas
   - Views para consultas otimizadas

5. **Modularidade**
   - Componentes React reutilizáveis
   - Módulos Node.js bem definidos
   - Fácil adicionar novos recursos

### ⚠️ Considerações e Limitações

1. **Monolítico Atual**
   - Backend único pode ser gargalo
   - Solução: Migrar para microserviços no futuro

2. **File Storage Local**
   - Imagens salvas em filesystem
   - Solução: Migrar para S3/CloudStorage

3. **Sem Cache**
   - Todas as queries vão ao banco
   - Solução: Implementar Redis

4. **Sem Fila de Jobs**
   - Processos síncronos podem travar
   - Solução: Implementar RabbitMQ/Bull

5. **Monitoramento Básico**
   - Logs apenas em console
   - Solução: Implementar APM (New Relic, Sentry)

---

## 📚 Tecnologias e Versões Detalhadas

### Frontend

| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| React | 18.2.0 | Framework UI |
| React Router | 6.x | Navegação SPA |
| Axios | 1.x | Cliente HTTP |
| SCSS | - | Estilização |
| Context API | React 18 | State Management |
| LocalStorage | Browser API | Persistência local |

### Backend

| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| Node.js | 20.x LTS | Runtime JavaScript |
| Express | 4.18.x | Framework web |
| MySQL2 | 3.x | Driver MySQL |
| bcrypt | 5.x | Hash de senhas |
| jsonwebtoken | 9.x | Geração de JWT |
| multer | 1.x | Upload de arquivos |
| cors | 2.x | Cross-Origin |
| dotenv | 16.x | Variáveis de ambiente |

### Banco de Dados

| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| MySQL | 8.0+ | Banco relacional |
| InnoDB | Default | Engine transacional |
| UTF8MB4 | Charset | Suporte completo Unicode |

### Ferramentas de Desenvolvimento

| Ferramenta | Propósito |
|-----------|-----------|
| Git | Controle de versão |
| npm | Gerenciador de pacotes |
| MySQL Workbench | Administração BD |
| Postman | Teste de APIs |
| VS Code | Editor de código |

---

## 🔍 Conclusão

A arquitetura do **Segredo do Sabor** foi projetada para ser:

- **Escalável**: Pronta para crescer conforme a demanda
- **Manutenível**: Código organizado e documentado
- **Segura**: Múltiplas camadas de segurança
- **Performática**: Otimizações em todos os níveis
- **Moderna**: Tecnologias atuais e boas práticas

O sistema utiliza uma arquitetura cliente-servidor clássica, mas moderna, com separação clara de responsabilidades e preparada para evoluções futuras como microserviços, cache distribuído e processamento assíncrono.

---

**Documentação Completa**: 13 de Outubro de 2025  
**Versão do Sistema**: 4.0 - DoceGest MVP  
**Arquiteto**: Sistema Segredo do Sabor

