#!/bin/bash

################################################################################
# SCRIPT DE DEPLOY AUTOMATIZADO - SEGREDO DO SABOR v5.0
# Microsoft Azure - Ubuntu 22.04 LTS
# 
# USO: sudo bash deploy-azure.sh
#
# Este script instala e configura:
# - Node.js 18 LTS
# - MySQL 8.0
# - Nginx
# - Docker + Evolution API
# - PM2
# - Backend + Frontend
################################################################################

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se é root
if [ "$EUID" -ne 0 ]; then 
    print_error "Execute como root: sudo bash deploy-azure.sh"
    exit 1
fi

# Banner
clear
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         SEGREDO DO SABOR v5.0 - DEPLOY AZURE             ║
║                                                           ║
║              Script de Instalação Automática             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# Coletar informações
print_header "CONFIGURAÇÕES INICIAIS"

echo "📧 Email para notificações SSL:"
read -p "Digite seu email: " EMAIL

echo ""
echo "💡 Dica: Pressione Enter para usar valores padrão"
echo ""

# Usar valores padrão conforme especificado
MYSQL_ROOT_PASS="P@\$\$w0rd"
MYSQL_USER_PASS="P@\$\$w0rd"
WHATSAPP_PHONE="5511967696744"

echo "✅ Senha MySQL: P@\$\$w0rd (padrão)"
echo "✅ WhatsApp: +55 11 96769-6744 (padrão)"

read -p "Digite o domínio (ou pressione Enter para usar IP): " DOMAIN

# Validar inputs
if [ -z "$EMAIL" ]; then
    print_warning "Email não fornecido - SSL não será configurado automaticamente"
    EMAIL="admin@segredodosabor.com"
fi

print_success "Configurações coletadas!"
echo ""
echo "📋 Resumo:"
echo "  • Email: $EMAIL"
echo "  • Senha MySQL: P@\$\$w0rd"
echo "  • WhatsApp: +55 11 96769-6744"
if [ -n "$DOMAIN" ]; then
    echo "  • Domínio: $DOMAIN"
else
    echo "  • Usando IP público (sem domínio)"
fi
echo ""
read -p "Pressione Enter para continuar..."
sleep 1

# Obter IP público
PUBLIC_IP=$(curl -s ifconfig.me)
print_info "IP Público detectado: $PUBLIC_IP"

# Usar domínio ou IP
if [ -z "$DOMAIN" ]; then
    SERVER_NAME=$PUBLIC_IP
    USE_SSL=false
else
    SERVER_NAME=$DOMAIN
    USE_SSL=true
fi

print_success "Configurações coletadas!"
sleep 2

################################################################################
# 1. ATUALIZAR SISTEMA
################################################################################

print_header "1/10 - ATUALIZANDO SISTEMA"

export DEBIAN_FRONTEND=noninteractive

apt update -qq
apt upgrade -y -qq
apt install -y -qq curl wget git unzip software-properties-common

print_success "Sistema atualizado!"

################################################################################
# 2. INSTALAR NODE.JS
################################################################################

print_header "2/10 - INSTALANDO NODE.JS 18 LTS"

if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
    apt install -y -qq nodejs
    print_success "Node.js $(node --version) instalado!"
else
    print_info "Node.js já instalado: $(node --version)"
fi

# Instalar PM2
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 --silent
    print_success "PM2 instalado!"
else
    print_info "PM2 já instalado"
fi

################################################################################
# 3. INSTALAR MYSQL
################################################################################

print_header "3/10 - INSTALANDO MYSQL 8.0"

if ! command -v mysql &> /dev/null; then
    # Pré-configurar senha do MySQL
    debconf-set-selections <<< "mysql-server mysql-server/root_password password $MYSQL_ROOT_PASS"
    debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PASS"
    
    apt install -y -qq mysql-server
    
    # Iniciar MySQL
    systemctl start mysql
    systemctl enable mysql
    
    print_success "MySQL instalado!"
else
    print_info "MySQL já instalado"
fi

# Criar banco de dados
print_info "Criando banco de dados..."

mysql -u root -p"$MYSQL_ROOT_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'segredo_user'@'localhost' IDENTIFIED BY '$MYSQL_USER_PASS';
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';
FLUSH PRIVILEGES;
EOF

print_success "Banco de dados criado!"

################################################################################
# 4. INSTALAR NGINX
################################################################################

print_header "4/10 - INSTALANDO NGINX"

if ! command -v nginx &> /dev/null; then
    apt install -y -qq nginx
    systemctl start nginx
    systemctl enable nginx
    print_success "Nginx instalado!"
