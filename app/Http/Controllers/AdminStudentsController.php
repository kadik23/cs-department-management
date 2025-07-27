<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Group;
use App\Models\AcademicLevel;
use App\Models\Attendance;
use App\Repositories\StudentRepository;
use App\Repositories\GroupRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Grade;

class AdminStudentsController extends Controller
{
    protected $studentRepository;
    protected $groupRepository;

    public function __construct(StudentRepository $studentRepository, GroupRepository $groupRepository)
    {
        $this->studentRepository = $studentRepository;
        $this->groupRepository = $groupRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $students = $this->studentRepository->getStudentsWithData($search);

        return Inertia::render('admin/Students', [
            'students' => $students,
            'search' => $search
        ]);
    }

    public function getGroups(Request $request)
    {
        $academicLevelId = $request->input('academic_level_id');
        
        $groups = $this->groupRepository->getGroupsByAcademicLevelWithData($academicLevelId);

        return response()->json($groups);
    }

    public function assignGroup(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'group_id' => 'required|exists:groups,id'
        ]);

        $student = $this->studentRepository->find($request->student_id);
        $student->group_id = $request->group_id;
        $student->save();

        return redirect()->back()->with('success', 'Group assigned successfully');
    }
} 