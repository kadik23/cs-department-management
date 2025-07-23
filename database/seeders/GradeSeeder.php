<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Grade;
use App\Models\Student;
use App\Models\Semester;
use App\Models\Subject;
class GradeSeeder extends Seeder {
    public function run() {
        $students = Student::pluck('id')->all();
        $semesters = Semester::pluck('id')->all();
        $subjects = Subject::pluck('id')->all();
        Grade::insert([
            [
                'student_id' => $students[0] ?? 1,
                'semester_id' => $semesters[0] ?? 1,
                'subject_id' => $subjects[0] ?? 1,
                'control_note' => 15,
                'exam_note' => 16,
            ],
            [
                'student_id' => $students[1] ?? $students[0] ?? 1,
                'semester_id' => $semesters[1] ?? $semesters[0] ?? 1,
                'subject_id' => $subjects[1] ?? $subjects[0] ?? 1,
                'control_note' => 12,
                'exam_note' => 14,
            ],
            [
                'student_id' => $students[2] ?? $students[0] ?? 1,
                'semester_id' => $semesters[2] ?? $semesters[0] ?? 1,
                'subject_id' => $subjects[2] ?? $subjects[0] ?? 1,
                'control_note' => 18,
                'exam_note' => 19,
            ],
        ]);
    }
} 