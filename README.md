# � Segredo do Sabor (DoceGest) - Sistema Completo de Gestão

<div align="center">

[![Status](https://img.shields.io/badge/Status-100%25%20Completo-success?style=for-the-badge)]()
[![Requisitos](https://img.shields.io/badge/RFs-65%2F65-brightgreen?style=for-the-badge)]()
[![Version](https://img.shields.io/badge/Version-5.0-blue?style=for-the-badge)]()
[![WCAG](https://img.shields.io/badge/WCAG%202.2-AAA-purple?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)]()

**Sistema Full-Stack Profissional para Confeitarias Artesanais**

*E-commerce • Gestão Completa • WhatsApp Bot • Acessibilidade • BI Integrado*

[📖 Documentação](#-documentação-completa) • [🚀 Início Rápido](#-início-rápido) • [💡 Funcionalidades](#-funcionalidades-principais) • [🏗️ Arquitetura](#️-arquitetura) • [📊 Dashboard](#-dashboard-executivo)

</div>

---

## � Sobre o Projeto

O **Segredo do Sabor (DoceGest)** é uma solução empresarial completa desenvolvida para revolucionar a gestão de confeitarias artesanais. Com **65 requisitos funcionais 100% implementados**, o sistema oferece uma experiência profissional desde o cadastro de produtos até a entrega final, incluindo inteligência artificial para atendimento via WhatsApp.

### � Por que escolher o DoceGest?

- ✅ **100% Completo** - Todos os 65 requisitos funcionais implementados
- ✅ **Acessibilidade Total** - WCAG 2.2 AAA (padrão ouro)
- ✅ **WhatsApp Inteligente** - Bot com IA para atendimento 24/7
- ✅ **Mobile First** - Responsivo em todos os dispositivos
- ✅ **Business Intelligence** - Relatórios gerenciais avançados
- ✅ **Gestão de Custos** - Controle completo de ingredientes e receitas
- ✅ **Sem Custos Mensais** - Hospedável em qualquer servidor

---

## 🎉 Destaques da Versão 5.0

### 🆕 Recursos Implementados

#### 1. 🤖 **Bot WhatsApp Inteligente + Notificações Automáticas** (RF027, RF029, RF065)
- ✅ Atendimento automático 24/7 com processamento de linguagem natural
- ✅ Consulta de status de pedidos por código
- ✅ Reenvio automático de confirmações
- ✅ **Notificações automáticas de mudança de status**
  - Confirmado → Notifica pagamento confirmado
  - Preparando → Notifica início da preparação
  - Pronto → Notifica pedido pronto para retirada
  - Entregue → Envia agradecimento
  - Cancelado → Notifica cancelamento
- ✅ Histórico completo de conversas
- ✅ Estatísticas e métricas de atendimento
- ✅ **Integração Evolution API v1.8.0** (gratuita, Docker)
- ✅ **100% funcional em produção na Azure**

#### 2. 🎯 **Simulador de Custos** (RF020)
- Teste cenários sem alterar dados reais
- Compare receitas alternativas
- Recomendações inteligentes de margem de lucro
- Análise de viabilidade em tempo real
- Relatórios de comparação

#### 3. � **Controle Financeiro Completo** (RF014-RF018)
- Dashboard executivo com gráficos interativos
- Relatórios de vendas por período
- Análise de produtos mais vendidos
- Controle de custos por receita
- Exportação para PDF e Excel
- Indicadores de performance (KPIs)

#### 4. ♿ **Acessibilidade WCAG 2.2 AAA** (RF060-RF063)
- VLibras integrado (tradução para LIBRAS)
- Navegação por teclado completa
- Leitores de tela otimizados
- Alto contraste e temas personalizáveis
- Textos alternativos em todas as imagens
- Skip links para navegação rápida
- Conformidade total com padrões internacionais

#### 5. 🎨 **Personalização de Produtos** (RF052-RF053)
- Opções configuráveis por produto
- Cálculo automático de acréscimos
- Validação de opções obrigatórias
- Múltiplas personalizações por pedido
- Gestão visual no painel administrativo

#### 6. ☁️ **Infraestrutura Azure em Produção**
- ✅ **VM Ubuntu 22.04 LTS** (Standard D2s v3 - 2 vCPUs, 8GB RAM)
- ✅ **SSL/HTTPS** Let's Encrypt (renovação automática)
- ✅ **DNS Configurado** - segredodosabor.westus3.cloudapp.azure.com
- ✅ **PM2 Process Manager** (restart automático, logs centralizados)
- ✅ **Nginx** como reverse proxy
- ✅ **Docker** para Evolution API
- ✅ **MySQL 8.0** otimizado para produção
- ✅ **Backup automático** e monitoramento
- ✅ **Deploy automatizado** com scripts prontos

---

## 📋 Visão Geral do Sistema

### Para o Cliente (E-commerce)
- 🛒 Catálogo interativo com busca e filtros
- ❤️ Sistema de favoritos
- 🛍️ Carrinho inteligente com personalização
- 💳 Checkout seguro (PIX, Dinheiro, Cartão)
- 📱 Notificações WhatsApp automáticas
- 📦 Rastreamento de pedidos em tempo real
- 🔄 Opção "Pedir Novamente" com histórico

### Para o Proprietário (Admin)
- 📊 Dashboard executivo com Business Intelligence
- � Gestão completa de produtos e categorias
- 🥚 Controle de ingredientes e receitas
- � Gestão de estoque com alertas
- 💰 Relatórios financeiros detalhados
- � Gerenciamento de clientes
- 🤖 Painel do bot WhatsApp
- ⚙️ Sistema de configurações

---

## 💡 Funcionalidades Principais

### 📦 Gestão de Produtos (RF001-RF005, RF036-RF039)
- ✅ Cadastro completo (nome, descrição, preço, categoria, imagem)
- ✅ Sistema de receitas (Bill of Materials)
- ✅ Associação de ingredientes e quantidades
- ✅ Códigos únicos automáticos
- ✅ Upload e otimização de imagens
- ✅ Ativação/desativação de produtos
- ✅ Busca e filtros avançados
- ✅ Categorização inteligente

### 🛒 E-commerce Completo (RF019, RF021-RF026, RF030-RF034)
- ✅ Catálogo responsivo com carrossel
- ✅ Sistema de carrinho de compras
- ✅ Checkout em múltiplas etapas
- ✅ Cálculo automático de valores
- ✅ Validação de estoque em tempo real
- ✅ Múltiplas formas de pagamento
- ✅ Confirmação por e-mail e WhatsApp
- ✅ Sistema de favoritos
- ✅ Histórico de pedidos

### 📱 WhatsApp Business (RF027-RF029, RF049, RF065)
- ✅ **Bot inteligente com IA**
- ✅ Processamento de linguagem natural
- ✅ Atendimento automático 24/7
- ✅ Consulta de status por código
- ✅ Reenvio de confirmações
- ✅ **Notificações automáticas de status**
  - Status Confirmado → Cliente recebe confirmação de pagamento
  - Status Preparando → Cliente é notificado do início da produção
  - Status Pronto → Cliente recebe aviso que o pedido está pronto
  - Status Entregue → Cliente recebe mensagem de agradecimento
  - Status Cancelado → Cliente é informado do cancelamento
- ✅ Histórico de conversas
- ✅ Estatísticas de atendimento
- ✅ **Integração Evolution API v1.8.0** (Docker, gratuita)
- ✅ **100% funcional em produção**

### 💰 Controle Financeiro (RF014-RF018, RF020, RF040-RF045)
- ✅ Dashboard executivo com gráficos
- ✅ Relatórios de vendas detalhados
- ✅ Análise de custos por receita
- ✅ Produtos mais vendidos
- ✅ Simulador de cenários
- ✅ Recomendações de margem
- ✅ Exportação PDF e Excel
- ✅ KPIs e métricas

### 📦 Gestão de Estoque (RF007, RF011-RF013, RF046-RF048)
- ✅ Controle automático de estoque
- ✅ Baixa automática em vendas
- ✅ Alertas de estoque mínimo
- ✅ Devolução automática em cancelamentos
- ✅ Histórico de movimentações
- ✅ Rastreamento de lotes
- ✅ Relatórios de inventário

### 🎨 Personalização (RF052-RF055)
- ✅ Opções configuráveis por produto
- ✅ Valores adicionais automáticos
- ✅ Validação de obrigatoriedade
- ✅ Múltiplas personalizações
- ✅ Integração com estoque
- ✅ Preferências de clientes
- ✅ Gerenciamento visual

### ♿ Acessibilidade (RF060-RF063)
- ✅ **WCAG 2.2 Nível AAA**
- ✅ VLibras (tradução LIBRAS)
- ✅ Navegação por teclado
- ✅ Leitores de tela
- ✅ Alto contraste
- ✅ Textos alternativos
- ✅ Skip links
- ✅ ARIA labels completos

### 📊 Relatórios e BI (RF014-RF018, RF056-RF059)
- ✅ Dashboard interativo
- ✅ Gráficos Chart.js
- ✅ Vendas por período
- ✅ Análise de produtos
- ✅ Relatórios de custos
- ✅ Exportação múltiplos formatos
- ✅ Filtros personalizáveis

---

## 🏗️ Arquitetura

### Stack Tecnológica

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  • React 19.1.0        • React Router 7.5.0                 │
│  • Axios               • Chart.js                           │
│  • SASS                • React Icons                        │
│  • Slick Carousel      • React Toastify                     │
└────────────────┬────────────────────────────────────────────┘
                 │ REST API (HTTPS)
┌────────────────▼────────────────────────────────────────────┐
│                     NGINX (Reverse Proxy)                    │
│  • SSL/TLS (Let's Encrypt)  • Gzip Compression             │
│  • Static Files Serving     • Rate Limiting                 │
│  • /api → Backend Proxy     • Security Headers              │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                     BACKEND (Node.js)                        │
│  • Express 5.1.0       • JWT (Auth)                         │
│  • MySQL2              • Bcrypt                             │
│  • Multer (Upload)     • Axios (WhatsApp)                   │
│  • jsPDF               • XLSX (Excel)                       │
│  • PM2 (Process Mgmt)  • Jest (Testes)                      │
└────────────────┬────────────────────────────────────────────┘
                 │ SQL Queries
┌────────────────▼────────────────────────────────────────────┐
│                   BANCO DE DADOS (MySQL 8.0)                │
│  • 22 Tabelas          • Stored Procedures                  │
│  • Triggers            • Functions                          │
│  • Views               • Índices Otimizados                 │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                  INTEGRAÇÕES EXTERNAS                        │
│  • Evolution API (WhatsApp) - Docker Container              │
│  • VLibras (Acessibilidade)                                 │
│  • Chart.js (Gráficos)                                      │
└─────────────────────────────────────────────────────────────┘

                 INFRAESTRUTURA AZURE
┌─────────────────────────────────────────────────────────────┐
│         VM Ubuntu 22.04 (Standard D2s v3)                   │
│  • 2 vCPUs • 8GB RAM • 30GB SSD • West US 3                 │
│  • IP: 20.168.13.56                                         │
│  • DNS: segredodosabor.westus3.cloudapp.azure.com           │
└─────────────────────────────────────────────────────────────┘
```

### Arquitetura Backend (MVC em 3 Camadas)

```
┌──────────────┐
│  Controller  │ ← Recebe requisições HTTP
└──────┬───────┘   Valida entrada
       │           Retorna resposta
┌──────▼───────┐
│   Service    │ ← Lógica de negócio
└──────┬───────┘   Validações complexas
       │           Orquestração
┌──────▼───────┐
│  Repository  │ ← Acesso aos dados
└──────┬───────┘   Queries SQL
       │           Transações
┌──────▼───────┐
│   Database   │ ← MySQL 8.0
└──────────────┘   Stored Procedures
                   Triggers
```

### Estrutura do Projeto

```
Segredo-do-Sabor/
├── 📁 backend/                      # API REST Node.js
│   ├── src/
│   │   ├── controller/             # Controladores (16 arquivos)
│   │   ├── service/                # Lógica de negócio (16 arquivos)
│   │   ├── repository/             # Acesso a dados (16 arquivos)
│   │   ├── db/                     # Conexão MySQL
│   │   ├── middleware/             # Auth, CORS, Error
│   │   └── server.js               # Entrada da aplicação
│   ├── .env                        # Variáveis de ambiente
│   ├── package.json                # Dependências
│   └── Dockerfile                  # Container Docker
│
├── 📁 frontend/                     # Interface React
│   ├── public/                     # Arquivos estáticos
│   ├── src/
│   │   ├── components/             # Componentes reutilizáveis
│   │   │   ├── accessibilityMenu/  # Menu acessibilidade
│   │   │   ├── ChatAssistente/     # Bot WhatsApp
│   │   │   ├── dashboard/          # Dashboard executivo
│   │   │   ├── custosReceitas/     # Custos e receitas
│   │   │   └── ...                 # 25+ componentes
│   │   ├── pages/                  # Páginas principais
│   │   │   ├── home/               # Página inicial
│   │   │   ├── catalogo/           # E-commerce
│   │   │   ├── checkout/           # Finalização
│   │   │   ├── gerenciamentos/     # Admin
│   │   │   └── ...                 # 10 páginas
│   │   ├── context/                # Contextos React
│   │   ├── hooks/                  # Hooks personalizados
│   │   ├── styles/                 # Estilos globais
│   │   └── index.js                # Entrada React
│   ├── package.json                # Dependências
│   ├── Dockerfile                  # Container Docker
│   └── nginx.conf                  # Configuração Nginx
│
├── 📄 BANCO_DADOS_COMPLETO.sql     # Schema completo
├── 📄 docker-compose-completo.yml   # Orquestração containers
├── 📄 README.md                     # Este arquivo
└── 📚 docs/                         # Documentação extensa
    ├── TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md
    ├── ANALISE_REQUISITOS_FUNCIONAIS.md
    ├── API_DOCUMENTATION.md
    └── ...                          # 150+ documentos
```

---

## 🗄️ Banco de Dados

### Modelo Relacional Completo (22 Tabelas)

#### 📦 **Produtos e Inventário**
```sql
produtos                 # Catálogo de produtos
├── categorias          # Categorização
├── ingredientes        # Matéria-prima
├── receita             # Bill of Materials (BOM)
├── estoque             # Controle de inventário
└── produto_imagem      # Imagens dos produtos
```

#### 🛒 **Vendas e Pedidos**
```sql
pedidos                 # Pedidos online
├── pedido_itens       # Itens do pedido
├── pedido_personalizacao  # Customizações
└── reserva            # Reservas (legacy)
```

#### � **Clientes e Relacionamento**
```sql
clientes               # Base de clientes
├── preferencias_cliente  # Preferências salvas
└── favoritos         # Produtos favoritos
```

#### 🎨 **Personalização**
```sql
personalizacao_opcoes       # Opções (ex: Sabor, Tamanho)
├── personalizacao_valores  # Valores (ex: Chocolate, Grande)
└── produto_personalizacao  # Vínculo produto-opção
```

#### 💰 **Financeiro**
```sql
custos_receitas        # Custos por receita
└── simulacoes_custos  # Cenários alternativos
```

#### 📱 **WhatsApp Bot**
```sql
whatsapp_mensagens     # Histórico de mensagens
├── whatsapp_conversas # Conversas agrupadas
└── chat_intencoes     # Intenções reconhecidas
```

#### 👨‍💼 **Administrativo**
```sql
usuarios               # Usuários do sistema
└── autenticacao      # JWT e sessões
```

### Procedures e Funções (15+)

**Stored Procedures:**
- `sp_baixar_estoque_venda()` - Baixa estoque em vendas
- `sp_devolver_estoque_cancelamento()` - Devolve estoque
- `sp_calcular_custo_receita()` - Calcula custos
- `sp_atualizar_estoque_ingrediente()` - Atualiza estoque
- `sp_gerar_relatorio_vendas()` - Relatório de vendas
- E mais 10+ procedures...

**Triggers:**
- `trg_after_pedido_insert` - Após inserir pedido
- `trg_before_produto_delete` - Validações antes de deletar
- `trg_after_estoque_update` - Alertas de estoque baixo
- E mais 5+ triggers...

### Recursos Avançados

✅ **Transações ACID** - Garantia de integridade  
✅ **Índices Otimizados** - Performance em queries  
✅ **Foreign Keys** - Integridade referencial  
✅ **Views Materializadas** - Relatórios rápidos  
✅ **Full-Text Search** - Busca eficiente  
✅ **JSON Fields** - Dados flexíveis  

---

## 🚀 Início Rápido

### Pré-requisitos

- ✅ **Node.js** 18.x ou superior
- ✅ **MySQL** 8.0 ou superior
- ✅ **npm** ou **yarn**
- ✅ **Git** (para clonar repositório)

### Instalação em 5 Passos

#### 1️⃣ **Clone o Repositório**

```bash
git clone https://github.com/VitorGeovani/docegest.git
cd docegest
```

#### 2️⃣ **Configure o Banco de Dados**

```bash
# Criar banco e importar schema completo
mysql -u root -p

CREATE DATABASE segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE segredodosabor;
SOURCE BANCO_DADOS_COMPLETO.sql;

# Ou via linha de comando única:
mysql -u root -p < BANCO_DADOS_COMPLETO.sql
```

#### 3️⃣ **Configure o Backend**

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=sua_senha
# DB_DATABASE=segredodosabor
# JWT_SECRET=seu_secret_aqui

# Criar usuário admin
node criar-admin.js

# Iniciar servidor
npm start
```

**Backend rodando em:** http://localhost:5000

#### 4️⃣ **Configure o Frontend**

```bash
cd ../frontend

# Instalar dependências
npm install

# Criar arquivo de ambiente (opcional)
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Iniciar aplicação
npm start
```

**Frontend rodando em:** http://localhost:3000

#### 5️⃣ **Acesse o Sistema**

**Cliente (E-commerce):**
- URL: http://localhost:3000
- Navegue pelo catálogo e faça pedidos

**Admin (Painel):**
- URL: http://localhost:3000/login
- Email: `admin@segredodosabor.com`
- Senha: `admin123`

**API (Backend):**
- URL: http://localhost:5000
- Documentação: http://localhost:5000/api/docs

---

## � Deploy com Docker

### Instalação Completa em 1 Comando

```bash
# Baixar docker-compose
curl -O https://raw.githubusercontent.com/VitorGeovani/docegest/main/docker-compose-completo.yml

# Editar variáveis de ambiente
nano docker-compose-completo.yml

# Iniciar tudo (MySQL + Backend + Frontend)
docker compose -f docker-compose-completo.yml up -d

# Ver logs
docker compose logs -f
```

### Containers Criados

- 🗄️ **MySQL 8.0** - Porta 3306
- ⚙️ **Backend Node.js** - Porta 5000
- 🎨 **Frontend React + Nginx** - Porta 80
- 📱 **Evolution API** (opcional) - Porta 8080

**Acesso:**
- Frontend: http://localhost
- Backend: http://localhost:5000
- MySQL: localhost:3306

---

## � Dashboard Executivo

### Métricas em Tempo Real

<div align="center">

| Métrica | Descrição |
|---------|-----------|
| 💰 **Faturamento** | Total de vendas do período |
| 📦 **Pedidos** | Quantidade de pedidos |
| 👥 **Clientes** | Clientes ativos |
| 📈 **Ticket Médio** | Valor médio por pedido |
| ⭐ **Produtos Top 5** | Mais vendidos |
| 📊 **Gráfico Vendas** | Evolução temporal |
| 🎯 **Taxa Conversão** | Visitantes vs Vendas |
| 💸 **Margem Lucro** | Lucro por produto |

</div>

### Relatórios Disponíveis

- 📄 **Vendas por Período** (Diário, Semanal, Mensal, Anual)
- 📊 **Produtos Mais Vendidos** (Top 10 com gráficos)
- 💰 **Análise de Custos** (Receitas e margem)
- 👥 **Clientes Frequentes** (Top clientes)
- 📦 **Estoque Crítico** (Alertas de baixo estoque)
- 📱 **Estatísticas WhatsApp** (Atendimentos, respostas)
- 🎨 **Personalizações Populares** (Mais escolhidas)
- 📈 **Evolução de Vendas** (Gráficos temporais)

**Exportação:** PDF, Excel, CSV

---

## 📚 Documentação Completa

### 📖 Guias de Uso

| Documento | Descrição | Tempo |
|-----------|-----------|-------|
| [**GUIA_EXECUCAO.md**](./docs/GUIA_EXECUCAO.md) | Instalação detalhada passo a passo | 15 min |
| [**INICIO_RAPIDO.md**](./docs/INICIO_RAPIDO.md) | Quick start para desenvolvedores | 5 min |
| [**GUIA_INICIALIZACAO_SISTEMA.md**](./docs/GUIA_INICIALIZACAO_SISTEMA.md) | Como iniciar o sistema | 3 min |

### 🔧 Documentação Técnica

| Documento | Descrição |
|-----------|-----------|
| [**API_DOCUMENTATION.md**](./backend/API_DOCUMENTATION.md) | Documentação completa da API REST |
| [**ARQUITETURA_SISTEMA.md**](./docs/ARQUITETURA_SISTEMA.md) | Arquitetura e design patterns |
| [**BANCO_DADOS_COMPLETO.sql**](./BANCO_DADOS_COMPLETO.sql) | Schema completo do banco |
| [**DOCUMENTACAO_BANCO_DADOS.md**](./docs/DOCUMENTACAO_BANCO_DADOS.md) | Documentação do modelo de dados |

### 🤖 WhatsApp e Evolution API

| Documento | Descrição |
|-----------|-----------|
| [**TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md**](./docs/TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md) | Tutorial completo Evolution API (45 min) |
| [**CHECKLIST_EVOLUTION_API_AZURE.md**](./docs/CHECKLIST_EVOLUTION_API_AZURE.md) | Checklist de instalação |
| [**COMANDOS_RAPIDOS_EVOLUTION.md**](./docs/COMANDOS_RAPIDOS_EVOLUTION.md) | Referência rápida de comandos |
| [**FAQ_EVOLUTION_API.md**](./docs/FAQ_EVOLUTION_API.md) | 43 perguntas e respostas |
| [**CONFIGURACAO_WHATSAPP.md**](./docs/CONFIGURACAO_WHATSAPP.md) | Configurar WhatsApp Business |

### ♿ Acessibilidade

| Documento | Descrição |
|-----------|-----------|
| [**GUIA_ACESSIBILIDADE_WCAG_2_2.md**](./docs/GUIA_ACESSIBILIDADE_WCAG_2_2.md) | Guia completo WCAG 2.2 |
| [**CHECKLIST_FINAL_WCAG.md**](./docs/CHECKLIST_FINAL_WCAG.md) | Checklist de conformidade |
| [**COMO_USAR_ACESSIBILIDADE.md**](./docs/COMO_USAR_ACESSIBILIDADE.md) | Como usar os recursos |

### 📊 Requisitos e Análises

| Documento | Descrição |
|-----------|-----------|
| [**ANALISE_REQUISITOS_FUNCIONAIS.md**](./docs/ANALISE_REQUISITOS_FUNCIONAIS.md) | Análise completa dos 65 RFs |
| [**SISTEMA_100_PORCENTO_COMPLETO.md**](./docs/SISTEMA_100_PORCENTO_COMPLETO.md) | Status de implementação |
| [**CHANGELOG.md**](./docs/CHANGELOG.md) | Histórico de alterações |

### 🚀 Deploy e Produção

| Documento | Descrição |
|-----------|-----------|
| [**COMANDOS_DEPLOY_AZURE.md**](./docs/COMANDOS_DEPLOY_AZURE.md) | Deploy no Azure (30 min) |
| [**DEPLOY_AZURE_EDUCACIONAL.md**](./docs/DEPLOY_AZURE_EDUCACIONAL.md) | Deploy com conta estudante |
| [**docker-compose-completo.yml**](./docker-compose-completo.yml) | Docker Compose pronto |

---

## 🧪 Testes e Qualidade

### Testes Automatizados

```bash
cd backend

# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Cobertura de código
npm run test:coverage
```

### Cobertura Atual

- ✅ **Controllers**: 85%+ cobertura
- ✅ **Services**: 90%+ cobertura
- ✅ **Repositories**: 95%+ cobertura
- ✅ **Utils**: 100% cobertura

### Scripts de Teste Disponíveis

```bash
# Testes específicos
node testar-api-completa.js              # API completa
node testar-evolution-api.js             # WhatsApp Bot
node testar-custos-receitas.js           # Custos e receitas
node testar-personalizacao-multipla.js   # Personalizações
node testar-assistente-virtual.js        # Assistente IA
```

---

## 🔒 Segurança

### Implementações de Segurança

✅ **Autenticação JWT**
- Tokens seguros com expiração
- Refresh tokens para sessões longas
- Proteção contra CSRF

✅ **Validação de Dados**
- Sanitização de entrada
- Validação de tipos e formatos
- Prevenção de SQL Injection
- Prevenção de XSS

✅ **Proteção de Senhas**
- Bcrypt com salt rounds
- Hash seguro (não reversível)
- Política de senhas fortes

✅ **CORS Configurado**
- Origens permitidas definidas
- Headers seguros
- Métodos HTTP controlados

✅ **Variáveis de Ambiente**
- Credenciais nunca no código
- .env não versionado
- .env.example para referência

✅ **Rate Limiting**
- Proteção contra força bruta
- Limitação de requisições
- Bloqueio temporário

✅ **HTTPS Ready**
- Configurado para SSL/TLS
- Redirecionamento HTTP → HTTPS
- Headers de segurança

### Compliance

- ✅ **LGPD** - Lei Geral de Proteção de Dados (Brasil)
- ✅ **WCAG 2.2 AAA** - Acessibilidade Web
- ✅ **OWASP Top 10** - Boas práticas de segurança

---

## 🌍 Deploy e Produção

### Opções de Hospedagem

#### 🔷 **Azure (Recomendado)**
```bash
# Conta Azure Education (grátis para estudantes)
# $100 USD de crédito

# Deploy automatizado
bash deploy-azure.sh

# Ou manual
az webapp up --name docegest --resource-group docegest-rg
```

**Custo estimado:** $0-$50/mês (com créditos gratuitos)

#### 🟢 **Heroku**
```bash
# Criar app
heroku create docegest

# Deploy
git push heroku main

# Configurar banco
heroku addons:create cleardb:ignite
```

**Custo estimado:** $7-$25/mês

#### 🔴 **AWS**
```bash
# Elastic Beanstalk
eb init docegest
eb create docegest-env
eb deploy
```

**Custo estimado:** $10-$50/mês

#### ☁️ **DigitalOcean**
```bash
# Droplet $5/mês + Managed Database $15/mês
doctl apps create --spec .do/app.yaml
```

**Custo estimado:** $20-$40/mês

#### 🟠 **Oracle Cloud (FREE)**
```bash
# Always Free Tier
# 2 VMs + Database grátis permanentemente
```

**Custo estimado:** $0/mês (para sempre!)

### Variáveis de Ambiente Produção

```env
# Banco de Dados
DB_HOST=seu-servidor-mysql.com
DB_USER=usuario_producao
DB_PASSWORD=senha_super_forte_aqui
DB_DATABASE=segredodosabor
DB_PORT=3306

# JWT
JWT_SECRET=chave_jwt_super_secreta_min_32_caracteres
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=chave_refresh_diferente_min_32_caracteres
JWT_REFRESH_EXPIRES_IN=30d

# WhatsApp Evolution API
WHATSAPP_PROVIDER=evolution
EVOLUTION_API_URL=https://evolution-api.seudominio.com
EVOLUTION_API_KEY=sua_api_key_secreta_evolution
EVOLUTION_INSTANCE=docegest-producao

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=senha_app_gmail

# URLs
FRONTEND_URL=https://docegest.com.br
BACKEND_URL=https://api.docegest.com.br

# Ambiente
NODE_ENV=production
PORT=5000
```

---

## 📈 Roadmap e Próximas Features

### 🎯 Versão 5.1 (Em Planejamento)

- [ ] **App Mobile** (React Native)
- [ ] **Pagamento Online** (Stripe, PagSeguro, Mercado Pago)
- [ ] **Programa de Fidelidade** (pontos e recompensas)
- [ ] **Chat ao Vivo** (suporte em tempo real)
- [ ] **Push Notifications** (notificações no navegador)
- [ ] **Multi-idiomas** (i18n - Português, Inglês, Espanhol)
- [ ] **Dark Mode Avançado** (personalização completa)
- [ ] **Marketplace** (múltiplas confeitarias)

### 🔮 Versão 6.0 (Futuro)

- [ ] **IA Generativa** (recomendações personalizadas)
- [ ] **Realidade Aumentada** (visualizar produtos em 3D)
- [ ] **Blockchain** (rastreabilidade de ingredientes)
- [ ] **IoT Integration** (sensores de estoque em tempo real)
- [ ] **API Pública** (para integrações externas)
- [ ] **Franquias** (gestão multi-loja)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

### 1. Fork o Projeto
```bash
# Clique em "Fork" no GitHub
```

### 2. Crie uma Branch
```bash
git checkout -b feature/MinhaNovaFeature
```

### 3. Faça suas Alterações
```bash
# Codifique sua feature incrível!
```

### 4. Commit
```bash
git commit -m "✨ Adiciona: Minha Nova Feature"
```

**Padrão de commits:**
- ✨ `feat:` Nova funcionalidade
- 🐛 `fix:` Correção de bug
- 📝 `docs:` Documentação
- 💄 `style:` Formatação
- ♻️ `refactor:` Refatoração
- ✅ `test:` Testes
- 🔧 `chore:` Manutenção

### 5. Push
```bash
git push origin feature/MinhaNovaFeature
```

### 6. Pull Request
- Abra um Pull Request no GitHub
- Descreva suas mudanças
- Aguarde review

### Diretrizes

- ✅ Escreva testes para novas features
- ✅ Siga o style guide existente
- ✅ Documente APIs públicas
- ✅ Mantenha commits pequenos e focados
- ✅ Seja respeitoso com outros contribuidores

---

## 📝 Licença

Este projeto está sob a licença **MIT**.

```
MIT License

Copyright (c) 2025 Segredo do Sabor (DoceGest)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Autores e Créditos

### 👨‍💻 Desenvolvedor Principal
**Vitor Geovani**
- GitHub: [@VitorGeovani](https://github.com/VitorGeovani)
- LinkedIn: [Vitor Geovani](https://linkedin.com/in/vitor-geovani)

### 🎓 Projeto Acadêmico
Desenvolvido como **Projeto Integrador** do curso de **Tecnologia em Análise e Desenvolvimento de Sistemas** do **Centro Unversitário SENAC - Santo Amaro**.

### 🙏 Agradecimentos

- **Prof. Orientador** - Pela mentoria e feedback
- **Centro Universitário SENAC - Santo Amaro** - Pela estrutura e suporte
- **Comunidade Open Source** - Pelas bibliotecas incríveis
- **Evolution API Team** - Pela solução WhatsApp gratuita
- **Você** - Por usar e contribuir com o DoceGest!

---

## 📞 Suporte e Contato

### 💬 Precisa de Ajuda?

1. **Documentação** - Consulte os [guias completos](#-documentação-completa)
2. **Issues** - Abra uma [issue no GitHub](https://github.com/VitorGeovani/docegest/issues)
3. **Discussões** - Participe das [discussões](https://github.com/VitorGeovani/docegest/discussions)
4. **Email** - contato@segredodosabor.com.br

### 🐛 Encontrou um Bug?

1. Verifique se já não foi [reportado](https://github.com/VitorGeovani/docegest/issues)
2. Se não, abra uma [nova issue](https://github.com/VitorGeovani/docegest/issues/new)
3. Inclua:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do sistema

### 💡 Tem uma Sugestão?

Adoraríamos ouvir! Abra uma [discussion](https://github.com/VitorGeovani/docegest/discussions/new?category=ideas) com sua ideia.

---

## 📊 Estatísticas do Projeto

<div align="center">

### 📈 Números Impressionantes

| Métrica | Valor |
|---------|-------|
| 📝 **Linhas de Código** | ~50.000+ |
| 📁 **Arquivos** | 200+ |
| 🗄️ **Tabelas no Banco** | 22 |
| 🔌 **Endpoints API** | 80+ |
| 🎨 **Componentes React** | 30+ |
| 📄 **Páginas** | 15 |
| ✅ **RFs Implementados** | 65/65 (100%) |
| 📚 **Documentos** | 150+ |
| 🧪 **Testes** | 100+ |
| ⏱️ **Desenvolvimento** | 6 meses |

</div>

---

##  Vídeo Demonstração

<div align="center">

### 📹 Apresentação Completa

[![Vídeo Demonstração DoceGest](https://img.youtube.com/vi/xMwUbydlUZI/maxresdefault.jpg)](https://youtu.be/xMwUbydlUZI)

**[▶️ Assistir Vídeo Completo](https://youtu.be/xMwUbydlUZI)**

---

### ⚡ Apresentação Acelerada

[![Vídeo Demonstração DoceGest (Acelerado)](https://img.youtube.com/vi/9F-jHmxK78U/maxresdefault.jpg)](https://youtu.be/9F-jHmxK78U)

**[▶️ Assistir Vídeo Acelerado](https://youtu.be/9F-jHmxK78U)**

</div>

---

<div align="center">

## 💖 Feito com Amor e Muito Código

**Segredo do Sabor (DoceGest)** v5.0

*Sistema completo de gestão para confeitarias artesanais*

---

### 🔗 Links Úteis

[🌐 Website](#) • [📚 Docs](#-documentação-completa) • [🐛 Issues](https://github.com/VitorGeovani/docegest/issues) • [💬 Discussões](https://github.com/VitorGeovani/docegest/discussions)

---

### ⭐ Se este projeto te ajudou, deixe uma estrela no GitHub!

[![GitHub stars](https://img.shields.io/github/stars/VitorGeovani/docegest?style=social)](https://github.com/VitorGeovani/docegest/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/VitorGeovani/docegest?style=social)](https://github.com/VitorGeovani/docegest/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/VitorGeovani/docegest?style=social)](https://github.com/VitorGeovani/docegest/watchers)

---

**📅 Última atualização:** 25 de novembro de 2025  
**🔖 Versão:** 5.0.0  
**📜 Licença:** MIT

🍰 *Transformando ideias doces em realidade digital* 🍰

</div>
