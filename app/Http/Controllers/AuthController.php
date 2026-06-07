<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirect(): JsonResponse
    {
        $url = Socialite::driver('google')
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    public function callback(Request $request): JsonResponse
    {
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

            return response()->json([
                'token' => $token,
                'user'  => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Auth failed: ' . $e->getMessage()], 401);
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
