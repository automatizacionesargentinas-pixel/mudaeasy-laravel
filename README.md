# MudaEasy — Laravel + React PWA

Sistema de presupuestos de mudanzas. Laravel API + React PWA mobile-first.

## Stack
- **Backend**: Laravel 11 + Sanctum + Socialite (Google Auth)
- **Base de datos**: MySQL (Railway) o SQLite (local)
- **Frontend**: React 18 + Tailwind CSS + Vite PWA
- **PDF**: DomPDF (Laravel)
- **Deploy**: Railway (backend) + Vercel/Railway (frontend)

## Setup local

### Backend
```bash
cd mudaeasy-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env    # poner URL del backend
npm run dev
```

## Deploy en Railway

1. Subir a GitHub
2. Crear nuevo proyecto en Railway → "Deploy from GitHub"
3. Agregar MySQL plugin en Railway
4. Configurar variables de entorno:
   - `APP_KEY` → `php artisan key:generate --show`
   - `DB_CONNECTION=mysql` + credenciales de Railway
   - `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`
   - `APP_URL` → URL de Railway
   - `FRONTEND_URL` → URL del frontend (para CORS)

## Variables de entorno necesarias

```
APP_KEY=
APP_URL=https://tu-app.up.railway.app
DB_CONNECTION=mysql
DB_HOST=...  (Railway te da esto)
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=...
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=https://tu-app.up.railway.app/api/auth/google/callback
```

## Instalación como app en el celular

1. Abrir la URL en Chrome (Android) o Safari (iPhone)
2. En Android: menú → "Agregar a pantalla de inicio"
3. En iPhone: botón compartir → "Agregar a pantalla de inicio"
