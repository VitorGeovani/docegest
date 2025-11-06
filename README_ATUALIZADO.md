# 🍦 Segredos do Sabor - Sistema de Gestão de Sorveteria

> **Status:** ✅ Sistema Funcional | 📅 Última atualização: 04/10/2025

Sistema completo para gerenciamento de sorveteria artesanal com autenticação, controle de estoque, gestão de ingredientes e relatórios financeiros.

---

## 🎯 Recursos Principais

### ✅ Sistema de Autenticação
- Login com JWT (Access Token + Refresh Token)
- Controle de acesso por tipo de usuário (cliente/admin)
- Recuperação de senha via token
- Verificação de e-mail

### 🍨 Gestão de Produtos
- Cadastro completo de produtos com imagens
- Categorização inteligente (6 categorias)
- Controle de estoque automatizado
- Cálculo de custo de produção e margem de lucro

### 📦 Sistema de Ingredientes (DoceGest V3)
- 21 ingredientes cadastrados
- Controle de estoque e estoque mínimo
- Alertas de estoque baixo
- Receitas e custeio de produtos

### 📊 Relatórios e Dashboard
- Vendas diárias, semanais e mensais
- Receita total e lucro líquido
- Produtos mais vendidos
- Análise de formas de pagamento
- Gráficos interativos

### 🛒 Sistema de Pedidos
- Reservas online com WhatsApp
- Controle de status (pendente/confirmado/cancelado)
- Gestão de entregas e retiradas
- Histórico completo de pedidos

---

## 🏗️ Arquitetura do Sistema

```
Segredos-do-Sabor/
├── 📁 backend/                    # API REST (Node.js + Express)
│   ├── src/
│   │   ├── controller/           # Controladores da API
│   │   ├── repository/           # Acesso ao banco de dados
│   │   ├── services/             # Lógica de negócio
│   │   ├── middleware/           # Autenticação e validações
│   │   └── utils/                # Funções auxiliares
│   ├── storage/                  # Imagens dos produtos
│   ├── tests/                    # Testes automatizados
│   └── .env                      # Variáveis de ambiente
│
├── 📁 frontend/                   # Interface Web (React)
│   ├── src/
│   │   ├── components/           # Componentes reutilizáveis
│   │   ├── pages/                # Páginas da aplicação
│   │   └── context/              # Contexto de autenticação
│   └── public/                   # Arquivos estáticos
│
├── 📄 migracao_completa_autenticacao.sql  # Script SQL completo
├── 📄 verificar_banco.sql                 # Script de verificação
│
└── 📚 Documentação:
    ├── CORRECOES_REALIZADAS.md    # Correções aplicadas (04/10)
    ├── PROXIMO_PASSOS.md           # Guia passo a passo
    ├── RESUMO_EXECUTIVO.md         # Resumo técnico
    ├── GUIA_EXECUCAO.md            # Guia de instalação
    └── API_DOCUMENTATION.md        # Documentação da API
```

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+ instalado
- MySQL 5.7+ instalado e rodando
- Git instalado

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/Segredos-do-Sabor.git
cd Segredos-do-Sabor
```

### 2. Configurar Banco de Dados
```sql
-- No MySQL Workbench ou terminal MySQL:
CREATE DATABASE segredodosabor;
USE segredodosabor;
SOURCE migracao_completa_autenticacao.sql;
```

### 3. Configurar Backend
```powershell
cd backend
npm install
cp .env.example .env
# Edite o arquivo .env com suas credenciais do MySQL
npm start
```

O backend estará rodando em: **http://localhost:5000**

### 4. Configurar Frontend
```powershell
cd frontend
npm install
npm start
```

O frontend estará rodando em: **http://localhost:3000**

---

## 🔧 Configuração do .env

Crie um arquivo `.env` na pasta `backend` com:

```env
# Servidor
PORT=5000

# Banco de Dados MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=segredodosabor

# JWT Authentication
JWT_SECRET=segredodosabor_secret_2025
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=segredodosabor_refresh_2025
JWT_REFRESH_EXPIRES_IN=30d

