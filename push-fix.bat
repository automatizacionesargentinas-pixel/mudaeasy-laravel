@echo off
cd /d "C:\Users\Usuario\Downloads\MudaEasy\mudaeasy---presupuestos-de-mudanzas-VERSION-FINAL-VERCEL\mudaeasy-laravel"
echo Verificando estado...
git status
echo.
echo Haciendo commit y push del fix...
git add resources/views/app.blade.php
git add app/Models/User.php
git commit -m "Fix: add missing app.blade.php view (was causing 500 on all routes)"
git push
echo.
echo LISTO! Revisa Railway para ver el redeploy.
pause
