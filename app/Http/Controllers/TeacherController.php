<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Teacher;
use App\Models\Schedule;
use App\Models\Lecture;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\Semester;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TeacherController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = Auth::user();
        $teacher = Teacher::with(['user'])->where('user_id', $user->id)->first();

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        $schedulesCount = Schedule::where('teacher_id', $teacher->id)->count();
        
        $lecturesCount = Lecture::where('teacher_id', $teacher->id)->count();
        
        $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first();

        return Inertia::render('teacher/Dashboard', [
            'teacher' => $teacher,
            'schedulesCount' => $schedulesCount,
            'lecturesCount' => $lecturesCount,
            'semester' => $semester,
        ]);
    }

    public function courses(Request $request)
    {
        $user = Auth::user();
        $teacher = Teacher::with(['user'])->where('user_id', $user->id)->first();

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        // Get teacher's schedules with subjects, groups, and classrooms
        $schedules = Schedule::with(['subject', 'group.academicLevel.speciality', 'classRoom'])
            ->where('teacher_id', $teacher->id)
            ->orderBy('day_of_week')
            ->orderBy('class_index')
            ->get();

        // Get teacher's lectures with subjects, academic levels, and classrooms
        $lectures = Lecture::with(['subject', 'academicLevel.speciality', 'classRoom'])
            ->where('teacher_id', $teacher->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('teacher/Courses', [
            'teacher' => $teacher,
            'schedules' => $schedules,
            'lectures' => $lectures,
        ]);
    }

    public function schedule(Request $request)
    {
        $user = Auth::user();
        $teacher = Teacher::with(['user'])->where('user_id', $user->id)->first();

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        $schedule = Schedule::with(['subject', 'classRoom', 'group.academicLevel.speciality'])
            ->where('teacher_id', $teacher->id)
            ->orderBy('day_of_week')
            ->orderBy('class_index')
            ->get();
        
        $settings = \App\Models\SchedulerSetting::first();
        
        return Inertia::render('teacher/Schedule', [
            'teacher' => $teacher,
            'schedule' => $schedule,
            'settings' => $settings,
        ]);
    }

    public function grades(Request $request)
    {
        $user = Auth::user();
        $teacher = Teacher::with(['user'])->where('user_id', $user->id)->first();

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first();
        
        // Get grades for subjects taught by this teacher
        $grades = Grade::with(['student.user', 'subject'])
            ->whereHas('subject', function($query) use ($teacher) {
                $query->whereHas('schedules', function($q) use ($teacher) {
                    $q->where('teacher_id', $teacher->id);
                });
            })
            ->where('semester_id', $semester ? $semester->id : null)
            ->get();

        return Inertia::render('teacher/Grades', [
            'teacher' => $teacher,
            'grades' => $grades,
            'semester' => $semester,
        ]);
    }

    public function attendance(Request $request)
    {
        $user = Auth::user();
        $teacher = Teacher::with(['user'])->where('user_id', $user->id)->first();

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        // Get attendance records for subjects taught by this teacher
        $attendance = Attendance::with(['student.user', 'subject'])
            ->whereHas('subject', function($query) use ($teacher) {
                $query->whereHas('schedules', function($q) use ($teacher) {
                    $q->where('teacher_id', $teacher->id);
                });
            })
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('teacher/Attendance', [
            'teacher' => $teacher,
            'attendance' => $attendance,
        ]);
    }
} 