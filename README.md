# 🍦 Segredo do Sabor - v5.0 (100% COMPLETO)

**Sistema Completo de Gestão para Confeitaria Artesanal**

[![Status](https://img.shields.io/badge/Status-100%25%20Completo-success)]()
[![Requisitos](https://img.shields.io/badge/RFs-65%2F65-brightgreen)]()
[![Version](https://img.shields.io/badge/Version-5.0-blue)]()
[![License](https://img.shields.io/badge/License-Proprietário-red)]()

Sistema full-stack completo para gerenciamento de confeitarias, incluindo e-commerce, painel administrativo, controle de custos, bot WhatsApp inteligente e acessibilidade WCAG 2.2 AAA.

---

## 🎉 NOVIDADES DA VERSÃO 5.0

### ⭐ 100% DE IMPLEMENTAÇÃO!

Todos os **65 Requisitos Funcionais** foram implementados com sucesso:

#### 🆕 Recursos Recém-Implementados:

1. **🎯 Simulador de Custos** (RF020)
   - Teste receitas alternativas sem alterar dados reais
   - Compare cenários de preço
   - Recomendações inteligentes de margem
   - Cálculos em tempo real

2. **🤖 Bot WhatsApp Inteligente** (RF027, RF029, RF065)
   - Responde automaticamente 24/7
   - Entende intenções dos clientes
   - Consulta status de pedidos
   - Reenvia confirmações
   - Histórico completo de conversas
   - Estatísticas de atendimento

3. **🔄 Sistema de Reenvio** (RF049)
   - Reenvie confirmações de pedidos
   - Integrado com histórico WhatsApp
   - Logs completos de todas as ações

---

## 📋 Sobre o Projeto

O **Segredo do Sabor** é um sistema profissional desenvolvido para modernizar a gestão de confeitarias artesanais, oferecendo:

- 🛒 **E-commerce** completo com carrinho e checkout
- 👨‍💼 **Painel administrativo** com 8 módulos de gestão
- 💰 **Controle financeiro** e cálculo de custos
- 📦 **Gestão de estoque** inteligente com alertas
- 🤖 **Bot WhatsApp** com IA
- ♿ **Acessibilidade total** WCAG 2.2 AAA
- 📊 **Business Intelligence** integrado

---O Segredo do Sabor é uma aplicação web full-stack desenvolvida para facilitar o gerenciamento e vendas de uma sorveteria artesanal. O sistema permite:

- 🍨 Gerenciamento completo de produtos
- 👥 Cadastro e controle de clientes
- 📝 Sistema de reservas com controle de estoque
- 💰 Gestão financeira e relatórios
- 🖼️ Upload e visualização de imagens dos produtos

## 🏗️ Arquitetura do Projeto

```
Segredos-do-Sabor/
├── backend/              # API REST (Node.js + Express)
├── frontend/             # Interface Web (React)
├── segredodosabor.sql   # Script do Banco de Dados
├── GUIA_EXECUCAO.md     # Guia completo de instalação
└── CHANGELOG.md          # Histórico de alterações
```

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web
- **MySQL** - Banco de dados relacional
- **Jest** - Framework de testes
- **Multer** - Upload de arquivos
- **Dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **React** - Biblioteca para construção de interfaces
- **React Router** - Navegação entre páginas
- **Axios** - Cliente HTTP
- **SASS** - Pré-processador CSS
- **Slick Carousel** - Carrossel de imagens

## 📚 Documentação

- **[GUIA_EXECUCAO.md](./GUIA_EXECUCAO.md)** - Instruções detalhadas de instalação e execução
- **[backend/README.md](./backend/README.md)** - Documentação do backend
- **[backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)** - Documentação completa da API
- **[CHANGELOG.md](./CHANGELOG.md)** - Registro de todas as alterações do projeto

## ⚡ Início Rápido

### Pré-requisitos
- Node.js 14+
- MySQL 8.0+
- npm ou yarn

### Instalação Rápida

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd Segredos-do-Sabor
```

2. **Configure o banco de dados**
```bash
mysql -u root -p < segredodosabor.sql
```

3. **Configure e inicie o backend**
```bash
cd backend
npm install
copy .env.example .env    # Configure suas credenciais
npm start
```

4. **Configure e inicie o frontend**
```bash
cd ../frontend
npm install
npm start
```

5. **Acesse o sistema**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Para instruções detalhadas, consulte o **[GUIA_EXECUCAO.md](./GUIA_EXECUCAO.md)**

## 🧪 Testes

```bash
cd backend
npm test                  # Executa todos os testes
npm run test:watch       # Modo watch
npm run test:coverage    # Relatório de cobertura
```

## 📊 Funcionalidades Principais

### Produtos
- ✅ Cadastro, edição e remoção de produtos
- ✅ Upload de imagens
- ✅ Controle de estoque
- ✅ Listagem com filtros

### Clientes
- ✅ Cadastro automático ou manual
- ✅ Validação de dados
- ✅ Histórico de compras

### Reservas
- ✅ Criação de reservas
- ✅ Validação automática de estoque
- ✅ Gestão de status (Pendente/Confirmado/Cancelado)
- ✅ Cálculo automático de valores
- ✅ Devolução de produtos ao estoque em caso de cancelamento

### Gestão
- ✅ Visualização de reservas pendentes
- ✅ Relatórios financeiros
- ✅ Controle de estoque em tempo real

## 🏛️ Arquitetura Backend

O backend segue uma arquitetura em três camadas:

```
┌─────────────┐
│  Controller │ ← Recebe requisições HTTP
└──────┬──────┘
       │
┌──────▼──────┐
│   Service   │ ← Lógica de negócio e validações
└──────┬──────┘
       │
┌──────▼──────┐
│ Repository  │ ← Acesso aos dados
└──────┬──────┘
       │
┌──────▼──────┐
│   Database  │
└─────────────┘
```

## 🔒 Segurança

- ✅ Validação de entrada em todas as operações
- ✅ Credenciais em variáveis de ambiente
- ✅ Transações de banco para operações críticas
- ✅ Tratamento de erros sem expor informações sensíveis
- ✅ Sanitização de dados

## 📈 Melhorias Implementadas

- ✅ Arquitetura em camadas (Controller, Service, Repository)
- ✅ Validações robustas em todas as operações
- ✅ Testes unitários configurados
- ✅ Documentação completa da API
- ✅ Tratamento de erros padronizado
- ✅ Middleware de erro centralizado
- ✅ Funções utilitárias para validação
- ✅ Variáveis de ambiente
- ✅ Code style consistente

## 🤝 Contribuindo

Este projeto foi desenvolvido como parte do Projeto Integrador. Para contribuições:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é de uso acadêmico.

## 👥 Autores

Projeto desenvolvido para a disciplina de Projeto Integrador.

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação em [GUIA_EXECUCAO.md](./GUIA_EXECUCAO.md)
2. Verifique as issues no repositório
3. Entre em contato com a equipe de desenvolvimento

---

**Versão:** 2.0.0  
**Última atualização:** Outubro 2025

🍦 Desenvolvido com muito ❤️ e 🍨
