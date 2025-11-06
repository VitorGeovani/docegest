@echo off
echo ========================================
echo ATUALIZANDO BANCO DE DADOS
echo ========================================
echo.

mysql -u root -p1234 db_segredo_do_sabor < atualizar_banco_auth.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCESSO! Banco atualizado e populado
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERRO ao executar script SQL
    echo ========================================
)

pause
