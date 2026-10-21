<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resource;

class ResourceSeeder extends Seeder
{
    public function run()
    {
        $resources = [
            ['resource_type' => 'Amphi', 'resource_number' => 1],
            ['resource_type' => 'Amphi', 'resource_number' => 2],
            ['resource_type' => 'Amphi', 'resource_number' => 3],
            ['resource_type' => 'Lab', 'resource_number' => 101],
            ['resource_type' => 'Lab', 'resource_number' => 102],
            ['resource_type' => 'Lab', 'resource_number' => 103],
            ['resource_type' => 'Classroom', 'resource_number' => 201],
            ['resource_type' => 'Classroom', 'resource_number' => 202],
            ['resource_type' => 'Classroom', 'resource_number' => 203],
            ['resource_type' => 'Classroom', 'resource_number' => 204],
            ['resource_type' => 'Classroom', 'resource_number' => 301],
            ['resource_type' => 'Classroom', 'resource_number' => 302],
        ];

        foreach ($resources as $resource) {
            Resource::updateOrCreate(
                [
                    'resource_type' => $resource['resource_type'],
                    'resource_number' => $resource['resource_number'],
                ],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
} 