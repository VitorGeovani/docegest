#!/bin/bash
################################################################################
# SCRIPT PARA CORRIGIR URLs E FAZER BUILD DO FRONTEND
################################################################################

set -e

echo "========================================="
echo "🔧 CORRIGINDO URLs DO FRONTEND"
echo "========================================="

# Voltar para o diretório do projeto
cd "$(dirname "$0")/front"

echo ""
echo "📝 1. Substituindo localhost:5000 por /api..."

# Substituir todas as ocorrências de http://localhost:5000 por /api
find src -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i 's|http://localhost:5000|/api|g' {} +

# Substituir localhost:5015 (se existir) por /api também
find src -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i 's|http://localhost:5015|/api|g' {} +

echo "   ✅ URLs substituídas!"

echo ""
echo "📦 2. Instalando dependências..."
npm install

echo ""
echo "🏗️  3. Fazendo build de produção..."
npm run build

echo ""
echo "========================================="
echo "✅ BUILD CONCLUÍDO COM SUCESSO!"
echo "========================================="
echo "📦 Arquivos em: front/build/"
echo ""
echo "⚠️  PRÓXIMO PASSO:"
echo "Execute: scp -r front/build/* azureuser@IP:/var/www/segredodosabor/frontend/"
echo "========================================="
