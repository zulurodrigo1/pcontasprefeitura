<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private UserRepository $userRepository) {}

    public function index()
    {
        return UserResource::collection($this->userRepository->listUsers());
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userRepository->createUser($request->validated());

        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($user),
            ],
            'message' => 'Usuário criado com sucesso.',
        ], 201);
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $updatedUser = $this->userRepository->updateUser($user, $request->validated());

        return new UserResource($updatedUser);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->userRepository->deleteUser($user);

        return response()->json(null, 204);
    }
}
