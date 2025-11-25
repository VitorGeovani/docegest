# 🚀 SCRIPT DE CONTINUAÇÃO DO DEPLOY - PARTE 2

## COMANDOS PARA EXECUTAR AGORA

### 1️⃣ Enviar Frontend (sem node_modules - mais rápido)

**No PowerShell do Windows:**

```powershell
cd D:\Downloads\Segredo-do-Sabor

# Enviar apenas arquivos necessários do frontend (sem node_modules)
scp -i D:\Downloads\segredo-sabor-key.pem -r frontend/src frontend/public frontend/package.json frontend/.gitignore frontend/README.md azureuser@20.163.57.236:~/frontend-files/
```

**OU se tiver o frontend.zip:**

```powershell
scp -i D:\Downloads\segredo-sabor-key.pem frontend.zip azureuser@20.163.57.236:~/
```

---

### 2️⃣ Conectar ao Servidor

```powershell
ssh -i D:\Downloads\segredo-sabor-key.pem azureuser@20.163.57.236
```

---

### 3️⃣ Corrigir Senha do MySQL

```bash
# O MySQL foi instalado mas a senha precisa ser configurada
sudo mysql

# Dentro do MySQL, execute:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@$$w0rd';
CREATE DATABASE IF NOT EXISTS segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'segredo_user'@'localhost' IDENTIFIED BY 'P@$$w0rd';
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### 4️⃣ Mover Arquivos

```bash
# Criar estrutura se não existir
sudo mkdir -p /var/www/segredodosabor

# Mover backend
sudo mv ~/backend /var/www/segredodosabor/

# Mover frontend (se usou ZIP)
cd ~
unzip frontend.zip -d /tmp/
sudo mv /tmp/frontend /var/www/segredodosabor/

