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
use App\Repositories\TeacherRepository;
use App\Repositories\ScheduleRepository;
use App\Repositories\LectureRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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

        return Inertia::render('teacher/Dashboard', [
            'teacher' => $teacher,
            'schedulesCount' => $schedulesCount,
            'lecturesCount' => $lecturesCount,
            'semester' => $context['semester'],
            'teacherSubjects' => $context['subjects'],
            'teacherGroups' => $context['groups'],
            'students' => $context['students'],
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

        return Inertia::render('teacher/Courses', [
            'teacher' => $teacher,
            'schedules' => $schedules,
            'lectures' => $lectures,
        ]);
    }

    public function schedule(Request $request)
    {
        $user = Auth::user();
        $teacher = $this->getTeacherForUser($user);

        if (!$teacher) {
            return redirect('/')->with('error', 'No teacher record found for this user.');
        }

        $schedule = $this->teacherRepository->getTeacherSchedules($teacher->id);
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
} 