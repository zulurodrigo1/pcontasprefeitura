<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository
{
    public function listUsers(): LengthAwarePaginator
    {
        return User::query()->orderBy('name')->paginate(15);
    }

    public function findById(int $id): ?User
    {
        return User::query()->find($id);
    }

    public function createUser(array $attributes): User
    {
        return User::query()->create($attributes);
    }

    public function updateUser(User $user, array $attributes): User
    {
        $user->update($attributes);

        return $user->refresh();
    }

    public function deleteUser(User $user): void
    {
        $user->delete();
    }
}
