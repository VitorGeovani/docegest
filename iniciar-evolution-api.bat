@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 INICIANDO EVOLUTION API
echo ========================================
echo.

cd D:\Downloads\Segredos-do-Sabor\evolution-api

echo 📂 Pasta: %CD%
echo.

echo ⏳ Iniciando servidor...
echo 🌐 URL: http://localhost:8080
echo.

npm start

pause
