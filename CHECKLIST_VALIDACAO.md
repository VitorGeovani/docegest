# ✅ CHECKLIST DE VALIDAÇÃO DO SISTEMA

> Use este checklist para garantir que tudo está funcionando corretamente

---

## 🔧 CONFIGURAÇÃO INICIAL

### Backend
- [ ] Node.js instalado (versão 16+)
- [ ] MySQL instalado e rodando
- [ ] Pasta `backend` existe
- [ ] Arquivo `.env` configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Porta 5000 livre

### Frontend
- [ ] Node.js instalado (versão 16+)
- [ ] Pasta `frontend` existe
- [ ] Dependências instaladas (`npm install`)
- [ ] Porta 3000 livre

### Banco de Dados
- [ ] MySQL rodando
- [ ] Database `segredodosabor` criada
- [ ] Script `migracao_completa_autenticacao.sql` executado
- [ ] Tabelas criadas (categoria, produto, ingrediente, reserva, cliente)

---

## 🚀 INICIALIZAÇÃO

### Backend
- [ ] Terminal aberto na pasta `backend`
- [ ] Comando `npm start` executado
- [ ] Mensagem "API subiu na porta 5000!" apareceu
- [ ] Mensagem "Conexão com banco realizada!" apareceu
- [ ] Sem erros no console

### Frontend
- [ ] Terminal aberto na pasta `frontend`
- [ ] Comando `npm start` executado
- [ ] Navegador abriu automaticamente
- [ ] Página carregou em `http://localhost:3000`
- [ ] Sem erros no console do navegador (F12)

---

## 📊 BANCO DE DADOS

### Estrutura
- [ ] Tabela `categoria` existe
- [ ] Tabela `ingrediente` existe
- [ ] Tabela `produto` existe
- [ ] Tabela `reserva` existe
- [ ] Tabela `cliente` existe
- [ ] Tabela `refresh_token` existe

### Dados Populados
- [ ] 6 categorias cadastradas
- [ ] 21 ingredientes cadastrados
- [ ] Pelo menos 1 cliente admin (maria@email.com)
- [ ] Produtos têm `img_Produto` válido (não NULL/undefined)

### Verificação Rápida (MySQL)
```sql
USE segredodosabor;
SELECT COUNT(*) FROM categoria;      -- Deve retornar 6
SELECT COUNT(*) FROM ingrediente;    -- Deve retornar 21
SELECT COUNT(*) FROM cliente;        -- Deve retornar pelo menos 1
SELECT COUNT(*) FROM produto;        -- Deve retornar os produtos cadastrados
```

---

## 🌐 ENDPOINTS DA API

### Teste Manual (Browser/Postman)

#### Categorias
- [ ] `GET http://localhost:5000/categorias/ativas` → Retorna array com categorias
- [ ] `GET http://localhost:5000/categorias` → Retorna todas categorias
- [ ] Status 200 OK

#### Produtos
- [ ] `GET http://localhost:5000/produto/listar` → Retorna array com produtos
- [ ] Produtos têm `caminhoImagem` válido
- [ ] Status 200 OK

#### Ingredientes
- [ ] `GET http://localhost:5000/ingrediente/listar` → Retorna array com ingredientes
- [ ] Ingredientes têm `quantidade_estoque`
- [ ] Status 200 OK

#### Reservas
- [ ] `GET http://localhost:5000/reserva/listar` → Retorna array (pode estar vazio)
- [ ] `GET http://localhost:5000/reserva/pendente` → Retorna array
- [ ] Status 200 OK

#### Relatórios
- [ ] `GET http://localhost:5000/relatorio/receita-total` → Retorna número
- [ ] `GET http://localhost:5000/relatorio/vendas-diarias` → Retorna array
- [ ] `GET http://localhost:5000/relatorio/produtos-mais-vendidos` → Retorna top 3
- [ ] Status 200 OK

### Teste Automático
- [ ] Script `testar-endpoints.js` executado
- [ ] Todos endpoints retornaram ✅
- [ ] Nenhum erro ❌ apareceu

---

## 🎨 FRONTEND

### Páginas Principais
- [ ] **Home** (`/`) carrega sem erros
- [ ] **Catálogo** (`/catalogo`) mostra produtos
- [ ] **Login** (`/login`) formulário funciona
- [ ] **Gerenciamentos** (`/gerenciamentos`) dashboard funciona

### Gerenciamentos (Admin)
- [ ] **Dashboard** mostra estatísticas
- [ ] **Categorias** lista 6 categorias
- [ ] **Produtos** lista produtos com imagens
- [ ] **Ingredientes** lista 21 ingredientes
- [ ] **Pedidos** lista reservas

### Componentes Visuais
- [ ] Imagens dos produtos aparecem
- [ ] Carrossel funciona
- [ ] Gráficos renderizam (se houver dados)
- [ ] Cards exibem informações corretas
- [ ] Modais abrem e fecham

### Console do Navegador (F12)
- [ ] Sem erros `ERR_CONNECTION_REFUSED`
- [ ] Sem erros `500 (Internal Server Error)`
- [ ] Sem erros `404 (Not Found)` em imagens
- [ ] Avisos (warnings) podem ser ignorados

---

## 🔐 AUTENTICAÇÃO

### Login
- [ ] Página de login acessível
- [ ] Formulário com email e senha
- [ ] Botão "Entrar" funciona

