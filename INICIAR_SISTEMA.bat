@echo off
echo ========================================
echo  SEGREDOS DO SABOR - Sistema Completo
echo ========================================
echo.
echo [1/2] Iniciando Backend...
echo.

cd backend
start "Backend - Segredos do Sabor" cmd /k "npm start"

timeout /t 3 /nobreak >nul

echo.
echo [2/2] Iniciando Frontend...
echo.

cd ..\frontend
start "Frontend - Segredos do Sabor" cmd /k "npm start"

echo.
echo ========================================
echo  Sistema iniciado!
echo ========================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo  Catalogo: http://localhost:3000/catalogo
echo.
echo  Pressione qualquer tecla para fechar...
pause >nul
