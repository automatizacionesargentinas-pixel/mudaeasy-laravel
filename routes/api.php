<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\CompanyController;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'app' => 'MudaEasy']));

// DEBUG TEMPORAL — testea Socialite sin pasar por el controller
Route::get('/debug-socialite', function () {
    try {
        $cfg = config('services.google');
        $url = \Laravel\Socialite\Facades\Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
        return response()->json([
            'ok'            => true,
            'url_preview'   => substr($url, 0, 60) . '...',
            'client_id_set' => !empty($cfg['client_id']),
            'secret_set'    => !empty($cfg['client_secret']),
            'redirect'      => $cfg['redirect'] ?? null,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'ok'            => false,
            'error'         => $e->getMessage(),
            'class'         => get_class($e),
            'client_id_set' => !empty(env('GOOGLE_CLIENT_ID')),
            'secret_set'    => !empty(env('GOOGLE_CLIENT_SECRET')),
            'redirect'      => env('GOOGLE_REDIRECT_URL'),
        ]);
    }
});

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
