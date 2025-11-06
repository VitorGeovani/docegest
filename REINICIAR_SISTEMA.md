# 🚀 REINICIAR SISTEMA - Após Correção de Relatórios

**Data:** 04 de Outubro de 2025  
**Objetivo:** Aplicar correções do sistema de relatórios

---

## ⚡ REINÍCIO RÁPIDO (3 passos)

### **Passo 1: Pare os Servidores**

Se o backend e frontend estiverem rodando, pare-os:
- Pressione **Ctrl + C** em cada terminal

---

### **Passo 2: Inicie o Backend**

**Abra um terminal (CMD ou PowerShell):**

```powershell
cd d:\Downloads\Segredos-do-Sabor\backend
npm start
```

**Aguarde a mensagem:**
```
✅ Servidor rodando na porta 5000
✅ Banco de dados conectado!
```

---

### **Passo 3: Inicie o Frontend**

**Abra OUTRO terminal:**

```powershell
cd d:\Downloads\Segredos-do-Sabor\frontend
npm start
```

**Aguarde abrir automaticamente:**
```
http://localhost:3000
```

---

## ✅ VERIFICAÇÃO

### **1. Backend (Porta 5000)**

Abra no navegador:
```
http://localhost:5000/relatorio/receita-total
```

**Resultado esperado:**
```json
{"receitaTotal": 0}
```

Se aparecer isso, backend está OK! ✅

---

### **2. Frontend (Porta 3000)**

Acesse:
```
http://localhost:3000
```

**Resultado esperado:**
- Página de login carrega normalmente ✅

---

### **3. Teste de Relatório**

1. Faça login
2. Vá em: **Gerenciamentos** → **Relatórios**
3. Configure:
   - Tipo: Relatório de Vendas
   - Data Início: 2025-01-01
   - Data Fim: 2025-12-31
4. Clique: **"Gerar PDF"**

**Resultado esperado:**
- PDF baixa automaticamente ✅
- Arquivo: `relatorio_vendas_2025-01-01_2025-12-31.pdf` ✅
- PDF abre sem erros ✅

---

## 🔧 SCRIPT AUTOMÁTICO (Windows)

### **Opção 1: Iniciar Backend**

Crie um arquivo `iniciar-backend.bat`:

```batch
@echo off
echo ========================================
echo   Iniciando Backend - Segredo do Sabor
echo ========================================
cd /d d:\Downloads\Segredos-do-Sabor\backend
echo.
echo Iniciando servidor na porta 5000...
npm start
```

**Para executar:**
- Duplo clique em `iniciar-backend.bat`

---

### **Opção 2: Iniciar Frontend**

Crie um arquivo `iniciar-frontend.bat`:

```batch
@echo off
echo ========================================
echo   Iniciando Frontend - Segredo do Sabor
echo ========================================
cd /d d:\Downloads\Segredos-do-Sabor\frontend
echo.
echo Iniciando aplicação na porta 3000...
npm start
```

**Para executar:**
- Duplo clique em `iniciar-frontend.bat`

---

### **Opção 3: Iniciar Tudo (2 janelas)**

Crie um arquivo `iniciar-tudo.bat`:

```batch
@echo off
echo ========================================
echo   Iniciando Sistema Completo
echo ========================================

echo Iniciando Backend...
start cmd /k "cd /d d:\Downloads\Segredos-do-Sabor\backend && npm start"

timeout /t 3 /nobreak >nul

echo Iniciando Frontend...
start cmd /k "cd /d d:\Downloads\Segredos-do-Sabor\frontend && npm start"

echo.
echo ========================================
echo   Sistema Iniciado!
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
```

**Para executar:**
- Duplo clique em `iniciar-tudo.bat`
- Abrirá 2 janelas automaticamente ✅

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### **Erro: "Porta 5000 já está em uso"**

**Solução 1 - Matar processo:**
```powershell
# No PowerShell
Stop-Process -Name node -Force
```

**Solução 2 - Identificar e matar:**
```powershell
netstat -ano | findstr :5000
# Anote o PID (último número)
taskkill /PID <número> /F
```

---

### **Erro: "Porta 3000 já está em uso"**

