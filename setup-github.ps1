# MudaEasy - Setup GitHub
# Ejecuta este script en PowerShell como administrador

$projectPath = "C:\Users\Usuario\Downloads\MudaEasy\mudaeasy-laravel"
$repoName = "mudaeasy-laravel"
$githubUser = "automatizacionesargentinas"

Write-Host "==============================" -ForegroundColor Cyan
Write-Host "  MudaEasy - Subir a GitHub" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Ir al proyecto
Set-Location $projectPath

# Pedir token de GitHub
Write-Host ""
Write-Host "Necesitas un GitHub Personal Access Token." -ForegroundColor Yellow
Write-Host "Crealo en: https://github.com/settings/tokens/new" -ForegroundColor Yellow
Write-Host "Permisos necesarios: 'repo' (check all repo options)" -ForegroundColor Yellow
Write-Host ""
$token = Read-Host "Pega tu GitHub Token aqui"

# Crear repo via API
Write-Host ""
Write-Host "Creando repositorio en GitHub..." -ForegroundColor Green
$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github.v3+json"
}
$body = @{
    name = $repoName
    private = $true
    description = "MudaEasy - Sistema de presupuestos de mudanzas (Laravel + React PWA)"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Repositorio creado: $($response.html_url)" -ForegroundColor Green
} catch {
    Write-Host "El repositorio ya existe o hubo un error. Continuando..." -ForegroundColor Yellow
}

# Git init y push
Write-Host ""
Write-Host "Inicializando Git y subiendo codigo..." -ForegroundColor Green

git init
git add .
git commit -m "MudaEasy Laravel - Initial commit"
git branch -M main
git remote remove origin 2>$null
git remote add origin "https://$token@github.com/$githubUser/$repoName.git"
git push -u origin main

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "  Listo! Proyecto en GitHub:" -ForegroundColor Cyan
Write-Host "  https://github.com/$githubUser/$repoName" -ForegroundColor White
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora ve a railway.com y:" -ForegroundColor Yellow
Write-Host "1. New Project > Deploy from GitHub > mudaeasy-laravel" -ForegroundColor White
Write-Host "2. Add Service > Database > MySQL" -ForegroundColor White
Write-Host "3. Configura las variables de entorno del README" -ForegroundColor White
Write-Host ""
Read-Host "Presiona Enter para cerrar"
