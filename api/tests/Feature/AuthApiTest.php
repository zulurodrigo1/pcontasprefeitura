<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@prefeitura.gov.br',
            'password' => 'Demo@123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@prefeitura.gov.br',
            'password' => 'Demo@123',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'admin@prefeitura.gov.br')
            ->assertJsonPath('data.token_type', 'bearer');
    }

    public function test_authenticated_user_can_fetch_profile(): void
    {
        $user = User::factory()->create([
            'email' => 'profile@prefeitura.gov.br',
        ]);

        $token = $user->createToken('portal-test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")->getJson('/api/me');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', $user->email);
    }
}
