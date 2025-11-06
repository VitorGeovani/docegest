#!/bin/bash

################################################################################
# DEPLOY SUPER RÁPIDO - AZURE EDUCACIONAL
# Segredo do Sabor v5.0
# 
# USO: sudo bash deploy-rapido.sh SEU_IP_PUBLICO
# 
# Exemplo: sudo bash deploy-rapido.sh 20.206.123.45
################################################################################

set -e

# Verificar se é root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Execute como root: sudo bash deploy-rapido.sh SEU_IP"
    exit 1
fi

# Verificar se IP foi fornecido
if [ -z "$1" ]; then
    echo "❌ Uso: sudo bash deploy-rapido.sh SEU_IP_PUBLICO"
    echo "Exemplo: sudo bash deploy-rapido.sh 20.206.123.45"
    exit 1
fi

PUBLIC_IP=$1

# Credenciais padrão
MYSQL_PASS="P@\$\$w0rd"
WHATSAPP="5511967696744"

clear
echo "╔══════════════════════════════════════════════════════╗"
echo "║  SEGREDO DO SABOR v5.0 - DEPLOY RÁPIDO AZURE        ║"
echo "║  Deploy 100% automático em ~15 minutos              ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "📋 Configurações:"
echo "  • IP: $PUBLIC_IP"
echo "  • MySQL: segredo_user / P@\$\$w0rd"
echo "  • WhatsApp: +55 11 96769-6744"
echo ""
read -p "Pressione Enter para iniciar..."

################################################################################
# 1. ATUALIZAR SISTEMA
################################################################################

echo ""
echo "⏳ [1/8] Atualizando sistema..."
export DEBIAN_FRONTEND=noninteractive
apt update -qq
apt upgrade -y -qq
apt install -y -qq curl wget git unzip nano htop

echo "✅ Sistema atualizado!"

################################################################################
# 2. INSTALAR NODE.JS
################################################################################

echo ""
echo "⏳ [2/8] Instalando Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
    apt install -y -qq nodejs
fi
npm install -g pm2 --silent
echo "✅ Node.js $(node --version) + PM2 instalados!"

################################################################################
# 3. INSTALAR MYSQL
################################################################################

echo ""
echo "⏳ [3/8] Instalando MySQL 8.0..."
if ! command -v mysql &> /dev/null; then
    debconf-set-selections <<< "mysql-server mysql-server/root_password password $MYSQL_PASS"
    debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $MYSQL_PASS"
    apt install -y -qq mysql-server
    systemctl start mysql
    systemctl enable mysql
fi

# Criar banco e usuário
mysql -u root -p"$MYSQL_PASS" <<EOF 2>/dev/null
CREATE DATABASE IF NOT EXISTS segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'segredo_user'@'localhost' IDENTIFIED BY '$MYSQL_PASS';
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "✅ MySQL instalado e configurado!"

################################################################################
# 4. INSTALAR NGINX
################################################################################

echo ""
echo "⏳ [4/8] Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y -qq nginx
    systemctl start nginx
    systemctl enable nginx
fi
echo "✅ Nginx instalado!"

################################################################################
# 5. INSTALAR DOCKER
################################################################################

echo ""
echo "⏳ [5/8] Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh > /dev/null 2>&1
    usermod -aG docker $SUDO_USER
fi
echo "✅ Docker instalado!"

################################################################################
# 6. CRIAR ESTRUTURA
################################################################################

echo ""
echo "⏳ [6/8] Criando estrutura de diretórios..."

mkdir -p /var/www/segredodosabor
mkdir -p /opt/backups
mkdir -p /var/log/pm2
chown -R $SUDO_USER:$SUDO_USER /var/www/segredodosabor
chown -R $SUDO_USER:$SUDO_USER /opt/backups
chown -R $SUDO_USER:$SUDO_USER /var/log/pm2

echo "✅ Diretórios criados!"

################################################################################
# 7. CONFIGURAR NGINX
################################################################################

echo ""
echo "⏳ [7/8] Configurando Nginx..."