**Solução:**
```powershell
# No PowerShell
Stop-Process -Name node -Force
```

Ou quando o React perguntar:
```
Would you like to run the app on another port instead? (Y/n)
```
Digite: **Y**

---

### **Erro: "ENOENT: package.json not found"**

**Causa:** Você está no diretório errado

**Solução:**
```powershell
# Certifique-se de estar na pasta correta
cd d:\Downloads\Segredos-do-Sabor\backend
# Depois
npm start
```

---

### **Erro: "MySQL connection refused"**

**Causa:** MySQL não está rodando

**Solução Windows:**
```powershell
# Abra Serviços (services.msc)
# Procure: MySQL80
# Clique com direito: Iniciar
```

Ou no MySQL Workbench:
1. Conecte ao servidor
2. Se não conectar, inicie o serviço MySQL

---

### **Erro: "npm not found"**

**Causa:** Node.js não está instalado ou não está no PATH

**Solução:**
1. Baixe Node.js: https://nodejs.org/
2. Instale (versão LTS recomendada)
3. Reinicie o terminal
4. Teste: `node --version`

---

## 📊 MONITORAMENTO

### **Logs do Backend**

O terminal do backend mostrará:

```
✅ Conexões às rotas
✅ Queries SQL executadas
✅ Erros (se houver)
```

**Exemplo:**
```
GET /relatorio/exportar-pdf 200 1524ms
```

---

### **Logs do Frontend**

O terminal do frontend mostrará:

```
✅ Compilação do React
✅ Mudanças em arquivos
⚠️ Warnings (se houver)
```

---

### **Console do Navegador (F12)**

Pressione F12 no navegador e vá em:

**Aba Console:**
- Erros JavaScript aparecem aqui

**Aba Network:**
- Requisições HTTP aparecem aqui
- Filtro: XHR para ver apenas APIs

---

## 🔄 REINÍCIO COMPLETO (Se necessário)

Se nada funcionar, faça um reinício completo:

### **1. Pare tudo**
```powershell
Stop-Process -Name node -Force
```

### **2. Limpe cache npm**
```powershell
cd d:\Downloads\Segredos-do-Sabor\backend
npm cache clean --force

cd ..\frontend
npm cache clean --force
```

### **3. Reinstale dependências**
```powershell
# Backend
cd d:\Downloads\Segredos-do-Sabor\backend
rmdir /s /q node_modules
npm install

# Frontend
cd ..\frontend
rmdir /s /q node_modules
npm install
```

### **4. Inicie novamente**
```powershell
# Backend
cd ..\backend
npm start

# Frontend (outro terminal)
cd ..\frontend
npm start
```

---

## 📋 CHECKLIST PRÉ-EXECUÇÃO

Antes de iniciar, verifique:

- [ ] MySQL está rodando
- [ ] Banco `segredodosabor` existe
- [ ] Produtos estão ativos (script executado)
- [ ] Node.js instalado (v16+)
- [ ] Portas 3000 e 5000 livres
- [ ] Arquivo `.env` existe no backend
- [ ] Dependencies instaladas (`node_modules`)

---

## 🎯 CONFIGURAÇÃO DO .ENV

Certifique-se que o arquivo `.env` no backend contém:

```env
# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=segredodosabor
DB_PORT=3306

# Servidor
PORT=5000

# JWT
JWT_SECRET=seu_secret_aqui_muito_seguro_123456
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# WhatsApp (opcional)
WHATSAPP_API_KEY=sua_chave_aqui
```

---

## ✅ SISTEMA PRONTO!

Após seguir os passos:

```
✅ Backend rodando: http://localhost:5000
✅ Frontend rodando: http://localhost:3000
✅ MySQL conectado
✅ Relatórios funcionando
✅ Sistema 100% operacional
```

---

## 📞 PRECISA DE AJUDA?

**Consulte os guias:**
- `TESTE_RELATORIOS_GUIA.md` - Como testar relatórios
- `CORRECAO_RELATORIOS_PDF.md` - Documentação técnica
- `RESUMO_CORRECAO_RELATORIOS.md` - Resumo executivo

---

**Boa sorte! 🚀**

Sistema pronto para gerar relatórios profissionais em PDF e Excel!
