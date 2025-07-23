<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Administrator;
class AdministratorSeeder extends Seeder {
    public function run() {
        Administrator::insert([
            ['user_id' => 1],
            ['user_id' => 2],
            ['user_id' => 3],
        ]);
    }
} 