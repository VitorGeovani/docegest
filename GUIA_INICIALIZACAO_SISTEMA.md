# 🚀 GUIA DE INICIALIZAÇÃO - SISTEMA 100% COMPLETO

## Sistema Segredo do Sabor v5.0

**Status**: ✅ 65/65 Requisitos Funcionais Implementados (100%)

---

## 📋 PRÉ-REQUISITOS

Antes de iniciar, certifique-se de ter instalado:

- ✅ **Node.js** v14 ou superior ([Download](https://nodejs.org/))
- ✅ **MySQL** 8.0 ou superior ([Download](https://dev.mysql.com/downloads/))
- ✅ **Git** (opcional) ([Download](https://git-scm.com/))

---

## 🛠️ CONFIGURAÇÃO INICIAL

### 1️⃣ Configurar Banco de Dados

```bash
# 1. Abrir MySQL
mysql -u root -p

# 2. Criar banco de dados
CREATE DATABASE segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Usar o banco
USE segredodosabor;

# 4. Sair
EXIT;

# 5. Importar estrutura completa
mysql -u root -p segredodosabor < BANCO_DADOS_COMPLETO.sql

# 6. Criar tabela de mensagens WhatsApp (novo)
mysql -u root -p segredodosabor < criar-tabela-mensagens-whatsapp-completa.sql
```

### 2️⃣ Configurar Backend

```bash
# 1. Entrar na pasta do backend
cd backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Copiar arquivo de exemplo
copy .env.example .env

# 4. Editar .env com seus dados
notepad .env
```

**Configuração do .env:**

```env
# Servidor
PORT=5000

# Banco de Dados
DB_HOST=localhost
DB_DATABASE=segredodosabor
DB_USER=root
DB_PASSWORD=sua_senha_mysql

# JWT (Autenticação)
JWT_SECRET=seu_segredo_super_secreto_aqui_mude_isso
JWT_REFRESH_SECRET=outro_segredo_para_refresh_token

# WhatsApp (Evolution API - Opcional)
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_API_KEY=sua_chave_api_aqui
WHATSAPP_BUSINESS_PHONE=5511999999999
```

### 3️⃣ Configurar Frontend

```bash
# 1. Abrir NOVO terminal (manter backend rodando)
# 2. Entrar na pasta do frontend
cd frontend

# 3. Instalar dependências
npm install
```

---

## ▶️ INICIAR O SISTEMA

### Opção 1: Iniciar Manualmente (Recomendado para desenvolvimento)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Aguarde a mensagem:
```
✅ Servidor rodando na porta 5000
✅ Banco de dados conectado
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Aguarde abrir o navegador em `http://localhost:3000`

---

### Opção 2: Usar Scripts Automáticos (Windows)

**Opção A - Iniciar Apenas Backend:**
```bash
start-backend.bat
```

**Opção B - Iniciar Apenas Frontend:**
```bash
start.bat
```

**Opção C - Iniciar TUDO de uma vez:**
```bash
iniciar-tudo.bat
```

---

## 🧪 VALIDAR INSTALAÇÃO

### 1. Verificar Backend

Abra o navegador em: `http://localhost:5000`

Você deve ver:
```json
{
  "mensagem": "Bem-vindo à API Segredo do Sabor v5.0",
  "status": "online",
  "versao": "5.0.0",
  "requisitos_implementados": "65/65 (100%)"
}
```

### 2. Testar Endpoints

```bash
# Listar produtos
curl http://localhost:5000/produto/listar

# Listar categorias
curl http://localhost:5000/categoria

# Ver estatísticas WhatsApp (NOVO!)
curl http://localhost:5000/whatsapp/estatisticas

# Testar simulação (NOVO!)
curl -X POST http://localhost:5000/simulacao/custo \
  -H "Content-Type: application/json" \
  -d '{"idproduto": 1, "receita_simulada": [{"idingrediente": 1, "quantidade": 200}]}'
```

### 3. Verificar Frontend

Abra `http://localhost:3000`

**Deve aparecer:**
- ✅ Página inicial carregada
- ✅ Logo "Segredo do Sabor"
- ✅ Menu de navegação
- ✅ Botão de acessibilidade (canto inferior direito)
- ✅ VLibras widget (canto inferior direito)

**Teste de navegação:**
1. Clicar em "Ver Catálogo Completo"
2. Página `/catalogo` deve carregar com produtos
3. Adicionar produto ao carrinho
4. Favoritar um produto (coração vermelho)
5. Recarregar página (F5) → favoritos devem permanecer ✅

---

## 👨‍💼 ACESSAR PAINEL ADMINISTRATIVO

### 1. Criar Usuário Admin (se não existir)

```bash
cd backend
node criar-admin.js
```

**Ou inserir manualmente no MySQL:**

```sql
USE segredodosabor;

-- Senha: admin123 (hash bcrypt)
INSERT INTO cliente (nome, telefone, email, senha, tipo, ativo) VALUES
('Administrador', '11999999999', 'admin@segredodosabor.com', 
'$2b$10$YourBcryptHashHere', 'admin', 1);
```

### 2. Fazer Login

1. Ir para `http://localhost:3000/login`
2. Email: `admin@segredodosabor.com`
3. Senha: `admin123`
4. Clicar em "Entrar"
5. Será redirecionado para `/gerenciamentos`

### 3. Explorar Painel

**8 Módulos Disponíveis:**

1. 📊 **Dashboard** - Métricas e KPIs
2. 💵 **Finanças** - Receitas e despesas
3. 🏷️ **Categorias** - Gestão de categorias (6 cadastradas)
4. 📦 **Produtos** - CRUD completo de produtos
5. 🥚 **Ingredientes** - Gestão de ingredientes (21 cadastrados)
6. 💰 **Custos & Receitas** - Cálculo de custos (BOM)
7. 📋 **Reservas/Pedidos** - Gestão de pedidos
8. 📊 **Relatórios** - Relatórios e exportação

---

## 🆕 TESTAR NOVOS RECURSOS (v5.0)

### 1. Simulador de Custos ⭐ NOVO

**No Postman ou cURL:**

```bash
# Simular nova receita
curl -X POST http://localhost:5000/simulacao/custo \
  -H "Content-Type: application/json" \
  -d '{
    "idproduto": 1,
    "receita_simulada": [
      {"idingrediente": 1, "quantidade": 250},
      {"idingrediente": 2, "quantidade": 60}
    ]
  }'

# Resposta esperada:
{
  "produto": {"id": 1, "nome": "Brigadeiro", "preco_venda": 25.00},
  "custo_atual": 8.50,
  "custo_simulado": 10.00,
  "diferenca_custo": 1.50,
  "margem_atual": 194.12,
  "margem_simulada": 150.00,
  "diferenca_margem": -44.12,
  "recomendacao": {
    "tipo": "EXCELENTE",
    "mensagem": "Margem excelente! Produto muito rentável.",
    "cor": "blue"
  }
}
```

### 2. Bot WhatsApp ⭐ NOVO

**A. Reenviar Confirmação:**

```bash
curl -X POST http://localhost:5000/whatsapp/reenviar-confirmacao/1

# Resposta:
{
  "sucesso": true,
  "mensagem": "Confirmação reenviada com sucesso",
  "pedido": {
    "codigo": "PED20251101001",
    "telefone": "5511999999999"
  }
}
```

**B. Consultar Histórico:**

```bash
# Por cliente
curl http://localhost:5000/whatsapp/historico/cliente/5511999999999

# Por pedido
curl http://localhost:5000/whatsapp/historico/pedido/1
```

**C. Consultar Status:**

```bash
curl -X POST http://localhost:5000/whatsapp/consultar-status \
  -H "Content-Type: application/json" \
  -d '{"telefone": "5511999999999"}'

# Resposta:
{
  "sucesso": true,
  "tipo": "status",
  "mensagem": "✅ Status do Pedido #PED20251101001\n\nStatus: Em Produção\n..."
}
```

**D. Ver Estatísticas:**

```bash
curl http://localhost:5000/whatsapp/estatisticas

# Resposta:
{
  "periodo": "Últimos 30 dias",
  "estatisticas": {
    "total_mensagens": 150,
    "clientes_unicos": 45,
    "confirmacoes": 50,
    "mensagens_recebidas": 30
  }
}
```

---

## 🔧 CONFIGURAR EVOLUTION API (OPCIONAL)

Para ativar o bot WhatsApp que responde automaticamente:

### 1. Instalar Evolution API

```bash
# Opção 1: Docker (Recomendado)
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  atendai/evolution-api

# Opção 2: Manual
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api
npm install
npm start
```

### 2. Configurar Instância WhatsApp

1. Acesse `http://localhost:8080`
2. Crie uma instância
3. Escaneie QR Code com WhatsApp
4. Copie a API Key gerada

### 3. Configurar Webhook

**No painel da Evolution API:**

- URL: `http://localhost:5000/whatsapp/webhook`
- Events: Marcar `messages.upsert`
- Salvar

### 4. Atualizar .env

```env
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_API_KEY=sua_chave_copiada_aqui
WHATSAPP_BUSINESS_PHONE=5511999999999
```

### 5. Reiniciar Backend

```bash
# Parar: Ctrl+C
# Iniciar novamente:
npm start
```

### 6. Testar Bot

Envie mensagem para o número do WhatsApp Business:

- "status" → Bot responde com status do pedido
- "confirmação" → Bot reenvia confirmação
- "ajuda" → Bot mostra menu
- "cancelar" → Bot inicia cancelamento

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: Porta 5000 em uso

```bash
# Windows: Encontrar processo
netstat -ano | findstr :5000

# Matar processo
taskkill /PID <numero_pid> /F
```

### Erro: Banco de dados não conecta

1. Verificar se MySQL está rodando:
   - Abrir Serviços do Windows
   - Procurar "MySQL"
   - Iniciar se estiver parado

2. Testar conexão:
```bash
mysql -u root -p -h localhost
```

3. Verificar credenciais no `.env`

### Erro: Frontend não carrega

```bash
# Limpar cache e reinstalar
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
npm start
```

### Erro: VLibras não aparece

1. Verificar conexão com internet (VLibras é CDN)
2. Limpar cache do navegador (Ctrl+Shift+Delete)
3. Abrir DevTools (F12) e verificar console

---

## 📊 DADOS DE TESTE

O sistema vem com dados de exemplo:

### Categorias (6):
- Bolos
- Tortas
- Docinhos
- Brownies
- Cookies
- Sobremesas

### Produtos (15):
- Brigadeiro Gourmet - R$ 25,00
- Bolo de Chocolate - R$ 45,00
- Torta de Limão - R$ 35,00
- (+ 12 outros produtos)

### Ingredientes (21):
- Leite Condensado
- Cacau em Pó
- Manteiga
- Ovos
- Farinha de Trigo
- (+ 16 outros ingredientes)

### Pedidos (5):
- 2 Pendentes
- 1 Confirmado
- 1 Pronto
- 1 Entregue

---

## ✅ CHECKLIST DE VALIDAÇÃO

Antes de gravar o vídeo, verifique:

### Backend
- [ ] MySQL rodando e conectado
- [ ] Servidor em `http://localhost:5000` responde
- [ ] Endpoint `/produto/listar` retorna produtos
- [ ] Endpoint `/whatsapp/estatisticas` funciona
- [ ] Endpoint `/simulacao/custo` funciona

### Frontend
- [ ] Página inicial (`/`) carrega
- [ ] Catálogo (`/catalogo`) mostra produtos
- [ ] Login (`/login`) funciona
- [ ] Painel admin (`/gerenciamentos`) acessível
- [ ] Botão de acessibilidade visível
- [ ] VLibras widget aparece

### Funcionalidades
- [ ] Adicionar produto ao carrinho funciona
- [ ] Favoritar produto persiste após reload (F5)
- [ ] Checkout completo funciona
- [ ] Dashboard mostra métricas
- [ ] Cadastro de produto funciona
- [ ] Upload de imagem funciona

### Novos Recursos v5.0
- [ ] Simulador de custos responde
- [ ] Reenvio de confirmação funciona
- [ ] Histórico WhatsApp salva
- [ ] Consulta de status funciona
- [ ] Estatísticas WhatsApp aparecem

---

## 🎬 PRONTO PARA GRAVAR!

Se todos os itens acima estão funcionando:

✅ **Sistema 100% operacional**  
✅ **Banco de dados populado**  
✅ **Frontend responsivo**  
✅ **Backend estável**  
✅ **Novos recursos testados**

👉 **Próximo passo**: Seguir o roteiro em `ROTEIRO_VIDEO_DEMONSTRACAO.md`

---

## 📞 SUPORTE

Em caso de dúvidas ou problemas:

1. Consultar `SISTEMA_100_PORCENTO_COMPLETO.md`
2. Verificar logs do terminal
3. Abrir DevTools do navegador (F12)
4. Consultar documentação específica:
   - Backend: `backend/README.md`
   - Frontend: `frontend/README.md`
   - API: `backend/API_DOCUMENTATION.md`

---

**Sistema**: Segredo do Sabor v5.0  
**Status**: 100% Completo  
**Data**: 01/11/2025  

🎊 **BOA SORTE COM A DEMONSTRAÇÃO!** 🎊
