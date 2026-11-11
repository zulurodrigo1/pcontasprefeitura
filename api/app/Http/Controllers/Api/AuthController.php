<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $user = $this->authService->login($request->validated());
        } catch (AuthenticationException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
                'errors' => [
                    'email' => [$exception->getMessage()],
                ],
            ], 401);
        }

        $token = $user->createToken('portal-access')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => 3600,
            ],
            'message' => 'Login realizado com sucesso.',
        ], 200);
    }

    public function me(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource(Auth::user()),
            ],
            'message' => 'Usuário autenticado.',
        ]);
    }

    public function logout(): JsonResponse
    {
        Auth::user()?->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout realizado com sucesso.',
        ]);
    }
}
