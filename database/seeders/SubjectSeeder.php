<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Subject;
class SubjectSeeder extends Seeder {
    public function run() {
        Subject::insert([
            ['subject_name' => 'Mathematics', 'coefficient' => 2, 'credit' => 3],
            ['subject_name' => 'Programming', 'coefficient' => 3, 'credit' => 4],
            ['subject_name' => 'Networks', 'coefficient' => 2, 'credit' => 3],
        ]);
    }
} 