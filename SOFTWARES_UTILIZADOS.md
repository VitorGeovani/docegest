# 🛠️ Softwares Utilizados no Projeto
## Segredo do Sabor - Sistema de Gestão de Confeitaria

**Versão**: 4.0 - DoceGest MVP  
**Data**: 13 de Outubro de 2025

---

## 📋 Índice

1. [Concepção do Projeto](#1-concepção-do-projeto)
2. [Prototipação](#2-prototipação)
3. [Gerenciamento do Projeto](#3-gerenciamento-do-projeto)
4. [Comunicação e Reuniões](#4-comunicação-e-reuniões)
5. [Documentação](#5-documentação)
6. [Banco de Dados](#6-banco-de-dados)
7. [Desenvolvimento - Backend](#7-desenvolvimento-backend)
8. [Desenvolvimento - Frontend](#8-desenvolvimento-frontend)
9. [Controle de Versão](#9-controle-de-versão)
10. [Testes e Qualidade](#10-testes-e-qualidade)
11. [Deploy e Infraestrutura](#11-deploy-e-infraestrutura)
12. [Ferramentas de Apoio](#12-ferramentas-de-apoio)
13. [Resumo Geral](#13-resumo-geral)

---

## 1. 🎨 Concepção do Projeto

### 1.1 Design Thinking e Ideação

#### **Miro**
- **Categoria**: Quadro Colaborativo Digital
- **Versão**: Web App
- **Finalidade no Projeto**: 
  - Fase de **Empatia**: Criação de mapas de empatia para entender as dores dos confeiteiros
  - Fase de **Definição**: Organização de insights e definição do problema
  - Fase de **Ideação**: Brainstorming de funcionalidades e soluções
  - Criação de **User Journey Maps** para mapear a jornada do cliente
  - Organização de **Canvas de Proposta de Valor**
- **Como foi utilizado**:
  - Mapeamento de personas (Cliente que compra doces, Confeiteiro administrador)
  - Identificação de pain points (controle manual de estoque, perda de pedidos)
  - Brainstorming de features MVP
  - Priorização de funcionalidades com matriz esforço x impacto

#### **Figma** (Fase de Concepção)
- **Categoria**: Design Colaborativo e Ideação
- **Versão**: Web App + Desktop
- **Finalidade no Projeto**:
  - Criação de **FigJam boards** para ideação inicial
  - Wireframes de baixa fidelidade para validar conceitos
  - Organização visual de fluxos de usuário
  - Definição de arquitetura de informação
- **Como foi utilizado**:
  - Sketches rápidos de telas principais
  - Fluxograma de processo de pedido
  - Definição de navegação do sistema
  - Alinhamento de expectativas visuais com stakeholders

#### **Google Forms**
- **Categoria**: Ferramenta de Pesquisa
- **Versão**: Web App
- **Finalidade no Projeto**:
  - Fase de **Imersão**: Coleta de dados de potenciais usuários
  - Pesquisa de mercado com confeiteiros locais
  - Validação de hipóteses sobre funcionalidades
  - Identificação de dores e necessidades reais
- **Como foi utilizado**:
  - Questionário enviado para 15 confeiteiros da região
  - Perguntas sobre controle de estoque, pedidos e custos
  - Análise de respostas para priorizar features

---

## 2. 🎨 Prototipação

### 2.1 Design de Interface

#### **Figma**
- **Categoria**: Design de Interface e Prototipação
- **Versão**: Web App + Desktop
- **Site**: https://figma.com
- **Finalidade no Projeto**:
  - Criação de **protótipos de alta fidelidade** de todas as telas
  - Design de **componentes reutilizáveis** (botões, cards, formulários)
  - Definição de **paleta de cores** e identidade visual
  - Criação de **design system** do projeto
  - Prototipagem **interativa** para testes de usabilidade
  - Design **responsivo** (mobile, tablet, desktop)
- **Como foi utilizado**:
  - Design de 15+ telas (Home, Catálogo, Checkout, Dashboard Admin, etc)
  - Criação de variantes de componentes (botões primários, secundários, disabled)
  - Definição de tipografia (fontes, tamanhos, pesos)
  - Paleta de cores (primária: #4A90E2, secundária: #F5A623)
  - Protótipo clicável para validação com stakeholders
  - Export de assets (ícones, imagens) para desenvolvimento

#### **Adobe Color**
- **Categoria**: Ferramenta de Paleta de Cores
- **Versão**: Web App
- **Finalidade no Projeto**:
  - Definição de **harmonia de cores** do projeto
  - Teste de acessibilidade (contraste WCAG)
  - Geração de variações de cores
- **Como foi utilizado**:
  - Criação de paleta harmoniosa para o tema "doces"
  - Validação de contraste para legibilidade
  - Export de códigos HEX para uso no CSS

#### **Google Fonts**
- **Categoria**: Biblioteca de Fontes
- **Versão**: Web Service
- **Finalidade no Projeto**:
  - Seleção de **tipografia** do projeto
  - Fontes gratuitas e otimizadas para web
- **Fontes Selecionadas**:
  - **Poppins**: Fonte principal (títulos e textos)
  - **Roboto**: Fonte secundária (corpo de texto)
- **Como foi utilizado**:
  - Importação via CDN no projeto React
  - Aplicação em todos os componentes

---

## 3. 📊 Gerenciamento do Projeto

### 3.1 Planejamento e Controle

#### **Trello**
- **Categoria**: Gerenciamento de Projetos (Kanban)
- **Versão**: Web App + Mobile
- **Site**: https://trello.com
- **Finalidade no Projeto**:
  - Gestão de **sprints** e tarefas
  - Metodologia **Kanban** para controle de fluxo
  - Organização de **backlog** de funcionalidades
  - Acompanhamento de progresso do projeto
- **Como foi utilizado**:
  - Board "Segredo do Sabor - MVP"
  - Listas: Backlog → To Do → In Progress → Review → Done
  - Cards para cada feature (ex: "Implementar login", "CRUD de produtos")
  - Labels por tipo: Frontend, Backend, Database, Bug, Enhancement
  - Checklist dentro de cards para subtarefas
  - Datas de entrega e responsáveis

#### **GitHub Projects**
- **Categoria**: Gerenciamento de Projetos Integrado
- **Versão**: Web (integrado ao GitHub)
- **Finalidade no Projeto**:
  - Gestão de **issues** e pull requests
  - Vinculação de commits a tarefas
  - Roadmap de desenvolvimento
  - Tracking de bugs e melhorias
- **Como foi utilizado**:
  - Project board vinculado ao repositório
  - Issues para bugs e features
  - Milestones para versões (v1.0, v2.0, etc)
  - Pull requests vinculadas a issues
  - Automação: mover cards automaticamente ao fazer merge

#### **Notion**
- **Categoria**: Workspace Colaborativo
- **Versão**: Web App + Desktop + Mobile
- **Site**: https://notion.so
- **Finalidade no Projeto**:
  - **Base de conhecimento** do projeto
  - Documentação de decisões técnicas
  - Registro de reuniões e atas
  - Wiki do projeto
- **Como foi utilizado**:
  - Página principal com overview do projeto
  - Database de funcionalidades com status
  - Documentação de arquitetura
  - Registro de decisões (ADRs - Architecture Decision Records)
  - Glossário de termos do negócio

---

## 4. 💬 Comunicação e Reuniões

### 4.1 Comunicação Interna da Equipe

#### **WhatsApp**
- **Categoria**: Mensageiro Instantâneo
- **Versão**: Mobile + Desktop
- **Finalidade no Projeto**:
  - Comunicação **rápida** e **informal** entre membros da equipe
  - Grupo "Dev Segredo do Sabor"
  - Compartilhamento de prints de tela e vídeos
  - Notificações urgentes
- **Como foi utilizado**:
  - Comunicação diária entre desenvolvedores
  - Avisos de bugs críticos
  - Compartilhamento de links e recursos
  - Agendamento de reuniões

#### **Microsoft Teams**
- **Categoria**: Plataforma de Colaboração Empresarial
- **Versão**: Web + Desktop + Mobile
- **Finalidade no Projeto**:
  - **Reuniões diárias** de standup (15 min)
  - **Sprint planning** e retrospectivas
  - Compartilhamento de tela para pair programming
  - Gravação de reuniões importantes
- **Como foi utilizado**:
  - Daily standups às 9h (segunda a sexta)
  - Sprint planning semanal (segunda)
  - Sprint review e retrospective (sexta)
  - Canal de equipe para avisos formais

#### **Discord**
- **Categoria**: Plataforma de Comunicação para Desenvolvedores
- **Versão**: Web + Desktop + Mobile
- **Finalidade no Projeto**:
  - **Pair programming** com compartilhamento de tela
  - **Code reviews** ao vivo
  - Canais separados por tópico (frontend, backend, database)
  - Bot de notificações do GitHub
- **Como foi utilizado**:
  - Servidor "Segredo do Sabor"
  - Canais: #geral, #frontend, #backend, #database, #bugs
  - Sessões de live coding
  - Integração com GitHub para notificar commits e PRs

### 4.2 Comunicação Externa (Cliente/Stakeholders)

#### **Gmail**
- **Categoria**: Serviço de Email
- **Versão**: Web + Mobile
- **Finalidade no Projeto**:
  - Comunicação **formal** com cliente/stakeholder
  - Envio de relatórios de progresso
  - Solicitações de feedback
  - Documentação por escrito de decisões
- **Como foi utilizado**:
  - Email semanal com status do projeto
  - Envio de links para protótipos no Figma
  - Solicitação de validação de funcionalidades
  - Agendamento de apresentações

#### **Google Meet**
- **Categoria**: Plataforma de Videoconferência
- **Versão**: Web (browser-based)
- **Finalidade no Projeto**:
  - **Reuniões de alinhamento** com cliente (quinzenal)
  - **Apresentações de demos** do sistema
  - Validação de protótipos e funcionalidades
  - Feedback sessions
- **Como foi utilizado**:
  - Reuniões quinzenais de 1h com stakeholder
  - Apresentação de telas desenvolvidas
  - Demonstração de funcionalidades prontas
  - Coleta de feedback e ajustes

---

## 5. 📚 Documentação

### 5.1 Requisitos e User Stories

#### **Notion**
- **Categoria**: Ferramenta de Documentação
- **Versão**: Web + Desktop + Mobile
- **Finalidade no Projeto**:
  - Documentação de **user stories**
  - Registro de **requisitos funcionais**
  - Registro de **requisitos não funcionais**
  - **Acceptance criteria** para cada feature
- **Como foi utilizado**:
  - Database "User Stories" com campos:
    - ID, Título, Descrição, Critérios de Aceitação, Prioridade, Status
  - Exemplo:
    ```
    US-001: Login de Usuário
    Como cliente, quero fazer login no sistema para acessar meus pedidos
    Critérios:
    - [ ] Validar email e senha
    - [ ] Gerar token JWT
    - [ ] Redirecionar para dashboard
    ```
  - Requisitos funcionais documentados (RF-001 a RF-045)
  - Requisitos não funcionais (RNF-001 a RNF-015)

#### **GitHub Wiki**
- **Categoria**: Wiki Integrada ao Repositório
- **Versão**: Web
- **Finalidade no Projeto**:
  - **Documentação técnica** para desenvolvedores
  - Guias de setup do ambiente
  - Convenções de código
  - Arquitetura do sistema
- **Como foi utilizado**:
  - Página "Getting Started" com setup
  - Página "API Documentation" com endpoints
  - Página "Database Schema" com diagramas
  - Página "Contributing Guidelines"

#### **Markdown Files (README.md)**
- **Categoria**: Documentação em Repositório
- **Versão**: Arquivos .md no Git
- **Finalidade no Projeto**:
  - **README.md** principal do projeto
  - Documentação de cada módulo
  - Instruções de instalação e execução
- **Arquivos criados**:
  - `README.md`: Overview geral do projeto
  - `API_DOCUMENTATION.md`: Documentação da API REST
  - `BANCO_DADOS_COMPLETO.sql`: Script completo do banco
  - `DOCUMENTACAO_BANCO_DADOS.md`: Documentação do schema
  - `ARQUITETURA_SISTEMA.md`: Arquitetura detalhada
  - `CHANGELOG.md`: Histórico de versões

#### **Mermaid**
- **Categoria**: Ferramenta de Diagramação em Markdown
- **Versão**: Embedded em Markdown
- **Finalidade no Projeto**:
  - Criação de **diagramas de arquitetura**
  - **Diagramas ER** do banco de dados
  - **Diagramas de sequência** de fluxos
  - **Fluxogramas** de processos
- **Como foi utilizado**:
  - Diagramas embarcados em arquivos .md
  - Visualização direta no GitHub
  - Facilita manutenção (código em vez de imagem)

---

## 6. 🗄️ Banco de Dados

### 6.1 SGBD e Ferramentas

#### **MySQL**
- **Categoria**: Sistema Gerenciador de Banco de Dados Relacional
- **Versão**: 8.0.35
- **Site**: https://www.mysql.com
- **Finalidade no Projeto**:
  - **Armazenamento persistente** de todos os dados
  - Banco relacional ACID (Atomicidade, Consistência, Isolamento, Durabilidade)
  - Engine **InnoDB** para suporte a transações
  - Charset **UTF8MB4** para suporte completo a emojis
- **Como foi utilizado**:
  - Criação de 10 tabelas principais:
    - `cliente`, `refresh_tokens`, `categoria`, `produto`
    - `reserva`, `ingrediente`, `receita`, `movimentacao_estoque`
    - `custo_indireto`, `configuracao`
  - 6 Views otimizadas para relatórios
  - 5 Stored Procedures para lógica de negócio
  - 5 Triggers para automações
  - Índices para performance
  - Foreign Keys para integridade referencial

#### **MySQL Workbench**
- **Categoria**: Ferramenta de Administração de Banco de Dados
- **Versão**: 8.0 CE
- **Site**: https://www.mysql.com/products/workbench/
- **Finalidade no Projeto**:
  - **Modelagem visual** do banco de dados
  - Criação de **diagramas ER**
  - Execução de queries SQL
  - Gerenciamento de usuários e permissões
  - Import/Export de dados
  - Administração de backups
- **Como foi utilizado**:
  - Criação do diagrama ER completo
  - Execução de scripts de migração
  - Testes de queries complexas
  - Monitoramento de performance
  - Export de diagramas para documentação

#### **DBeaver**
- **Categoria**: Cliente Universal de Banco de Dados
- **Versão**: Community Edition
- **Site**: https://dbeaver.io
- **Finalidade no Projeto**:
  - **Alternativa** ao MySQL Workbench
  - Editor SQL avançado com autocomplete
  - Visualização de dados em formato tabular
  - Execução de múltiplas queries em abas
- **Como foi utilizado**:
  - Desenvolvimento e teste de queries
  - Visualização rápida de dados
  - Export de resultados para CSV
  - Comparação de schemas

---

## 7. 💻 Desenvolvimento - Backend

### 7.1 Runtime e Framework

#### **Node.js**
- **Categoria**: Runtime JavaScript
- **Versão**: 20.10.0 LTS
- **Site**: https://nodejs.org
- **Finalidade no Projeto**:
  - **Runtime** para executar JavaScript no servidor
  - Ambiente de execução para o backend
  - Gerenciamento de pacotes via npm
  - Event-driven, non-blocking I/O para alta performance
- **Por que foi escolhido**:
  - JavaScript full-stack (mesma linguagem no frontend e backend)
  - Ecosystem rico de bibliotecas (npm)
  - Performance adequada para aplicações I/O intensive
  - Comunidade ativa e grande suporte

#### **Express.js**
- **Categoria**: Framework Web para Node.js
- **Versão**: 4.18.2
- **Site**: https://expressjs.com
- **Finalidade no Projeto**:
  - **Framework web** para criação da API REST
  - Roteamento de requisições HTTP
  - Middleware para interceptação de requests
  - Simplifica criação de endpoints
- **Como foi utilizado**:
  - Criação de servidor HTTP na porta 5000
  - Definição de rotas RESTful:
    - `GET /api/produtos` - Listar produtos
    - `POST /api/auth/login` - Login
    - `POST /api/reservas` - Criar pedido
  - Middlewares: CORS, Auth, Error Handler
  - Servir arquivos estáticos (imagens de produtos)

### 7.2 Bibliotecas e Dependências

#### **mysql2**
- **Categoria**: Driver MySQL para Node.js
- **Versão**: 3.6.5
- **NPM**: https://www.npmjs.com/package/mysql2
- **Finalidade no Projeto**:
  - **Conexão** entre Node.js e MySQL
  - Execução de queries SQL
  - Suporte a Prepared Statements (proteção SQL Injection)
  - Connection Pooling para reutilização de conexões
- **Como foi utilizado**:
  ```javascript
  const mysql = require('mysql2/promise');
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
  ```

#### **bcrypt**
- **Categoria**: Biblioteca de Criptografia
- **Versão**: 5.1.1
- **NPM**: https://www.npmjs.com/package/bcrypt
- **Finalidade no Projeto**:
  - **Hash de senhas** para armazenamento seguro
  - Verificação de senhas no login
  - Salt rounds = 10 para segurança adequada
- **Como foi utilizado**:
  ```javascript
  // Registro
  const hashedPassword = await bcrypt.hash(senha, 10);
  
  // Login
  const match = await bcrypt.compare(senha, hashedSenha);
  ```

#### **jsonwebtoken**
- **Categoria**: Implementação de JWT (JSON Web Tokens)
- **Versão**: 9.0.2
- **NPM**: https://www.npmjs.com/package/jsonwebtoken
- **Finalidade no Projeto**:
  - **Geração de tokens JWT** para autenticação
  - Validação de tokens em rotas protegidas
  - Stateless authentication (sem sessão no servidor)
- **Como foi utilizado**:
  ```javascript
  // Gerar token
  const token = jwt.sign(
    { idcliente, email, tipo },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // Validar token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  ```

#### **cors**
- **Categoria**: Middleware para Cross-Origin Resource Sharing
- **Versão**: 2.8.5
- **NPM**: https://www.npmjs.com/package/cors
- **Finalidade no Projeto**:
  - Permitir **requisições do frontend** (porta 3000) para backend (porta 5000)
  - Configuração de origens permitidas
  - Headers permitidos para JWT
- **Como foi utilizado**:
  ```javascript
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  ```

#### **dotenv**
- **Categoria**: Gerenciador de Variáveis de Ambiente
- **Versão**: 16.3.1
- **NPM**: https://www.npmjs.com/package/dotenv
- **Finalidade no Projeto**:
  - Carregar **variáveis de ambiente** do arquivo `.env`
  - Separar configurações sensíveis do código
  - Diferentes configs para dev/prod
- **Como foi utilizado**:
  ```javascript
  require('dotenv').config();
  
  const dbHost = process.env.DB_HOST;
  const jwtSecret = process.env.JWT_SECRET;
  ```

#### **multer**
- **Categoria**: Middleware para Upload de Arquivos
- **Versão**: 1.4.5-lts.1
- **NPM**: https://www.npmjs.com/package/multer
- **Finalidade no Projeto**:
  - **Upload de imagens** de produtos
  - Armazenamento em filesystem
  - Validação de tipo de arquivo (apenas imagens)
- **Como foi utilizado**:
  ```javascript
  const upload = multer({
    dest: './storage/',
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      }
    }
  });
  
  app.post('/api/produtos', upload.single('imagem'), ...);
  ```

#### **axios**
- **Categoria**: Cliente HTTP para Node.js
- **Versão**: 1.6.2
- **NPM**: https://www.npmjs.com/package/axios
- **Finalidade no Projeto**:
  - **Requisições HTTP** para APIs externas
  - Integração com Evolution API (WhatsApp)
  - Requisições para serviço de email
- **Como foi utilizado**:
  ```javascript
  // Enviar mensagem WhatsApp
  await axios.post(
    `${EVOLUTION_API_URL}/message/sendText`,
    {
      number: telefone,
      text: mensagem
    }
  );
  ```

#### **nodemailer**
- **Categoria**: Biblioteca para Envio de Emails
- **Versão**: 6.9.7
- **NPM**: https://www.npmjs.com/package/nodemailer
- **Finalidade no Projeto**:
  - **Envio de emails** transacionais
  - Recuperação de senha
  - Confirmação de cadastro
- **Como foi utilizado**:
  ```javascript
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  await transporter.sendMail({
    from: 'noreply@segredodosabor.com',
    to: clienteEmail,
    subject: 'Recuperação de Senha',
    html: '<p>Clique aqui para redefinir...</p>'
  });
  ```

### 7.3 Testes

#### **Jest**
- **Categoria**: Framework de Testes para JavaScript
- **Versão**: 29.7.0
- **NPM**: https://www.npmjs.com/package/jest
- **Finalidade no Projeto**:
  - **Testes unitários** de services e repositories
  - Testes de integração de endpoints
  - Cobertura de código
  - Mocks de dependências
- **Como foi utilizado**:
  ```javascript
  // clienteService.test.js
  describe('ClienteService', () => {
    test('deve criar cliente com sucesso', async () => {
      const cliente = await clienteService.criar({
        nome: 'João',
        email: 'joao@email.com'
      });
      expect(cliente.idcliente).toBeDefined();
    });
  });
  ```

---

## 8. 🎨 Desenvolvimento - Frontend

### 8.1 Framework e Bibliotecas Core

#### **React**
- **Categoria**: Biblioteca JavaScript para UI
- **Versão**: 18.2.0
- **Site**: https://react.dev
- **Finalidade no Projeto**:
  - **Framework principal** para construção da interface
  - Componentização e reutilização de código
  - Virtual DOM para performance
  - Hooks para gerenciamento de estado
- **Por que foi escolhido**:
  - Biblioteca mais popular para SPAs
  - Ecosystem rico de componentes
  - Performance otimizada
  - Fácil integração com APIs REST
- **Como foi utilizado**:
  - Criação de componentes funcionais
  - Hooks: useState, useEffect, useContext, useNavigate
  - JSX para marcação declarativa
  - 15+ páginas e 30+ componentes reutilizáveis

#### **React Router DOM**
- **Categoria**: Biblioteca de Roteamento para React
- **Versão**: 6.20.1
- **NPM**: https://www.npmjs.com/package/react-router-dom
- **Finalidade no Projeto**:
  - **Navegação SPA** (Single Page Application)
  - Rotas declarativas
  - Rotas protegidas (autenticação)
  - Parâmetros de URL
- **Como foi utilizado**:
  ```javascript
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/gerenciamentos" element={
        <ProtectedRoute><Gerenciamentos /></ProtectedRoute>
      } />
    </Routes>
  </BrowserRouter>
  ```

#### **Axios**
- **Categoria**: Cliente HTTP para Navegadores
- **Versão**: 1.6.2
- **NPM**: https://www.npmjs.com/package/axios
- **Finalidade no Projeto**:
  - **Requisições HTTP** para a API backend
  - Interceptors para adicionar token JWT automaticamente
  - Tratamento de erros centralizado
- **Como foi utilizado**:
  ```javascript
  // Interceptor para adicionar token
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  // Requisição
  const response = await axios.get('http://localhost:5000/api/produtos');
  ```

### 8.2 Estilização

#### **SCSS (Sass)**
- **Categoria**: Pré-processador CSS
- **Versão**: sass 1.69.5
- **Site**: https://sass-lang.com
- **Finalidade no Projeto**:
  - **Estilização avançada** com variáveis e mixins
  - Nesting para organização
  - Modularização de estilos
  - Temas e cores globais
- **Como foi utilizado**:
  ```scss
  // Variáveis globais
  $primary-color: #4A90E2;
  $secondary-color: #F5A623;
  
  // Mixin reutilizável
  @mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  // Nesting
  .card {
    padding: 1rem;
    
    &__title {
      font-size: 1.5rem;
    }
    
    &:hover {
      transform: scale(1.05);
    }
  }
  ```
  - Arquivo por componente (ex: `Card/index.scss`)
  - Arquivo global `LAYOUT_MODERNO_GLOBAL.scss`

#### **CSS3**
- **Categoria**: Linguagem de Estilização
- **Versão**: CSS3 (padrão W3C)
- **Finalidade no Projeto**:
  - **Estilização base** quando SCSS não é necessário
  - Animações e transições
  - Grid e Flexbox para layouts
  - Media queries para responsividade
- **Como foi utilizado**:
  - Flexbox para layouts de cards
  - Grid para dashboard admin
  - Transitions para hover effects
  - Media queries para mobile/tablet/desktop

### 8.3 Context API e State Management

#### **React Context API**
- **Categoria**: API Nativa do React para State Management
- **Versão**: Built-in React 18
- **Finalidade no Projeto**:
  - **Gerenciamento de estado global**
  - Autenticação (login, logout, usuário logado)
  - Evita prop drilling
- **Como foi utilizado**:
  ```javascript
  // AuthContext.js
  export const AuthContext = createContext();
  
  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    
    const login = async (email, senha) => {
      const response = await axios.post('/api/auth/login', {email, senha});
      setUser(response.data.usuario);
      localStorage.setItem('token', response.data.accessToken);
    };
    
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }
  ```

#### **LocalStorage**
- **Categoria**: API Web Storage do Navegador
- **Versão**: Built-in Browser API
- **Finalidade no Projeto**:
  - **Persistência local** de dados
  - Armazenar carrinho de compras
  - Armazenar tokens JWT
  - Preferências do usuário
- **Como foi utilizado**:
  ```javascript
  // Salvar carrinho
  localStorage.setItem('carrinho', JSON.stringify(produtos));
  
  // Recuperar carrinho
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  
  // Salvar token
  localStorage.setItem('token', accessToken);
  ```

### 8.4 Ferramentas de Build

#### **Create React App (CRA)**
- **Categoria**: Ferramenta de Setup de Projeto React
- **Versão**: 5.0.1
- **NPM**: https://create-react-app.dev
- **Finalidade no Projeto**:
  - **Scaffolding inicial** do projeto React
  - Configuração automática de Webpack, Babel, ESLint
  - Scripts de build e desenvolvimento
  - Hot reload para desenvolvimento
- **Como foi utilizado**:
  ```bash
  npx create-react-app frontend
  cd frontend
  npm start  # Desenvolvimento
  npm run build  # Produção
  ```

#### **Webpack**
- **Categoria**: Module Bundler
- **Versão**: 5.x (via CRA)
- **Finalidade no Projeto**:
  - **Bundling** de JavaScript, CSS, imagens
  - Otimização de assets
  - Code splitting
  - Tree shaking
- **Como foi utilizado**:
  - Configuração automática via CRA
  - Build otimizado para produção
  - Minificação de JS e CSS

#### **Babel**
- **Categoria**: Transpilador JavaScript
- **Versão**: 7.x (via CRA)
- **Finalidade no Projeto**:
  - **Transpilação** de JSX para JavaScript
  - Suporte a ES6+ em navegadores antigos
  - Transformações de código
- **Como foi utilizado**:
  - Configuração automática via CRA
  - Transpilação de JSX
  - Polyfills para compatibilidade

---

## 9. 🔀 Controle de Versão

### 9.1 Sistema de Controle de Versão

#### **Git**
- **Categoria**: Sistema de Controle de Versão Distribuído
- **Versão**: 2.43.0
- **Site**: https://git-scm.com
- **Finalidade no Projeto**:
  - **Controle de versão** de todo o código-fonte
  - Histórico de alterações
  - Branches para features e correções
  - Merge de código entre desenvolvedores
  - Rollback de alterações problemáticas
- **Como foi utilizado**:
  - Repositório Git inicializado
  - Commits frequentes com mensagens descritivas
  - Branches: `main`, `develop`, `feature/nome-feature`, `bugfix/nome-bug`
  - Git flow simplificado
  - Tags para versões: `v1.0.0`, `v2.0.0`, `v4.0.0`
  
#### **GitHub**
- **Categoria**: Plataforma de Hospedagem de Repositórios Git
- **Versão**: Web Platform
- **Site**: https://github.com
- **Finalidade no Projeto**:
  - **Hospedagem remota** do repositório
  - Backup do código na nuvem
  - Colaboração entre desenvolvedores
  - Pull requests para code review
  - Issues para tracking de bugs e features
  - Actions para CI/CD (futuro)
- **Como foi utilizado**:
  - Repositório: `github.com/usuario/segredo-do-sabor`
  - README.md com documentação
  - .gitignore para excluir node_modules, .env
  - Pull requests para revisar código
  - Issues para bugs e melhorias
  - Projects para Kanban integrado

### 9.2 Estratégia de Branches

```
main (produção)
  ↑
develop (desenvolvimento)
  ↑
  ├── feature/login-jwt
  ├── feature/crud-produtos
  ├── feature/checkout
  └── bugfix/correcao-estoque
```

**Convenção de Commits**:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alteração em documentação
- `style:` Formatação de código
- `refactor:` Refatoração sem mudar funcionalidade
- `test:` Adição ou correção de testes

**Exemplo**:
```bash
git commit -m "feat: implementa autenticação JWT"
git commit -m "fix: corrige cálculo de custo de produtos"
git commit -m "docs: atualiza README com instruções de deploy"
```

---

## 10. 🧪 Testes e Qualidade

### 10.1 Testes Automatizados

#### **Jest**
- **Categoria**: Framework de Testes JavaScript
- **Versão**: 29.7.0
- **Site**: https://jestjs.io
- **Finalidade no Projeto**:
  - **Testes unitários** de funções e serviços
  - **Testes de integração** de endpoints
  - Cobertura de código
  - Mocks e spies
- **Como foi utilizado**:
  - Testes de services: `clienteService.test.js`, `produtoService.test.js`
  - Testes de validators: `validators.test.js`
  - Configuração em `jest.config.js`
  - Comando: `npm test`

#### **Postman**
- **Categoria**: Plataforma de Teste de APIs
- **Versão**: Desktop App + Web
- **Site**: https://www.postman.com
- **Finalidade no Projeto**:
  - **Testes manuais** de endpoints da API
  - Documentação interativa da API
  - Collections de requisições
  - Testes de autenticação (JWT)
  - Validação de responses
- **Como foi utilizado**:
  - Collection "Segredo do Sabor API"
  - Pasta "Auth" (Login, Register, Refresh Token)
  - Pasta "Produtos" (GET, POST, PUT, DELETE)
  - Pasta "Pedidos" (GET, POST, PUT)
  - Variáveis de ambiente ({{baseUrl}}, {{token}})
  - Testes automatizados em requests
  - Export de collection para documentação

### 10.2 Qualidade de Código

#### **ESLint**
- **Categoria**: Linter para JavaScript
- **Versão**: 8.x (via CRA)
- **Site**: https://eslint.org
- **Finalidade no Projeto**:
  - **Análise estática** de código
  - Identificação de erros e code smells
  - Padronização de estilo de código
  - Boas práticas JavaScript/React
- **Como foi utilizado**:
  - Configuração automática via CRA
  - Regras customizadas no `.eslintrc.js`
  - Integração com VS Code
  - Correção automática: `npm run lint --fix`

#### **Prettier**
- **Categoria**: Formatador de Código
- **Versão**: 3.x
- **Site**: https://prettier.io
- **Finalidade no Projeto**:
  - **Formatação automática** de código
  - Consistência visual
  - Integração com ESLint
- **Como foi utilizado**:
  - Configuração em `.prettierrc`
  - Integração com VS Code (format on save)
  - Comandos: `npm run format`

---

## 11. 🚀 Deploy e Infraestrutura

### 11.1 Hospedagem (Planejado)

#### **Vercel**
- **Categoria**: Plataforma de Deploy para Frontend
- **Versão**: Cloud Platform
- **Site**: https://vercel.com
- **Finalidade no Projeto**:
  - **Deploy do frontend** React
  - Hospedagem estática otimizada
  - CDN global para performance
  - HTTPS automático
  - Builds automáticas do GitHub
- **Como será utilizado**:
  - Conectar repositório GitHub
  - Build automático no push para `main`
  - Variáveis de ambiente configuradas
  - Preview deployments para PRs

#### **Heroku / Railway**
- **Categoria**: Plataforma de Deploy para Backend
- **Versão**: Cloud Platform
- **Site**: https://heroku.com / https://railway.app
- **Finalidade no Projeto**:
  - **Deploy do backend** Node.js
  - Hospedagem de API REST
  - Variáveis de ambiente configuradas
  - Logs centralizados
- **Como será utilizado**:
  - Deploy via Git push
  - Dyno/Container rodando Node.js
  - Add-on de banco de dados MySQL
  - Configuração de .env no dashboard

#### **AWS RDS / ClearDB**
- **Categoria**: Banco de Dados MySQL Gerenciado
- **Versão**: MySQL 8.0
- **Site**: https://aws.amazon.com/rds
- **Finalidade no Projeto**:
  - **Hospedagem do banco de dados** MySQL
  - Backups automáticos
  - Escalabilidade
  - Monitoramento
- **Como será utilizado**:
  - Instância MySQL gerenciada
  - Backup diário automático
  - Conexão via SSL
  - Acesso restrito por IP

### 11.2 Monitoramento

#### **PM2**
- **Categoria**: Process Manager para Node.js
- **Versão**: 5.x
- **NPM**: https://pm2.keymetrics.io
- **Finalidade no Projeto**:
  - **Gerenciamento de processos** Node.js em produção
  - Restart automático em caso de crash
  - Load balancing
  - Logs centralizados
- **Como será utilizado**:
  ```bash
  pm2 start src/server.js --name "segredo-api"
  pm2 startup
  pm2 save
  pm2 logs segredo-api
  ```

---

## 12. 🛠️ Ferramentas de Apoio

### 12.1 Editores e IDEs

#### **Visual Studio Code (VS Code)**
- **Categoria**: Editor de Código
- **Versão**: 1.85.0
- **Site**: https://code.visualstudio.com
- **Finalidade no Projeto**:
  - **Editor principal** de código
  - Suporte a JavaScript, React, Node.js, SQL
  - Extensões para produtividade
  - Terminal integrado
  - Debugging integrado
- **Extensões utilizadas**:
  - **ES7+ React/Redux/React-Native snippets**: Snippets para React
  - **ESLint**: Integração com ESLint
  - **Prettier**: Formatação automática
  - **Auto Rename Tag**: Renomeia tags HTML automaticamente
  - **Path Intellisense**: Autocomplete de caminhos
  - **GitLens**: Informações Git no editor
  - **MySQL**: Extensão para queries SQL
  - **SCSS IntelliSense**: Autocomplete para SCSS
  - **Thunder Client**: Cliente HTTP (alternativa ao Postman)

### 12.2 Navegadores e DevTools

#### **Google Chrome**
- **Categoria**: Navegador Web
- **Versão**: Latest
- **Site**: https://www.google.com/chrome
- **Finalidade no Projeto**:
  - **Navegador principal** para desenvolvimento
  - Chrome DevTools para debug
  - React Developer Tools
  - Network tab para debug de requisições
- **Como foi utilizado**:
  - Inspecionar elementos
  - Console para debug JavaScript
  - Network para ver requisições HTTP
  - Application para ver LocalStorage
  - Performance para analisar renderizações

#### **React Developer Tools**
- **Categoria**: Extensão do Chrome para React
- **Versão**: Latest Extension
- **Site**: Chrome Web Store
- **Finalidade no Projeto**:
  - **Debug de componentes** React
  - Inspecionar props e state
  - Visualizar árvore de componentes
  - Profiler para performance
- **Como foi utilizado**:
  - Debug de Context API
  - Inspecionar props passadas entre componentes
  - Identificar re-renders desnecessários

### 12.3 Geração de Dados

#### **Mockaroo**
- **Categoria**: Gerador de Dados Fake
- **Versão**: Web App
- **Site**: https://mockaroo.com
- **Finalidade no Projeto**:
  - **Geração de dados de teste** para popular banco
  - Criar registros realistas (nomes, emails, telefones)
  - Export para SQL
- **Como foi utilizado**:
  - Geração de 50 clientes fake
  - Geração de 20 produtos
  - Export para SQL INSERT statements

#### **Faker.js**
- **Categoria**: Biblioteca de Geração de Dados Fake
- **Versão**: 8.3.1
- **NPM**: https://www.npmjs.com/package/@faker-js/faker
- **Finalidade no Projeto**:
  - **Gerar dados fake** em scripts de seed
  - Popular banco com dados de teste
- **Como foi utilizado**:
  ```javascript
  const { faker } = require('@faker-js/faker');
  
  const cliente = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    telefone: faker.phone.number()
  };
  ```

### 12.4 Utilitários

#### **Insomnia**
- **Categoria**: Cliente HTTP (alternativa ao Postman)
- **Versão**: Desktop App
- **Site**: https://insomnia.rest
- **Finalidade no Projeto**:
  - **Testes de API** (alternativa ao Postman)
  - Organização de requisições
  - Ambientes de desenvolvimento/produção
- **Como foi utilizado**:
  - Testes rápidos de endpoints
  - Debug de autenticação JWT
  - Export/import de collections

#### **Figma to Code**
- **Categoria**: Ferramenta de Conversão Design → Código
- **Versão**: Plugin do Figma
- **Finalidade no Projeto**:
  - **Conversão de designs** Figma para código React/CSS
  - Acelerar desenvolvimento de componentes
- **Como foi utilizado**:
  - Export de componentes simples
  - Geração de CSS inicial
  - Ajustes manuais após export

---

## 13. 📊 Resumo Geral

### Resumo por Fase do Projeto

| Fase | Softwares Utilizados | Quantidade |
|------|---------------------|------------|
| **Concepção** | Miro, Figma, Google Forms | 3 |
| **Prototipação** | Figma, Adobe Color, Google Fonts | 3 |
| **Gerenciamento** | Trello, GitHub Projects, Notion | 3 |
| **Comunicação** | WhatsApp, MS Teams, Discord, Gmail, Google Meet | 5 |
| **Documentação** | Notion, GitHub Wiki, Markdown, Mermaid | 4 |
| **Banco de Dados** | MySQL, MySQL Workbench, DBeaver | 3 |
| **Backend** | Node.js, Express, 8 bibliotecas principais, Jest | 11+ |
| **Frontend** | React, React Router, Axios, SCSS, 5+ ferramentas | 10+ |
| **Controle de Versão** | Git, GitHub | 2 |
| **Testes** | Jest, Postman, ESLint, Prettier | 4 |
| **Deploy** | Vercel, Heroku/Railway, AWS RDS, PM2 | 4 |
| **Ferramentas de Apoio** | VS Code (8 extensões), Chrome, DevTools, Insomnia | 12+ |
| **TOTAL** | **60+ softwares e ferramentas** | 60+ |

### Resumo por Categoria

```
🎨 Design e UX: 6 ferramentas
📊 Gestão e Documentação: 10 ferramentas
💬 Comunicação: 5 ferramentas
🗄️ Banco de Dados: 3 ferramentas
💻 Desenvolvimento Backend: 15+ ferramentas/bibliotecas
🎨 Desenvolvimento Frontend: 12+ ferramentas/bibliotecas
🔀 Versionamento: 2 ferramentas
🧪 Testes e Qualidade: 4 ferramentas
🚀 Deploy e Infraestrutura: 4 ferramentas
🛠️ Ferramentas de Apoio: 15+ ferramentas
```

---

## 🎯 Softwares Essenciais (Top 20)

Lista dos 20 softwares mais críticos para o projeto:

1. **VS Code** - Editor principal
2. **Git** - Controle de versão
3. **GitHub** - Repositório remoto
4. **Node.js** - Runtime backend
5. **React** - Framework frontend
6. **MySQL** - Banco de dados
7. **MySQL Workbench** - Admin BD
8. **Express.js** - Framework web backend
9. **Figma** - Design e prototipação
10. **Postman** - Testes de API
11. **Notion** - Documentação
12. **Trello** - Gerenciamento
13. **WhatsApp** - Comunicação rápida
14. **Google Meet** - Reuniões com cliente
15. **Chrome** - Browser para desenvolvimento
16. **axios** - Cliente HTTP
17. **jsonwebtoken** - Autenticação
18. **bcrypt** - Segurança de senhas
19. **SCSS** - Estilização avançada
20. **Jest** - Testes automatizados

---

## 📈 Stack Tecnológico Completo

### Backend Stack
```
Node.js 20.x
├── Express 4.18.x (Framework Web)
├── mysql2 3.6.x (Driver MySQL)
├── bcrypt 5.1.x (Hash de senhas)
├── jsonwebtoken 9.0.x (JWT)
├── cors 2.8.x (CORS)
├── dotenv 16.3.x (Env vars)
├── multer 1.4.x (Upload)
├── axios 1.6.x (HTTP client)
├── nodemailer 6.9.x (Email)
└── jest 29.7.x (Testes)
```

### Frontend Stack
```
React 18.2.0
├── react-router-dom 6.20.x (Routing)
├── axios 1.6.x (HTTP client)
├── sass 1.69.x (SCSS)
└── create-react-app 5.0.x (Setup)
```

### Database Stack
```
MySQL 8.0.35
├── InnoDB (Engine)
├── UTF8MB4 (Charset)
├── 10 Tabelas
├── 6 Views
├── 5 Stored Procedures
└── 5 Triggers
```

### DevOps Stack
```
Git 2.43.0
├── GitHub (Repositório)
├── PM2 (Process Manager)
├── Vercel (Frontend Deploy)
├── Heroku/Railway (Backend Deploy)
└── AWS RDS (Database)
```

---

## 🔗 Links Importantes

### Documentação Oficial
- **Node.js**: https://nodejs.org/docs
- **React**: https://react.dev
- **Express**: https://expressjs.com
- **MySQL**: https://dev.mysql.com/doc
- **Git**: https://git-scm.com/doc

### Tutoriais e Recursos
- **MDN Web Docs**: https://developer.mozilla.org
- **Stack Overflow**: https://stackoverflow.com
- **GitHub Docs**: https://docs.github.com
- **npm Registry**: https://www.npmjs.com

### Ferramentas Online
- **Figma**: https://figma.com
- **Miro**: https://miro.com
- **Notion**: https://notion.so
- **Trello**: https://trello.com

---

## ✅ Checklist de Softwares Instalados

### Para Começar o Desenvolvimento

- [ ] **Node.js 20.x** instalado
- [ ] **npm** atualizado
- [ ] **MySQL 8.0+** instalado e rodando
- [ ] **MySQL Workbench** instalado
- [ ] **Git** instalado e configurado
- [ ] **VS Code** instalado
- [ ] **VS Code Extensions** instaladas
- [ ] **Google Chrome** instalado
- [ ] **React Developer Tools** instalado
- [ ] **Postman** ou **Insomnia** instalado
- [ ] **Conta GitHub** criada
- [ ] **Conta Figma** criada
- [ ] **Conta Trello** criada
- [ ] **Conta Notion** criada

### Comandos de Verificação

```bash
# Verificar Node.js
node --version  # Deve retornar v20.x

# Verificar npm
npm --version  # Deve retornar 10.x

# Verificar Git
git --version  # Deve retornar 2.x

# Verificar MySQL
mysql --version  # Deve retornar 8.0.x

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd frontend
npm install
```

---

## 🎓 Conclusão

O projeto **Segredo do Sabor** utilizou um **ecossistema completo de 60+ ferramentas** que abrangem todas as fases do desenvolvimento de software:

1. **Concepção**: Ferramentas de design thinking e ideação
2. **Prototipação**: Ferramentas de design e UX
3. **Gerenciamento**: Ferramentas ágeis e documentação
4. **Comunicação**: Plataformas para equipe e cliente
5. **Desenvolvimento**: Stack moderno e robusto
6. **Testes**: Ferramentas automatizadas e manuais
7. **Deploy**: Infraestrutura cloud escalável

Cada ferramenta foi cuidadosamente selecionada para:
- ✅ Maximizar **produtividade**
- ✅ Garantir **qualidade**
- ✅ Facilitar **colaboração**
- ✅ Permitir **escalabilidade**
- ✅ Seguir **boas práticas** da indústria

---

**Documentação Completa**: 13 de Outubro de 2025  
**Versão do Sistema**: 4.0 - DoceGest MVP  
**Equipe**: Segredo do Sabor Development Team
