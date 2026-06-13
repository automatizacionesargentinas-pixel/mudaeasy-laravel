@echo off
echo ==============================
echo   MudaEasy - Push a GitHub
echo ==============================

REM Ir a la carpeta correcta
cd /d "%~dp0"

echo Carpeta actual: %CD%
dir /b | find "composer.json" >nul 2>&1
if errorlevel 1 (
    echo ERROR: No se encontraron los archivos del proyecto aqui
    echo Mova este archivo .bat dentro de la carpeta mudaeasy-laravel
    pause
    exit /b 1
)

echo Archivos encontrados. Iniciando git...

git init
git add -A
git status
git commit -m "MudaEasy Laravel - Initial commit"
git branch -M main
git remote remove origin 2>nul
git remote add origin "https://github.com/automatizacionesargentinas-pixel/mudaeasy-laravel.git"
git push -u origin main --force

echo.
echo ==============================
echo  Listo! https://github.com/automatizacionesargentinas-pixel/mudaeasy-laravel
echo ==============================
pause
