<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\User;
use App\Models\Group;
use App\Models\Semester;
use App\Models\Grade;
use App\Models\ExamsSchedule;
use App\Models\Schedule;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = Auth::user();
        $student = Student::with(['user', 'group.academicLevel.speciality'])->where('user_id', $user->id)->first();

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        $colleagues = User::join('students', 'users.id', '=', 'students.user_id')
            ->where('students.group_id', $student->group_id)
            ->where('users.id', '!=', $user->id)
            ->get(['users.first_name', 'users.last_name']);
        $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first();
        return Inertia::render('student/Dashboard', [
            'student' => $student,
            'colleagues' => $colleagues,
            'semester' => $semester,
        ]);
    }

    public function schedule(Request $request)
    {
        $user = Auth::user();
        $student = Student::with(['user', 'group.academicLevel.speciality'])->where('user_id', $user->id)->first();

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        $schedule = Schedule::with(['subject', 'classRoom', 'teacher.user'])
            ->where('group_id', $student->group_id)
            ->orderBy('day_of_week')
            ->orderBy('class_index')
            ->get();
        
        $settings = \App\Models\SchedulerSetting::first();
        return Inertia::render('student/Schedule', [
            'student' => $student,
            'schedule' => $schedule,
            'settings' => $settings,
        ]);
    }

    public function notes(Request $request)
    {
        $user = Auth::user();
        $student = Student::with(['user', 'group.academicLevel.speciality'])->where('user_id', $user->id)->first();

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first();
        $grades = Grade::with('subject')
            ->where('semester_id', $semester ? $semester->id : null)
            ->where('student_id', $student->id)
            ->get();
        return Inertia::render('student/Notes', [
            'student' => $student,
            'grades' => $grades,
        ]);
    }

    public function exams(Request $request)
    {
        $user = Auth::user();
        $student = Student::with(['user', 'group.academicLevel.speciality'])->where('user_id', $user->id)->first();

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        $exams = ExamsSchedule::with(['subject', 'classRoom'])
            ->where('group_id', $student->group_id)
            ->orderBy('date')
            ->orderBy('class_index')
            ->get();
        
        $settings = \App\Models\ExamSchedulerSetting::first();
        return Inertia::render('student/Exams', [
            'student' => $student,
            'exams' => $exams,
            'settings' => $settings,
        ]);
    }
} 