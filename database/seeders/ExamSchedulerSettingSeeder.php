<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\ExamSchedulerSetting;
class ExamSchedulerSettingSeeder extends Seeder {
    public function run() {
        ExamSchedulerSetting::insert([
            ['exam_duration' => 90, 'first_exam_start_at' => '08:30'],
            ['exam_duration' => 120, 'first_exam_start_at' => '09:00'],
            ['exam_duration' => 60, 'first_exam_start_at' => '10:00'],
        ]);
    }
} 