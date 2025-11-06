@echo off
echo ============================================================
echo  MIGRACAO DE PREFERENCIAS DE CLIENTES (RF055)
echo ============================================================
echo.
echo Este script ira criar a estrutura de preferencias no banco:
echo - Tabela cliente_preferencias
echo - 4 Stored Procedures
echo - 2 Views
echo - 1 Trigger
echo.
echo Pressione qualquer tecla para continuar ou Ctrl+C para cancelar...
pause >nul

cd backend

echo.
echo Executando migracao...
echo.

node executar-migracao-preferencias.js

echo.
echo ============================================================
echo Pressione qualquer tecla para fechar...
pause >nul
