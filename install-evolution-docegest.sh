#!/bin/bash

################################################################################
# Script de Instalação Automatizada - Evolution API + Docegest
# Para Ubuntu 22.04 em VM Azure
# 
# USO:
#   chmod +x install-evolution-docegest.sh
#   ./install-evolution-docegest.sh
################################################################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   🚀 INSTALAÇÃO EVOLUTION API + DOCEGEST"
echo "   📱 WhatsApp Business Automation"
echo "   🐳 Docker + Node.js + MySQL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar se está rodando como root
if [ "$EUID" -eq 0 ]; then 
    log_error "Não execute este script como root! Use: ./install-evolution-docegest.sh"
    exit 1
fi

# Perguntar configurações
log_info "Vamos configurar seu ambiente. Pressione ENTER para valores padrão."
echo ""

read -p "Porta Evolution API [8080]: " EVOLUTION_PORT
EVOLUTION_PORT=${EVOLUTION_PORT:-8080}

read -p "Porta Backend Node.js [5000]: " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-5000}

read -p "Nome da instância WhatsApp [docegest-whatsapp]: " INSTANCE_NAME
INSTANCE_NAME=${INSTANCE_NAME:-docegest-whatsapp}

read -p "Seu número WhatsApp (ex: 5511967696744): " WHATSAPP_NUMBER
if [ -z "$WHATSAPP_NUMBER" ]; then
    log_error "Número WhatsApp é obrigatório!"
    exit 1
fi

read -p "Senha MySQL root [P@\$\$w0rd]: " MYSQL_ROOT_PASS
MYSQL_ROOT_PASS=${MYSQL_ROOT_PASS:-'P@$$w0rd'}

read -p "Senha MySQL docegest [Docegest@2025]: " MYSQL_USER_PASS
MYSQL_USER_PASS=${MYSQL_USER_PASS:-'Docegest@2025'}

# Gerar API Key aleatória
EVOLUTION_API_KEY="docegest_evolution_$(openssl rand -hex 16)"

echo ""
log_info "Configurações:"
echo "  - Evolution API: :$EVOLUTION_PORT"
echo "  - Backend: :$BACKEND_PORT"
echo "  - Instância: $INSTANCE_NAME"
echo "  - WhatsApp: $WHATSAPP_NUMBER"
echo "  - API Key: $EVOLUTION_API_KEY"
echo ""

read -p "Continuar com estas configurações? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warning "Instalação cancelada."
    exit 0
fi

################################################################################
# ETAPA 1: ATUALIZAR SISTEMA
################################################################################

log_info "ETAPA 1/8: Atualizando sistema..."
sudo apt update && sudo apt upgrade -y
log_success "Sistema atualizado!"

################################################################################
# ETAPA 2: INSTALAR DOCKER
################################################################################

log_info "ETAPA 2/8: Instalando Docker..."

if command -v docker &> /dev/null; then
    log_warning "Docker já está instalado. Pulando..."
else
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo usermod -aG docker $USER
    log_success "Docker instalado!"
fi

################################################################################
# ETAPA 3: INSTALAR NODE.JS
################################################################################

log_info "ETAPA 3/8: Instalando Node.js 18..."

if command -v node &> /dev/null; then
    log_warning "Node.js já está instalado. Pulando..."
else
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    sudo npm install -g pm2
    log_success "Node.js $(node --version) e PM2 instalados!"
fi

################################################################################
# ETAPA 4: INSTALAR MYSQL
################################################################################

log_info "ETAPA 4/8: Instalando MySQL..."

if command -v mysql &> /dev/null; then
    log_warning "MySQL já está instalado. Pulando..."
else
    # Configurar senha root antes da instalação
    sudo debconf-set-selections <<< "mysql-server mysql-server/root_password password $MYSQL_ROOT_PASS"
    sudo debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $MYSQL_ROOT_PASS"
    
    sudo apt install -y mysql-server
    
    # Configurações de segurança
    sudo mysql -u root -p"$MYSQL_ROOT_PASS" <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASS';
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
FLUSH PRIVILEGES;
EOF
    
    log_success "MySQL instalado e configurado!"
fi

################################################################################
# ETAPA 5: CONFIGURAR BANCO DE DADOS
################################################################################

log_info "ETAPA 5/8: Criando banco de dados..."

sudo mysql -u root -p"$MYSQL_ROOT_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'docegest'@'%' IDENTIFIED BY '$MYSQL_USER_PASS';
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'docegest'@'%';
FLUSH PRIVILEGES;
EOF

