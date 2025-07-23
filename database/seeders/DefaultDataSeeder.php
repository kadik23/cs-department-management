<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Administrator;
use App\Models\SchedulerSetting;
use App\Models\ExamSchedulerSetting;
use Illuminate\Support\Facades\Hash;

class DefaultDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if not exists
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@univ-medea.dz'],
            [
                'first_name' => 'admin',
                'last_name' => 'admin',
                'username' => 'admin',
                'password' => Hash::make('password'),
            ]
        );

        // Create administrator record if not exists
        Administrator::firstOrCreate([
            'user_id' => $adminUser->id,
        ]);

        // Insert default scheduler settings if not exists
        SchedulerSetting::firstOrCreate([
            'class_duration' => 60,
            'first_class_start_at' => '08:00',
        ]);

        // Insert default exam scheduler settings if not exists
        ExamSchedulerSetting::firstOrCreate([
            'exam_duration' => 90,
            'first_exam_start_at' => '08:30',
        ]);
    }
}
