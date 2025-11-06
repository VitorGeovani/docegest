@echo off
title Segredo do Sabor - Sistema Completo
color 0A
echo ========================================
echo   Iniciando Sistema Completo
echo   Segredo do Sabor v4.0
echo ========================================
echo.

echo [1/2] Iniciando Backend (porta 5000)...
start "Backend - Segredo do Sabor" cmd /k "cd /d d:\Downloads\Segredos-do-Sabor\backend && npm start"

echo Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Frontend (porta 3000)...
start "Frontend - Segredo do Sabor" cmd /k "cd /d d:\Downloads\Segredos-do-Sabor\frontend && npm start"

echo.
echo ========================================
echo   SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo O navegador abrira automaticamente.
echo.
echo Pressione qualquer tecla para fechar esta janela.
echo (O sistema continuara rodando nas outras janelas)
echo ========================================
pause >nul
