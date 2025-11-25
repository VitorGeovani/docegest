#!/bin/bash

# Script para configurar MySQL e importar banco

echo "🔧 Configurando MySQL..."

# Parar MySQL temporariamente
sudo systemctl stop mysql

# Iniciar MySQL em modo seguro
sudo mysqld_safe --skip-grant-tables --skip-networking &
MYSQL_PID=$!

# Aguardar MySQL iniciar
sleep 5

# Configurar usuário
mysql -u root <<EOF
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@\$\$w0rd';
CREATE DATABASE IF NOT EXISTS segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'segredo_user'@'localhost' IDENTIFIED BY 'P@\$\$w0rd';
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# Matar mysqld_safe
sudo kill $MYSQL_PID
sleep 2

# Reiniciar MySQL normalmente
sudo systemctl start mysql

echo "✅ MySQL configurado!"

# Testar conexão
echo "🧪 Testando conexão..."
mysql -usegredo_user -p'P@$$w0rd' -e "SELECT 'Conexão OK!' as status;"

# Importar banco
echo "📦 Importando banco de dados..."
cd /var/www/segredodosabor
mysql -usegredo_user -p'P@$$w0rd' segredodosabor < INSTALACAO_BANCO_COMPLETO.sql

# Verificar tabelas
echo "✅ Tabelas criadas:"
mysql -usegredo_user -p'P@$$w0rd' segredodosabor -e "SHOW TABLES;"

echo "🎉 Banco de dados pronto!"
