# ⚡ GUIA RÁPIDO - DEPLOY AZURE

## Comandos Essenciais em 5 Minutos

---

## 🚀 INÍCIO RÁPIDO

### 1. Criar VM no Azure Portal

```yaml
Nome: segredo-do-sabor-vm
Região: Brazil South
Tamanho: Standard_B2s (2 vCPUs, 4GB RAM)
SO: Ubuntu 22.04 LTS
Portas: 22, 80, 443
```

**Baixe a chave SSH `.pem`!**

### 2. Conectar via SSH

```bash
# Windows PowerShell
ssh -i segredo-do-sabor-key.pem azureuser@SEU_IP_PUBLICO
```

### 3. Executar Script de Deploy Automático

```bash
# Na VM, fazer upload do script
# Do seu PC:
scp -i segredo-do-sabor-key.pem deploy-azure.sh azureuser@SEU_IP:~/

# Na VM:
sudo bash deploy-azure.sh
```

**O script instalará TUDO automaticamente!**

### 4. Fazer Upload do Código

```bash
# Do seu PC Windows (PowerShell):
cd D:\Downloads\Segredo-do-Sabor

# Compactar
tar -czf app.tar.gz backend frontend *.sql

# Enviar
scp -i segredo-do-sabor-key.pem app.tar.gz azureuser@SEU_IP:~/

# Na VM:
cd /var/www/segredodosabor
tar -xzf ~/app.tar.gz
```

### 5. Configurar Backend

```bash
cd /var/www/segredodosabor/backend
cp /var/www/segredodosabor/.env.backend .env
npm install
pm2 start src/server.js --name segredo-backend
pm2 save
```

### 6. Importar Banco de Dados

```bash
cd /var/www/segredodosabor
mysql -u segredo_user -p segredodosabor < BANCO_DADOS_COMPLETO.sql
mysql -u segredo_user -p segredodosabor < criar-tabela-mensagens-whatsapp-completa.sql
```

### 7. Configurar Frontend

```bash
cd /var/www/segredodosabor/frontend
cp /var/www/segredodosabor/.env.frontend .env
npm install
npm run build
```

### 8. Testar

```bash
# Verificar backend
curl http://localhost:5000/

# Verificar frontend
curl http://SEU_IP/

# Ver status
pm2 status
sudo systemctl status nginx
```

✅ **Sistema funcionando!**

---

## 📋 CHECKLIST PASSO A PASSO

```
☐ 1. VM criada no Azure
☐ 2. IP público anotado
☐ 3. Chave SSH baixada
☐ 4. Conectado via SSH
☐ 5. Script deploy-azure.sh executado
☐ 6. Código enviado via SCP
☐ 7. Backend configurado
☐ 8. Banco de dados importado
☐ 9. Frontend buildado
☐ 10. Sistema testado
☐ 11. SSL configurado (opcional)
☐ 12. WhatsApp conectado (opcional)
```

---

## 🔥 COMANDOS MAIS USADOS

### Status dos Serviços

```bash
pm2 status                          # Status do backend
sudo systemctl status nginx         # Status do Nginx
sudo systemctl status mysql         # Status do MySQL
docker ps | grep evolution          # Status Evolution API
```

### Ver Logs

```bash
pm2 logs                           # Logs do backend
sudo tail -f /var/log/nginx/segredodosabor-access.log
sudo tail -f /var/log/nginx/segredodosabor-error.log
docker logs -f evolution-api       # Logs WhatsApp
```

### Reiniciar Serviços

```bash
pm2 restart all                    # Reiniciar backend
sudo systemctl restart nginx       # Reiniciar Nginx
sudo systemctl restart mysql       # Reiniciar MySQL
docker restart evolution-api       # Reiniciar Evolution API
```

### Atualizar Código

```bash
# Backend
cd /var/www/segredodosabor/backend
git pull  # ou fazer upload novo
npm install
pm2 restart segredo-backend

# Frontend
cd /var/www/segredodosabor/frontend
git pull  # ou fazer upload novo
npm install
npm run build
sudo systemctl restart nginx
```

### Backup Manual

```bash
/opt/backups/backup-segredo.sh
ls -lh /opt/backups/
```

---

## 🆘 SOLUÇÃO RÁPIDA DE PROBLEMAS

### Backend não inicia

```bash
pm2 logs segredo-backend --err
cd /var/www/segredodosabor/backend
cat .env  # Verificar configurações
npm install
pm2 restart segredo-backend
```

### Frontend mostra página branca

