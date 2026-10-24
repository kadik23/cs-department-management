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
use App\Models\Lecture;
use App\Models\Attendance;
use App\Models\CourseMaterial;
use App\Models\Announcement;
use App\Models\Subject;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
        $recentAnnouncements = Announcement::with('author')
            ->active()
            ->forStudent($student)
            ->pinnedFirst()
            ->take(4)
            ->get();

        return Inertia::render('student/Dashboard', [
            'student' => $student,
            'colleagues' => $colleagues,
            'semester' => $semester,
            'collegeYear' => $collegeYear,
            'recentAnnouncements' => $recentAnnouncements,
        ]);
    }

    public function schedule(Request $request)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        // Group TD/TP sessions
        $groupSchedules = Schedule::with(['subject', 'classRoom', 'teacher.user'])
            ->where('group_id', $student->group_id)
            ->get()
            ->map(function ($item) {
                $item->is_lecture = false;
                $item->session_type = 'TD / TP';
                return $item;
            });

        $academicLevelId = $student->academic_level_id ?? $student->group?->academic_level_id;

        // Cohort Amphitheater Lectures
        $lectures = collect();
        if ($academicLevelId) {
            $lectures = Lecture::with(['subject', 'classRoom', 'teacher.user'])
                ->where('academic_level_id', $academicLevelId)
                ->get()
                ->map(function ($item) {
                    $item->is_lecture = true;
                    $item->session_type = 'Cours';
                    return $item;
                });
        }

        // Merge both into unified schedule
        $schedule = $groupSchedules->concat($lectures);
        
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

    public function courses(Request $request)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first() ?: Semester::latest()->first();

        $materials = CourseMaterial::forStudent($student)
            ->with(['subject', 'teacher.user', 'academicLevel.speciality', 'group'])
            ->latest()
            ->get();

        $scheduleSubjects = Schedule::where('group_id', $student->group_id)->with('subject')->get()->pluck('subject');
        $materialSubjects = $materials->pluck('subject');
        $allSubjects = Subject::orderBy('subject_name')->get();
        $subjects = $scheduleSubjects->concat($materialSubjects)->concat($allSubjects)->filter()->unique('id')->values();

        return Inertia::render('student/Courses', [
            'student' => $student,
            'semester' => $semester,
            'materials' => $materials,
            'subjects' => $subjects,
        ]);
    }

    public function downloadMaterial(CourseMaterial $material)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);

        if ($material->academic_level_id && $student->academic_level_id && $material->academic_level_id !== $student->academic_level_id) {
            abort(403, 'Unauthorized access to this course material.');
        }

        if (!Storage::disk('local')->exists($material->file_path)) {
            abort(404, 'Material file not found.');
        }

        $material->increment('download_count');

        return Storage::disk('local')->download($material->file_path, $material->file_name);
    }

    public function previewMaterial(CourseMaterial $material)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);

        if ($material->academic_level_id && $student->academic_level_id && $material->academic_level_id !== $student->academic_level_id) {
            abort(403, 'Unauthorized access to this course material.');
        }

        if (!Storage::disk('local')->exists($material->file_path)) {
            abort(404, 'Material file not found.');
        }

        return Storage::disk('local')->response($material->file_path, $material->file_name, [
            'Content-Type' => $material->file_mime ?: 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $material->file_name . '"',
        ]);
    }

    public function announcements(Request $request)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);

        if (!$student) {
            return redirect('/')->with('error', 'No student record found for this user.');
        }

        $query = Announcement::with('author')
            ->active()
            ->forStudent($student);

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $announcements = $query->pinnedFirst()->paginate(10)->withQueryString();

        return Inertia::render('student/Announcements', [
            'student' => $student,
            'announcements' => $announcements,
            'filters' => $request->only(['search', 'category', 'priority']),
        ]);
    }

    public function downloadAnnouncementAttachment($id)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);
        $announcement = Announcement::active()->forStudent($student)->findOrFail($id);

        if (!$announcement->attachment_path || !Storage::disk('public')->exists($announcement->attachment_path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->download($announcement->attachment_path, $announcement->attachment_name);
    }

    public function previewAnnouncementAttachment($id)
    {
        $user = Auth::user();
        $student = $this->getStudentForUser($user);
        $announcement = Announcement::active()->forStudent($student)->findOrFail($id);

        if (!$announcement->attachment_path || !Storage::disk('public')->exists($announcement->attachment_path)) {
            abort(404, 'File not found');
        }

        $filePath = Storage::disk('public')->path($announcement->attachment_path);
        return response()->file($filePath, [
            'Content-Type' => $announcement->attachment_mime ?? 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $announcement->attachment_name . '"',
        ]);
    }
} 