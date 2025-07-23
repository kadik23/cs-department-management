<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Speciality;
class SpecialitySeeder extends Seeder {
    public function run() {
        Speciality::insert([
            ['speciality_name' => 'Software Engineering'],
            ['speciality_name' => 'Artificial Intelligence'],
            ['speciality_name' => 'Networks'],
        ]);
    }
} 