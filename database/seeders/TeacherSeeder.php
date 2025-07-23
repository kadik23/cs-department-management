<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Teacher;
use App\Models\User;
class TeacherSeeder extends Seeder {
    public function run() {
        $users = User::pluck('id', 'username');
        Teacher::insert([
            ['user_id' => $users['teacher1'] ?? $users->first()],
            ['user_id' => $users['teacher2'] ?? $users->skip(1)->first()],
            ['user_id' => $users['teacher3'] ?? $users->skip(2)->first()],
        ]);
    }
} 