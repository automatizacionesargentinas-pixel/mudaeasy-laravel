<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirect(): mixed
    {
        try {
            $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
            return redirect($url);
        } catch (\Throwable $e) {
            // DEBUG TEMPORAL — se elimina después de identificar el error
            return response()->json([
                'error'                => $e->getMessage(),
                'class'                => get_class($e),
                'file'                 => basename($e->getFile()),
                'line'                 => $e->getLine(),
                'google_client_id_set' => !empty(env('GOOGLE_CLIENT_ID')),
                'google_redirect_set'  => !empty(env('GOOGLE_REDIRECT_URL')),
            ], 500);
        }
    }

    public function callback(Request $request): RedirectResponse
    {
        $frontendUrl = env('FRONTEND_URL', 'https://mudaeasy-laravel.vercel.app');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::updateOrCreate(
                ['google_id' => $googleUser->getId()],
                [
                    'name'   => $googleUser->getName(),
                    'email'  => $googleUser->getEmail(),
                    'avatar' => $googleUser->getAvatar(),
                ]
            );

            $token = $user->createToken('mudaeasy')->plainTextToken;

            // Redirect to frontend with token in URL (SPA picks it up)
            return redirect("{$frontendUrl}?token={$token}");

        } catch (\Exception $e) {
            return redirect("{$frontendUrl}?error=" . urlencode($e->getMessage()));
        }
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user()->load('company'));
    }

    public function updateRole(Request $request): JsonResponse
    {
        $request->validate(['role' => 'required|in:client,company']);
        $request->user()->update(['role' => $request->role]);
        return response()->json($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['ok' => true]);
    }
}
