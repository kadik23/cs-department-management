<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Speciality;

class SpecialitySeeder extends Seeder
{
    public function run()
    {
        $specialities = [
            'Software Engineering',
            'Artificial Intelligence & Data Science',
            'Networks & Distributed Systems',
            'Information Systems & Web Technologies',
            'Computer Systems & Architecture',
        ];

        foreach ($specialities as $name) {
            Speciality::updateOrCreate(
                ['speciality_name' => $name],
                [
                    'speciality_name' => $name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
} 