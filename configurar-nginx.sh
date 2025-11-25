#!/bin/bash
################################################################################
# SCRIPT DE CONFIGURAÇÃO DO NGINX - DOCEGEST V5.0
################################################################################

set -e

echo "========================================="
echo "🌐 CONFIGURANDO NGINX"
echo "========================================="

# Copiar configuração para sites-available
echo ""
echo "📝 1. Copiando configuração do Nginx..."
sudo cp ~/nginx-segredodosabor.conf /etc/nginx/sites-available/segredodosabor

# Criar link simbólico em sites-enabled
echo ""
echo "📝 2. Ativando site..."
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/segredodosabor /etc/nginx/sites-enabled/

# Testar configuração
echo ""
echo "📝 3. Testando configuração..."
sudo nginx -t

# Reiniciar Nginx
echo ""
echo "📝 4. Reiniciando Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Verificar status
echo ""
echo "📝 5. Verificando status..."
sudo systemctl status nginx --no-pager | head -10

echo ""
echo "========================================="
echo "✅ NGINX CONFIGURADO COM SUCESSO!"
echo "========================================="
echo "🌐 Acesse: http://20.168.13.56"
echo "🌐 Ou: http://segredodosabor.westus3.cloudapp.azure.com"
echo "📡 Backend API: http://20.168.13.56/api"
echo "🔍 Health: http://20.168.13.56/health"
echo "========================================="
