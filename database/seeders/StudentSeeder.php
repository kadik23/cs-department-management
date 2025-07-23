<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\User;
use App\Models\AcademicLevel;
use App\Models\Group;
class StudentSeeder extends Seeder {
    public function run() {
        $users = User::pluck('id', 'username');
        $levels = AcademicLevel::pluck('id', 'level');
        $groups = Group::pluck('id', 'group_number');
        Student::insert([
            [
                'user_id' => $users['student'] ?? $users->first(),
                'academic_level_id' => $levels[1] ?? $levels->first(),
                'group_id' => $groups[1] ?? $groups->first(),
            ],
            [
                'user_id' => $users['student2'] ?? $users->skip(1)->first(),
                'academic_level_id' => $levels[2] ?? $levels->skip(1)->first(),
                'group_id' => $groups[2] ?? $groups->skip(1)->first(),
            ],
            [
                'user_id' => $users['student3'] ?? $users->skip(2)->first(),
                'academic_level_id' => $levels[3] ?? $levels->skip(2)->first(),
                'group_id' => $groups[3] ?? $groups->skip(2)->first(),
            ],
        ]);
    }
} 