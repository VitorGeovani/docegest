# 🚀 Guia de Comandos Rápidos - Evolution API + Docegest

## 📋 Índice de Comandos

- [Conexão SSH](#conexão-ssh)
- [Docker](#docker)
- [Evolution API](#evolution-api)
- [MySQL](#mysql)
- [Backend](#backend)
- [Frontend](#frontend)
- [Monitoramento](#monitoramento)
- [Backup e Restore](#backup-e-restore)
- [Troubleshooting](#troubleshooting)

---

## 🔐 Conexão SSH

### Conectar na VM Azure

**Windows PowerShell:**
```powershell
ssh -i docegest-key.pem azureuser@SEU_IP
```

**Linux/Mac:**
```bash
chmod 400 docegest-key.pem
ssh -i docegest-key.pem azureuser@SEU_IP
```

### Upload de Arquivos

**Upload único:**
```bash
scp -i docegest-key.pem arquivo.txt azureuser@SEU_IP:~/
```

**Upload pasta completa:**
```bash
scp -i docegest-key.pem -r pasta/ azureuser@SEU_IP:~/
```

**Download da VM:**
```bash
scp -i docegest-key.pem azureuser@SEU_IP:~/arquivo.txt ./
```

---

## 🐳 Docker

### Gerenciar Containers

```bash
# Ver containers rodando
docker ps

# Ver todos os containers (incluindo parados)
docker ps -a

# Iniciar containers
docker compose up -d

# Parar containers
docker compose down

# Reiniciar containers
docker compose restart

# Reiniciar container específico
docker restart evolution-api

# Ver logs
docker logs -f evolution-api

# Ver últimas 100 linhas de log
docker logs --tail 100 evolution-api

# Entrar no container
docker exec -it evolution-api sh

# Ver uso de recursos
docker stats

# Ver informações do container
docker inspect evolution-api
```

### Limpeza Docker

```bash
# Remover containers parados
docker container prune -f

# Remover imagens não usadas
docker image prune -a -f

# Remover volumes não usados
docker volume prune -f

# Limpeza completa
docker system prune -a -f --volumes

# Ver espaço usado
docker system df
```

### Atualizar Imagens

```bash
cd ~/evolution-api

# Baixar versão mais recente
docker compose pull

# Recriar containers
docker compose up -d --force-recreate
```

---

## 📱 Evolution API

### Gerenciar Instâncias

**Criar instância:**
```bash
curl -X POST http://localhost:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "instanceName": "docegest-whatsapp",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

**Conectar WhatsApp (obter QR Code):**
```bash
curl -X GET http://localhost:8080/instance/connect/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

**Verificar status:**
```bash
curl -X GET http://localhost:8080/instance/connectionState/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

**Listar instâncias:**
```bash
curl -X GET http://localhost:8080/instance/fetchInstances \
  -H "apikey: SUA_API_KEY"
```

**Desconectar WhatsApp:**
```bash
curl -X DELETE http://localhost:8080/instance/logout/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

**Deletar instância:**
```bash
curl -X DELETE http://localhost:8080/instance/delete/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

**Reiniciar instância:**
```bash
curl -X PUT http://localhost:8080/instance/restart/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

### Enviar Mensagens

**Mensagem de texto:**
```bash
curl -X POST http://localhost:8080/message/sendText/docegest-whatsapp \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "number": "5511967696744",
    "text": "Olá! Esta é uma mensagem de teste."
  }'
```

**Mensagem com emojis:**
```bash
curl -X POST http://localhost:8080/message/sendText/docegest-whatsapp \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "number": "5511967696744",
    "text": "🎉 Pedido confirmado!\n📦 Código: #PED000123\n💰 Valor: R$ 45,90"
  }'
```

**Mensagem com imagem:**
```bash
curl -X POST http://localhost:8080/message/sendMedia/docegest-whatsapp \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "number": "5511967696744",
    "mediatype": "image",
    "media": "https://example.com/imagem.jpg",
    "caption": "Confira seu pedido!"
  }'
```

### Buscar Informações

**Buscar contato:**
```bash
curl -X GET "http://localhost:8080/chat/findContacts/docegest-whatsapp?phone=5511967696744" \
  -H "apikey: SUA_API_KEY"
```

**Listar conversas:**
```bash
curl -X GET http://localhost:8080/chat/findChats/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

**Buscar mensagens:**
```bash
curl -X GET http://localhost:8080/chat/findMessages/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

---

## 🗄️ MySQL

### Acesso ao Banco

```bash
# Entrar no MySQL
mysql -u docegest -p
# Senha: Docegest@2025

# Ou como root
sudo mysql -u root -p
# Senha: P@$$w0rd
```

### Comandos SQL Úteis

```sql
-- Ver databases
SHOW DATABASES;

-- Usar database
USE segredodosabor;

-- Ver tabelas
SHOW TABLES;

-- Descrever estrutura de tabela
DESCRIBE pedidos;

-- Ver últimos pedidos
SELECT * FROM pedidos ORDER BY data_criacao DESC LIMIT 10;

-- Contar pedidos
SELECT COUNT(*) as total FROM pedidos;

-- Ver produtos ativos
SELECT id, nome, valor, ativo FROM produtos WHERE ativo = 1;

-- Ver log de WhatsApp
SELECT * FROM whatsapp_mensagens ORDER BY data_envio DESC LIMIT 20;

-- Sair
EXIT;
```

### Backup e Restore

**Backup completo:**
```bash
mysqldump -u docegest -p segredodosabor > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Backup apenas estrutura:**
```bash
mysqldump -u docegest -p --no-data segredodosabor > estrutura.sql
```

**Backup apenas dados:**
```bash
mysqldump -u docegest -p --no-create-info segredodosabor > dados.sql
```

**Restore:**
```bash
mysql -u docegest -p segredodosabor < backup.sql
```

**Backup remoto (do seu PC):**
```bash
ssh -i docegest-key.pem azureuser@SEU_IP "mysqldump -u docegest -p'Docegest@2025' segredodosabor" > backup_local.sql
```

---

## ⚙️ Backend

### Gerenciar com PM2

```bash
# Iniciar
cd ~/docegest/backend
pm2 start npm --name "docegest-backend" -- start

# Parar
pm2 stop docegest-backend

# Reiniciar
pm2 restart docegest-backend

# Recarregar (sem downtime)
pm2 reload docegest-backend

# Deletar do PM2
pm2 delete docegest-backend

# Ver logs
pm2 logs docegest-backend

# Ver logs apenas de erros
pm2 logs docegest-backend --err

# Limpar logs
pm2 flush

# Ver status
pm2 status

# Ver detalhes
pm2 show docegest-backend

# Monitorar recursos
pm2 monit

# Salvar configuração
pm2 save

# Configurar para iniciar com sistema
pm2 startup
```

### Testar Backend

**Healthcheck:**
```bash
curl http://localhost:5000/api/health
```

**Fazer login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@segredodosabor.com","password":"admin123"}'
```

**Listar produtos (com autenticação):**
```bash
# Primeiro fazer login e pegar token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@segredodosabor.com","password":"admin123"}' \
  | jq -r '.token')

# Usar token
curl http://localhost:5000/api/produtos \
  -H "Authorization: Bearer $TOKEN"
```

### Logs Backend

```bash
# Ver logs do PM2
pm2 logs docegest-backend

# Logs da aplicação (se configurado)
tail -f ~/docegest/backend/logs/app.log

# Buscar erro específico
grep "ERROR" ~/docegest/backend/logs/app.log
```

---

## 🎨 Frontend

### Build Local

```bash
cd ~/docegest/frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm start

# Build para produção
npm run build

# Testar build
npm run serve
```

### Deploy com Nginx

```bash
# Copiar build para Nginx
sudo cp -r build/* /var/www/html/

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver status
sudo systemctl status nginx

# Testar configuração
sudo nginx -t

# Ver logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 Monitoramento

### Script de Status

```bash
# Ver status geral
~/status.sh
```

**Criar script de status:**
```bash
cat > ~/status.sh << 'EOF'
#!/bin/bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   📊 STATUS DOCEGEST + EVOLUTION API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🐳 DOCKER:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "⚙️  PM2:"
pm2 list
echo ""
echo "🗄️  MYSQL:"
sudo systemctl is-active mysql
echo ""
echo "💾 DISCO:"
df -h / | tail -1 | awk '{print "Usado: " $3 " de " $2 " (" $5 ")"}'
echo ""
echo "🧠 MEMÓRIA:"
free -h | grep Mem | awk '{print "Usado: " $3 " de " $2}'
echo ""
echo "⏰ UPTIME:"
uptime -p
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
EOF
chmod +x ~/status.sh
```

### Recursos do Sistema

```bash
# CPU e Memória
top

# Uso de disco
df -h

# Uso de memória
free -h

# Processos usando mais CPU
ps aux --sort=-%cpu | head -10

# Processos usando mais memória
ps aux --sort=-%mem | head -10

# Ver portas em uso
sudo netstat -tulpn | grep LISTEN

# Ver conexões ativas
sudo netstat -an | grep ESTABLISHED | wc -l

# Ver uptime
uptime

# Ver logs do sistema
sudo journalctl -f
```

---

## 💾 Backup e Restore

### Backup Automático

```bash
# Criar script de backup
cat > ~/backup-evolution.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/azureuser/backups"
DATE=$(date +%Y%m%d_%H%M%S)
EVOLUTION_DIR="/home/azureuser/evolution-api"

mkdir -p "$BACKUP_DIR"

echo "🔄 Backup Evolution API..."
tar -czf "$BACKUP_DIR/evolution_$DATE.tar.gz" -C "$EVOLUTION_DIR" instances store

echo "🔄 Backup MySQL..."
mysqldump -u docegest -p'Docegest@2025' segredodosabor > "$BACKUP_DIR/database_$DATE.sql"

echo "🧹 Limpando backups antigos..."
find "$BACKUP_DIR" -name "evolution_*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "database_*.sql" -mtime +7 -delete

echo "✅ Backup concluído: $DATE"
EOF
chmod +x ~/backup-evolution.sh

# Executar backup
~/backup-evolution.sh
```

### Agendar Backups

```bash
# Editar crontab
crontab -e

# Adicionar backup diário às 2h da manhã
0 2 * * * /home/azureuser/backup-evolution.sh >> /home/azureuser/backup.log 2>&1

# Ver crons agendados
crontab -l
```

### Restore

**Restore Evolution API:**
```bash
# Parar container
cd ~/evolution-api
docker compose down

# Extrair backup
tar -xzf ~/backups/evolution_20250116_020000.tar.gz -C ~/evolution-api/

# Iniciar container
docker compose up -d
```

**Restore MySQL:**
```bash
mysql -u docegest -p segredodosabor < ~/backups/database_20250116_020000.sql
```

---

## 🐛 Troubleshooting

### Evolution API não responde

```bash
# Ver logs
docker logs evolution-api --tail 50

# Ver se está rodando
docker ps | grep evolution

# Reiniciar
cd ~/evolution-api
docker compose restart

# Se não resolver, recriar
docker compose down
docker compose up -d
```

### WhatsApp desconecta

```bash
# Verificar status
curl -X GET http://localhost:8080/instance/connectionState/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"

# Reconectar
curl -X GET http://localhost:8080/instance/connect/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"

# Se não resolver, deletar e recriar instância
curl -X DELETE http://localhost:8080/instance/delete/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

### Backend não inicia

```bash
# Ver logs
pm2 logs docegest-backend --err

# Verificar .env
cat ~/docegest/backend/.env

# Testar conexão MySQL
mysql -u docegest -p -e "SELECT 1"

# Reiniciar
pm2 restart docegest-backend
```

### MySQL não conecta

```bash
# Ver status
sudo systemctl status mysql

# Reiniciar
sudo systemctl restart mysql

# Ver logs
sudo tail -f /var/log/mysql/error.log

# Testar conexão
mysql -u root -p -e "SELECT 1"
```

### Porta já em uso

```bash
# Ver o que está usando porta 8080
sudo lsof -i :8080

# Matar processo
sudo kill -9 PID

# Ou mudar porta no docker-compose.yml
```

### Sem espaço em disco

```bash
# Ver uso
df -h

# Limpar Docker
docker system prune -a -f --volumes

# Limpar logs
pm2 flush
sudo journalctl --vacuum-time=7d

# Limpar apt cache
sudo apt clean
sudo apt autoremove -y

# Ver maiores arquivos
du -ah ~ | sort -rh | head -20
```

### Performance lenta

```bash
# Ver recursos
top
htop  # Se instalado: sudo apt install htop

# Ver uso de rede
iftop  # Se instalado: sudo apt install iftop

# Reiniciar tudo
cd ~/evolution-api && docker compose restart
pm2 restart all
sudo systemctl restart nginx
```

---

## 🔒 Segurança

### Firewall

```bash
# Ver regras UFW
sudo ufw status verbose

# Permitir porta
sudo ufw allow 8080/tcp

# Negar porta
sudo ufw deny 8080/tcp

# Deletar regra
sudo ufw delete allow 8080/tcp

# Resetar firewall
sudo ufw reset
```

### Atualizar Sistema

```bash
# Atualizar pacotes
sudo apt update
sudo apt upgrade -y

# Atualizar kernel (cuidado!)
sudo apt dist-upgrade -y

# Reiniciar se necessário
sudo reboot
```

### Verificar Segurança

```bash
# Ver usuários logados
who

# Ver histórico de logins
last

# Ver tentativas de SSH falhas
sudo grep "Failed password" /var/log/auth.log

# Ver processos rodando
ps aux

# Ver serviços ativos
sudo systemctl list-units --type=service --state=running
```

---

## 📚 Comandos Combinados Úteis

### Deploy Completo do Zero

```bash
# Executar tudo de uma vez
curl -sSL https://raw.githubusercontent.com/VitorGeovani/docegest/main/install-evolution-docegest.sh | bash
```

### Restart Completo

```bash
# Reiniciar todos os serviços
cd ~/evolution-api && docker compose restart && \
pm2 restart docegest-backend && \
sudo systemctl restart nginx && \
echo "✅ Todos os serviços reiniciados!"
```

### Verificação Completa

```bash
# Testar tudo
curl -s http://localhost:8080 > /dev/null && echo "✅ Evolution API OK" || echo "❌ Evolution API FALHOU"
curl -s http://localhost:5000/api/health > /dev/null && echo "✅ Backend OK" || echo "❌ Backend FALHOU"
mysql -u docegest -p'Docegest@2025' -e "SELECT 1" > /dev/null 2>&1 && echo "✅ MySQL OK" || echo "❌ MySQL FALHOU"
curl -s http://localhost > /dev/null && echo "✅ Frontend OK" || echo "❌ Frontend FALHOU"
```

### Backup Completo

```bash
# Backup de tudo
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p ~/backups/$DATE
cd ~/evolution-api && tar -czf ~/backups/$DATE/evolution.tar.gz instances store
mysqldump -u docegest -p'Docegest@2025' segredodosabor > ~/backups/$DATE/database.sql
cp ~/.env-docegest ~/backups/$DATE/
echo "✅ Backup completo em ~/backups/$DATE"
```

---

**💡 Dica:** Salve este arquivo como referência rápida! Use `Ctrl+F` para buscar comandos específicos.

**📖 Documentação Completa:** [TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md](./TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md)
