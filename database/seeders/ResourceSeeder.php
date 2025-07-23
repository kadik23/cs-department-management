<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Resource;
class ResourceSeeder extends Seeder {
    public function run() {
        Resource::insert([
            ['resource_type' => 'Amphi', 'resource_number' => 101],
            ['resource_type' => 'Lab', 'resource_number' => 201],
            ['resource_type' => 'Classroom', 'resource_number' => 301],
        ]);
    }
} 