@echo off
echo ========================================
echo  INSTALACAO RAPIDA - WhatsApp Evolution API
echo ========================================
echo.

REM Verificar se Docker esta instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao encontrado!
    echo.
    echo Por favor, instale o Docker Desktop:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo [OK] Docker encontrado!
echo.

REM Parar container antigo se existir
echo [INFO] Removendo container antigo (se existir)...
docker rm -f evolution-api >nul 2>&1

REM Iniciar Evolution API
echo [INFO] Iniciando Evolution API...
docker run -d ^
  --name evolution-api ^
  -p 8080:8080 ^
  -e AUTHENTICATION_API_KEY=segredodosabor2025 ^
  --restart unless-stopped ^
  atendai/evolution-api

if %errorlevel% neq 0 (
    echo [ERRO] Falha ao iniciar Evolution API!
    pause
    exit /b 1
)

echo [OK] Evolution API iniciada!
echo.

REM Aguardar 5 segundos
echo [INFO] Aguardando inicializacao (5 segundos)...
timeout /t 5 /nobreak >nul

REM Verificar se esta rodando
docker ps | findstr evolution-api >nul
if %errorlevel% neq 0 (
    echo [ERRO] Container nao esta rodando!
    echo.
    echo Verifique os logs com: docker logs evolution-api
    pause
    exit /b 1
)

echo [OK] Container rodando!
echo.

REM Atualizar .env
echo [INFO] Atualizando arquivo .env...

cd backend

REM Backup do .env original
if exist .env (
    copy /Y .env .env.backup >nul
    echo [OK] Backup do .env criado (.env.backup)
)

REM Adicionar configurações WhatsApp ao .env
echo. >> .env
echo # WhatsApp - Evolution API (Configurado automaticamente) >> .env
echo WHATSAPP_PROVIDER=evolution >> .env
echo EVOLUTION_API_URL=http://localhost:8080 >> .env
echo EVOLUTION_API_KEY=segredodosabor2025 >> .env
echo EVOLUTION_INSTANCE=segredodosabor >> .env
echo WHATSAPP_BUSINESS_PHONE=5511967696744 >> .env

echo [OK] Arquivo .env atualizado!
echo.

cd ..

REM Substituir whatsappService.js
echo [INFO] Atualizando whatsappService.js...

cd backend\src\services

REM Backup do arquivo original
if exist whatsappService.js (
    copy /Y whatsappService.js whatsappService_BACKUP.js >nul
    echo [OK] Backup criado (whatsappService_BACKUP.js)
)

REM Copiar novo arquivo
if exist whatsappService_EVOLUTION.js (
    copy /Y whatsappService_EVOLUTION.js whatsappService.js >nul
    echo [OK] whatsappService.js atualizado!
) else (
    echo [AVISO] Arquivo whatsappService_EVOLUTION.js nao encontrado
    echo         Execute manualmente a substituicao
)

cd ..\..\..

echo.
echo ========================================
echo  INSTALACAO CONCLUIDA!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Acesse: http://localhost:8080
echo 2. Crie uma instancia com nome: segredodosabor
echo 3. Escaneie o QR Code com WhatsApp (5511967696744)
echo 4. Reinicie o backend (se estiver rodando)
echo 5. Faca um pedido de teste!
echo.
echo ========================================
echo.
echo Deseja abrir o painel Evolution API agora? (S/N)
set /p resposta=

if /i "%resposta%"=="S" (
    start http://localhost:8080
)

echo.
echo [INFO] Para verificar logs: docker logs evolution-api
echo [INFO] Para reiniciar: docker restart evolution-api
echo [INFO] Para parar: docker stop evolution-api
echo.
pause
