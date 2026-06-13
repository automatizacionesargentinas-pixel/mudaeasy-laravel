<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\CompanyController;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'app' => 'MudaEasy']));

// DEBUG TEMPORAL
Route::get('/debug-config', fn() => response()->json([
    'env_GOOGLE_CLIENT_ID'    => substr(getenv('GOOGLE_CLIENT_ID') ?: '', 0, 15) . '...',
    'env_APP_URL'             => getenv('APP_URL'),
    'env_DB_HOST'             => getenv('DB_HOST') ? 'set' : 'empty',
    'config_google_client_id' => substr(config('services.google.client_id') ?? '', 0, 15) . '...',
    'config_app_url'          => config('app.url'),
    'dotenv_loaded'           => file_exists(base_path('.env')),
]));


// Auth
Route::get('/auth/google', [AuthController::class, 'redirect']);
Route::get('/auth/google/callback', [AuthController::class, 'callback']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::put('/auth/role', [AuthController::class, 'updateRole'])->middleware('auth:sanctum');

// Quotes (authenticated)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/quotes', [QuoteController::class, 'index']);
    Route::post('/quotes', [QuoteController::class, 'store']);
    Route::get('/quotes/{quote}', [QuoteController::class, 'show']);
    Route::put('/quotes/{quote}', [QuoteController::class, 'update']);
    Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy']);
    Route::get('/quotes/{quote}/pdf', [QuoteController::class, 'pdf']);

    // Companies — mine va antes del parámetro para evitar conflictos de routing
    Route::get('/companies', [CompanyController::class, 'index']);
    Route::post('/companies', [CompanyController::class, 'store']);
    Route::get('/companies/mine', [CompanyController::class, 'mine']);
    Route::put('/companies/{company}', [CompanyController::class, 'update']);
});