# WhatsApp Business API (Opcional)
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_PHONE=5511967696744
WHATSAPP_VERIFY_TOKEN=segredodosabor2025
```

---

## 📊 Estrutura do Banco de Dados

### Principais Tabelas:

**categoria** - 6 categorias de produtos
```sql
idcategoria, nome, descricao, ativo, data_cadastro
```

**ingrediente** - 21 ingredientes para receitas
```sql
idingrediente, nome, unidade_medida, preco_unitario, 
quantidade_estoque, estoque_minimo, fornecedor
```

**produto** - Catálogo de produtos
```sql
idproduto, nome, descricao, preco, quantidade, 
img_Produto, idcategoria, custo_producao, margem_lucro
```

**reserva** - Pedidos e reservas
```sql
idreserva, data_entrega, hora_entrega, ponto_entrega,
valor_total, status, pagamento, produtos (JSON), qtdReserva (JSON)
```

**cliente** - Usuários do sistema
```sql
idcliente, nome, cpf, email, senha, telefone, tipo (admin/cliente),
email_verificado, token_recuperacao
```

---

## 🔐 Sistema de Autenticação

### Fazer Login
```javascript
POST http://localhost:5000/auth/login
{
  "email": "maria@email.com",
  "senha": "123456"
}
```

### Usuário Admin Padrão
```
Email: maria@email.com
Senha: 123456
Tipo: admin
```

---

## 📡 Endpoints Principais da API

### Autenticação
- `POST /auth/registro` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Fazer logout
- `POST /auth/recuperar-senha` - Solicitar recuperação de senha
- `POST /auth/redefinir-senha` - Redefinir senha com token

### Categorias
- `GET /categorias` - Listar todas categorias
- `GET /categorias/ativas` - Listar categorias ativas
- `POST /categorias` - Criar categoria
- `PUT /categorias/:id` - Atualizar categoria
- `DELETE /categorias/:id` - Excluir categoria

### Produtos
- `GET /produto/listar` - Listar produtos disponíveis
- `GET /produto/:id` - Buscar produto por ID
- `POST /produto/inserir` - Cadastrar produto
- `PUT /produto/:id` - Atualizar produto
- `DELETE /produto/:id` - Remover produto

### Ingredientes
- `GET /ingrediente/listar` - Listar ingredientes
- `GET /ingrediente/estoque/baixo` - Ingredientes com estoque baixo
- `POST /ingrediente/inserir` - Cadastrar ingrediente
- `PUT /ingrediente/:id` - Atualizar ingrediente
- `POST /ingrediente/movimentacao` - Registrar movimentação de estoque

### Reservas/Pedidos
- `GET /reserva/listar` - Listar todas reservas
- `GET /reserva/pendente` - Listar reservas pendentes
- `POST /reserva/inserir` - Criar nova reserva
- `PUT /reserva/:id/confirmar` - Confirmar reserva
- `PUT /reserva/:id/cancelar` - Cancelar reserva

### Relatórios
- `GET /relatorio/receita-total` - Receita total
- `GET /relatorio/custo-total` - Custo total
- `GET /relatorio/lucro-liquido` - Lucro líquido
- `GET /relatorio/total-pedidos` - Total de pedidos
- `GET /relatorio/vendas-diarias` - Vendas dos últimos 7 dias
- `GET /relatorio/produtos-mais-vendidos` - Top 3 produtos
- `GET /relatorio/tipos-pagamento` - Análise de pagamentos

---

## 🧪 Testar o Sistema

### Método 1: Script Automático
```powershell
cd backend
node testar-endpoints.js
```

### Método 2: Verificar Banco
```sql
-- No MySQL Workbench:
USE segredodosabor;
SOURCE verificar_banco.sql;
```

### Método 3: Manual (Postman/Insomnia)
```
GET http://localhost:5000/categorias/ativas
GET http://localhost:5000/produto/listar
GET http://localhost:5000/ingrediente/listar
```

---

## 🐛 Solução de Problemas

### Backend não inicia
```powershell
# Verifique se a porta 5000 está livre
netstat -ano | findstr :5000

