# 🚀 Guia de Execução - Segredo do Sabor

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- ✅ Node.js (versão 14 ou superior)
- ✅ MySQL 8.0 ou superior
- ✅ npm ou yarn
- ✅ Git (opcional)

---

## 📥 Instalação

### 1. Clone o Repositório (se aplicável)

```bash
git clone <url-do-repositorio>
cd Segredos-do-Sabor
```

### 2. Configure o Banco de Dados

#### Passo 1: Inicie o MySQL
```bash
# Windows
mysql -u root -p

# Linux/Mac
sudo mysql -u root -p
```

#### Passo 2: Importe o Banco de Dados
```sql
-- Dentro do MySQL CLI
source segredodosabor.sql
-- OU
\. segredodosabor.sql
```

#### Alternativa: Importe via linha de comando
```bash
mysql -u root -p < segredodosabor.sql
```

### 3. Configure o Backend

```bash
# Navegue para o diretório do backend
cd backend

# Instale as dependências
npm install

# Copie o arquivo de exemplo de variáveis de ambiente
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac

# Edite o arquivo .env com suas credenciais do MySQL
# Você pode usar qualquer editor de texto
notepad .env              # Windows
nano .env                 # Linux/Mac
```

#### Exemplo de configuração do `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_DATABASE=segredodosabor
DB_USER=root
DB_PASSWORD=sua_senha_aqui
```

### 4. Configure o Frontend

```bash
# Volte para o diretório raiz
cd ..

# Navegue para o diretório do frontend
cd frontend

# Instale as dependências
npm install
```

---

## ▶️ Execução

### Backend

```bash
# No diretório backend
npm start
```

**Resultado esperado:**
```
API subiu na porta 5000!
Conexão com banco realizada!
```

A API estará disponível em: `http://localhost:5000`

### Frontend

```bash
# No diretório frontend (em outro terminal)
npm start
```

**Resultado esperado:**
```
Compiled successfully!

You can now view front in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

O frontend estará disponível em: `http://localhost:3000`

---

## 🧪 Testes

### Executar Testes do Backend

```bash
# No diretório backend
npm test
```

### Executar Testes com Cobertura

```bash
# No diretório backend
npm run test:coverage
```

### Executar Testes em Modo Watch (desenvolvimento)

```bash
# No diretório backend
npm run test:watch
```

---

## 🔍 Verificando a Instalação

### 1. Teste a API

Abra o navegador e acesse:
```
http://localhost:5000/
```

Você deve ver a mensagem de boas-vindas da API.

### 2. Teste Endpoints Específicos

#### Listar Produtos
```
GET http://localhost:5000/produto/listar
```

#### Listar Clientes
```
GET http://localhost:5000/cliente/listar
```

### 3. Teste o Frontend

Abra o navegador e acesse:
```
http://localhost:3000
```

Você deve ver a página inicial do Segredo do Sabor.

---

## 📁 Estrutura de Diretórios

```
Segredos-do-Sabor/
├── backend/              # API Node.js
│   ├── src/
│   │   ├── controller/  # Controllers
│   │   ├── services/    # Lógica de negócio
│   │   ├── repository/  # Acesso a dados
│   │   ├── middleware/  # Middlewares
│   │   ├── utils/       # Utilitários
│   │   └── tests/       # Testes
│   ├── storage/         # Imagens dos produtos
│   ├── .env             # Variáveis de ambiente
│   └── package.json
├── frontend/            # React App
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   └── pages/       # Páginas
│   └── package.json
└── segredodosabor.sql  # Script do banco de dados
```

---

## 🛠️ Solução de Problemas

### Problema: Erro de conexão com o banco de dados

**Sintoma:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solução:**
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Verifique se o banco de dados `segredodosabor` existe

```bash
# Verificar serviço MySQL (Windows)
sc query MySQL80

# Verificar serviço MySQL (Linux)
sudo systemctl status mysql
```

### Problema: Porta já em uso

**Sintoma:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solução:**
1. Mude a porta no arquivo `.env`
2. Ou encerre o processo que está usando a porta

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Problema: Módulo não encontrado

**Sintoma:**
```
Error: Cannot find module 'express'
```

**Solução:**
```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

### Problema: Testes falhando

**Sintoma:**
```
jest is not defined
```

**Solução:**
1. Certifique-se de estar usando Node.js 14+
2. Reinstale as dependências de desenvolvimento

```bash
npm install --save-dev jest @babel/core @babel/preset-env
```

---

## 📊 Testando a API com Ferramentas

### Usando Postman

1. Baixe o Postman: https://www.postman.com/downloads/
2. Importe a coleção (se disponível)
3. Configure a URL base: `http://localhost:5000`

### Usando cURL

#### Listar Produtos
```bash
curl http://localhost:5000/produto/listar
```

#### Criar Cliente
```bash
curl -X POST http://localhost:5000/cliente/inserir \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"João Silva\",\"email\":\"joao@email.com\",\"telefone\":\"11999999999\"}"
```

### Usando Thunder Client (VS Code)

1. Instale a extensão Thunder Client no VS Code
2. Crie uma nova requisição
3. Configure a URL e método HTTP
4. Envie a requisição

---

## 🔄 Desenvolvimento

### Modo de Desenvolvimento

O backend usa `nodemon` para auto-reload durante o desenvolvimento:

```bash
# Backend
cd backend
npm start
# O servidor reiniciará automaticamente ao salvar arquivos
```

O frontend do React também recarrega automaticamente:

```bash
# Frontend
cd frontend
npm start
# A página recarregará automaticamente ao salvar arquivos
```

### Estrutura de Desenvolvimento

```
backend/
├── src/
│   ├── controller/      # Adicione novos controllers aqui
│   ├── services/        # Adicione nova lógica de negócio aqui
│   ├── repository/      # Adicione novos repositórios aqui
│   └── tests/          # Adicione novos testes aqui

frontend/
├── src/
│   ├── components/     # Adicione novos componentes aqui
│   └── pages/         # Adicione novas páginas aqui
```

---

## 📖 Documentação Adicional

- **README.md** - Visão geral do projeto
- **API_DOCUMENTATION.md** - Documentação completa da API
- **CHANGELOG.md** - Histórico de alterações

---

## 🆘 Suporte

Se você encontrar problemas não listados aqui:

1. Verifique os logs de erro
2. Consulte a documentação da API
3. Verifique as issues no repositório (se aplicável)
4. Entre em contato com a equipe de desenvolvimento

---

## ✅ Checklist de Instalação

- [ ] Node.js instalado
- [ ] MySQL instalado e rodando
- [ ] Banco de dados importado
- [ ] Dependências do backend instaladas
- [ ] Dependências do frontend instaladas
- [ ] Arquivo `.env` configurado
- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 3000
- [ ] API respondendo corretamente
- [ ] Frontend carregando corretamente
- [ ] Testes passando

---

## 🎉 Pronto!

Se todos os passos foram concluídos com sucesso, o sistema está pronto para uso!

**URLs importantes:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Imagens: http://localhost:5000/storage/{nome-arquivo}

Bom desenvolvimento! 🚀
