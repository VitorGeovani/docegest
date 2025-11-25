# ================================================================
# SCRIPT PARA CORRIGIR URLs DO FRONTEND - WINDOWS
# ================================================================

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🔧 CORRIGINDO URLs DO FRONTEND" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$frontDir = "D:\Downloads\Segredo-do-Sabor\front"

Write-Host "`n📝 1. Criando backup dos arquivos originais..." -ForegroundColor Yellow
$backupDir = "$frontDir\src_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item -Path "$frontDir\src" -Destination $backupDir -Recurse -Force
Write-Host "   ✅ Backup criado em: $backupDir" -ForegroundColor Green

Write-Host "`n📝 2. Substituindo localhost:5000 por /api..." -ForegroundColor Yellow
$files = Get-ChildItem -Path "$frontDir\src" -Recurse -Include *.js,*.jsx

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Substituir http://localhost:5000 por /api
    $content = $content -replace 'http://localhost:5000', '/api'
    
    # Substituir http://localhost:5015 por /api
    $content = $content -replace 'http://localhost:5015', '/api'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $count++
        Write-Host "   ✅ Atualizado: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n   ✅ Total de $count arquivos atualizados!" -ForegroundColor Green

Write-Host "`n📦 3. Instalando dependências do NPM..." -ForegroundColor Yellow
Set-Location $frontDir
npm install

Write-Host "`n🏗️  4. Fazendo build de produção..." -ForegroundColor Yellow
npm run build

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "✅ BUILD CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📦 Arquivos em: front/build/" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "⚠️  PRÓXIMO PASSO:" -ForegroundColor Yellow
Write-Host "Executar deploy: .\deploy-frontend.ps1" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Cyan
