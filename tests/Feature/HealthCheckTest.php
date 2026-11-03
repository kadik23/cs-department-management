<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    /**
     * Test healthcheck endpoint returns successful response.
     */
    public function test_healthcheck_returns_ok(): void
    {
        $response = $this->get('/healthcheck');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
            ])
            ->assertJsonStructure([
                'status',
                'timestamp',
            ]);
    }

    /**
     * Test health endpoint returns successful response.
     */
    public function test_health_returns_ok(): void
    {
        $response = $this->get('/health');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
            ])
            ->assertJsonStructure([
                'status',
                'timestamp',
            ]);
    }
}
