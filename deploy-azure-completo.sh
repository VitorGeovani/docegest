#!/bin/bash

###############################################################################
# SCRIPT DE DEPLOY COMPLETO - SEGREDO DO SABOR v5.0
# Azure VM - Ubuntu 22.04 LTS
# Execução automática de todos os passos
###############################################################################

set -e  # Parar em qualquer erro

echo "=========================================="
echo "🚀 DEPLOY SEGREDO DO SABOR v5.0 - AZURE"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções auxiliares
print_step() {
    echo -e "${GREEN}[PASSO $1]${NC} $2"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    print_error "Por favor, execute como root (sudo bash deploy-azure-completo.sh)"
    exit 1
fi

###############################################################################
# PASSO 1: ATUALIZAR SISTEMA
###############################################################################
print_step "1" "Atualizando sistema operacional..."
apt update -y
apt upgrade -y
print_success "Sistema atualizado!"
echo ""

###############################################################################
# PASSO 2: INSTALAR NODE.JS 20.x
###############################################################################
print_step "2" "Instalando Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
print_info "Node.js instalado: $(node --version)"
print_info "npm instalado: $(npm --version)"
print_success "Node.js configurado!"
echo ""

###############################################################################
# PASSO 3: INSTALAR MYSQL 8.0
###############################################################################
print_step "3" "Instalando MySQL 8.0..."
apt install -y mysql-server

# Iniciar MySQL
systemctl start mysql
systemctl enable mysql

# Configurar senha root do MySQL
print_info "Configurando senha do MySQL..."
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@\$\$w0rd';"
mysql -e "FLUSH PRIVILEGES;"

print_success "MySQL instalado e configurado!"
echo ""

###############################################################################
# PASSO 4: CRIAR BANCO DE DADOS E USUÁRIO
###############################################################################
print_step "4" "Criando banco de dados..."

mysql -uroot -p'P@$$w0rd' <<MYSQL_SCRIPT
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário
CREATE USER IF NOT EXISTS 'segredo_user'@'localhost' IDENTIFIED BY 'P@\$\$w0rd';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';

-- Aplicar mudanças
FLUSH PRIVILEGES;
MYSQL_SCRIPT

print_success "Banco de dados 'segredodosabor' criado!"
print_success "Usuário 'segredo_user' criado!"
echo ""

###############################################################################
# PASSO 5: INSTALAR NGINX
###############################################################################
print_step "5" "Instalando Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx
print_success "Nginx instalado e rodando!"
echo ""

###############################################################################
# PASSO 6: INSTALAR PM2 (Process Manager)
###############################################################################
print_step "6" "Instalando PM2..."
npm install -g pm2
print_success "PM2 instalado: $(pm2 --version)"
echo ""

###############################################################################
# PASSO 7: CRIAR ESTRUTURA DE DIRETÓRIOS
###############################################################################
print_step "7" "Criando estrutura de diretórios..."
mkdir -p /var/www/segredodosabor
mkdir -p /opt/backups
chown -R azureuser:azureuser /var/www/segredodosabor
chown -R azureuser:azureuser /opt/backups
print_success "Diretórios criados!"
echo ""

###############################################################################
# PASSO 8: CONFIGURAR FIREWALL
###############################################################################
print_step "8" "Configurando firewall UFW..."
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw allow 3306/tcp # MySQL (apenas local)
print_info "Firewall configurado (não ativado ainda para não perder SSH)"
echo ""

###############################################################################
# PASSO 9: INSTALAR DOCKER (para Evolution API)
###############################################################################
print_step "9" "Instalando Docker..."
apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt update
apt install -y docker-ce docker-ce-cli containerd.io
systemctl start docker
systemctl enable docker

# Adicionar azureuser ao grupo docker
usermod -aG docker azureuser

print_success "Docker instalado: $(docker --version)"
echo ""

###############################################################################
# PASSO 10: CRIAR SCRIPT DE BACKUP AUTOMÁTICO
###############################################################################
print_step "10" "Criando script de backup..."

cat > /opt/backups/backup-segredo.sh <<'BACKUP_SCRIPT'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
MYSQL_USER="segredo_user"
MYSQL_PASS="P@\$\$w0rd"
MYSQL_DB="segredodosabor"

# Backup banco de dados
mysqldump -u$MYSQL_USER -p$MYSQL_PASS $MYSQL_DB > $BACKUP_DIR/db_$DATE.sql

# Backup uploads (se existir)
if [ -d "/var/www/segredodosabor/backend/uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/segredodosabor/backend/uploads/
fi

# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete

echo "Backup realizado: $DATE"
BACKUP_SCRIPT

chmod +x /opt/backups/backup-segredo.sh

# Adicionar ao cron (backup diário às 2h)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backups/backup-segredo.sh >> /var/log/backup-segredo.log 2>&1") | crontab -

print_success "Script de backup criado e agendado (diário às 2h)"
echo ""

###############################################################################
# PASSO 11: CRIAR ARQUIVO .ENV PARA BACKEND
###############################################################################
print_step "11" "Criando arquivo .env para backend..."

cat > /var/www/segredodosabor/.env.backend <<'ENV_FILE'
# Ambiente
NODE_ENV=production
PORT=5000

# URL do Frontend
FRONTEND_URL=http://20.163.57.236

# Banco de Dados
DB_HOST=localhost
DB_USER=segredo_user
DB_PASSWORD=P@$$w0rd
DB_NAME=segredodosabor
DB_PORT=3306

# Pool de Conexões
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# JWT
JWT_SECRET=segredo_do_sabor_super_secret_key_2025_azure_deploy_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=segredo_do_sabor_refresh_token_secret_key_2025
JWT_REFRESH_EXPIRES_IN=30d

# WhatsApp - Evolution API
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=segredodosabor2025
WHATSAPP_INSTANCE_NAME=segredodosabor
WHATSAPP_PHONE=5511967696744

# Upload de Arquivos
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=http://20.163.57.236

# Logs
LOG_LEVEL=info
ENV_FILE

chown azureuser:azureuser /var/www/segredodosabor/.env.backend
print_success "Arquivo .env para backend criado!"
echo ""

###############################################################################
# PASSO 12: CRIAR ARQUIVO .ENV PARA FRONTEND
###############################################################################
print_step "12" "Criando arquivo .env para frontend..."

cat > /var/www/segredodosabor/.env.frontend <<'ENV_FRONTEND'
REACT_APP_API_URL=http://20.163.57.236/api
NODE_ENV=production
GENERATE_SOURCEMAP=false
ENV_FRONTEND

chown azureuser:azureuser /var/www/segredodosabor/.env.frontend
print_success "Arquivo .env para frontend criado!"
echo ""

###############################################################################
# INFORMAÇÕES FINAIS
###############################################################################
echo ""
echo "=========================================="
echo "✅ INSTALAÇÃO BASE CONCLUÍDA!"
echo "=========================================="
echo ""
echo "📋 PRÓXIMOS PASSOS (no seu PC Windows):"
echo ""
echo "1️⃣  Compactar projeto:"
echo "   cd D:\\Downloads\\Segredo-do-Sabor"
echo "   tar -czf app.tar.gz backend frontend *.sql"
echo ""
echo "2️⃣  Enviar para servidor:"
echo "   scp -i segredo-sabor-key.pem app.tar.gz azureuser@20.163.57.236:~/"
echo ""
echo "3️⃣  Conectar via SSH:"
echo "   ssh -i segredo-sabor-key.pem azureuser@20.163.57.236"
echo ""
echo "4️⃣  Extrair e configurar:"
echo "   cd /var/www/segredodosabor"
echo "   sudo tar -xzf ~/app.tar.gz"
echo "   sudo chown -R azureuser:azureuser /var/www/segredodosabor"
echo ""
echo "5️⃣  Importar banco de dados:"
echo "   cd /var/www/segredodosabor"
echo "   mysql -usegredo_user -p'P@\$\$w0rd' segredodosabor < INSTALACAO_BANCO_COMPLETO.sql"
echo ""
echo "6️⃣  Configurar backend:"
echo "   cd /var/www/segredodosabor/backend"
echo "   cp /var/www/segredodosabor/.env.backend .env"
echo "   npm install"
echo "   pm2 start src/server.js --name segredo-backend"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "7️⃣  Configurar frontend:"
echo "   cd /var/www/segredodosabor/frontend"
echo "   cp /var/www/segredodosabor/.env.frontend .env"
echo "   npm install"
echo "   npm run build"
echo ""
echo "8️⃣  Configurar Nginx (execute: sudo bash /var/www/segredodosabor/configurar-nginx.sh)"
echo ""
echo "=========================================="
echo "📊 INFORMAÇÕES DO SISTEMA:"
echo "=========================================="
echo "IP Público: 20.163.57.236"
echo "URL Sistema: http://20.163.57.236"
echo "URL Admin: http://20.163.57.236/gerenciamentos"
echo ""
echo "MySQL:"
echo "  Host: localhost"
echo "  User: segredo_user"
echo "  Pass: P@\$\$w0rd"
echo "  Database: segredodosabor"
echo ""
echo "Admin Padrão (após importar banco):"
echo "  Email: admin@segredodosabor.com"
echo "  Senha: Admin@123"
echo ""
echo "=========================================="
echo "🎉 Script concluído com sucesso!"
echo "=========================================="
