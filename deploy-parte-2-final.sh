#!/bin/bash

###############################################################################
# SCRIPT FINAL DE DEPLOY - PARTE 2
# Segredo do Sabor v5.0 - Continuação
###############################################################################

set -e

echo "=========================================="
echo "🚀 DEPLOY PARTE 2 - CONFIGURAÇÃO FINAL"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "${GREEN}[PASSO $1]${NC} $2"
}

###############################################################################
# PASSO 1: Corrigir MySQL (se necessário)
###############################################################################
print_step "1" "Verificando MySQL..."

# Tentar conectar com root sem senha (instalação padrão Ubuntu)
if sudo mysql -e "SELECT 1;" 2>/dev/null; then
    echo "✅ MySQL acessível via sudo"
    
    # Configurar senha e criar banco
    sudo mysql <<MYSQL_SCRIPT
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@\$\$w0rd';
CREATE DATABASE IF NOT EXISTS segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'segredo_user'@'localhost' IDENTIFIED BY 'P@\$\$w0rd';
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT
    
    echo "✅ MySQL configurado!"
else
    echo "⚠️  MySQL já configurado ou precisa de ajuste manual"
fi

echo ""

###############################################################################
# PASSO 2: Mover Arquivos
###############################################################################
print_step "2" "Movendo arquivos para /var/www/segredodosabor..."

# Criar estrutura
sudo mkdir -p /var/www/segredodosabor/frontend/build

# Mover backend (se existir em ~)
if [ -d ~/backend ]; then
    sudo mv ~/backend /var/www/segredodosabor/ 2>/dev/null || true
fi

