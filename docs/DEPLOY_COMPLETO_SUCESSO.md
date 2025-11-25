# 🎉 DEPLOY COMPLETO REALIZADO COM SUCESSO!
**Data:** 22 de novembro de 2025  
**Servidor:** Azure VM D2s v3 (2 vCPUs, 8GB RAM)  
**Sistema:** Ubuntu 22.04.5 LTS

---

## ✅ STATUS DO SISTEMA

### 🖥️ **Servidor**
- **IP Público:** `20.168.13.56`
- **DNS:** `segredodosabor.westus3.cloudapp.azure.com`
- **SSH:** `ssh -i D:\Downloads\segredo-sabor-key.pem azureuser@20.168.13.56`

### 🗄️ **Banco de Dados MySQL 8.0**
- **Status:** ✅ Online
- **Banco:** `segredo_do_sabor`
- **Usuário:** `segredo_user`
- **Senha:** `SegredoSabor2025!`
- **Tabelas:** 35 tabelas importadas
- **Views:** 7 views
- **Procedures:** 5 procedures
- **Triggers:** 5 triggers
- **Arquivo SQL:** `INSTALACAO_BANCO_COMPLETO_V5_FINAL.sql` (77 KB, 1949 linhas)

### 🚀 **Backend Node.js**
- **Status:** ✅ Online (PM2)
- **Processo:** `segredo-backend`
- **Porta:** `5000`
- **Versão Node:** `v20.19.5`
- **Pacotes:** 185 dependências instaladas
- **Localização:** `/var/www/segredodosabor/backend`
- **Auto-start:** Configurado com PM2 systemd
- **Comando PM2:** `pm2 list` / `pm2 logs segredo-backend`

### ⚛️ **Frontend React**
- **Status:** ✅ Deployado
- **Build:** React 19.1.0 (production)
- **Arquivos:** 40 arquivos estáticos
- **Localização:** `/var/www/segredodosabor/frontend`
- **Servidor:** Nginx 1.18.0

### 🌐 **Nginx (Reverse Proxy)**
- **Status:** ✅ Ativo
- **Versão:** 1.18.0 (Ubuntu)
- **Configuração:** `/etc/nginx/sites-available/segredodosabor`
- **Logs:**
  - Access: `/var/log/nginx/segredodosabor_access.log`
  - Error: `/var/log/nginx/segredodosabor_error.log`

### 🐳 **Docker**
- **Status:** ✅ Instalado
- **Versão:** 29.0.2
- **Docker Compose:** v2.40.3
- **Pronto para:** Evolution API (WhatsApp Bot)

---

## 🌐 ACESSOS DO SISTEMA

### 🏠 **Frontend (React)**
```
http://20.168.13.56
http://segredodosabor.westus3.cloudapp.azure.com
```

### 📡 **Backend API**
```
http://20.168.13.56/api
http://segredodosabor.westus3.cloudapp.azure.com/api
```

### 🔍 **Health Check**
```
http://20.168.13.56/health
```

### 📸 **Upload de Imagens**
```
http://20.168.13.56/uploads/
```

---

## 🔐 CREDENCIAIS

### **MySQL**
```
Host: localhost
Porta: 3306
Banco: segredo_do_sabor
Usuário: segredo_user
Senha: SegredoSabor2025!
Root Senha: SegredoSabor2025!
```

### **Administrador do Sistema** (cadastrar via script)
```
Email: admin@segredodosabor.com
Senha: Admin@123 (alterar após primeiro login)
```

### **SSH Azure**
```
Usuário: azureuser
Chave: D:\Downloads\segredo-sabor-key.pem
Comando: ssh -i D:\Downloads\segredo-sabor-key.pem azureuser@20.168.13.56
```

---

## 📦 SOFTWARES INSTALADOS

| Software | Versão | Status |
|----------|--------|--------|
| **Ubuntu** | 22.04.5 LTS | ✅ |
| **Node.js** | 20.19.5 | ✅ |
| **npm** | 10.8.2 | ✅ |
| **MySQL** | 8.0.44 | ✅ |
| **Nginx** | 1.18.0 | ✅ |
| **Docker** | 29.0.2 | ✅ |
| **Docker Compose** | 2.40.3 | ✅ |
| **PM2** | 6.0.13 | ✅ |

---

## 📁 ESTRUTURA DE PASTAS

```
/var/www/segredodosabor/
├── backend/                    (Backend Node.js + Express)
│   ├── src/
│   │   ├── controllers/       (Controladores da API)
│   │   ├── services/          (Lógica de negócio)
│   │   ├── repositories/      (Acesso ao banco)
│   │   ├── middlewares/       (Autenticação, validação)
│   │   └── server.js          (Servidor Express)
│   ├── node_modules/          (185 pacotes)
│   ├── uploads/               (Imagens de produtos)
│   ├── package.json
│   └── .env                   (Variáveis de ambiente)
│
└── frontend/                   (Frontend React build)
    ├── static/
    │   ├── css/
    │   ├── js/
    │   └── media/
    ├── imgs/                  (Imagens estáticas)
    └── index.html             (SPA entry point)
```

---

## 🛠️ COMANDOS ÚTEIS

### **PM2 (Backend)**
```bash
pm2 list                      # Listar processos
pm2 logs segredo-backend      # Ver logs em tempo real
pm2 restart segredo-backend   # Reiniciar backend
pm2 stop segredo-backend      # Parar backend
pm2 monit                     # Monitor interativo
```

