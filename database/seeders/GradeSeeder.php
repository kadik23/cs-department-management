<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Grade;
use App\Models\Student;
use App\Models\Semester;
use App\Models\Subject;

class GradeSeeder extends Seeder
{
    public function run()
    {
        $students = Student::all();
        $semesters = Semester::all();
        $subjects = Subject::all();

        if ($students->isEmpty() || $semesters->isEmpty() || $subjects->isEmpty()) {
            return;
        }

        // Base grades for variety
        $sampleNotes = [
            ['control' => 14.5, 'exam' => 16.0],
            ['control' => 12.0, 'exam' => 13.5],
            ['control' => 17.0, 'exam' => 18.0],
            ['control' => 10.5, 'exam' => 11.0],
            ['control' => 15.0, 'exam' => 14.0],
            ['control' => 18.5, 'exam' => 19.0],
            ['control' => 13.0, 'exam' => 15.5],
            ['control' => 16.0, 'exam' => 17.0],
        ];

        // Seed grades for each semester
        foreach ($semesters as $semIdx => $semester) {
            foreach ($students as $studIdx => $student) {
                // Seed 4-6 subjects per student
                foreach ($subjects->take(6) as $subIdx => $subject) {
                    $notePair = $sampleNotes[($studIdx + $subIdx + $semIdx) % count($sampleNotes)];

                    Grade::updateOrCreate(
                        [
                            'student_id' => $student->id,
                            'semester_id' => $semester->id,
                            'subject_id' => $subject->id,
                        ],
                        [
                            'control_note' => $notePair['control'],
                            'exam_note' => $notePair['exam'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        }
    }
} 