# Mover frontend build
if [ -d ~/frontend-build ]; then
    sudo cp -r ~/frontend-build/* /var/www/segredodosabor/frontend/build/
fi

# Mover SQL
if [ -f ~/INSTALACAO_BANCO_COMPLETO.sql ]; then
    sudo mv ~/INSTALACAO_BANCO_COMPLETO.sql /var/www/segredodosabor/
fi

# Mover script nginx
if [ -f ~/configurar-nginx.sh ]; then
    sudo mv ~/configurar-nginx.sh /var/www/segredodosabor/
fi

# Ajustar permissões
sudo chown -R azureuser:azureuser /var/www/segredodosabor

echo "✅ Arquivos movidos!"
echo ""

###############################################################################
# PASSO 3: Importar Banco de Dados
###############################################################################
print_step "3" "Importando banco de dados..."

cd /var/www/segredodosabor

if [ -f INSTALACAO_BANCO_COMPLETO.sql ]; then
    mysql -usegredo_user -p'P@$$w0rd' segredodosabor < INSTALACAO_BANCO_COMPLETO.sql
    
    # Verificar
    TABLES=$(mysql -usegredo_user -p'P@$$w0rd' segredodosabor -e "SHOW TABLES;" | wc -l)
    echo "✅ Banco importado! $TABLES tabelas criadas"
else
    echo "⚠️  Arquivo SQL não encontrado. Pule esta etapa se já foi importado."
fi

echo ""

###############################################################################
# PASSO 4: Configurar Backend
###############################################################################
print_step "4" "Configurando backend..."

cd /var/www/segredodosabor/backend

# Copiar .env se existir
if [ -f /var/www/segredodosabor/.env.backend ]; then
    cp /var/www/segredodosabor/.env.backend .env
else
    # Criar .env na hora
    cat > .env <<'EOF'
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://20.163.57.236

DB_HOST=localhost
DB_USER=segredo_user
DB_PASSWORD=P@$$w0rd
DB_NAME=segredodosabor
DB_PORT=3306
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

JWT_SECRET=segredo_do_sabor_super_secret_key_2025_azure_deploy_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=segredo_do_sabor_refresh_token_secret_key_2025
JWT_REFRESH_EXPIRES_IN=30d

EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=segredodosabor2025
WHATSAPP_INSTANCE_NAME=segredodosabor
WHATSAPP_PHONE=5511967696744

MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

CORS_ORIGIN=http://20.163.57.236
LOG_LEVEL=info
EOF
fi

# Instalar dependências
echo "📦 Instalando dependências do backend (pode demorar)..."
npm install --production --silent

# Criar pasta de uploads
mkdir -p uploads

# Instalar PM2 globalmente se não estiver instalado
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    sudo npm install -g pm2 --silent
fi

# Parar instância anterior se existir
pm2 delete segredo-backend 2>/dev/null || true

# Iniciar backend
pm2 start src/server.js --name segredo-backend
pm2 save

echo "✅ Backend configurado e rodando!"
echo ""

###############################################################################
# PASSO 5: Configurar Nginx
###############################################################################
print_step "5" "Configurando Nginx..."

cd /var/www/segredodosabor

if [ -f configurar-nginx.sh ]; then
    sudo bash configurar-nginx.sh
else
    echo "⚠️  Script de configuração Nginx não encontrado. Configurando manualmente..."
    
    # Criar configuração Nginx
    sudo tee /etc/nginx/sites-available/segredodosabor > /dev/null <<'NGINX_CONFIG'
server {
    listen 80;
    server_name 20.163.57.236;

    access_log /var/log/nginx/segredodosabor-access.log;
    error_log /var/log/nginx/segredodosabor-error.log;

    root /var/www/segredodosabor/frontend/build;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /uploads {
        alias /var/www/segredodosabor/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location ~ /\. {
        deny all;
    }
}
NGINX_CONFIG

    # Ativar site
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo ln -sf /etc/nginx/sites-available/segredodosabor /etc/nginx/sites-enabled/
    
    # Testar e reiniciar
    sudo nginx -t && sudo systemctl restart nginx
fi

echo "✅ Nginx configurado!"
echo ""

###############################################################################
# PASSO 6: Instalar Docker Compose (se necessário)
###############################################################################
print_step "6" "Verificando Docker Compose..."

if ! command -v docker-compose &> /dev/null; then
    echo "📦 Instalando Docker Compose..."
    sudo apt install docker-compose -y
fi

echo "✅ Docker Compose pronto!"
echo ""

###############################################################################
# PASSO 7: Configurar Evolution API
###############################################################################
print_step "7" "Configurando Evolution API (WhatsApp Bot)..."

cd ~

# Criar docker-compose
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
      PORT: 8080
      AUTHENTICATION_API_KEY: segredodosabor2025
      INSTANCE_MAX_RETRY_QR: 5
      QRCODE_LIMIT: 30
      WEBHOOK_GLOBAL_ENABLED: true
      WEBHOOK_GLOBAL_URL: http://host.docker.internal:5000/whatsapp/webhook
      WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS: true
      LOG_LEVEL: info
      LOG_COLOR: true
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

# Parar containers antigos
sudo docker-compose -f docker-compose-evolution.yml down 2>/dev/null || true

# Iniciar Evolution API
echo "🚀 Iniciando Evolution API..."
sudo docker-compose -f docker-compose-evolution.yml up -d

# Aguardar inicialização
echo "⏳ Aguardando Evolution API inicializar (30 segundos)..."
sleep 30

echo "✅ Evolution API rodando!"
echo ""

###############################################################################
# PASSO 8: Criar Instância WhatsApp
###############################################################################
print_step "8" "Criando instância WhatsApp..."

# Tentar criar instância
RESPONSE=$(curl -s -X POST http://localhost:8080/instance/create \
  -H "apikey: segredodosabor2025" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "segredodosabor",
    "token": "segredodosabor2025",
    "qrcode": true,
    "number": "5511967696744"
  }')

echo "Resposta da API: $RESPONSE"

echo "✅ Instância criada! Use túnel SSH para ver QR Code"
echo ""

###############################################################################
# INFORMAÇÕES FINAIS
###############################################################################
echo ""
echo "=========================================="
echo "✅ DEPLOY COMPLETO!"
echo "=========================================="
echo ""
echo "📊 Status dos Serviços:"
echo ""

# PM2
echo "=== PM2 ==="
pm2 status

echo ""

# Nginx
echo "=== Nginx ==="
sudo systemctl status nginx --no-pager | head -5

echo ""

# MySQL
echo "=== MySQL ==="
sudo systemctl status mysql --no-pager | head -5

echo ""

# Docker
echo "=== Docker/Evolution ==="
sudo docker ps

echo ""
echo "=========================================="
echo "🌐 ACESSE O SISTEMA:"
echo "=========================================="
echo ""
echo "Frontend: http://20.163.57.236"
echo "Admin: http://20.163.57.236/gerenciamentos"
echo "API: http://20.163.57.236/api"
echo ""
echo "Login Admin:"
echo "  Email: admin@segredodosabor.com"
echo "  Senha: Admin@123"
echo ""
echo "=========================================="
echo "📱 WHATSAPP BOT:"
echo "=========================================="
echo ""
echo "Para conectar WhatsApp, execute no seu PC:"
echo ""
echo "ssh -i D:\\Downloads\\segredo-sabor-key.pem -L 8080:localhost:8080 azureuser@20.163.57.236"
echo ""
echo "Depois abra: http://localhost:8080"
echo ""
echo "Ou obtenha QR Code via API:"
echo "curl http://localhost:8080/instance/connect/segredodosabor -H 'apikey: segredodosabor2025'"
echo ""
echo "=========================================="
echo "🎉 TUDO PRONTO PARA APRESENTAÇÃO!"
echo "=========================================="
