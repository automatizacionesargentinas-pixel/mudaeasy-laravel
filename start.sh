#!/bin/bash
set -e

echo "=== MudaEasy Startup ==="
echo "APP_URL: ${APP_URL:-NOT SET}"
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:0:20}..."

# Generate .env from the shell environment (which CAN read Railway vars)
# This bypasses the php artisan serve / proc_open() env-stripping issue
{
  [ -n "$APP_ENV" ]                  && printf 'APP_ENV=%s\n'                  "$APP_ENV"
  [ -n "$APP_KEY" ]                  && printf 'APP_KEY=%s\n'                  "$APP_KEY"
  [ -n "$APP_DEBUG" ]                && printf 'APP_DEBUG=%s\n'                "$APP_DEBUG"
  [ -n "$APP_URL" ]                  && printf 'APP_URL=%s\n'                  "$APP_URL"
  [ -n "$DB_CONNECTION" ]            && printf 'DB_CONNECTION=%s\n'            "$DB_CONNECTION"
  [ -n "$DB_HOST" ]                  && printf 'DB_HOST=%s\n'                  "$DB_HOST"
  [ -n "$DB_PORT" ]                  && printf 'DB_PORT=%s\n'                  "$DB_PORT"
  [ -n "$DB_DATABASE" ]              && printf 'DB_DATABASE=%s\n'              "$DB_DATABASE"
  [ -n "$DB_USERNAME" ]              && printf 'DB_USERNAME=%s\n'              "$DB_USERNAME"
  [ -n "$DB_PASSWORD" ]              && printf 'DB_PASSWORD=%s\n'              "$DB_PASSWORD"
  [ -n "$GOOGLE_CLIENT_ID" ]         && printf 'GOOGLE_CLIENT_ID=%s\n'         "$GOOGLE_CLIENT_ID"
  [ -n "$GOOGLE_CLIENT_SECRET" ]     && printf 'GOOGLE_CLIENT_SECRET=%s\n'     "$GOOGLE_CLIENT_SECRET"
  [ -n "$GOOGLE_REDIRECT_URL" ]      && printf 'GOOGLE_REDIRECT_URL=%s\n'      "$GOOGLE_REDIRECT_URL"
  [ -n "$FRONTEND_URL" ]             && printf 'FRONTEND_URL=%s\n'             "$FRONTEND_URL"
  [ -n "$CACHE_STORE" ]              && printf 'CACHE_STORE=%s\n'              "$CACHE_STORE"
  [ -n "$QUEUE_CONNECTION" ]         && printf 'QUEUE_CONNECTION=%s\n'         "$QUEUE_CONNECTION"
  [ -n "$SESSION_DRIVER" ]           && printf 'SESSION_DRIVER=%s\n'           "$SESSION_DRIVER"
  [ -n "$SANCTUM_STATEFUL_DOMAINS" ] && printf 'SANCTUM_STATEFUL_DOMAINS=%s\n' "$SANCTUM_STATEFUL_DOMAINS"
} > .env

echo "=== .env generated (${APP_KEY:+APP_KEY ok, }${GOOGLE_CLIENT_ID:+GOOGLE_CLIENT_ID ok}) ==="

chmod -R 775 storage bootstrap/cache
php artisan config:clear
php artisan migrate --force
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
