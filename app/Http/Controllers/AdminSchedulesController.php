<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Teacher;
use App\Models\Resource;
use App\Models\SchedulerSetting;
use App\Repositories\ScheduleRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\GroupRepository;
use App\Repositories\UserRepository;
use App\Repositories\ResourceRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSchedulesController extends Controller
{
    protected $scheduleRepository;
    protected $subjectRepository;
    protected $groupRepository;
    protected $userRepository;
    protected $resourceRepository;

    public function __construct(
        ScheduleRepository $scheduleRepository,
        SubjectRepository $subjectRepository,
        GroupRepository $groupRepository,
        UserRepository $userRepository,
        ResourceRepository $resourceRepository
    ) {
        $this->scheduleRepository = $scheduleRepository;
        $this->subjectRepository = $subjectRepository;
        $this->groupRepository = $groupRepository;
        $this->userRepository = $userRepository;
        $this->resourceRepository = $resourceRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $filterGroupId = $request->input('filter_group_id');

        $schedules = $this->scheduleRepository->getSchedulesWithData($search, $filterGroupId);
        $subjects = $this->scheduleRepository->getSubjectsForSelection();
        $groups = $this->scheduleRepository->getGroupsWithAcademicLevels();
        $teachers = $this->scheduleRepository->getTeachersForSelection();
        $classRooms = $this->scheduleRepository->getClassroomsForSelection();
        $settings = $this->scheduleRepository->getSchedulerSettings();

        return Inertia::render('admin/Schedules', [
            'schedules' => $schedules,
            'subjects' => $subjects,
            'groups' => $groups,
            'teachers' => $teachers,
            'classRooms' => $classRooms,
            'settings' => $settings,
            'search' => $search,
            'filter_group_id' => $filterGroupId,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'class_room_id' => 'required|exists:resources,id',
            'group_id' => 'required|exists:groups,id',
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,id',
            'day_of_week' => 'required|integer|min:0|max:6',
            'class_index' => 'required|integer|min:0',
        ]);

        // Check for group conflict
        $groupConflict = $this->scheduleRepository->checkGroupConflict(
            $request->group_id, 
            $request->class_index, 
            $request->day_of_week
        );
        if ($groupConflict) {
            return redirect()->back()->withErrors(['error' => 'This group already has another class at that time.']);
        }
        
        // Check for teacher conflict
        $teacherConflict = $this->scheduleRepository->checkTeacherConflict(
            $request->teacher_id, 
            $request->class_index, 
            $request->day_of_week
        );
        if ($teacherConflict) {
            return redirect()->back()->withErrors(['error' => 'This teacher already has another class at that time.']);
        }
        
        // Check for class room conflict
        $roomConflict = $this->scheduleRepository->checkClassroomConflict(
            $request->class_room_id, 
            $request->class_index, 
            $request->day_of_week
        );
        if ($roomConflict) {
            return redirect()->back()->withErrors(['error' => 'The class room is already reserved at that time.']);
        }
        
        // Prevent duplicate schedule
        $exists = $this->scheduleRepository->checkGroupConflict(
            $request->group_id, 
            $request->class_index, 
            $request->day_of_week
        );
        if ($exists) {
            return redirect()->back()->withErrors(['error' => 'Schedule already exists.']);
        }
        
        // Create schedule
        $this->scheduleRepository->create([
            'class_room_id' => $request->class_room_id,
            'group_id' => $request->group_id,
            'teacher_id' => $request->teacher_id,
            'subject_id' => $request->subject_id,
            'day_of_week' => $request->day_of_week,
            'class_index' => $request->class_index,
        ]);
        return redirect()->back()->with('success', 'Schedule added successfully.');
    }

    public function updateSchedulerSettings(Request $request)
    {
        $request->validate([
            'class_duration' => 'required|integer|min:1',
            'first_class_start_at' => 'required|date_format:H:i',
        ]);
        $settings = $this->scheduleRepository->getSchedulerSettings();
        if ($settings) {
            $settings->update([
                'class_duration' => $request->class_duration,
                'first_class_start_at' => $request->first_class_start_at,
            ]);
        }
        return redirect()->back()->with('success', 'Scheduler settings updated successfully.');
    }

    public function destroy($id)
    {
        $this->scheduleRepository->delete($id);
        return redirect()->back()->with('success', 'Schedule deleted successfully');
    }
} 