<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Semester;
use Carbon\Carbon;

class SemesterSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();
        $currentYear = $now->year;

        $semesters = [
            [
                'semester_name' => 'Fall ' . ($currentYear - 1),
                'start_at' => Carbon::create($currentYear - 1, 9, 1)->toDateString(),
                'end_at' => Carbon::create($currentYear, 1, 20)->toDateString(),
            ],
            [
                'semester_name' => 'Spring ' . $currentYear,
                'start_at' => $now->copy()->subMonths(2)->startOfMonth()->toDateString(),
                'end_at' => $now->copy()->addMonths(4)->endOfMonth()->toDateString(),
            ],
            [
                'semester_name' => 'Fall ' . $currentYear,
                'start_at' => Carbon::create($currentYear, 9, 1)->toDateString(),
                'end_at' => Carbon::create($currentYear + 1, 1, 20)->toDateString(),
            ],
        ];

        foreach ($semesters as $semester) {
            Semester::updateOrCreate(
                ['semester_name' => $semester['semester_name']],
                [
                    'start_at' => $semester['start_at'],
                    'end_at' => $semester['end_at'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
} 