log_success "Banco de dados 'segredodosabor' criado!"

################################################################################
# ETAPA 6: INSTALAR EVOLUTION API
################################################################################

log_info "ETAPA 6/8: Instalando Evolution API..."

mkdir -p ~/evolution-api/{instances,store}
cd ~/evolution-api

# Obter IP público
PUBLIC_IP=$(curl -s ifconfig.me)
log_info "IP público detectado: $PUBLIC_IP"

# Criar docker-compose.yml
cat > docker-compose.yml <<EOF
version: '3.8'

services:
  evolution-api:
    container_name: evolution-api
    image: atendai/evolution-api:latest
    restart: always
    ports:
      - "$EVOLUTION_PORT:8080"
    environment:
      - SERVER_URL=http://$PUBLIC_IP:$EVOLUTION_PORT
      - CORS_ORIGIN=*
      - CORS_METHODS=GET,POST,PUT,DELETE
      - CORS_CREDENTIALS=true
      - AUTHENTICATION_API_KEY=$EVOLUTION_API_KEY
      - CONFIG_SESSION_PHONE_CLIENT=Docegest
      - CONFIG_SESSION_PHONE_NAME=Chrome
      - STORE_MESSAGES=true
      - STORE_MESSAGE_UP=true
      - STORE_CONTACTS=true
      - STORE_CHATS=true
      - DATABASE_ENABLED=true
      - DATABASE_CONNECTION=sqlite
      - DATABASE_CONNECTION_SQLITE_DB_NAME=evolution.sqlite3
      - LOG_LEVEL=ERROR
      - LOG_COLOR=true
      - LOG_BAILEYS=false
      - WEBHOOK_GLOBAL_ENABLED=false
      - QRCODE_LIMIT=30
      - QRCODE_COLOR=#198754
      - CONNECTION_TIMEOUT=60000
    volumes:
      - ./instances:/evolution/instances
      - ./store:/evolution/store
    networks:
      - evolution-network

networks:
  evolution-network:
    driver: bridge
EOF

# Iniciar Evolution API
docker compose up -d

log_success "Evolution API instalado e iniciado!"
log_info "Aguardando inicialização (30 segundos)..."
sleep 30

################################################################################
# ETAPA 7: CRIAR SCRIPTS AUXILIARES
################################################################################

log_info "ETAPA 7/8: Criando scripts auxiliares..."

# Script de backup
cat > ~/backup-evolution.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/home/azureuser/backups"
DATE=$(date +%Y%m%d_%H%M%S)
EVOLUTION_DIR="/home/azureuser/evolution-api"

mkdir -p "$BACKUP_DIR"

echo "🔄 Backup Evolution API..."
tar -czf "$BACKUP_DIR/evolution_$DATE.tar.gz" -C "$EVOLUTION_DIR" instances store

echo "🔄 Backup MySQL..."
mysqldump -u docegest -p'MYSQL_USER_PASS_PLACEHOLDER' segredodosabor > "$BACKUP_DIR/database_$DATE.sql"

echo "🧹 Limpando backups antigos..."
find "$BACKUP_DIR" -name "evolution_*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "database_*.sql" -mtime +7 -delete

echo "✅ Backup concluído: $DATE"
EOF

# Substituir senha no script
sed -i "s/MYSQL_USER_PASS_PLACEHOLDER/$MYSQL_USER_PASS/g" ~/backup-evolution.sh
chmod +x ~/backup-evolution.sh

# Script de status
cat > ~/status.sh <<'EOF'
#!/bin/bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   📊 STATUS DOCEGEST + EVOLUTION API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🐳 DOCKER:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "💾 DISCO:"
df -h / | tail -1 | awk '{print "Usado: " $3 " de " $2 " (" $5 ")"}'
echo ""
echo "🧠 MEMÓRIA:"
free -h | grep Mem | awk '{print "Usado: " $3 " de " $2}'
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
EOF

chmod +x ~/status.sh

# Script de healthcheck
cat > ~/healthcheck-evolution.sh <<EOF
#!/bin/bash
API_URL="http://localhost:$EVOLUTION_PORT"
API_KEY="$EVOLUTION_API_KEY"
INSTANCE="$INSTANCE_NAME"

response=\$(curl -s -o /dev/null -w "%{http_code}" "\$API_URL/instance/connectionState/\$INSTANCE" -H "apikey: \$API_KEY")

