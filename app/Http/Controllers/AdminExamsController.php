<?php

namespace App\Http\Controllers;

use App\Models\ExamsSchedule;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Resource;
use App\Models\ExamSchedulerSetting;
use App\Repositories\ExamsScheduleRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\GroupRepository;
use App\Repositories\ResourceRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminExamsController extends Controller
{
    protected $examsScheduleRepository;
    protected $subjectRepository;
    protected $groupRepository;
    protected $resourceRepository;

    public function __construct(
        ExamsScheduleRepository $examsScheduleRepository,
        SubjectRepository $subjectRepository,
        GroupRepository $groupRepository,
        ResourceRepository $resourceRepository
    ) {
        $this->examsScheduleRepository = $examsScheduleRepository;
        $this->subjectRepository = $subjectRepository;
        $this->groupRepository = $groupRepository;
        $this->resourceRepository = $resourceRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $exams = $this->examsScheduleRepository->getExamsWithData($search);
        $subjects = $this->examsScheduleRepository->getSubjectsForSelection();
        $groups = $this->examsScheduleRepository->getGroupsForSelection();
        $classRooms = $this->examsScheduleRepository->getClassroomsForSelection();
        $settings = $this->examsScheduleRepository->getExamSchedulerSettings();

        return Inertia::render('admin/Exams', [
            'exams' => $exams,
            'subjects' => $subjects,
            'groups' => $groups,
            'classRooms' => $classRooms,
            'settings' => $settings,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_room_id' => 'required|exists:resources,id',
            'group_id' => 'required|exists:groups,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'class_index' => 'required|integer|min:0',
        ]);

        $this->examsScheduleRepository->create([
            'class_room_id' => $request->class_room_id,
            'group_id' => $request->group_id,
            'subject_id' => $request->subject_id,
            'date' => $request->date,
            'class_index' => $request->class_index,
        ]);

        return redirect()->back()->with('success', 'Exam schedule created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'class_room_id' => 'required|exists:resources,id',
            'subject_id' => 'required|exists:subjects,id',
            'group_id' => 'required|exists:groups,id',
            'date' => 'required|date',
            'class_index' => 'required|integer|min:0'
        ]);

        $this->examsScheduleRepository->update($id, [
            'class_room_id' => $request->class_room_id,
            'subject_id' => $request->subject_id,
            'group_id' => $request->group_id,
            'date' => $request->date,
            'class_index' => $request->class_index
        ]);

        return redirect()->back()->with('success', 'Exam schedule updated successfully');
    }

    public function destroy($id)
    {
        $this->examsScheduleRepository->delete($id);

        return redirect()->back()->with('success', 'Exam schedule deleted successfully');
    }
} 