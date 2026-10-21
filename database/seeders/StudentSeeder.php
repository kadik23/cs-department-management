<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\User;
use App\Models\AcademicLevel;
use App\Models\Group;

class StudentSeeder extends Seeder
{
    public function run()
    {
        $studentUsers = User::where('username', 'like', 'student%')->get();
        $groups = Group::with('academicLevel')->get();

        if ($groups->isEmpty()) {
            return;
        }

        // Put the first 4 students in Group 1 so they are colleagues
        $groupCount = $groups->count();

        foreach ($studentUsers as $idx => $user) {
            // First 4 students belong to group 0 (Group 1 of Level 1)
            if ($idx < 4) {
                $targetGroup = $groups[0];
            } else {
                $targetGroup = $groups[$idx % $groupCount];
            }

            Student::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'academic_level_id' => $targetGroup->academic_level_id,
                    'group_id' => $targetGroup->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
} 