<?php

namespace App\Http\Controllers;

use App\Models\Lecture;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Teacher;
use App\Repositories\LectureRepository;
use App\Repositories\GroupRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SchedulerSetting;

class AdminLecturesController extends Controller
{
    protected $lectureRepository;
    protected $groupRepository;
    protected $subjectRepository;
    protected $userRepository;

    public function __construct(
        LectureRepository $lectureRepository,
        GroupRepository $groupRepository,
        SubjectRepository $subjectRepository,
        UserRepository $userRepository
    ) {
        $this->lectureRepository = $lectureRepository;
        $this->groupRepository = $groupRepository;
        $this->subjectRepository = $subjectRepository;
        $this->userRepository = $userRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $lectures = $this->lectureRepository->getLecturesWithData($search);
        $academicLevels = $this->lectureRepository->getAcademicLevelsWithSpecialities();
        $groups = $this->lectureRepository->getGroupsWithAcademicLevels();
        $classRooms = $this->lectureRepository->getClassroomResources();
        $subjects = $this->lectureRepository->getSubjectsForSelection();
        $teachers = $this->lectureRepository->getTeachersForSelection();
        $settings = $this->lectureRepository->getSchedulerSettings();

        return Inertia::render('admin/Lectures', [
            'lectures' => $lectures,
            'subjects' => $subjects,
            'groups' => $groups,
            'academicLevels' => $academicLevels,
            'classRooms' => $classRooms,
            'teachers' => $teachers,
            'settings' => $settings,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'class_room_id' => 'required|exists:resources,id',
            'academic_level_id' => 'required|exists:academic_levels,id',
            'day_of_week' => 'required|integer|min:0|max:6',
            'class_index' => 'required|integer|min:0'
        ]);

        $this->lectureRepository->create([
            'subject_id' => $request->subject_id,
            'teacher_id' => $request->teacher_id,
            'class_room_id' => $request->class_room_id,
            'academic_level_id' => $request->academic_level_id,
            'day_of_week' => $request->day_of_week,
            'class_index' => $request->class_index
        ]);

        return redirect()->back()->with('success', 'Lecture created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'class_room_id' => 'required|exists:resources,id',
            'academic_level_id' => 'required|exists:academic_levels,id',
            'day_of_week' => 'required|integer|min:0|max:6',
            'class_index' => 'required|integer|min:0'
        ]);

        $this->lectureRepository->update($id, [
            'subject_id' => $request->subject_id,
            'teacher_id' => $request->teacher_id,
            'class_room_id' => $request->class_room_id,
            'academic_level_id' => $request->academic_level_id,
            'day_of_week' => $request->day_of_week,
            'class_index' => $request->class_index
        ]);

        return redirect()->back()->with('success', 'Lecture updated successfully');
    }

    public function destroy($id)
    {
        $this->lectureRepository->delete($id);

        return redirect()->back()->with('success', 'Lecture deleted successfully');
    }
} 