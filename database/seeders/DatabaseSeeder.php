<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Least dependent
            UserSeeder::class,
            SpecialitySeeder::class,
            AcademicLevelSeeder::class,
            GroupSeeder::class,
            ResourceSeeder::class,
            SubjectSeeder::class,
            SemesterSeeder::class,
            // 2. Entities referencing above
            TeacherSeeder::class,
            StudentSeeder::class,
            // 3. Entities referencing above
            ScheduleSeeder::class,
            LectureSeeder::class,
            AttendanceSeeder::class,
            GradeSeeder::class,
            // 4. Settings and admin
            DefaultDataSeeder::class,
            AdministratorSeeder::class,
            SchedulerSettingSeeder::class,
            ExamSchedulerSettingSeeder::class,
            ExamsScheduleSeeder::class,
        ]);
    }
}
