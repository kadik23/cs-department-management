<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;

class SubjectSeeder extends Seeder
{
    public function run()
    {
        $subjects = [
            ['subject_name' => 'Algorithms & Data Structures', 'coefficient' => 3, 'credit' => 5],
            ['subject_name' => 'Object-Oriented Programming (Java)', 'coefficient' => 3, 'credit' => 5],
            ['subject_name' => 'Database Management Systems', 'coefficient' => 3, 'credit' => 4],
            ['subject_name' => 'Computer Networks & Protocols', 'coefficient' => 2, 'credit' => 4],
            ['subject_name' => 'Operating Systems & Architecture', 'coefficient' => 3, 'credit' => 4],
            ['subject_name' => 'Web Technologies & Frameworks', 'coefficient' => 2, 'credit' => 3],
            ['subject_name' => 'Artificial Intelligence Fundamentals', 'coefficient' => 3, 'credit' => 5],
            ['subject_name' => 'Software Engineering & UML', 'coefficient' => 2, 'credit' => 3],
            ['subject_name' => 'Information Security & Cryptography', 'coefficient' => 2, 'credit' => 3],
            ['subject_name' => 'Linear Algebra & Probabilities', 'coefficient' => 2, 'credit' => 3],
            ['subject_name' => 'Distributed Systems & Cloud Computing', 'coefficient' => 3, 'credit' => 4],
            ['subject_name' => 'Mobile Application Development', 'coefficient' => 2, 'credit' => 3],
        ];

        foreach ($subjects as $subject) {
            Subject::updateOrCreate(
                ['subject_name' => $subject['subject_name']],
                [
                    'coefficient' => $subject['coefficient'],
                    'credit' => $subject['credit'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
} 