```bash
cd /var/www/segredodosabor/frontend
cat .env  # Verificar REACT_APP_API_URL
npm run build
sudo systemctl restart nginx
```

### Erro 502 Bad Gateway

```bash
pm2 status  # Backend rodando?
curl http://localhost:5000/  # Backend responde?
sudo nginx -t  # Configuração OK?
sudo systemctl restart nginx
```

### MySQL não conecta

```bash
sudo systemctl status mysql
sudo systemctl start mysql
mysql -u segredo_user -p segredodosabor  # Testar
```

### Disco cheio

```bash
df -h  # Ver espaço
sudo apt clean
sudo journalctl --vacuum-time=7d
pm2 flush
```

---

## 🔒 CONFIGURAR SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado (trocar domínio)
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br

# Testar renovação
sudo certbot renew --dry-run
```

**Certificado renova automaticamente a cada 90 dias!**

---

## 📱 CONFIGURAR WHATSAPP

### 1. Criar Túnel SSH (do seu PC)

```bash
ssh -i segredo-do-sabor-key.pem -L 8080:localhost:8080 azureuser@SEU_IP
```

### 2. Acessar Evolution API

Abrir no navegador: `http://localhost:8080`

### 3. Criar Instância

- POST `/instance/create`
- instanceName: `segredodosabor`
- qrcode: `true`

### 4. Escanear QR Code

Usar WhatsApp no celular para escanear

### 5. Configurar Webhook

```bash
curl -X POST http://localhost:8080/webhook/set/segredodosabor \
  -H "apikey: segredodosabor2025" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:5000/whatsapp/webhook",
    "events": ["messages.upsert"]
  }'
```

---

## 📊 MONITORAMENTO

### Ver Recursos

```bash
htop                    # CPU e Memória (instalar: apt install htop)
df -h                   # Espaço em disco
free -h                 # Memória RAM
netstat -tlnp           # Portas em uso
```

### Ver Processos

```bash
ps aux | grep node      # Processos Node.js
ps aux | grep nginx     # Processos Nginx
docker ps               # Containers
```

### Logs em Tempo Real

```bash
# Backend
pm2 logs --lines 50

# Nginx
sudo tail -f /var/log/nginx/segredodosabor-access.log

# MySQL
sudo tail -f /var/log/mysql/error.log

# Sistema
sudo journalctl -f
```

---

## 🔧 CONFIGURAÇÕES ÚTEIS

### Aumentar Workers PM2

```bash
# Ver atual
pm2 info segredo-backend

# Escalar para 4 instâncias
pm2 scale segredo-backend 4
```

### Limpar Cache

```bash
# Cache do sistema
sudo apt clean
sudo apt autoclean

# Cache Node
rm -rf node_modules
npm cache clean --force
npm install

# Cache PM2
pm2 flush
```

### Otimizar MySQL

```bash
# Instalar ferramenta
sudo apt install mysqltuner

# Executar análise
sudo mysqltuner
```

---

## 🎯 URLS DO SISTEMA

### Produção

```
Frontend: https://seudominio.com.br
Backend: https://seudominio.com.br/api
Admin: https://seudominio.com.br/gerenciamentos
Health: https://seudominio.com.br/health
```

### Desenvolvimento (túnel SSH)

```
Evolution API: http://localhost:8080
MySQL: localhost:3306 (apenas via SSH)
Backend direto: http://localhost:5000
```

---

## 🔑 CREDENCIAIS PADRÃO

### MySQL

```
Host: localhost
Database: segredodosabor
User: segredo_user
Password: (definida durante instalação)
```

### Admin Sistema

```
Email: admin@segredodosabor.com
Senha: Admin@2025
```

### Evolution API

```
URL: http://localhost:8080
API Key: segredodosabor2025
Instance: segredodosabor
```

---

## 📱 TESTAR ENDPOINTS

### Backend - Health Check

```bash
curl http://SEU_IP/api/
```

### Listar Produtos

```bash
curl http://SEU_IP/api/produto/listar
```

### Login

```bash
curl -X POST http://SEU_IP/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@segredodosabor.com",
    "senha": "Admin@2025"
  }'
```

### Simulador de Custos

```bash
curl -X POST http://SEU_IP/api/simulacao/custo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "idproduto": 1,
    "receita_simulada": [{"idingrediente": 1, "quantidade": 250}]
  }'
```

---

## 💡 DICAS PRO

### 1. Alias Úteis

Adicionar ao `~/.bashrc`:

