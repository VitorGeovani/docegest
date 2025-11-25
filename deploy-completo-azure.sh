#!/bin/bash
################################################################################
# SCRIPT DE DEPLOY COMPLETO - DOCEGEST V5.0
# Servidor: Azure D2s v3 (2 vCPUs, 8GB RAM)
# IP: 20.168.13.56
# DNS: segredodosabor.westus3.cloudapp.azure.com
################################################################################

set -e  # Parar em caso de erro

echo "========================================="
echo "🚀 INICIANDO DEPLOY DOCEGEST V5.0"
echo "========================================="

# Atualizar sistema
echo ""
echo "📦 1. Atualizando sistema..."
sudo apt-get update
sudo apt-get upgrade -y

# Instalar Node.js 20.x
echo ""
echo "📦 2. Instalando Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar MySQL 8.0
echo ""
echo "📦 3. Instalando MySQL 8.0..."
sudo apt-get install -y mysql-server

# Instalar Nginx
echo ""
echo "📦 4. Instalando Nginx..."
sudo apt-get install -y nginx

# Instalar Docker
echo ""
echo "📦 5. Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker azureuser

# Instalar Docker Compose
echo ""
echo "📦 6. Instalando Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar PM2
echo ""
echo "📦 7. Instalando PM2..."
sudo npm install -g pm2@latest

# Criar estrutura de diretórios
echo ""
echo "📁 8. Criando estrutura de diretórios..."
sudo mkdir -p /var/www/segredodosabor/{backend,frontend}
sudo chown -R azureuser:azureuser /var/www/segredodosabor

# Verificar versões instaladas
echo ""
echo "========================================="
echo "✅ INSTALAÇÕES CONCLUÍDAS!"
echo "========================================="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "MySQL: $(mysql --version | cut -d' ' -f6)"
echo "Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "Docker: $(docker --version | cut -d' ' -f3 | tr -d ',')"
echo "Docker Compose: $(docker-compose --version | cut -d' ' -f4 | tr -d ',')"
echo "PM2: $(pm2 --version)"
echo "========================================="
