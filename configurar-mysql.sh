#!/bin/bash
################################################################################
# SCRIPT DE CONFIGURAÇÃO DO MYSQL - DOCEGEST V5.0
################################################################################

set -e

echo "========================================="
echo "🔐 CONFIGURANDO MYSQL 8.0"
echo "========================================="

# Configurar senha root do MySQL
echo ""
echo "📝 1. Configurando senha root do MySQL..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'SegredoSabor2025!';"

# Criar banco de dados
echo ""
echo "📝 2. Criando banco de dados segredo_do_sabor..."
sudo mysql -uroot -pSegredoSabor2025! -e "CREATE DATABASE IF NOT EXISTS segredo_do_sabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Criar usuário e dar privilégios
echo ""
echo "📝 3. Criando usuário segredo_user..."
sudo mysql -uroot -pSegredoSabor2025! -e "DROP USER IF EXISTS 'segredo_user'@'%';"
sudo mysql -uroot -pSegredoSabor2025! -e "CREATE USER 'segredo_user'@'%' IDENTIFIED WITH mysql_native_password BY 'SegredoSabor2025!';"
sudo mysql -uroot -pSegredoSabor2025! -e "GRANT ALL PRIVILEGES ON segredo_do_sabor.* TO 'segredo_user'@'%';"
sudo mysql -uroot -pSegredoSabor2025! -e "GRANT SUPER, SYSTEM_VARIABLES_ADMIN ON *.* TO 'segredo_user'@'%';"
sudo mysql -uroot -pSegredoSabor2025! -e "FLUSH PRIVILEGES;"

# Importar banco de dados
echo ""
echo "📝 4. Importando banco de dados completo V5.0..."
echo "   (53 tabelas, 7 views, 5 procedures, 5 triggers - pode levar 1-2 minutos)"
sudo mysql -uroot -pSegredoSabor2025! segredo_do_sabor < ~/INSTALACAO_BANCO_COMPLETO_V5_FINAL.sql

# Verificar importação
echo ""
echo "📝 5. Verificando importação..."
TABLE_COUNT=$(sudo mysql -uroot -pSegredoSabor2025! segredo_do_sabor -sN -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'segredo_do_sabor';")

echo ""
echo "========================================="
echo "✅ MYSQL CONFIGURADO COM SUCESSO!"
echo "========================================="
echo "📊 Tabelas importadas: $TABLE_COUNT"
echo "🔐 Usuário: segredo_user"
echo "🔐 Senha: SegredoSabor2025!"
echo "📦 Banco: segredo_do_sabor"
echo "========================================="
