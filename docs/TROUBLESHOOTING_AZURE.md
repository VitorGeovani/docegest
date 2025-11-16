# 🔧 TROUBLESHOOTING - DEPLOY AZURE

## Guia Completo de Solução de Problemas

---

## 📋 ÍNDICE

1. [Problemas de Conexão SSH](#1-problemas-de-conexão-ssh)
2. [Erros de Instalação](#2-erros-de-instalação)
3. [Backend não Inicia](#3-backend-não-inicia)
4. [Frontend Página Branca](#4-frontend-página-branca)
5. [Erro 502 Bad Gateway](#5-erro-502-bad-gateway)
6. [MySQL Problemas](#6-mysql-problemas)
7. [Evolution API WhatsApp](#7-evolution-api-whatsapp)
8. [SSL/HTTPS Problemas](#8-sslhttps-problemas)
9. [Performance Lenta](#9-performance-lenta)
10. [Disco Cheio](#10-disco-cheio)
11. [Memória Insuficiente](#11-memória-insuficiente)
12. [Erros de Upload](#12-erros-de-upload)

---

## 1️⃣ PROBLEMAS DE CONEXÃO SSH

### ❌ Erro: "Permission denied (publickey)"

**Causa**: Chave SSH com permissões incorretas ou não encontrada

**Solução Windows:**

```powershell
# Verificar se chave existe
ls C:\Users\SeuUsuario\Downloads\segredo-do-sabor-key.pem

# Corrigir permissões
icacls "C:\Users\SeuUsuario\Downloads\segredo-do-sabor-key.pem" /inheritance:r
icacls "C:\Users\SeuUsuario\Downloads\segredo-do-sabor-key.pem" /grant:r "%username%:R"

# Conectar especificando chave
ssh -i "C:\Users\SeuUsuario\Downloads\segredo-do-sabor-key.pem" azureuser@SEU_IP
```

**Solução Linux/Mac:**

```bash
# Corrigir permissões
chmod 400 ~/Downloads/segredo-do-sabor-key.pem

# Conectar
ssh -i ~/Downloads/segredo-do-sabor-key.pem azureuser@SEU_IP
```

---

### ❌ Erro: "Connection refused"

**Causa**: Porta 22 bloqueada ou VM desligada

**Verificações:**

1. **VM está ligada?**
   - Ir ao Portal Azure
   - Verificar status da VM
   - Iniciar se estiver parada

2. **Porta 22 aberta?**
   - Portal Azure → VM → Rede
   - Regras de entrada
   - Verificar se porta 22 está permitida

3. **IP correto?**
   ```bash
   # Verificar IP público no portal Azure
   # Testar ping (pode estar bloqueado)
   ping SEU_IP
   ```

---

### ❌ Erro: "Connection timeout"

**Causa**: Firewall bloqueando ou IP incorreto

**Solução:**

1. **Verificar NSG (Network Security Group)**
   ```
   Portal Azure → Grupos de segurança de rede
   → segredo-do-sabor-vm-nsg
   → Regras de segurança de entrada
   → Adicionar regra SSH (porta 22)
   ```

2. **Verificar IP público**
   ```
   Portal Azure → VM → Visão geral
   Copiar "Endereço IP público"
   ```

3. **Testar de outro local**
   - Sua rede pode estar bloqueando
   - Testar com 4G/outro WiFi

---

## 2️⃣ ERROS DE INSTALAÇÃO

### ❌ Erro: "E: Unable to locate package"

**Causa**: Repositórios não atualizados

**Solução:**

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y software-properties-common
```

---

### ❌ Erro: "dpkg was interrupted"

**Causa**: Instalação anterior interrompida

**Solução:**

```bash
sudo dpkg --configure -a
sudo apt --fix-broken install
sudo apt update
```

---

### ❌ Erro: "No space left on device"

**Causa**: Disco cheio

**Solução:**

```bash
# Ver uso de disco
df -h

# Limpar cache
sudo apt clean
sudo apt autoclean

# Remover logs antigos
sudo journalctl --vacuum-time=3d

# Encontrar arquivos grandes
sudo du -sh /* | sort -h | tail -10
```

---

## 3️⃣ BACKEND NÃO INICIA

### ❌ PM2 mostra status "errored"

**Diagnóstico:**

```bash
# Ver logs de erro
pm2 logs segredo-backend --err --lines 50

# Ver informações detalhadas
pm2 show segredo-backend

# Ver todos os processos
pm2 list
```

---

### ❌ Erro: "Error: Cannot find module"

**Causa**: Dependências não instaladas

**Solução:**

```bash
cd /var/www/segredodosabor/backend

# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Verificar se instalou
ls -la node_modules/ | wc -l
# Deve ter ~100+ pastas

# Reiniciar
pm2 restart segredo-backend
```

---

### ❌ Erro: "ECONNREFUSED" (MySQL)

**Causa**: Backend não consegue conectar ao MySQL

**Diagnóstico:**

```bash
# MySQL está rodando?
sudo systemctl status mysql

# Testar conexão direta
mysql -u segredo_user -p segredodosabor
```

**Solução:**

```bash
# 1. Verificar .env
cd /var/www/segredodosabor/backend
cat .env | grep DB_

# Deve ter:
# DB_HOST=localhost
# DB_DATABASE=segredodosabor
# DB_USER=segredo_user
# DB_PASSWORD=sua_senha

# 2. Verificar usuário MySQL
mysql -u root -p
```

```sql
SELECT user, host FROM mysql.user WHERE user = 'segredo_user';
SHOW GRANTS FOR 'segredo_user'@'localhost';
EXIT;
```

```bash
# 3. Recriar usuário se necessário
mysql -u root -p
```

```sql
DROP USER IF EXISTS 'segredo_user'@'localhost';
CREATE USER 'segredo_user'@'localhost' IDENTIFIED BY 'SuaSenha123';
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# 4. Atualizar .env e reiniciar
nano /var/www/segredodosabor/backend/.env
# Corrigir DB_PASSWORD

pm2 restart segredo-backend
pm2 logs
```

---

### ❌ Erro: "Port 5000 already in use"

**Causa**: Porta já ocupada

**Solução:**

```bash
# Encontrar processo usando porta 5000
sudo netstat -tlnp | grep :5000

# Ou
sudo lsof -i :5000

# Matar processo (substitua PID)
sudo kill -9 PID

# Ou mudar porta no .env
nano /var/www/segredodosabor/backend/.env
# PORT=5001

# Atualizar Nginx também
sudo nano /etc/nginx/sites-available/segredodosabor
# upstream backend_api {
#     server localhost:5001;
# }

sudo nginx -t
sudo systemctl restart nginx
pm2 restart segredo-backend
```

---

### ❌ Erro: "JWT_SECRET is not defined"

**Causa**: Variável de ambiente faltando

**Solução:**

```bash
cd /var/www/segredodosabor/backend

# Verificar .env
cat .env | grep JWT_

# Se não tiver, gerar
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Adicionar ao .env
echo "JWT_SECRET=$JWT_SECRET" >> .env
echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET" >> .env

# Reiniciar
pm2 restart segredo-backend
```

---

## 4️⃣ FRONTEND PÁGINA BRANCA

### ❌ Navegador carrega mas tela fica branca

**Diagnóstico:**

1. **Abrir DevTools (F12)**
   - Console: verificar erros JavaScript
   - Network: verificar requisições falhando
   - Procurar erro de CORS ou 404

**Solução 1: Verificar Build**

```bash
cd /var/www/segredodosabor/frontend

# Build existe?
ls -la build/
# Deve ter: index.html, static/, imgs/

# Se não existir, criar
npm run build

# Verificar permissões
sudo chown -R www-data:www-data build/
```

**Solução 2: Verificar .env**

```bash
cat /var/www/segredodosabor/frontend/.env

# Deve ter:
# REACT_APP_API_URL=https://seudominio.com.br/api
# Ou
# REACT_APP_API_URL=http://SEU_IP/api
```

**Se mudou .env, precisa rebuild:**

```bash
rm -rf build/
npm run build
sudo systemctl restart nginx
```

**Solução 3: Verificar Nginx**

```bash
# Testar configuração
sudo nginx -t

# Ver logs
sudo tail -f /var/log/nginx/segredodosabor-error.log

# Reiniciar
sudo systemctl restart nginx
```

---

### ❌ Erro: "Failed to fetch" ou "Network Error"

**Causa**: Frontend não consegue chamar API backend

**Diagnóstico:**

```bash
# Backend está rodando?
pm2 status

# Backend responde?
curl http://localhost:5000/

# Nginx proxy funciona?
curl http://localhost/api/
```

**Solução:**

```bash
# 1. Verificar CORS no backend
cd /var/www/segredodosabor/backend
cat .env | grep CORS_ORIGIN

# Deve ter:
# CORS_ORIGIN=https://seudominio.com.br
# Ou para permitir todos (apenas dev):
# CORS_ORIGIN=*

# 2. Verificar proxy no Nginx
sudo cat /etc/nginx/sites-available/segredodosabor | grep -A 10 "location /api"

# Deve ter:
# location /api {
#     rewrite ^/api/(.*)$ /$1 break;
#     proxy_pass http://backend_api;
#     ...
# }

# 3. Reiniciar tudo
pm2 restart segredo-backend
sudo systemctl restart nginx
```

---

## 5️⃣ ERRO 502 BAD GATEWAY

### ❌ Nginx retorna erro 502

**Causa**: Backend não está respondendo

**Diagnóstico Completo:**

```bash
# 1. Backend rodando?
pm2 status
pm2 logs segredo-backend --lines 20

# 2. Backend responde localmente?
curl http://localhost:5000/
# Deve retornar JSON

# 3. Nginx consegue conectar?
sudo tail -f /var/log/nginx/segredodosabor-error.log
# Procurar: "upstream"

# 4. Porta correta?
sudo netstat -tlnp | grep :5000
```

**Solução:**

```bash
# 1. Reiniciar backend
pm2 restart segredo-backend
pm2 logs

# 2. Se não funcionar, iniciar manualmente para ver erro
cd /var/www/segredodosabor/backend
node src/server.js
# Ver erro específico

# 3. Verificar upstream no Nginx
sudo cat /etc/nginx/sites-available/segredodosabor | grep -A 3 "upstream backend_api"

# Deve apontar para porta correta:
# upstream backend_api {
#     server localhost:5000;
# }

# 4. Testar configuração e reiniciar
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6️⃣ MYSQL PROBLEMAS

### ❌ MySQL não inicia

**Diagnóstico:**

```bash
# Status
sudo systemctl status mysql

# Logs de erro
sudo tail -f /var/log/mysql/error.log
```

**Solução 1: Erro de Inicialização**

```bash
# Parar MySQL
sudo systemctl stop mysql

# Remover lock file se existir
sudo rm -f /var/lib/mysql/*.pid
sudo rm -f /var/run/mysqld/mysqld.pid

# Verificar permissões
sudo chown -R mysql:mysql /var/lib/mysql

# Iniciar
sudo systemctl start mysql
```

**Solução 2: Corrompiçao de Dados**

```bash
# Modo de recuperação
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Adicionar na seção [mysqld]:
# innodb_force_recovery = 1

# Salvar e reiniciar
sudo systemctl restart mysql

# Exportar dados
mysqldump -u root -p --all-databases > backup.sql

# Remover linha innodb_force_recovery
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Reiniciar
sudo systemctl restart mysql
```

---

### ❌ Erro: "Access denied for user"

**Causa**: Credenciais incorretas

**Solução:**

```bash
# Resetar senha do root
sudo mysql

# No MySQL:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'NovaSenha123';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Testar
mysql -u root -p
```

---

### ❌ Erro: "Too many connections"

**Causa**: Limite de conexões atingido

**Solução:**

```bash
sudo mysql -u root -p
```

```sql
-- Ver conexões atuais
SHOW PROCESSLIST;

-- Ver máximo
SHOW VARIABLES LIKE 'max_connections';

-- Matar conexões ociosas
KILL CONNECTION ID;
```

```bash
# Aumentar limite permanentemente
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Adicionar:
# max_connections = 200

sudo systemctl restart mysql
```

---

## 7️⃣ EVOLUTION API WHATSAPP

### ❌ Container não inicia

**Diagnóstico:**

```bash
# Ver logs
docker logs evolution-api

# Status do container
docker ps -a | grep evolution

# Verificar porta
sudo netstat -tlnp | grep :8080
```

**Solução:**

```bash
# Remover container antigo
docker rm -f evolution-api

# Recriar
docker run -d \
  --name evolution-api \
  --restart unless-stopped \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=segredodosabor2025 \
  -v ~/evolution-data:/evolution/instances \
  atendai/evolution-api:latest

# Aguardar 30 segundos
sleep 30

# Testar
curl http://localhost:8080
```

---

### ❌ QR Code não gera

**Causa**: Instância não criada corretamente

**Solução:**

```bash
# Criar túnel SSH (do seu PC)
ssh -i key.pem -L 8080:localhost:8080 azureuser@SEU_IP

# No navegador, acessar:
# http://localhost:8080

# Recriar instância via Swagger
# POST /instance/create
# Body:
{
  "instanceName": "segredodosabor",
  "token": "segredodosabor2025",
  "qrcode": true
}

# QR Code aparecerá na resposta
```

---

### ❌ WhatsApp desconecta

**Causa**: Sessão expirou ou celular offline

**Solução:**

```bash
# Verificar status da instância
curl http://localhost:8080/instance/connectionState/segredodosabor \
  -H "apikey: segredodosabor2025"

# Reconectar
# Via interface web ou deletar e recriar instância

# Verificar logs
docker logs evolution-api --tail 100 | grep -i error
```

---

### ❌ Webhook não recebe mensagens

**Diagnóstico:**

```bash
# 1. Webhook configurado?
curl http://localhost:8080/webhook/find/segredodosabor \
  -H "apikey: segredodosabor2025"

# 2. Backend recebe webhook?
pm2 logs segredo-backend | grep webhook

# 3. Endpoint existe?
curl http://localhost:5000/whatsapp/webhook
```

**Solução:**

```bash
# Reconfigurar webhook
curl -X POST http://localhost:8080/webhook/set/segredodosabor \
  -H "apikey: segredodosabor2025" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:5000/whatsapp/webhook",
    "webhook_by_events": false,
    "webhook_base64": false,
    "events": ["messages.upsert"]
  }'

# Enviar mensagem de teste
# Verificar logs
pm2 logs segredo-backend --lines 50
```

---

## 8️⃣ SSL/HTTPS PROBLEMAS

### ❌ Certbot falha ao obter certificado

**Erro**: "Challenge failed"

**Causa**: DNS não apontando ou porta 80 bloqueada

**Verificações:**

```bash
# 1. DNS correto?
dig seudominio.com.br +short
# Deve retornar IP da VM

# 2. Porta 80 acessível externamente?
curl -I http://seudominio.com.br

# 3. Nginx rodando?
sudo systemctl status nginx
```

**Solução:**

```bash
# 1. Parar Nginx temporariamente
sudo systemctl stop nginx

# 2. Obter certificado (modo standalone)
sudo certbot certonly --standalone -d seudominio.com.br -d www.seudominio.com.br

# 3. Configurar Nginx manualmente
sudo nano /etc/nginx/sites-available/segredodosabor

# Adicionar seção SSL:
server {
    listen 443 ssl http2;
    server_name seudominio.com.br www.seudominio.com.br;
    
    ssl_certificate /etc/letsencrypt/live/seudominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com.br/privkey.pem;
    
    # ... resto da configuração
}

# 4. Testar e reiniciar
sudo nginx -t
sudo systemctl start nginx
```

---

### ❌ SSL certificate expired

**Causa**: Renovação automática falhou

**Solução:**

```bash
# Renovar manualmente
sudo certbot renew --force-renewal

# Verificar timer
sudo systemctl status certbot.timer

# Habilitar se desabilitado
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Testar renovação
sudo certbot renew --dry-run
```

---

## 9️⃣ PERFORMANCE LENTA

### ❌ Site carrega devagar

**Diagnóstico:**

```bash
# 1. Ver uso de recursos
htop
# Verificar CPU e RAM

# 2. Ver processos pesados
top -o %CPU

# 3. Ver I/O de disco
sudo iotop

# 4. Ver conexões
sudo netstat -ant | wc -l
```

**Soluções:**

**1. Aumentar workers do PM2:**

```bash
# Ver configuração atual
pm2 info segredo-backend

# Escalar (usar 1 worker por core - 1)
pm2 scale segredo-backend 2

# Ou usar modo cluster no ecosystem.config.js:
cd /var/www/segredodosabor/backend
nano ecosystem.config.js

# Modificar:
{
  instances: 2,  # ou "max" para usar todos cores
  exec_mode: 'cluster'
}

pm2 restart segredo-backend
```

**2. Ativar cache no Nginx:**

```bash
sudo nano /etc/nginx/sites-available/segredodosabor

# Adicionar no topo:
proxy_cache_path /var/cache/nginx/segredodosabor levels=1:2 keys_zone=api_cache:10m max_size=100m;

# No location /api:
location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    add_header X-Cache-Status $upstream_cache_status;
    
    # ... resto da configuração
}

# Criar diretório
sudo mkdir -p /var/cache/nginx/segredodosabor
sudo chown -R www-data:www-data /var/cache/nginx

# Testar e reiniciar
sudo nginx -t
sudo systemctl restart nginx
```

**3. Otimizar MySQL:**

```bash
# Instalar mysqltuner
sudo apt install mysqltuner

# Executar
sudo mysqltuner

# Aplicar recomendações em:
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Exemplo:
[mysqld]
innodb_buffer_pool_size = 1G
query_cache_size = 32M
query_cache_limit = 2M
max_connections = 100

sudo systemctl restart mysql
```

**4. Comprimir respostas:**

```bash
sudo nano /etc/nginx/nginx.conf

# Verificar se tem:
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

sudo systemctl restart nginx
```

---

## 🔟 DISCO CHEIO

### ❌ "No space left on device"

**Diagnóstico:**

```bash
# Ver uso geral
df -h

# Ver por diretório
sudo du -sh /* | sort -h | tail -10

# Arquivos grandes
sudo find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null
```

**Soluções:**

```bash
# 1. Limpar APT
sudo apt clean
sudo apt autoclean
sudo apt autoremove -y

# 2. Limpar logs do sistema
sudo journalctl --vacuum-time=7d
sudo journalctl --vacuum-size=100M

# 3. Limpar logs do Nginx
sudo truncate -s 0 /var/log/nginx/*.log

# 4. Limpar logs do PM2
pm2 flush

# 5. Limpar Docker
docker system prune -a -f
docker volume prune -f

# 6. Limpar cache Node
cd /var/www/segredodosabor/backend
rm -rf node_modules
npm cache clean --force
npm install

cd ../frontend
rm -rf node_modules build
npm cache clean --force
npm install
npm run build

# 7. Remover backups antigos
find /opt/backups -type d -mtime +7 -exec rm -rf {} +

# 8. Verificar novamente
df -h
```

**Aumentar disco no Azure:**

```bash
# Portal Azure → VM → Discos → Expandir
# Depois de expandir no portal:

# Expandir partição Linux
sudo growpart /dev/sda 1
sudo resize2fs /dev/sda1

# Verificar
df -h
```

---

## 1️⃣1️⃣ MEMÓRIA INSUFICIENTE

### ❌ Sistema lento, "Out of memory"

**Diagnóstico:**

```bash
# Ver uso de memória
free -h

# Ver processos
ps aux --sort=-%mem | head -10
```

**Solução 1: Criar Swap**

```bash
# Criar arquivo swap de 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Tornar permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verificar
free -h
```

**Solução 2: Limitar PM2**

```bash
cd /var/www/segredodosabor/backend
nano ecosystem.config.js

# Adicionar:
{
  max_memory_restart: '400M',  # Reiniciar se passar de 400MB
  instances: 1  # Reduzir instâncias se necessário
}

pm2 restart segredo-backend
```

**Solução 3: Upgrade da VM**

```
Portal Azure → VM → Tamanho
Selecionar: Standard_B2ms (2 vCPUs, 8GB RAM)
Reiniciar VM
```

---

## 1️⃣2️⃣ ERROS DE UPLOAD

### ❌ "PayloadTooLargeError"

**Causa**: Arquivo muito grande

**Solução:**

```bash
# 1. Aumentar limite no backend
cd /var/www/segredodosabor/backend
nano .env

# Modificar:
MAX_FILE_SIZE=10485760  # 10MB

# 2. Aumentar limite no Nginx
sudo nano /etc/nginx/sites-available/segredodosabor

# Adicionar/modificar:
client_max_body_size 10M;

# 3. Reiniciar
pm2 restart segredo-backend
sudo systemctl restart nginx
```

---

### ❌ Upload falha sem erro

**Diagnóstico:**

```bash
# Verificar permissões da pasta storage
cd /var/www/segredodosabor/backend
ls -la storage/

# Verificar se pasta existe
ls -la | grep storage
```

**Solução:**

```bash
# Criar pasta se não existir
mkdir -p /var/www/segredodosabor/backend/storage

# Dar permissões
sudo chown -R $USER:$USER /var/www/segredodosabor/backend/storage
chmod 755 /var/www/segredodosabor/backend/storage

# Reiniciar
pm2 restart segredo-backend
```

---

## 🆘 PROCEDIMENTOS DE EMERGÊNCIA

### 🔥 Sistema completamente travado

```bash
# 1. Reiniciar via portal Azure
Portal Azure → VM → Reiniciar

# 2. Após reiniciar, verificar status
ssh -i key.pem azureuser@SEU_IP

sudo systemctl status mysql
sudo systemctl status nginx
pm2 status

# 3. Iniciar serviços se necessário
sudo systemctl start mysql
sudo systemctl start nginx
pm2 resurrect  # Restaurar processos salvos
```

---

### 🔥 Dados corrompidos

```bash
# 1. Restaurar último backup
cd /opt/backups
ls -la  # Ver backups disponíveis

# 2. Escolher backup
cd 20250101_030000

# 3. Restaurar banco
gunzip < database_20250101_030000.sql.gz | mysql -u segredo_user -p segredodosabor

# 4. Restaurar arquivos
tar -xzf files_20250101_030000.tar.gz -C /
```

---

### 🔥 Hack ou invasão

```bash
# 1. DESLIGAR VM IMEDIATAMENTE
# Portal Azure → VM → Parar

# 2. Criar snapshot do disco
# Portal Azure → Discos → Criar snapshot

# 3. Analisar logs offline

# 4. Criar nova VM do snapshot
# Aplicar patches de segurança
# Trocar TODAS as senhas
# Revisar logs de acesso
```

---

## 📞 COMANDOS DE DIAGNÓSTICO RÁPIDO

```bash
#!/bin/bash
# diagnostico-completo.sh

echo "🔍 DIAGNÓSTICO COMPLETO DO SISTEMA"
echo "=================================="
echo ""

echo "📊 SERVIÇOS:"
echo "MySQL: $(sudo systemctl is-active mysql)"
echo "Nginx: $(sudo systemctl is-active nginx)"
echo "PM2: $(pm2 list | grep -c online) processos online"
echo "Docker: $(docker ps | grep -c evolution) containers"
echo ""

echo "💾 DISCO:"
df -h / | tail -1
echo ""

echo "🧠 MEMÓRIA:"
free -h | grep Mem
echo ""

echo "🔌 PORTAS:"
sudo netstat -tlnp | grep -E ':(22|80|443|3306|5000|8080)'
echo ""

echo "📝 ÚLTIMOS ERROS (Nginx):"
sudo tail -5 /var/log/nginx/segredodosabor-error.log
echo ""

echo "📝 ÚLTIMOS ERROS (Backend):"
pm2 logs segredo-backend --err --lines 5 --nostream
echo ""

echo "🌐 TESTE DE CONECTIVIDADE:"
curl -s -o /dev/null -w "Backend (local): %{http_code}\n" http://localhost:5000/
curl -s -o /dev/null -w "Nginx (local): %{http_code}\n" http://localhost/
echo ""

echo "✅ Diagnóstico concluído!"
```

Salvar e executar:

```bash
chmod +x diagnostico-completo.sh
./diagnostico-completo.sh
```

---

## 📚 RECURSOS ADICIONAIS

### Documentação Oficial

- **Node.js**: https://nodejs.org/docs
- **MySQL**: https://dev.mysql.com/doc/
- **Nginx**: https://nginx.org/en/docs/
- **PM2**: https://pm2.keymetrics.io/docs/
- **Docker**: https://docs.docker.com/
- **Evolution API**: https://doc.evolution-api.com/

### Logs Importantes

```bash
# Backend
pm2 logs segredo-backend
/var/log/pm2/segredo-backend-error.log
/var/log/pm2/segredo-backend-out.log

# Nginx
/var/log/nginx/segredodosabor-access.log
/var/log/nginx/segredodosabor-error.log
/var/log/nginx/error.log

# MySQL
/var/log/mysql/error.log

# Sistema
sudo journalctl -u mysql
sudo journalctl -u nginx
```

---

**Versão**: 5.0  
**Atualizado**: 01/11/2025  
**Plataforma**: Microsoft Azure Ubuntu 22.04  

💡 **Dica**: Mantenha este guia acessível para consulta rápida!
