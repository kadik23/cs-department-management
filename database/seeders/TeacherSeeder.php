<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Teacher;
use App\Models\User;

class TeacherSeeder extends Seeder
{
    public function run()
    {
        $teacherUsers = User::where('username', 'like', 'teacher%')->get();

        foreach ($teacherUsers as $user) {
            Teacher::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
} 