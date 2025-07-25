<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Group;
use App\Models\AcademicLevel;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Grade;

class AdminStudentsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = Student::with(['user', 'group', 'academicLevel'])
            ->select('students.*')
            ->join('users', 'users.id', '=', 'students.user_id')
            ->leftJoin('groups', 'group_id', '=', 'groups.id')
            ->leftJoin('attendances', function($join) {
                $join->on('students.id', '=', 'attendances.student_id')
                     ->where('attendances.student_state', '=', 'absence');
            })
            ->groupBy('students.id');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('users.username', 'like', "%{$search}%")
                  ->orWhere('students.first_name', 'like', "%{$search}%")
                  ->orWhere('students.last_name', 'like', "%{$search}%");
            });
        }

        $students = $query->get()->map(function($student) {
            $absenceCount = Attendance::where('student_id', $student->id)
                                    ->where('student_state', 'absence')
                                    ->count();
            // Fetch the latest grade for the student
            $grade = Grade::where('student_id', $student->id)
                ->orderByDesc('id')
                ->first();
            $gradeValue = $grade ? ($grade->control_note . ' / ' . $grade->exam_note) : 'Grade not yet';
            return [
                'id' => $student->id,
                'academic_level_id' => $student->academic_level_id,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'group_number' => $student->group ? $student->group->group_number : null,
                'absence' => $absenceCount,
                'current_grade' => $gradeValue
            ];
        });

        return Inertia::render('admin/Students', [
            'students' => $students,
            'search' => $search
        ]);
    }

    public function getGroups(Request $request)
    {
        $academicLevelId = $request->input('academic_level_id');
        
        $groups = Group::with(['academicLevel.speciality'])
            ->where('academic_level_id', $academicLevelId)
            ->get()
            ->map(function($group) {
                return [
                    'id' => $group->id,
                    'group_number' => $group->group_number,
                    'level' => $group->academicLevel->level,
                    'speciality_name' => $group->academicLevel->speciality->name
                ];
            });

        return response()->json($groups);
    }

    public function assignGroup(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'group_id' => 'required|exists:groups,id'
        ]);

        $student = Student::find($request->student_id);
        $student->group_id = $request->group_id;
        $student->save();

        return redirect()->back()->with('success', 'Group assigned successfully');
    }
} 