### **Nginx**
```bash
sudo nginx -t                 # Testar configuração
sudo systemctl restart nginx  # Reiniciar Nginx
sudo systemctl status nginx   # Ver status
sudo tail -f /var/log/nginx/segredodosabor_error.log  # Ver logs de erro
```

### **MySQL**
```bash
mysql -usegredo_user -pSegredoSabor2025! segredo_do_sabor  # Conectar ao banco
sudo systemctl restart mysql  # Reiniciar MySQL
sudo systemctl status mysql   # Ver status
```

### **Docker** (para Evolution API)
```bash
docker ps                     # Listar containers
docker logs <container_id>    # Ver logs
docker-compose up -d          # Iniciar com compose
docker-compose down           # Parar containers
```

### **Sistema**
```bash
df -h                         # Espaço em disco
free -h                       # Memória disponível
top                           # Processos em execução
sudo reboot                   # Reiniciar servidor
```

---

## 🚧 PRÓXIMOS PASSOS (OPCIONAL)

### 1. **Criar Usuário Administrador**
```bash
cd /var/www/segredodosabor/backend
node criar-admin.js
```

### 2. **Popular Banco com Dados de Teste**
```bash
cd /var/www/segredodosabor/backend
node popular-banco-completo.js
```

### 3. **Instalar Evolution API (WhatsApp Bot)**
```bash
# 1. Criar docker-compose-evolution.yml
# 2. Executar: docker-compose up -d
# 3. Aguardar 30 segundos
# 4. Acessar: http://20.168.13.56:8080
```

### 4. **Configurar SSL (HTTPS)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d segredodosabor.westus3.cloudapp.azure.com
```

### 5. **Configurar Firewall**
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 📊 MONITORAMENTO

### **Status Geral**
```bash
# Verificar tudo de uma vez
ssh -i segredo-sabor-key.pem azureuser@20.168.13.56 "
  echo '=== PM2 ===' && pm2 list &&
  echo '' &&
  echo '=== NGINX ===' && sudo systemctl status nginx --no-pager | head -5 &&
  echo '' &&
  echo '=== MYSQL ===' && sudo systemctl status mysql --no-pager | head -5 &&
  echo '' &&
  echo '=== DISCO ===' && df -h / &&
  echo '' &&
  echo '=== MEMÓRIA ===' && free -h
"
```

### **Logs em Tempo Real**
```bash
# Backend
pm2 logs segredo-backend --lines 50

# Nginx Access
sudo tail -f /var/log/nginx/segredodosabor_access.log

# Nginx Error
sudo tail -f /var/log/nginx/segredodosabor_error.log

# MySQL Error
sudo tail -f /var/log/mysql/error.log
```

---

## ⚠️ TROUBLESHOOTING

### **Backend não responde**
```bash
pm2 restart segredo-backend
pm2 logs segredo-backend --lines 100
```

### **Erro 502 Bad Gateway**
```bash
# Verificar se backend está rodando
pm2 list

# Reiniciar backend
pm2 restart segredo-backend

# Verificar logs do Nginx
sudo tail -50 /var/log/nginx/segredodosabor_error.log
```

### **Erro de conexão com MySQL**
```bash
# Verificar status
sudo systemctl status mysql

# Reiniciar MySQL
sudo systemctl restart mysql

# Testar conexão
mysql -usegredo_user -pSegredoSabor2025! segredo_do_sabor -e "SELECT 1;"
```

### **Espaço em disco cheio**
```bash
# Verificar espaço
df -h

# Limpar logs antigos
sudo find /var/log -type f -name "*.log" -mtime +30 -delete

# Limpar cache do npm
npm cache clean --force

# Limpar imagens Docker não usadas
docker system prune -a
```

---

## 📝 NOTAS IMPORTANTES

1. ✅ **Backend rodando em produção** com PM2 (auto-restart habilitado)
2. ✅ **Frontend servido via Nginx** (cache configurado para 1 ano)
3. ✅ **Banco de dados completo V5.0** importado (35 tabelas)
4. ✅ **Reverse proxy configurado** (frontend na raiz, API em /api)
5. ✅ **Auto-start configurado** (PM2 e Nginx iniciam no boot)
6. ⚠️ **Evolution API não instalada ainda** (aguardando configuração)
7. ⚠️ **SSL não configurado ainda** (site em HTTP)
8. ⚠️ **Firewall não configurado** (todas as portas abertas)

---

## 🎯 RESULTADO FINAL

### **Sistema 100% Funcional! ✅**
- ✅ MySQL 8.0 rodando
- ✅ Backend Node.js online (porta 5000)
- ✅ Frontend React deployado
- ✅ Nginx configurado como reverse proxy
- ✅ PM2 gerenciando o backend
- ✅ Auto-start configurado
- ✅ 185 pacotes npm instalados
- ✅ 35 tabelas do banco importadas

### **Acessos Testados:**
```
✅ http://20.168.13.56 → Frontend React
✅ http://20.168.13.56/api → Backend API
✅ http://20.168.13.56/health → Health Check OK
```

---

## 📞 SUPORTE

**Caso precise reiniciar completamente:**
```bash
ssh -i D:\Downloads\segredo-sabor-key.pem azureuser@20.168.13.56
pm2 restart segredo-backend
sudo systemctl restart nginx
sudo systemctl restart mysql
```

**Para verificar se tudo está funcionando:**
```bash
curl http://20.168.13.56/health
# Deve retornar: OK
```

---

**🎉 DEPLOY FINALIZADO COM SUCESSO! 🎉**

**Servidor:** `20.168.13.56` | `segredodosabor.westus3.cloudapp.azure.com`  
**Status:** Online e Funcional  
**Data:** 22/11/2025
