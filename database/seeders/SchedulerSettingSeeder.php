<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\SchedulerSetting;
class SchedulerSettingSeeder extends Seeder {
    public function run() {
        SchedulerSetting::insert([
            ['class_duration' => 60, 'first_class_start_at' => '08:00'],
            ['class_duration' => 90, 'first_class_start_at' => '09:00'],
            ['class_duration' => 120, 'first_class_start_at' => '10:00'],
        ]);
    }
} 