else
    print_info "Nginx já instalado"
fi

################################################################################
# 5. INSTALAR DOCKER
################################################################################

print_header "5/10 - INSTALANDO DOCKER"

if ! command -v docker &> /dev/null; then
    # Adicionar repositório Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt update -qq
    apt install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Adicionar usuário ao grupo docker
    usermod -aG docker $SUDO_USER
    
    print_success "Docker instalado!"
else
    print_info "Docker já instalado"
fi

################################################################################
# 6. CONFIGURAR DIRETÓRIOS
################################################################################

print_header "6/10 - CONFIGURANDO DIRETÓRIOS"

# Criar diretório da aplicação
mkdir -p /var/www/segredodosabor
chown -R $SUDO_USER:$SUDO_USER /var/www/segredodosabor

# Criar diretório de backups
mkdir -p /opt/backups
chown -R $SUDO_USER:$SUDO_USER /opt/backups

# Criar diretório de logs PM2
mkdir -p /var/log/pm2
chown -R $SUDO_USER:$SUDO_USER /var/log/pm2

print_success "Diretórios criados!"

################################################################################
# 7. INSTALAR EVOLUTION API
################################################################################

print_header "7/10 - INSTALANDO EVOLUTION API"

# Parar container antigo se existir
docker rm -f evolution-api 2>/dev/null || true

# Criar diretório de dados
mkdir -p /home/$SUDO_USER/evolution-data
chown -R $SUDO_USER:$SUDO_USER /home/$SUDO_USER/evolution-data

# Executar container
docker run -d \
  --name evolution-api \
  --restart unless-stopped \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=segredodosabor2025 \
  -v /home/$SUDO_USER/evolution-data:/evolution/instances \
  atendai/evolution-api:latest

if [ $? -eq 0 ]; then
    print_success "Evolution API instalada!"
    print_info "Aguardando inicialização..."
    sleep 10
else
    print_warning "Evolution API falhou (não crítico, pode configurar depois)"
fi

################################################################################
# 8. CONFIGURAR FIREWALL
################################################################################

print_header "8/10 - CONFIGURANDO FIREWALL"

# Instalar UFW se não existir
if ! command -v ufw &> /dev/null; then
    apt install -y -qq ufw
fi

# Configurar regras
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

print_success "Firewall configurado!"

################################################################################
# 9. GERAR ARQUIVOS DE CONFIGURAÇÃO
################################################################################

print_header "9/10 - GERANDO CONFIGURAÇÕES"

# Gerar JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Criar .env do backend
cat > /var/www/segredodosabor/.env.backend << EOF
# Ambiente
NODE_ENV=production

# Servidor
PORT=5000
HOST=0.0.0.0

# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=segredodosabor
DB_USER=segredo_user
DB_PASSWORD=$MYSQL_USER_PASS

# JWT
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://$SERVER_NAME

# Upload
UPLOAD_DIR=./storage
MAX_FILE_SIZE=5242880

# WhatsApp - Evolution API
WHATSAPP_PROVIDER=evolution
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=segredodosabor2025
EVOLUTION_INSTANCE=segredodosabor
WHATSAPP_BUSINESS_PHONE=$WHATSAPP_PHONE
EOF

# Criar .env do frontend
cat > /var/www/segredodosabor/.env.frontend << EOF
REACT_APP_API_URL=https://$SERVER_NAME/api
NODE_ENV=production
EOF

