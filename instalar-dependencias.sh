#!/bin/bash
################################################################################
# SCRIPT DE INSTALAÇÃO DE DEPENDÊNCIAS - DOCEGEST V5.0
################################################################################

set -e

echo "========================================="
echo "📦 INSTALANDO DEPENDÊNCIAS"
echo "========================================="

# Criar diretórios no /var/www
echo ""
echo "📁 1. Criando estrutura de diretórios..."
sudo mkdir -p /var/www/segredodosabor/{backend,frontend}
sudo chown -R azureuser:azureuser /var/www/segredodosabor

# Mover e renomear backend
echo ""
echo "📂 2. Movendo backend (back -> backend)..."
cp -r ~/back/* /var/www/segredodosabor/backend/
cd /var/www/segredodosabor/backend

# Instalar dependências do backend
echo ""
echo "📦 3. Instalando dependências do backend..."
echo "   (Isso pode levar 2-3 minutos)"
npm install --production

# Verificar instalação do backend
BACKEND_MODULES=$(ls -1 node_modules | wc -l)
echo "   ✅ $BACKEND_MODULES pacotes instalados no backend"

# Mover e renomear frontend (apenas build)
echo ""
echo "📂 4. Movendo frontend (front/build -> frontend)..."
cp -r ~/front/build/* /var/www/segredodosabor/frontend/

# Verificar arquivos do frontend
FRONTEND_FILES=$(find /var/www/segredodosabor/frontend -type f | wc -l)
echo "   ✅ $FRONTEND_FILES arquivos copiados no frontend"

# Ajustar permissões
echo ""
echo "🔐 5. Ajustando permissões..."
sudo chown -R www-data:www-data /var/www/segredodosabor/frontend
sudo chown -R azureuser:azureuser /var/www/segredodosabor/backend
sudo chmod -R 755 /var/www/segredodosabor

echo ""
echo "========================================="
echo "✅ DEPENDÊNCIAS INSTALADAS!"
echo "========================================="
echo "📁 Backend: /var/www/segredodosabor/backend"
echo "📁 Frontend: /var/www/segredodosabor/frontend"
echo "📦 Pacotes backend: $BACKEND_MODULES"
echo "📄 Arquivos frontend: $FRONTEND_FILES"
echo "========================================="
