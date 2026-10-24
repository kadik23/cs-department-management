<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AssignmentSubmission;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Subject;

class AssignmentSubmissionSeeder extends Seeder
{
    public function run(): void
    {
        $student = Student::first();
        $teacher = Teacher::first();
        $subject = Subject::first();

        if (!$student || !$teacher || !$subject) {
            return;
        }

        AssignmentSubmission::updateOrCreate(
            ['title' => 'TP 1: Sorting Algorithms Performance & Complexity Analysis'],
            [
                'student_id' => $student->id,
                'teacher_id' => $teacher->id,
                'subject_id' => $subject->id,
                'group_id' => $student->group_id,
                'type' => 'tp',
                'description' => "Dear Professor,\n\nHere is our submission for TP 1 covering MergeSort, QuickSort, and HeapSort benchmarking. The implementation includes execution time curves and memory profile comparisons.",
                'file_path' => 'submissions/sample_tp1_deliverable.pdf',
                'file_name' => 'TP1_Sorting_Algorithms_Report.pdf',
                'file_size' => 679,
                'file_mime' => 'application/pdf',
                'is_read' => false,
                'created_at' => now()->subHours(3),
            ]
        );

        $secondStudent = Student::skip(1)->first() ?: $student;
        AssignmentSubmission::updateOrCreate(
            ['title' => 'TD 2: Recursion & Binary Search Trees Exercise Solutions'],
            [
                'student_id' => $secondStudent->id,
                'teacher_id' => $teacher->id,
                'subject_id' => $subject->id,
                'group_id' => $secondStudent->group_id,
                'type' => 'td',
                'description' => "Exercises 1 through 5 completed including tree rebalancing and in-order traversals.",
                'file_path' => 'submissions/sample_tp1_deliverable.pdf',
                'file_name' => 'TD2_BST_Solutions.pdf',
                'file_size' => 679,
                'file_mime' => 'application/pdf',
                'is_read' => true,
                'created_at' => now()->subDay(),
            ]
        );
    }
}
