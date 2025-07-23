<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\AcademicLevel;
use App\Models\Speciality;
class AcademicLevelSeeder extends Seeder {
    public function run() {
        $specialities = Speciality::pluck('id', 'speciality_name');
        AcademicLevel::insert([
            ['speciality_id' => $specialities['Software Engineering'] ?? $specialities->first(), 'level' => 1],
            ['speciality_id' => $specialities['Artificial Intelligence'] ?? $specialities->skip(1)->first(), 'level' => 2],
            ['speciality_id' => $specialities['Networks'] ?? $specialities->skip(2)->first(), 'level' => 3],
        ]);
    }
} 