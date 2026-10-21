<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExamSchedulerSetting;

class ExamSchedulerSettingSeeder extends Seeder
{
    public function run()
    {
        ExamSchedulerSetting::firstOrCreate(
            ['id' => 1],
            [
                'exam_duration' => 90,
                'first_exam_start_at' => '08:30',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
} 