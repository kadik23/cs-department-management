<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Semester;
class SemesterSeeder extends Seeder {
    public function run() {
        Semester::insert([
            ['semester_name' => 'Fall 2024', 'start_at' => '2024-09-01', 'end_at' => '2025-01-15'],
            ['semester_name' => 'Spring 2025', 'start_at' => '2025-02-01', 'end_at' => '2025-06-01'],
            ['semester_name' => 'Summer 2025', 'start_at' => '2025-06-15', 'end_at' => '2025-08-31'],
        ]);
    }
} 