<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\CompanyController;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'app' => 'MudaEasy']));

// DEBUG TEMPORAL
Route::get('/debug-config', fn() => response()->json([
    'getenv_PORT'             => getenv('PORT') ?: 'EMPTY',
    'getenv_RAILWAY_ENV'      => getenv('RAILWAY_ENVIRONMENT') ?: 'EMPTY',
    'getenv_GOOGLE_CLIENT_ID' => getenv('GOOGLE_CLIENT_ID') ? 'SET' : 'EMPTY',
    'getenv_APP_URL'          => getenv('APP_URL') ?: 'EMPTY',
    'server_PORT'             => $_SERVER['PORT'] ?? 'not-in-SERVER',
    'server_GOOGLE_CLIENT_ID' => isset($_SERVER['GOOGLE_CLIENT_ID']) ? 'SET-in-SERVER' : 'not-in-SERVER',
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
