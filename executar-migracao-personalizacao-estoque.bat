@echo off
chcp 65001 > nul
cls

echo ===============================================================================
echo 🎨 MIGRAÇÃO: PERSONALIZAÇÃO COM CONTROLE DE ESTOQUE
echo ===============================================================================
echo.
echo Este script irá executar a migração que vincula personalizações aos
echo ingredientes, permitindo controle de estoque ao personalizar produtos.
echo.
echo Arquivos:
echo   - vincular-personalizacao-ingredientes.sql
echo.
echo ===============================================================================
echo.

set /p confirmar="Deseja continuar? (S/N): "

if /i "%confirmar%" neq "S" (
    echo.
    echo ❌ Operação cancelada.
    pause
    exit /b
)

echo.
echo 📋 Iniciando migração...
echo.

REM Configurações do MySQL - AJUSTE CONFORME SUA INSTALAÇÃO
set MYSQL_USER=root
set MYSQL_PASS=
set MYSQL_DB=db_segredo_do_sabor

REM Caminhos possíveis do MySQL
set MYSQL_PATH1=C:\xampp\mysql\bin\mysql.exe
set MYSQL_PATH2=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
set MYSQL_PATH3=C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe

REM Detectar instalação do MySQL
if exist "%MYSQL_PATH1%" (
    set MYSQL_EXE=%MYSQL_PATH1%
    echo ✅ MySQL encontrado: XAMPP
) else if exist "%MYSQL_PATH2%" (
    set MYSQL_EXE=%MYSQL_PATH2%
    echo ✅ MySQL encontrado: MySQL Server 8.0
) else if exist "%MYSQL_PATH3%" (
    set MYSQL_EXE=%MYSQL_PATH3%
    echo ✅ MySQL encontrado: WAMP
) else (
    echo ❌ MySQL não encontrado em nenhum caminho padrão.
    echo.
    echo Por favor, execute manualmente:
    echo mysql -u root -p db_segredo_do_sabor ^< vincular-personalizacao-ingredientes.sql
    echo.
    pause
    exit /b 1
)

echo.
echo 🔄 Executando migração...
echo.

if "%MYSQL_PASS%"=="" (
    "%MYSQL_EXE%" -u %MYSQL_USER% %MYSQL_DB% < vincular-personalizacao-ingredientes.sql
) else (
    "%MYSQL_EXE%" -u %MYSQL_USER% -p%MYSQL_PASS% %MYSQL_DB% < vincular-personalizacao-ingredientes.sql
)

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===============================================================================
    echo ✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!
    echo ===============================================================================
    echo.
    echo 📋 O que foi criado:
    echo   - Tabela: personalizacao_ingrediente
    echo   - View: vw_personalizacao_com_ingredientes
    echo   - View: vw_disponibilidade_personalizacao
    echo   - Procedure: sp_verificar_disponibilidade_personalizacao
    echo   - Dados de exemplo vinculados
    echo.
    echo 📌 Próximos passos:
    echo   1. Iniciar o backend: cd backend ^&^& npm start
    echo   2. Testar endpoints: node backend\testar-personalizacao-estoque.js
    echo   3. Verificar banco: Consultar views criadas
    echo.
    echo 📖 Documentação completa:
    echo   - GUIA_PERSONALIZACAO_ESTOQUE.md
    echo   - RESUMO_IMPLEMENTACAO.md
    echo.
    echo ===============================================================================
) else (
    echo.
    echo ===============================================================================
    echo ❌ ERRO NA MIGRAÇÃO
    echo ===============================================================================
    echo.
    echo Possíveis causas:
    echo   - Banco de dados não existe
    echo   - Usuário/senha incorretos
    echo   - MySQL não está rodando
    echo   - Tabelas já existem
    echo.
    echo Tente executar manualmente:
    echo   mysql -u root -p db_segredo_do_sabor ^< vincular-personalizacao-ingredientes.sql
    echo.
    echo ===============================================================================
)

echo.
pause
