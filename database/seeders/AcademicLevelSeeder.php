<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicLevel;
use App\Models\Speciality;

class AcademicLevelSeeder extends Seeder
{
    public function run()
    {
        $specialities = Speciality::all();

        foreach ($specialities as $speciality) {
            // Software Engineering and AI have L1 through M2 (1..5)
            $maxLevel = in_array($speciality->speciality_name, ['Software Engineering', 'Artificial Intelligence & Data Science']) ? 5 : 3;

            for ($lvl = 1; $lvl <= $maxLevel; $lvl++) {
                AcademicLevel::updateOrCreate(
                    [
                        'speciality_id' => $speciality->id,
                        'level' => $lvl,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
} 