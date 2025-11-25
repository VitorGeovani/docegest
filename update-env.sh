#!/bin/bash

cd /var/www/segredodosabor/backend

# Backup do .env original
cp .env .env.backup

# Atualizar credenciais do banco
sed -i 's/DB_USER=root/DB_USER=segredo_user/' .env
sed -i 's/DB_PASSWORD=P@\$\$w0rd/DB_PASSWORD=SegredoSabor2025!/' .env

# Atualizar Evolution API Key
sed -i 's/EVOLUTION_API_KEY=COLE_SUA_API_KEY_AQUI/EVOLUTION_API_KEY=segredodosabor2025/' .env

echo "✅ .env atualizado com sucesso!"
echo ""
echo "Configurações atualizadas:"
grep -E '(DB_USER|DB_PASSWORD|EVOLUTION_API_KEY)' .env
