# ================================================================
# SCRIPT POWERSHELL - DEPLOY COMPLETO AZURE
# Segredo do Sabor v5.0
# ================================================================

$ErrorActionPreference = "Stop"

$IP_AZURE = "20.163.57.236"
$SSH_KEY = "D:\Downloads\segredo-sabor-key.pem"
$PROJETO_DIR = "D:\Downloads\Segredo-do-Sabor"

Write-Host "=========================================" -ForegroundColor Green
Write-Host "🚀 DEPLOY SEGREDO DO SABOR - AZURE" -ForegroundColor Green  
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Função para executar comando SSH
function Invoke-SSHCommand {
    param([string]$Command)
    ssh -i $SSH_KEY azureuser@$IP_AZURE $Command
}

# Função para copiar arquivo via SCP
function Copy-ToAzure {
    param([string]$LocalPath, [string]$RemotePath)
    scp -i $SSH_KEY $LocalPath azureuser@${IP_AZURE}:$RemotePath
}

# ================================================================
# PASSO 1: Verificar instalação base
# ================================================================
Write-Host "[1/8] Verificando instalação base no servidor..." -ForegroundColor Yellow

$services = Invoke-SSHCommand "node --version 2>&1; npm --version 2>&1; mysql --version 2>&1; nginx -v 2>&1; pm2 --version 2>&1"
Write-Host $services -ForegroundColor Gray

if ($services -match "command not found") {
    Write-Host "❌ Alguns serviços não estão instalados!" -ForegroundColor Red
    Write-Host "Execute primeiro: ssh -i $SSH_KEY azureuser@$IP_AZURE 'sudo bash ~/deploy-azure-completo.sh'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Serviços instalados!" -ForegroundColor Green
Write-Host ""

# ================================================================
# PASSO 2: Compactar projeto
# ================================================================
Write-Host "[2/8] Compactando projeto..." -ForegroundColor Yellow

Set-Location $PROJETO_DIR

# Remover compactação antiga se existir
if (Test-Path "app.tar.gz") {
    Remove-Item "app.tar.gz" -Force
}

# Compactar (usando tar do Windows 10+)
Write-Host "  Compactando backend, frontend e arquivos SQL..." -ForegroundColor Gray
tar -czf app.tar.gz backend frontend *.sql

if (!(Test-Path "app.tar.gz")) {
    Write-Host "❌ Erro ao compactar projeto!" -ForegroundColor Red
    exit 1
}

$fileSize = (Get-Item "app.tar.gz").Length / 1MB
Write-Host "✅ Projeto compactado! Tamanho: $($fileSize.ToString('0.00')) MB" -ForegroundColor Green
Write-Host ""

# ================================================================
# PASSO 3: Enviar projeto para servidor
# ================================================================
Write-Host "[3/8] Enviando projeto para servidor Azure..." -ForegroundColor Yellow

Copy-ToAzure "$PROJETO_DIR\app.tar.gz" "~/"

Write-Host "✅ Projeto enviado!" -ForegroundColor Green
Write-Host ""

# ================================================================
# PASSO 4: Extrair projeto no servidor
# ================================================================
Write-Host "[4/8] Extraindo projeto no servidor..." -ForegroundColor Yellow

Invoke-SSHCommand "cd /var/www/segredodosabor && sudo tar -xzf ~/app.tar.gz && sudo chown -R azureuser:azureuser /var/www/segredodosabor"

Write-Host "✅ Projeto extraído!" -ForegroundColor Green
Write-Host ""

# ================================================================
# PASSO 5: Importar banco de dados
# ================================================================
Write-Host "[5/8] Importando banco de dados..." -ForegroundColor Yellow

Invoke-SSHCommand @"
cd /var/www/segredodosabor
mysql -usegredo_user -p'P@`$`$w0rd' segredodosabor < INSTALACAO_BANCO_COMPLETO.sql
mysql -usegredo_user -p'P@`$`$w0rd' segredodosabor -e 'SHOW TABLES;'
"@

Write-Host "✅ Banco de dados importado!" -ForegroundColor Green
Write-Host ""

# ================================================================
# PASSO 6: Configurar e iniciar backend
# ================================================================
Write-Host "[6/8] Configurando backend..." -ForegroundColor Yellow

Invoke-SSHCommand @"
cd /var/www/segredodosabor/backend
cp /var/www/segredodosabor/.env.backend .env
npm install --production
mkdir -p uploads
pm2 delete segredo-backend 2>/dev/null || true
pm2 start src/server.js --name segredo-backend
pm2 save
"@

Write-Host "✅ Backend configurado e rodando!" -ForegroundColor Green
Write-Host ""

# ================================================================
# PASSO 7: Configurar e buildar frontend
# ================================================================
Write-Host "[7/8] Configurando frontend..." -ForegroundColor Yellow

Invoke-SSHCommand @"
cd /var/www/segredodosabor/frontend
cp /var/www/segredodosabor/.env.frontend .env
npm install
npm run build
sudo chown -R www-data:www-data build/
"@

Write-Host "✅ Frontend buildado!" -ForegroundColor Green
Write-Host ""

# ================================================================
# PASSO 8: Configurar Nginx
# ================================================================
Write-Host "[8/8] Configurando Nginx..." -ForegroundColor Yellow

# Mover script de configuração nginx
Invoke-SSHCommand "sudo cp ~/configurar-nginx.sh /var/www/segredodosabor/ 2>/dev/null || true"

# Executar configuração do Nginx
Invoke-SSHCommand "cd /var/www/segredodosabor && sudo bash configurar-nginx.sh"

Write-Host "✅ Nginx configurado!" -ForegroundColor Green
Write-Host ""

# ================================================================
# PASSO 9: Verificar status final
# ================================================================
Write-Host "=========================================" -ForegroundColor Green
Write-Host "✅ DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Status dos Serviços:" -ForegroundColor Cyan
Invoke-SSHCommand "pm2 status && echo '' && sudo systemctl status nginx --no-pager | head -5 && echo '' && sudo systemctl status mysql --no-pager | head -5"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "🌐 ACESSE O SISTEMA:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:     http://$IP_AZURE" -ForegroundColor White
Write-Host "Admin:        http://$IP_AZURE/gerenciamentos" -ForegroundColor White
Write-Host "API:          http://$IP_AZURE/api" -ForegroundColor White
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "🔐 CREDENCIAIS:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Admin do Sistema:" -ForegroundColor Yellow
Write-Host "  Email: admin@segredodosabor.com" -ForegroundColor White
Write-Host "  Senha: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "MySQL:" -ForegroundColor Yellow
Write-Host "  User: segredo_user" -ForegroundColor White
Write-Host "  Pass: P@`$`$w0rd" -ForegroundColor White
Write-Host "  Database: segredodosabor" -ForegroundColor White
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "📝 COMANDOS ÚTEIS:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Ver logs backend:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY azureuser@$IP_AZURE 'pm2 logs segredo-backend'" -ForegroundColor Gray
Write-Host ""
Write-Host "Reiniciar backend:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY azureuser@$IP_AZURE 'pm2 restart segredo-backend'" -ForegroundColor Gray
Write-Host ""
Write-Host "Fazer backup:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY azureuser@$IP_AZURE 'sudo /opt/backups/backup-segredo.sh'" -ForegroundColor Gray
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "🎉 BOA SORTE NA APRESENTAÇÃO!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
