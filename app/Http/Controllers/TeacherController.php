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
use App\Models\Student;
use App\Models\CourseMaterial;
use App\Models\Announcement;
use App\Models\AcademicLevel;
use App\Models\Group;
use App\Repositories\TeacherRepository;
use App\Repositories\ScheduleRepository;
use App\Repositories\LectureRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    protected $teacherRepository;
    protected $scheduleRepository;
    protected $lectureRepository;

    public function __construct(
        TeacherRepository $teacherRepository,
        ScheduleRepository $scheduleRepository,
        LectureRepository $lectureRepository
    ) {
        $this->teacherRepository = $teacherRepository;
        $this->scheduleRepository = $scheduleRepository;
        $this->lectureRepository = $lectureRepository;
    }

    protected function getTeacherForUser($user)
    {
        $teacher = $this->teacherRepository->getTeacherWithProfile($user->id);
        if (!$teacher) {
            \App\Models\Teacher::create(['user_id' => $user->id]);
            $teacher = $this->teacherRepository->getTeacherWithProfile($user->id);
        }
        return $teacher;
    }

    protected function getTeacherContextData($teacher, $semester = null)
    {
        if (!$semester) {
            $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first();
            if (!$semester) {
                $semester = Semester::latest()->first();
            }
        }

        // Distinct subjects taught by teacher via schedules or lectures
        $scheduleSubjects = Schedule::where('teacher_id', $teacher->id)->with('subject')->get()->pluck('subject');
        $lectureSubjects = Lecture::where('teacher_id', $teacher->id)->with('subject')->get()->pluck('subject');
        $subjects = $scheduleSubjects->concat($lectureSubjects)->filter()->unique('id')->values();

        // If no schedules yet, fallback to all subjects so teacher can still test
        if ($subjects->isEmpty()) {
            $subjects = \App\Models\Subject::all();
        }

        // Groups taught by teacher via schedules
        $groups = Schedule::where('teacher_id', $teacher->id)
            ->with(['group.academicLevel.speciality'])
            ->get()
            ->pluck('group')
            ->filter()
            ->unique('id')
            ->values();

        // Enrolled students in teacher's groups, or fallback to all active students
        $groupIds = $groups->pluck('id');
        $studentsQuery = Student::with(['user', 'group.academicLevel.speciality', 'grades', 'attendances']);
        if ($groupIds->isNotEmpty()) {
            $students = $studentsQuery->whereIn('group_id', $groupIds)->get();
        } else {
            $students = $studentsQuery->take(50)->get();
        }

        return [
            'subjects' => $subjects,
            'groups' => $groups,
            'students' => $students,
            'semester' => $semester,
        ];
    }

    public function dashboard(Request $request)
    {
        $user = Auth::user();
        $teacher = $this->getTeacherForUser($user);

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        $schedulesCount = $this->teacherRepository->getTeacherSchedulesCount($teacher->id);
        $lecturesCount = $this->teacherRepository->getTeacherLecturesCount($teacher->id);
        $context = $this->getTeacherContextData($teacher);
        $recentAnnouncements = Announcement::with('author')
            ->active()
            ->forTeacher()
            ->pinnedFirst()
            ->take(4)
            ->get();

        return Inertia::render('teacher/Dashboard', [
            'teacher' => $teacher,
            'schedulesCount' => $schedulesCount,
            'lecturesCount' => $lecturesCount,
            'semester' => $context['semester'],
            'teacherSubjects' => $context['subjects'],
            'teacherGroups' => $context['groups'],
            'students' => $context['students'],
            'recentAnnouncements' => $recentAnnouncements,
        ]);
    }

    public function courses(Request $request)
    {
        $user = Auth::user();
        $teacher = $this->getTeacherForUser($user);

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        // Get teacher's schedules with subjects, groups, and classrooms
        $schedules = $this->teacherRepository->getTeacherSchedules($teacher->id);

        // Get teacher's lectures with subjects, academic levels, and classrooms
        $lectures = $this->teacherRepository->getTeacherLectures($teacher->id);

        $context = $this->getTeacherContextData($teacher);

        $materials = CourseMaterial::where('teacher_id', $teacher->id)
            ->with(['subject', 'academicLevel.speciality', 'group'])
            ->latest()
            ->get();

        $academicLevels = AcademicLevel::with('speciality')->get();
        $groups = Group::with('academicLevel.speciality')->get();

        return Inertia::render('teacher/Courses', [
            'teacher' => $teacher,
            'schedules' => $schedules,
            'lectures' => $lectures,
            'materials' => $materials,
            'teacherSubjects' => $context['subjects'],
            'academicLevels' => $academicLevels,
            'groups' => $groups,
        ]);
    }

    public function schedule(Request $request)
    {
        $user = Auth::user();
        $teacher = $this->getTeacherForUser($user);

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        $schedules = $this->teacherRepository->getTeacherSchedules($teacher->id)->map(function ($item) {
            $item->is_lecture = false;
            $item->session_type = 'TD / TP';
            return $item;
        });

        $lectures = $this->teacherRepository->getTeacherLectures($teacher->id)->map(function ($item) {
            $item->is_lecture = true;
            $item->session_type = 'Cours';
            return $item;
        });

        $schedule = $schedules->concat($lectures);
        $settings = $this->scheduleRepository->getSchedulerSettings();
        
        return Inertia::render('teacher/Schedule', [
            'teacher' => $teacher,
            'schedule' => $schedule,
            'settings' => $settings,
        ]);
    }

    public function grades(Request $request)
    {
        $user = Auth::user();
        $teacher = $this->getTeacherForUser($user);

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        $context = $this->getTeacherContextData($teacher);
        $semester = $context['semester'];
        
        // Get grades for subjects taught by this teacher
        $grades = Grade::with(['student.user', 'subject'])
            ->whereHas('subject', function($query) use ($teacher) {
                $query->whereHas('schedules', function($q) use ($teacher) {
                    $q->where('teacher_id', $teacher->id);
                });
            })
            ->where('semester_id', $semester ? $semester->id : null)
            ->get();

        // If no grades found through schedule relationship, query by semester
        if ($grades->isEmpty() && $semester) {
            $grades = Grade::with(['student.user', 'subject'])
                ->where('semester_id', $semester->id)
                ->get();
        }

        return Inertia::render('teacher/Grades', [
            'teacher' => $teacher,
            'grades' => $grades,
            'semester' => $semester,
            'teacherSubjects' => $context['subjects'],
            'teacherGroups' => $context['groups'],
            'students' => $context['students'],
        ]);
    }

    public function attendance(Request $request)
    {
        $user = Auth::user();
        $teacher = $this->getTeacherForUser($user);

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        $context = $this->getTeacherContextData($teacher);

        // Get attendance records for subjects taught by this teacher
        $attendance = Attendance::with(['student.user', 'subject'])
            ->whereHas('subject', function($query) use ($teacher) {
                $query->whereHas('schedules', function($q) use ($teacher) {
                    $q->where('teacher_id', $teacher->id);
                });
            })
            ->orderBy('date', 'desc')
            ->get();

        // If no attendance found through schedule relation, fallback to recent attendances
        if ($attendance->isEmpty()) {
            $attendance = Attendance::with(['student.user', 'subject'])
                ->orderBy('date', 'desc')
                ->take(50)
                ->get();
        }

        return Inertia::render('teacher/Attendance', [
            'teacher' => $teacher,
            'attendance' => $attendance,
            'teacherSubjects' => $context['subjects'],
            'teacherGroups' => $context['groups'],
            'students' => $context['students'],
            'semester' => $context['semester'],
        ]);
    }

    public function saveGrade(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'semester_id' => 'nullable|exists:semesters,id',
            'control_note' => 'nullable|numeric|min:0|max:20',
            'exam_note' => 'nullable|numeric|min:0|max:20',
        ]);

        $semesterId = $request->semester_id;
        if (!$semesterId) {
            $semester = Semester::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first() ?? Semester::latest()->first();
            $semesterId = $semester ? $semester->id : null;
        }

        $grade = Grade::updateOrCreate(
            [
                'student_id' => $request->student_id,
                'subject_id' => $request->subject_id,
                'semester_id' => $semesterId,
            ],
            [
                'control_note' => ($request->control_note !== null && $request->control_note !== '') ? (float)$request->control_note : null,
                'exam_note' => ($request->exam_note !== null && $request->exam_note !== '') ? (float)$request->exam_note : null,
            ]
        );

        $grade->load(['student.user', 'subject']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Grade saved successfully!',
                'grade' => $grade,
            ]);
        }

        return redirect()->back()->with('success', 'Grade saved successfully!');
    }

    public function saveAttendance(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'student_state' => 'required|string',
        ]);

        $attendance = Attendance::updateOrCreate(
            [
                'student_id' => $request->student_id,
                'subject_id' => $request->subject_id,
                'date' => $request->date,
            ],
            [
                'student_state' => $request->student_state,
            ]
        );

        $attendance->load(['student.user', 'subject']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Attendance recorded successfully!',
                'attendance' => $attendance,
            ]);
        }

        return redirect()->back()->with('success', 'Attendance recorded successfully!');
    }

    public function uploadMaterial(Request $request)
    {
        $user = Auth::user();
        $teacher = $this->getTeacherForUser($user);

        if (!$teacher) {
            return redirect()->back()->with('error', 'Teacher account not found.');
        }

        if ($request->hasFile('file') && !$request->file('file')->isValid()) {
            $errorCode = $request->file('file')->getError();
            if ($errorCode === UPLOAD_ERR_INI_SIZE || $errorCode === UPLOAD_ERR_FORM_SIZE) {
                return redirect()->back()->withErrors([
                    'file' => 'The file exceeds the PHP server upload limit (' . ini_get('upload_max_filesize') . '). If running artisan serve, run: php -d upload_max_filesize=50M -d post_max_size=50M artisan serve',
                ]);
            }
        }

        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'type' => 'required|in:cours,td,tp,exam',
            'chapter_title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'academic_level_id' => 'nullable|exists:academic_levels,id',
            'group_id' => 'nullable|exists:groups,id',
            'file' => 'required|file|max:51200', // 50MB max
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $size = $file->getSize();
        $mime = $file->getClientMimeType() ?: $file->getMimeType();
        $path = $file->store('course_materials', 'local');

        CourseMaterial::create([
            'subject_id' => $request->subject_id,
            'teacher_id' => $teacher->id,
            'academic_level_id' => $request->academic_level_id ?: null,
            'group_id' => $request->group_id ?: null,
            'type' => $request->type,
            'chapter_title' => $request->chapter_title,
            'description' => $request->description,
            'file_path' => $path,
            'file_name' => $originalName,
            'file_size' => $size,
            'file_mime' => $mime,
        ]);

        return redirect()->back()->with('message', 'Course material uploaded successfully!');
    }

    public function deleteMaterial(CourseMaterial $material)
    {
        $user = Auth::user();
        $teacher = $this->getTeacherForUser($user);

        if ($material->teacher_id !== $teacher->id) {
            abort(403, 'Unauthorized action.');
        }

        if (Storage::disk('local')->exists($material->file_path)) {
            Storage::disk('local')->delete($material->file_path);
        }

        $material->delete();

        return redirect()->back()->with('message', 'Course material deleted successfully.');
    }

    public function downloadMaterial(CourseMaterial $material)
    {
        if (!Storage::disk('local')->exists($material->file_path)) {
            abort(404, 'Material file not found on disk.');
        }

        return Storage::disk('local')->download($material->file_path, $material->file_name);
    }

    public function previewMaterial(CourseMaterial $material)
    {
        if (!Storage::disk('local')->exists($material->file_path)) {
            abort(404, 'Material file not found on disk.');
        }

        return Storage::disk('local')->response($material->file_path, $material->file_name, [
            'Content-Type' => $material->file_mime ?: 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $material->file_name . '"',
        ]);
    }

    public function announcements(Request $request)
    {
        $user = Auth::user();
        $teacher = $this->getTeacherForUser($user);

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        $query = Announcement::with('author')
            ->active()
            ->forTeacher();

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

        return Inertia::render('teacher/Announcements', [
            'teacher' => $teacher,
            'announcements' => $announcements,
            'filters' => $request->only(['search', 'category', 'priority']),
        ]);
    }

    public function downloadAnnouncementAttachment($id)
    {
        $announcement = Announcement::active()->forTeacher()->findOrFail($id);

        if (!$announcement->attachment_path || !Storage::disk('public')->exists($announcement->attachment_path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->download($announcement->attachment_path, $announcement->attachment_name);
    }

    public function previewAnnouncementAttachment($id)
    {
        $announcement = Announcement::active()->forTeacher()->findOrFail($id);

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