### Teste com Admin Padrão
- [ ] Email: `maria@email.com`
- [ ] Senha: `123456`
- [ ] Login bem-sucedido
- [ ] Redirecionado para dashboard
- [ ] Token JWT salvo no localStorage

### Proteção de Rotas
- [ ] Rotas `/gerenciamentos/*` protegidas
- [ ] Redirecionamento para login se não autenticado
- [ ] Logout funciona e limpa token

---

## 📸 IMAGENS

### Backend
- [ ] Pasta `backend/storage` existe
- [ ] Pasta contém arquivos `.jpg` das imagens
- [ ] Rota `/storage` configurada no Express
- [ ] Imagens acessíveis via `http://localhost:5000/storage/{nome}.jpg`

### Frontend
- [ ] Imagens carregam sem erro 404
- [ ] Placeholder exibido se imagem não existir
- [ ] Upload de novas imagens funciona

---

## 📊 RELATÓRIOS E DASHBOARD

### Cards de Estatísticas
- [ ] Card "Receita Total" mostra valor
- [ ] Card "Total de Pedidos" mostra número
- [ ] Card "Produtos Vendidos" mostra quantidade
- [ ] Card "Lucro Líquido" mostra cálculo

### Gráficos
- [ ] Gráfico de vendas diárias renderiza
- [ ] Gráfico de produtos mais vendidos funciona
- [ ] Gráfico de formas de pagamento exibe dados

### Tabelas
- [ ] Tabela de pedidos lista reservas
- [ ] Tabela de produtos mostra estoque
- [ ] Tabela de ingredientes mostra quantidades
- [ ] Filtros e buscas funcionam

---

## 🐛 ERROS COMUNS E SOLUÇÕES

### ❌ "ERR_CONNECTION_REFUSED"
**Causa:** Backend não está rodando
**Solução:**
```powershell
cd backend
npm start
```
- [ ] Problema resolvido

### ❌ "500 (Internal Server Error)"
**Causa:** Erro no banco de dados ou query SQL
**Solução:**
1. Verificar console do backend
2. Executar `verificar_banco.sql`
3. Confirmar estrutura das tabelas
- [ ] Problema resolvido

### ❌ "Unknown column 'X' in 'field list'"
**Causa:** Script de migração não foi executado
**Solução:**
```sql
USE segredodosabor;
SOURCE migracao_completa_autenticacao.sql;
```
- [ ] Problema resolvido

### ❌ Imagens não aparecem (404)
**Causa:** Produtos com `img_Produto = NULL/undefined`
**Solução:**
```sql
UPDATE produto 
SET img_Produto = 'default-product.jpg' 
WHERE img_Produto IS NULL OR img_Produto = '';
```
- [ ] Problema resolvido

### ❌ Login não funciona
**Causa:** Usuário não existe ou senha incorreta
**Solução:**
```sql
SELECT * FROM cliente WHERE email = 'maria@email.com';
-- Se não existir, execute migracao_completa_autenticacao.sql
```
- [ ] Problema resolvido

---

## 🎯 TESTES FINAIS

### Fluxo Completo - Cliente
- [ ] Acessar home
- [ ] Ver catálogo de produtos
- [ ] Adicionar produto ao carrinho
- [ ] Fazer cadastro/login
- [ ] Finalizar pedido
- [ ] Receber confirmação

### Fluxo Completo - Admin
- [ ] Fazer login como admin
- [ ] Acessar dashboard
- [ ] Cadastrar novo produto
- [ ] Upload de imagem
- [ ] Visualizar relatórios
- [ ] Gerenciar pedidos pendentes
- [ ] Confirmar/cancelar reserva

---

## 📝 VALIDAÇÃO FINAL

### Critérios de Sucesso
- [ ] Backend rodando sem erros (porta 5000)
- [ ] Frontend rodando sem erros (porta 3000)
- [ ] Banco de dados populado com dados iniciais
- [ ] Todos os endpoints retornam 200 OK
- [ ] Login funciona e protege rotas
- [ ] Imagens carregam corretamente
- [ ] Dashboard mostra estatísticas reais
- [ ] Sistema pronto para uso

### Se TODOS os itens acima estão marcados:
## ✅ SISTEMA 100% FUNCIONAL! 🎉

---

## 📊 SCORE DO SISTEMA

**Conte quantos itens você marcou:**

- **80-100%** ✅ Sistema Perfeito! Pronto para produção
- **60-79%** ⚠️ Sistema Funcional - Alguns ajustes necessários
- **40-59%** ⚠️ Sistema Parcial - Revisar configurações
- **0-39%** ❌ Sistema com Problemas - Consultar documentação

---

## 📞 PRÓXIMOS PASSOS

Se tudo está funcionando:
1. ✅ Criar backup do banco de dados
2. ✅ Documentar credenciais em local seguro
3. ✅ Configurar ambiente de produção
4. ✅ Realizar testes de carga
5. ✅ Treinar usuários

Se algo não funciona:
1. ❌ Consultar `CORRECOES_REALIZADAS.md`
2. ❌ Executar `verificar_banco.sql`
3. ❌ Verificar logs do backend (terminal)
4. ❌ Verificar console do navegador (F12)
5. ❌ Abrir issue no repositório

---

**Data de validação:** ___/___/______

**Validado por:** _____________________

**Status Final:** [ ] Aprovado  [ ] Pendente  [ ] Reprovado

**Observações:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