if [ "\$response" -ne 200 ]; then
    echo "\$(date): ❌ Evolution API não respondeu. Reiniciando..."
    cd /home/azureuser/evolution-api
    docker compose restart
else
    echo "\$(date): ✅ Evolution API OK"
fi
EOF

chmod +x ~/healthcheck-evolution.sh

# Agendar crons
(crontab -l 2>/dev/null; echo "0 2 * * * /home/azureuser/backup-evolution.sh >> /home/azureuser/backup.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/azureuser/healthcheck-evolution.sh >> /home/azureuser/healthcheck.log 2>&1") | crontab -

log_success "Scripts criados e agendados!"

################################################################################
# ETAPA 8: CONFIGURAR ARQUIVO .ENV
################################################################################

log_info "ETAPA 8/8: Criando arquivo .env..."

cat > ~/.env-docegest <<EOF
# Configurações Docegest
PORT=$BACKEND_PORT

# Banco de Dados
DB_HOST=localhost
DB_DATABASE=segredodosabor
DB_USER=docegest
DB_PASSWORD=$MYSQL_USER_PASS

# JWT
JWT_SECRET=segredodosabor_secret_2025
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=segredodosabor_refresh_2025
JWT_REFRESH_EXPIRES_IN=30d

# WhatsApp com Evolution API
WHATSAPP_PROVIDER=evolution
EVOLUTION_API_URL=http://localhost:$EVOLUTION_PORT
EVOLUTION_API_KEY=$EVOLUTION_API_KEY
EVOLUTION_INSTANCE=$INSTANCE_NAME

# Configuração Geral
WHATSAPP_BUSINESS_PHONE=$WHATSAPP_NUMBER
WHATSAPP_VERIFY_TOKEN=segredodosabor2025
EOF

log_success "Arquivo .env criado!"

################################################################################
# FINALIZAÇÃO
################################################################################

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_success "INSTALAÇÃO CONCLUÍDA COM SUCESSO! 🎉"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_info "📝 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  CONECTAR WHATSAPP:"
echo "   Acesse: http://$PUBLIC_IP:$EVOLUTION_PORT"
echo "   Manager → Create Instance → Nome: $INSTANCE_NAME"
echo "   Escaneie o QR Code com WhatsApp Business"
echo ""
echo "2️⃣  CLONAR PROJETO DOCEGEST:"
echo "   cd ~"
echo "   git clone https://github.com/VitorGeovani/docegest.git"
echo "   # OU fazer upload via SCP"
echo ""
echo "3️⃣  CONFIGURAR BACKEND:"
echo "   cd ~/docegest/backend"
echo "   cp ~/.env-docegest .env"
echo "   npm install"
echo "   # Importar banco: mysql -u docegest -p segredodosabor < ../../BANCO_DADOS_COMPLETO.sql"
echo "   npm start"
echo ""
echo "4️⃣  TESTAR WHATSAPP:"
echo "   curl -X POST http://localhost:$EVOLUTION_PORT/message/sendText/$INSTANCE_NAME \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'apikey: $EVOLUTION_API_KEY' \\"
echo "     -d '{\"number\":\"$WHATSAPP_NUMBER\",\"text\":\"Teste Evolution API\"}'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "📋 INFORMAÇÕES IMPORTANTES:"
echo ""
echo "  🌐 IP Público: $PUBLIC_IP"
echo "  🔐 API Key: $EVOLUTION_API_KEY"
echo "  📱 Instância: $INSTANCE_NAME"
echo "  🗄️  MySQL User: docegest"
echo "  🗄️  MySQL Pass: $MYSQL_USER_PASS"
echo ""
echo "  📂 .env salvo em: ~/.env-docegest"
echo "  🔧 Scripts: ~/backup-evolution.sh, ~/status.sh, ~/healthcheck-evolution.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "📚 COMANDOS ÚTEIS:"
echo ""
echo "  Ver status:       ~/status.sh"
echo "  Backup manual:    ~/backup-evolution.sh"
echo "  Logs Evolution:   docker logs -f evolution-api"
echo "  Reiniciar:        cd ~/evolution-api && docker compose restart"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_warning "⚠️  IMPORTANTE: Anote a API Key em local seguro!"
log_warning "⚠️  Para aplicar grupo docker, relogue: exit e reconecte via SSH"
echo ""
log_success "Tudo pronto! Consulte TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md para mais detalhes."
echo ""
