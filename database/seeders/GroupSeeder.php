<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\AcademicLevel;
use App\Models\User;

class GroupSeeder extends Seeder
{
    public function run()
    {
        $levels = AcademicLevel::all();
        $adminOrTeacher = User::where('username', 'admin')->first() ?? User::first();
        $teachers = User::where('username', 'like', 'teacher%')->get();

        $groupIndex = 1;
        foreach ($levels as $level) {
            // Pick responsible teacher/user
            $responsibleUser = $teachers->isNotEmpty() 
                ? $teachers[$groupIndex % $teachers->count()]->id 
                : $adminOrTeacher->id;

            // Group 1
            Group::updateOrCreate(
                [
                    'group_number' => 1,
                    'academic_level_id' => $level->id,
                ],
                [
                    'responsible' => $responsibleUser,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // Group 2 for first few levels
            if ($level->level <= 3) {
                Group::updateOrCreate(
                    [
                        'group_number' => 2,
                        'academic_level_id' => $level->id,
                    ],
                    [
                        'responsible' => $responsibleUser,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            $groupIndex++;
        }
    }
} 