```bash
alias logs-backend='pm2 logs segredo-backend'
alias logs-nginx='sudo tail -f /var/log/nginx/segredodosabor-access.log'
alias status-all='pm2 status && sudo systemctl status nginx && sudo systemctl status mysql'
alias restart-all='pm2 restart all && sudo systemctl restart nginx'
```

Aplicar: `source ~/.bashrc`

### 2. Script de Status Rápido

```bash
#!/bin/bash
echo "🚀 SEGREDO DO SABOR - STATUS"
echo "================================"
echo ""
echo "📊 PM2:"
pm2 status
echo ""
echo "🌐 Nginx:"
sudo systemctl is-active nginx
echo ""
echo "🗄️  MySQL:"
sudo systemctl is-active mysql
echo ""
echo "🐳 Docker:"
docker ps --format "table {{.Names}}\t{{.Status}}"
echo ""
echo "💾 Disco:"
df -h / | tail -1
echo ""
echo "🧠 Memória:"
free -h | grep Mem
```

Salvar como `status.sh` e executar: `bash status.sh`

### 3. Monitoramento Simples

```bash
# Ver requisições em tempo real
sudo tail -f /var/log/nginx/segredodosabor-access.log | grep -E '(GET|POST)'

# Contar requisições por minuto
watch -n 1 'sudo tail -100 /var/log/nginx/segredodosabor-access.log | wc -l'

# Ver erros do backend
pm2 logs segredo-backend --err --lines 20
```

---

## 🎓 COMANDOS AVANÇADOS

### Deploy Automatizado Completo

```bash
#!/bin/bash
# deploy-update.sh - Atualizar sistema completo

echo "🔄 Atualizando Segredo do Sabor..."

cd /var/www/segredodosabor

# Backup
/opt/backups/backup-segredo.sh

# Atualizar código
git pull

# Backend
cd backend
npm install
pm2 restart segredo-backend

# Frontend
cd ../frontend
npm install
npm run build

# Restart Nginx
sudo systemctl restart nginx

echo "✅ Atualização concluída!"
pm2 status
```

### Limpar Sistema

```bash
#!/bin/bash
# clean-system.sh - Limpar arquivos temporários

echo "🧹 Limpando sistema..."

# APT
sudo apt autoremove -y
sudo apt autoclean
sudo apt clean

# Logs antigos
sudo journalctl --vacuum-time=7d
sudo find /var/log -type f -name "*.log" -mtime +7 -delete

# PM2
pm2 flush

# Docker
docker system prune -f

echo "✅ Limpeza concluída!"
df -h
```

---

## 📞 SUPORTE

### Arquivos de Documentação

```bash
/var/www/segredodosabor/TUTORIAL_DEPLOY_AZURE.md     # Tutorial completo
/var/www/segredodosabor/GUIA_INICIALIZACAO_SISTEMA.md # Guia de inicialização
/var/www/segredodosabor/backend/API_DOCUMENTATION.md  # Documentação da API
```

### Logs Importantes

```bash
/var/log/nginx/segredodosabor-access.log    # Acessos
/var/log/nginx/segredodosabor-error.log     # Erros Nginx
/var/log/pm2/segredo-backend-error.log      # Erros Backend
/var/log/pm2/segredo-backend-out.log        # Output Backend
/var/log/mysql/error.log                     # Erros MySQL
/var/log/backup-segredo.log                  # Logs de backup
```

---

## ⚡ RESUMO - 1 MINUTO

```bash
# 1. Criar VM no Azure (Standard_B2s, Ubuntu 22.04)
# 2. Conectar SSH
ssh -i key.pem azureuser@IP

# 3. Deploy automático
sudo bash deploy-azure.sh

# 4. Upload código
scp -i key.pem -r backend frontend *.sql azureuser@IP:/var/www/segredodosabor/

# 5. Configurar
cd /var/www/segredodosabor/backend
cp ../.env.backend .env && npm install
pm2 start src/server.js --name segredo-backend

# 6. Importar DB
mysql -u segredo_user -p segredodosabor < BANCO_DADOS_COMPLETO.sql

# 7. Build frontend
cd ../frontend
cp ../.env.frontend .env && npm install && npm run build

# 8. Acessar
http://SEU_IP
```

✅ **PRONTO!**

---

**Versão**: 5.0  
**Atualizado**: 01/11/2025  
**Plataforma**: Microsoft Azure  

Para tutorial completo: `TUTORIAL_DEPLOY_AZURE.md`
