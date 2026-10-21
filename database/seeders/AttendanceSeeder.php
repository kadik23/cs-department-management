<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Subject;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run()
    {
        $students = Student::all();
        $subjects = Subject::all();

        if ($students->isEmpty() || $subjects->isEmpty()) {
            return;
        }

        $now = Carbon::now();

        // Seed 30 recent attendance records over the last 14 days
        $attendanceData = [];
        $states = ['present', 'present', 'present', 'absence', 'late'];

        foreach ($students->take(8) as $studentIdx => $student) {
            foreach ($subjects->take(4) as $subjectIdx => $subject) {
                $daysAgo = ($studentIdx + $subjectIdx * 2) % 12;
                $date = $now->copy()->subDays($daysAgo)->toDateString();
                $state = $states[($studentIdx + $subjectIdx) % count($states)];

                Attendance::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'subject_id' => $subject->id,
                        'date' => $date,
                    ],
                    [
                        'student_state' => $state,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
} 