# Configuração do Nginx
cat > /etc/nginx/sites-available/segredodosabor << 'NGINXCONF'
upstream backend_api {
    server localhost:5000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    
    server_name SERVER_NAME_PLACEHOLDER;
    
    access_log /var/log/nginx/segredodosabor-access.log;
    error_log /var/log/nginx/segredodosabor-error.log;
    
    client_max_body_size 5M;
    
    root /var/www/segredodosabor/frontend/build;
    index index.html;
    
    # Headers de Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # API Backend
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
    
    # Static files com cache
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router - SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
NGINXCONF

# Substituir placeholder
sed -i "s/SERVER_NAME_PLACEHOLDER/$SERVER_NAME/g" /etc/nginx/sites-available/segredodosabor

# Ativar site
ln -sf /etc/nginx/sites-available/segredodosabor /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
if nginx -t > /dev/null 2>&1; then
    systemctl restart nginx
    print_success "Nginx configurado!"
else
    print_error "Erro na configuração do Nginx"
    nginx -t
fi

################################################################################
# 10. CRIAR SCRIPT DE BACKUP
################################################################################

print_header "10/10 - CONFIGURANDO BACKUP AUTOMÁTICO"

cat > /opt/backups/backup-segredo.sh << 'BACKUPSCRIPT'
#!/bin/bash

BACKUP_DIR="/opt/backups"
DB_NAME="segredodosabor"
DB_USER="segredo_user"
DB_PASS="DB_PASS_PLACEHOLDER"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR/$DATE"

echo "Fazendo backup do banco de dados..."
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > "$BACKUP_DIR/$DATE/database_$DATE.sql.gz"

echo "Fazendo backup dos arquivos..."
tar -czf "$BACKUP_DIR/$DATE/files_$DATE.tar.gz" /var/www/segredodosabor/backend/storage 2>/dev/null || true

echo "Fazendo backup das configurações..."
cp /var/www/segredodosabor/.env.backend "$BACKUP_DIR/$DATE/backend.env" 2>/dev/null || true
cp /var/www/segredodosabor/.env.frontend "$BACKUP_DIR/$DATE/frontend.env" 2>/dev/null || true

echo "Removendo backups antigos..."
find $BACKUP_DIR -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true

echo "Backup concluído: $BACKUP_DIR/$DATE"
BACKUPSCRIPT

# Substituir senha
sed -i "s/DB_PASS_PLACEHOLDER/$MYSQL_USER_PASS/g" /opt/backups/backup-segredo.sh

chmod +x /opt/backups/backup-segredo.sh

# Agendar backup diário (3h da manhã)
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/backups/backup-segredo.sh >> /var/log/backup-segredo.log 2>&1") | crontab -

print_success "Backup automático configurado!"

################################################################################
# FINALIZAÇÃO
################################################################################

print_header "INSTALAÇÃO CONCLUÍDA!"

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║           ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!           ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}\n"

print_info "PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  FAZER UPLOAD DO CÓDIGO:"
echo "   cd /var/www/segredodosabor"
echo "   # Fazer upload via SCP/Git dos diretórios backend/ e frontend/"
echo ""
echo "2️⃣  CONFIGURAR BACKEND:"
echo "   cd /var/www/segredodosabor/backend"
echo "   cp /var/www/segredodosabor/.env.backend .env"
echo "   npm install"
echo ""
echo "3️⃣  IMPORTAR BANCO DE DADOS:"
echo "   cd /var/www/segredodosabor"
echo "   sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < BANCO_DADOS_COMPLETO.sql"
echo "   sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < criar-tabela-mensagens-whatsapp-completa.sql"
echo ""
echo "4️⃣  INICIAR BACKEND:"
echo "   cd /var/www/segredodosabor/backend"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "5️⃣  CONFIGURAR FRONTEND:"
echo "   cd /var/www/segredodosabor/frontend"
echo "   cp /var/www/segredodosabor/.env.frontend .env"
echo "   npm install"
echo "   npm run build"
echo ""

if [ "$USE_SSL" = true ]; then
    echo "6️⃣  CONFIGURAR SSL (HTTPS):"
    echo "   apt install -y certbot python3-certbot-nginx"
    echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive"
    echo ""
fi

echo "7️⃣  CONFIGURAR WHATSAPP:"
echo "   # Criar túnel SSH:"
echo "   ssh -L 8080:localhost:8080 $SUDO_USER@$PUBLIC_IP"
echo "   # Acessar: http://localhost:8080"
echo "   # Criar instância e escanear QR Code"
echo ""

print_info "INFORMAÇÕES DO SISTEMA:"
echo ""
echo "🌐 URL: http://$SERVER_NAME"
if [ "$USE_SSL" = true ]; then
    echo "🔒 HTTPS: https://$SERVER_NAME (após configurar SSL)"
fi
echo "📱 IP Público: $PUBLIC_IP"
echo ""
echo "🗄️  MySQL:"
echo "   Host: localhost"
echo "   Database: segredodosabor"
echo "   User: segredo_user"
echo "   Password: P@\$\$w0rd"
echo ""
echo "🔑 Arquivos de configuração:"
echo "   Backend .env: /var/www/segredodosabor/.env.backend"
echo "   Frontend .env: /var/www/segredodosabor/.env.frontend"
echo ""
echo "📊 Monitoramento:"
echo "   PM2: pm2 status"
echo "   Logs: pm2 logs"
echo "   Nginx: systemctl status nginx"
echo ""
echo "💾 Backup automático:"
echo "   Script: /opt/backups/backup-segredo.sh"
echo "   Horário: Todo dia às 3h da manhã"
echo "   Localização: /opt/backups/"
echo ""

print_success "Sistema pronto para receber o código da aplicação!"
print_info "Consulte TUTORIAL_DEPLOY_AZURE.md para instruções detalhadas"

echo ""
