<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'demo@prefeitura.gov.br'],
            [
                'name' => 'Administrador Demo',
                'password' => Hash::make('Demo@123'),
            ]
        );

        User::factory()->count(5)->create();
    }
}
