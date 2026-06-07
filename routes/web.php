<?php

use Illuminate\Support\Facades\Route;

// SPA catch-all — el frontend React maneja el routing
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