# Mate processos Node antigos
taskkill /F /IM node.exe

# Reinicie
cd backend
npm start
```

### Erro de conexão com MySQL
1. Verifique se o MySQL está rodando
2. Confirme usuário e senha no `.env`
3. Teste conexão: `mysql -u root -p`

### Erro 500 nos endpoints
1. Verifique o console do backend
2. Execute `verificar_banco.sql` para verificar estrutura
3. Confirme que `migracao_completa_autenticacao.sql` foi executado

### Imagens não aparecem
```sql
-- No MySQL:
UPDATE produto 
SET img_Produto = 'default-product.jpg' 
WHERE img_Produto IS NULL OR img_Produto = '';
```

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| **CORRECOES_REALIZADAS.md** | Lista completa de correções aplicadas (04/10/2025) |
| **PROXIMO_PASSOS.md** | Guia passo a passo para configuração |
| **RESUMO_EXECUTIVO.md** | Resumo técnico das correções |
| **GUIA_EXECUCAO.md** | Instalação e configuração detalhada |
| **API_DOCUMENTATION.md** | Documentação completa da API REST |
| **CHANGELOG.md** | Histórico de alterações do projeto |

---

## 🛠️ Scripts Úteis

### PowerShell (Windows)
```powershell
# Iniciar backend automaticamente
.\iniciar-backend.ps1

# Testar endpoints
cd backend
node testar-endpoints.js

# Ver logs em tempo real
cd backend
npm start
```

### SQL
```sql
-- Verificar sistema
USE segredodosabor;
SOURCE verificar_banco.sql;

-- Popular dados iniciais
SOURCE migracao_completa_autenticacao.sql;
```

---

## 📦 Dados Populados

Após executar `migracao_completa_autenticacao.sql`:

### 6 Categorias:
- Cones Clássicos
- Cones Especiais  
- Cones Premium
- Cones Kids
- Cones Diet
- Cones Veganos

### 21 Ingredientes:
- Leite Condensado, Creme de Leite, Chocolate ao Leite
- Chocolate Branco, Chocolate Meio Amargo, Oreo
- Kit Kat, Kinder Bueno, Ninho, Nutella, Ovomaltine
- Pistache, Nozes, Amêndoas, Morango, Framboesa
- Maracujá, Limão, Coco, Manga, Açaí

### 1 Usuário Admin:
- Nome: Maria Silva
- Email: maria@email.com
- Senha: 123456 (alterar em produção!)
- Tipo: admin

---

## 🎯 Próximas Funcionalidades (Roadmap)

- [ ] Sistema de delivery integrado
- [ ] Integração WhatsApp Business completa
- [ ] Sistema de fidelidade para clientes
- [ ] App mobile (React Native)
- [ ] Impressão de comandas
- [ ] Dashboard avançado com BI
- [ ] Sistema de promoções e cupons

---

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

## 📞 Suporte

**Documentação:** Consulte os arquivos `.md` na raiz do projeto
**Issues:** Abra uma issue no repositório
**E-mail:** contato@segredodosabor.com.br

---

## ✅ Status do Sistema

| Componente | Status | Observações |
|------------|--------|-------------|
| Backend | ✅ 100% | Rodando na porta 5000 |
| Frontend | ✅ 100% | Rodando na porta 3000 |
| Banco de Dados | ✅ 100% | MySQL configurado |
| Autenticação | ✅ 100% | JWT implementado |
| API REST | ✅ 100% | Todos endpoints funcionais |
| Upload de Imagens | ✅ 100% | Multer configurado |
| Relatórios | ✅ 100% | Queries otimizadas |
| Testes | ⚠️ 60% | Testes unitários parciais |
| Documentação | ✅ 100% | Completa e atualizada |

---

**Desenvolvido com ❤️ por Segredos do Sabor Team**

**Última atualização:** 04 de outubro de 2025
