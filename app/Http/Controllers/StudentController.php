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
use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    protected function getStudentForUser($user)
    {
        $student = Student::with(['user', 'group.academicLevel.speciality', 'academicLevel'])->where('user_id', $user->id)->first();

        if (!$student) {
            $academicLevel = \App\Models\AcademicLevel::first();
            $group = \App\Models\Group::first();
            if ($academicLevel && $group) {
                $student = Student::create([
                    'user_id' => $user->id,
                    'academic_level_id' => $academicLevel->id,
                    'group_id' => $group->id,
                ]);
                $student->load(['user', 'group.academicLevel.speciality', 'academicLevel']);
            }
        }

        return $student;
    }

    public function dashboard(Request $request)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        $colleagues = collect();
        if ($student->group_id) {
            $colleagues = User::join('students', 'users.id', '=', 'students.user_id')
                ->where('students.group_id', $student->group_id)
                ->where('users.id', '!=', $user->id)
                ->get(['users.first_name', 'users.last_name']);
        }
        $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first();
        if (!$semester) {
            $semester = Semester::latest()->first();
        }
        $collegeYear = Semester::getActiveCollegeYear();
        return Inertia::render('student/Dashboard', [
            'student' => $student,
            'colleagues' => $colleagues,
            'semester' => $semester,
            'collegeYear' => $collegeYear,
        ]);
    }

    public function schedule(Request $request)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);

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
        $student = $this->getStudentForUser($user);

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first();
        if (!$semester) {
            $semester = Semester::latest()->first();
        }
        $grades = Grade::with('subject')
            ->where('semester_id', $semester ? $semester->id : null)
            ->where('student_id', $student->id)
            ->get();
        return Inertia::render('student/Notes', [
            'student' => $student,
            'grades' => $grades,
            'semester' => $semester,
        ]);
    }

    public function attendance(Request $request)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first();
        if (!$semester) {
            $semester = Semester::latest()->first();
        }

        $attendances = Attendance::with('subject')
            ->where('student_id', $student->id)
            ->orderBy('date', 'desc')
            ->get();

        $totalSessions = $attendances->count();
        $presentCount = $attendances->where('status', Attendance::STATE_PRESENT)->count();
        $absentCount = $attendances->where('status', Attendance::STATE_ABSENT)->count();
        $lateCount = $attendances->where('status', Attendance::STATE_LATE)->count();
        $excusedCount = $attendances->where('status', Attendance::STATE_EXCUSED)->count();

        $subjects = $attendances->pluck('subject')->filter()->unique('id')->values();

        return Inertia::render('student/Attendance', [
            'student' => $student,
            'attendances' => $attendances,
            'semester' => $semester,
            'summary' => [
                'total' => $totalSessions,
                'present' => $presentCount,
                'absent' => $absentCount,
                'late' => $lateCount,
                'excused' => $excusedCount,
            ],
            'subjects' => $subjects,
        ]);
    }

    public function exams(Request $request)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);

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