# OU se enviou arquivos separados:
sudo mkdir -p /var/www/segredodosabor/frontend
sudo mv ~/frontend-files/* /var/www/segredodosabor/frontend/

# Mover SQL
sudo mv ~/INSTALACAO_BANCO_COMPLETO.sql /var/www/segredodosabor/

# Mover script nginx
sudo mv ~/configurar-nginx.sh /var/www/segredodosabor/

# Ajustar permissões
sudo chown -R azureuser:azureuser /var/www/segredodosabor
```

---

### 5️⃣ Importar Banco de Dados

```bash
cd /var/www/segredodosabor
mysql -usegredo_user -p'P@$$w0rd' segredodosabor < INSTALACAO_BANCO_COMPLETO.sql

# Verificar
mysql -usegredo_user -p'P@$$w0rd' segredodosabor -e "SHOW TABLES;"
```

**✅ Deve mostrar 21 tabelas!**

---

### 6️⃣ Configurar Backend

```bash
cd /var/www/segredodosabor/backend

# Copiar .env
cp /var/www/segredodosabor/.env.backend .env

# Instalar dependências
npm install --production

# Criar pasta de uploads
mkdir -p uploads

# Verificar se PM2 está instalado
which pm2

# Se não estiver, instalar:
sudo npm install -g pm2

# Iniciar backend
pm2 delete segredo-backend 2>/dev/null || true
pm2 start src/server.js --name segredo-backend
pm2 save

# Configurar auto-start
pm2 startup
# COPIE E COLE o comando que aparecer (sudo env PATH=...)

# Verificar logs
pm2 logs segredo-backend --lines 20
```

---

### 7️⃣ Configurar Frontend

```bash
cd /var/www/segredodosabor/frontend

# Copiar .env
cp /var/www/segredodosabor/.env.frontend .env

# Verificar se package.json existe
ls -la package.json

# Instalar dependências
npm install

# Buildar
npm run build

# Ajustar permissões
sudo chown -R www-data:www-data build/
```

---

### 8️⃣ Configurar Nginx

```bash
cd /var/www/segredodosabor
sudo bash configurar-nginx.sh
```

---

### 9️⃣ Configurar Evolution API (WhatsApp Bot)

```bash
# Instalar Docker Compose se não estiver instalado
sudo apt install docker-compose -y

# Criar docker-compose para Evolution API
cd ~
cat > docker-compose-evolution.yml <<'EOF'
version: '3.8'

services:
  evolution-api:
    image: atendai/evolution-api:v2.0.0
    container_name: evolution-api
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      # Configurações básicas
      PORT: 8080
      
      # Autenticação
      AUTHENTICATION_API_KEY: segredodosabor2025
      
      # WhatsApp
      INSTANCE_MAX_RETRY_QR: 5
      QRCODE_LIMIT: 30
      
      # Webhook
      WEBHOOK_GLOBAL_ENABLED: true
      WEBHOOK_GLOBAL_URL: http://host.docker.internal:5000/whatsapp/webhook
      WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS: true
      
      # Logs
      LOG_LEVEL: info
      LOG_COLOR: true
      
      # Database (SQLite local)
      DATABASE_ENABLED: true
      DATABASE_PROVIDER: sqlite
      DATABASE_SQLITE_NAME: evolution.db
      
    volumes:
      - evolution_data:/evolution/instances
      - evolution_db:/evolution/store
    
    networks:
      - evolution-network
    
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  evolution_data:
  evolution_db:

networks:
  evolution-network:
    driver: bridge
EOF

# Iniciar Evolution API
sudo docker-compose -f docker-compose-evolution.yml up -d

# Verificar se está rodando
sudo docker ps

# Ver logs
sudo docker logs evolution-api

# Aguardar 30 segundos para inicializar
sleep 30
```

---

### 🔟 Criar Instância WhatsApp

```bash
# Criar instância via API
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: segredodosabor2025" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "segredodosabor",
    "token": "segredodosabor2025",
    "qrcode": true,
    "number": "5511967696744",
    "webhookUrl": "http://host.docker.internal:5000/whatsapp/webhook",
    "webhookEvents": ["messages.upsert"]
  }'
```

---

### 1️⃣1️⃣ Conectar QR Code WhatsApp

**Criar túnel SSH do seu PC para ver o QR Code:**

```powershell
# No PowerShell do Windows:
ssh -i D:\Downloads\segredo-sabor-key.pem -L 8080:localhost:8080 azureuser@20.163.57.236
```

**Depois abra no navegador:**
```
http://localhost:8080
```

**OU obtenha o QR Code via API:**

```bash
# No servidor, execute:
curl -X GET http://localhost:8080/instance/connect/segredodosabor \
  -H "apikey: segredodosabor2025"
```

**Escaneie o QR Code com o WhatsApp +55 11 96769-6744**

---

### 1️⃣2️⃣ Verificar Status Final

```bash
# Status dos serviços
echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager | head -10

echo ""
echo "=== MySQL Status ==="
sudo systemctl status mysql --no-pager | head -10

echo ""
echo "=== Docker/Evolution Status ==="
sudo docker ps

echo ""
echo "=== Testar Backend ==="
curl http://localhost:5000/

echo ""
echo "=== Testar via Nginx ==="
curl http://20.163.57.236/api/

echo ""
echo "=== Testar Evolution API ==="
curl http://localhost:8080/instance/fetchInstances \
  -H "apikey: segredodosabor2025"
```

---

### 1️⃣3️⃣ Configurar Webhook no Backend

```bash
# Verificar se o backend está recebendo webhooks
tail -f /var/www/segredodosabor/backend/logs/whatsapp.log

# OU ver logs do PM2
pm2 logs segredo-backend | grep -i webhook
```

---

## 🌐 TESTAR NO NAVEGADOR

**Abra no navegador do seu PC:**

- **Frontend**: http://20.163.57.236
- **Admin**: http://20.163.57.236/gerenciamentos
- **API**: http://20.163.57.236/api

**Login Admin:**
- Email: admin@segredodosabor.com
- Senha: Admin@123

---

## 📱 TESTAR WHATSAPP BOT

**Envie mensagem para:** +55 11 96769-6744

**Comandos disponíveis:**
- `cardapio` - Ver produtos
- `pedido` - Fazer pedido
- `status PED000001` - Consultar status
- `ajuda` - Ver comandos

---

## 🆘 TROUBLESHOOTING

### Backend não inicia

```bash
cd /var/www/segredodosabor/backend
pm2 logs segredo-backend
cat .env
node src/server.js
```

### Evolution API não conecta

```bash
sudo docker logs evolution-api
sudo docker restart evolution-api

# Recriar instância
curl -X DELETE http://localhost:8080/instance/logout/segredodosabor \
  -H "apikey: segredodosabor2025"
```

### Nginx erro 502

```bash
pm2 restart segredo-backend
sudo systemctl restart nginx
```

---

## ✅ CHECKLIST FINAL

- [ ] MySQL rodando e banco importado
- [ ] Backend rodando (pm2 status)
- [ ] Frontend buildado
- [ ] Nginx configurado
- [ ] Evolution API rodando (docker ps)
- [ ] WhatsApp conectado (QR Code escaneado)
- [ ] Frontend abre no navegador
- [ ] Login admin funciona
- [ ] WhatsApp Bot responde mensagens

---

**🎉 SISTEMA COMPLETO E FUNCIONANDO!** 🚀
