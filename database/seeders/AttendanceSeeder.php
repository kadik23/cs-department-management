<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Subject;
class AttendanceSeeder extends Seeder {
    public function run() {
        $students = Student::pluck('id')->all();
        $subjects = Subject::pluck('id')->all();
        Attendance::insert([
            [
                'student_id' => $students[0] ?? 1,
                'subject_id' => $subjects[0] ?? 1,
                'student_state' => 'present',
                'date' => '2024-10-01',
            ],
            [
                'student_id' => $students[1] ?? $students[0] ?? 1,
                'subject_id' => $subjects[1] ?? $subjects[0] ?? 1,
                'student_state' => 'absence',
                'date' => '2024-10-02',
            ],
            [
                'student_id' => $students[2] ?? $students[0] ?? 1,
                'subject_id' => $subjects[2] ?? $subjects[0] ?? 1,
                'student_state' => 'present',
                'date' => '2024-10-03',
            ],
        ]);
    }
} 