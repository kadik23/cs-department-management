<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Administrator;
use App\Models\User;

class AdministratorSeeder extends Seeder
{
    public function run()
    {
        $admin = User::where('username', 'admin')->first();
        if ($admin) {
            Administrator::updateOrCreate(
                ['user_id' => $admin->id],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
} 