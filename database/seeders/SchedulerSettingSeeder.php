<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchedulerSetting;

class SchedulerSettingSeeder extends Seeder
{
    public function run()
    {
        SchedulerSetting::firstOrCreate(
            ['id' => 1],
            [
                'class_duration' => 60,
                'first_class_start_at' => '08:00',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
} 