cat > /etc/nginx/sites-available/segredodosabor << 'NGINXCONF'
upstream backend_api {
    server localhost:5000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    access_log /var/log/nginx/segredodosabor-access.log;
    error_log /var/log/nginx/segredodosabor-error.log;
    
    client_max_body_size 5M;
    
    root /var/www/segredodosabor/frontend/build;
    index index.html;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location /api {
        rewrite ^/api/(.*)$ /$1 break;
        
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        proxy_cache_bypass $http_upgrade;
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
NGINXCONF

ln -sf /etc/nginx/sites-available/segredodosabor /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo "✅ Nginx configurado!"

################################################################################
# 8. GERAR .ENV
################################################################################

echo ""
echo "⏳ [8/8] Gerando arquivos de configuração..."

JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH=$(openssl rand -base64 32)

# Backend .env
cat > /var/www/segredodosabor/.env.backend << EOF
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=segredodosabor
DB_USER=segredo_user
DB_PASSWORD=$MYSQL_PASS

JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://$PUBLIC_IP

UPLOAD_DIR=./storage
MAX_FILE_SIZE=5242880

WHATSAPP_PROVIDER=evolution
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=segredodosabor2025
EVOLUTION_INSTANCE=segredodosabor
WHATSAPP_BUSINESS_PHONE=$WHATSAPP
EOF

# Frontend .env
cat > /var/www/segredodosabor/.env.frontend << EOF
REACT_APP_API_URL=http://$PUBLIC_IP/api
NODE_ENV=production
EOF

# Script de backup
cat > /opt/backups/backup.sh << 'BACKUP'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p /opt/backups/$DATE
mysqldump -u segredo_user -pP@\$\$w0rd segredodosabor | gzip > /opt/backups/$DATE/db.sql.gz
tar -czf /opt/backups/$DATE/files.tar.gz /var/www/segredodosabor/backend/storage 2>/dev/null
find /opt/backups -type d -mtime +7 -exec rm -rf {} + 2>/dev/null
BACKUP

chmod +x /opt/backups/backup.sh
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/backups/backup.sh") | crontab -

echo "✅ Configurações geradas!"

################################################################################
# FINALIZAR
################################################################################

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!               ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  FAZER UPLOAD DO CÓDIGO (do seu PC):"
echo ""
echo "    # Compactar"
echo "    cd D:\\Downloads\\Segredo-do-Sabor"
echo "    tar -czf app.tar.gz backend frontend *.sql"
echo ""
echo "    # Enviar"
echo "    scp -i chave.pem app.tar.gz azureuser@$PUBLIC_IP:~/"
echo ""
echo "2️⃣  EXTRAIR E CONFIGURAR (na VM):"
echo ""
echo "    cd /var/www/segredodosabor"
echo "    sudo tar -xzf ~/app.tar.gz"
echo "    sudo chown -R azureuser:azureuser ."
echo ""
echo "3️⃣  BACKEND:"
echo ""
echo "    cd /var/www/segredodosabor/backend"
echo "    cp /var/www/segredodosabor/.env.backend .env"
echo "    npm install"
echo ""
echo "4️⃣  IMPORTAR BANCO:"
echo ""
echo "    cd /var/www/segredodosabor"
echo "    sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < BANCO_DADOS_COMPLETO.sql"
echo "    sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < criar-tabela-mensagens-whatsapp-completa.sql"
echo ""
echo "5️⃣  CRIAR ADMIN:"
echo ""
echo "    sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor << 'SQL'"
echo "    INSERT INTO cliente (nome, telefone, email, senha, tipo, ativo, criado_em) VALUES"
echo "    ('Administrador', '5511967696744', 'admin@segredodosabor.com',"
echo "    '\$2b\$10\$rKJZQY9K5F8vXr5h.X6t3.jN1ZGy7hD8kP0mNxQ6fW8zL9vE4tC2S',"
echo "    'admin', 1, NOW());"
echo "    SQL"
echo ""
echo "6️⃣  INICIAR BACKEND:"
echo ""
echo "    cd /var/www/segredodosabor/backend"
echo "    pm2 start src/server.js --name segredo-backend"
echo "    pm2 save"
echo "    pm2 startup"
echo "    # Executar comando que aparecer"
echo ""
echo "7️⃣  FRONTEND:"
echo ""
echo "    cd /var/www/segredodosabor/frontend"
echo "    cp /var/www/segredodosabor/.env.frontend .env"
echo "    npm install"
echo "    npm run build"
echo "    sudo chown -R www-data:www-data build/"
echo ""
echo "8️⃣  ACESSAR:"
echo ""
echo "    🌐 http://$PUBLIC_IP"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 CREDENCIAIS:"
echo ""
echo "  Admin:"
echo "    Email: admin@segredodosabor.com"
echo "    Senha: Admin@2025"
echo ""
echo "  MySQL:"
echo "    User: segredo_user"
echo "    Pass: P@\$\$w0rd"
echo ""
echo "  WhatsApp: +55 11 96769-6744"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Infraestrutura instalada com sucesso!"
echo "⏱️  Tempo estimado para próximos passos: 10-15 minutos"
echo ""
