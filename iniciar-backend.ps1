# ===================================
# SCRIPT DE INICIALIZAÇÃO DO SISTEMA
# Segredos do Sabor - Backend
# ===================================

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  SEGREDOS DO SABOR - INICIALIZAÇÃO" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se o Node está instalado
Write-Host "[1/5] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js não encontrado! Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# 2. Verificar se o MySQL está rodando
Write-Host ""
Write-Host "[2/5] Verificando MySQL..." -ForegroundColor Yellow
$mysqlProcess = Get-Process -Name mysqld -ErrorAction SilentlyContinue
if ($mysqlProcess) {
    Write-Host "  ✓ MySQL está rodando" -ForegroundColor Green
} else {
    Write-Host "  ⚠ MySQL pode não estar rodando. Verifique o serviço." -ForegroundColor Yellow
}

# 3. Parar processos Node antigos
Write-Host ""
Write-Host "[3/5] Parando processos Node antigos..." -ForegroundColor Yellow
try {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Processos Node parados" -ForegroundColor Green
} catch {
    Write-Host "  ℹ Nenhum processo Node em execução" -ForegroundColor Gray
}

# 4. Navegar para o diretório backend
Write-Host ""
Write-Host "[4/5] Configurando diretório..." -ForegroundColor Yellow
$backendPath = "d:\Downloads\Segredos-do-Sabor\backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "  ✓ Diretório configurado: $backendPath" -ForegroundColor Green
} else {
    Write-Host "  ✗ Diretório não encontrado: $backendPath" -ForegroundColor Red
    exit 1
}

# 5. Iniciar o backend
Write-Host ""
Write-Host "[5/5] Iniciando servidor backend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  BACKEND INICIANDO..." -ForegroundColor Cyan
Write-Host "  Porta: 5000" -ForegroundColor Cyan
Write-Host "  Banco: segredodosabor" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar o servidor
npm start
