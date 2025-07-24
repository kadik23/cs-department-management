<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Teacher;
use App\Models\Resource;
use App\Models\SchedulerSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSchedulesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $filterGroupId = $request->input('filter_group_id');

        $query = Schedule::with(['subject', 'group', 'teacher', 'classRoom']);
        if ($filterGroupId) {
            $query->where('group_id', $filterGroupId);
        }
        if ($search) {
            $query->whereHas('subject', function($q) use ($search) {
                $q->where('subject_name', 'like', "%{$search}%");
            })->orWhereHas('group', function($q) use ($search) {
                $q->where('group_number', 'like', "%{$search}%");
            });
        }

        $schedules = $query->get()->map(function($schedule) {
            return [
                'id' => $schedule->id,
                'class_room' => $schedule->classRoom ? $schedule->classRoom->resource_type : 'Not assigned',
                'class_room_number' => $schedule->classRoom ? $schedule->classRoom->resource_number : '',
                'subject_name' => $schedule->subject ? $schedule->subject->subject_name : 'Not assigned',
                'teacher_first_name' => $schedule->teacher && $schedule->teacher->user ? $schedule->teacher->user->first_name : '',
                'teacher_last_name' => $schedule->teacher && $schedule->teacher->user ? $schedule->teacher->user->last_name : '',
                'group_number' => $schedule->group ? $schedule->group->group_number : 'Not assigned',
                'level' => $schedule->group && $schedule->group->academicLevel ? $schedule->group->academicLevel->level : '',
                'speciality_name' => $schedule->group && $schedule->group->academicLevel && $schedule->group->academicLevel->speciality ? $schedule->group->academicLevel->speciality->speciality_name : '',
                'day_of_week' => $schedule->day_of_week,
                'class_index' => $schedule->class_index,
                'subject_id' => $schedule->subject_id,
                'group_id' => $schedule->group_id,
                'teacher_id' => $schedule->teacher_id,
                'class_room_id' => $schedule->class_room_id,
            ];
        });

        $subjects = Subject::all(['id', 'subject_name']);
        $groups = Group::with('academicLevel.speciality')->get()->map(function($group) {
            return [
                'id' => $group->id,
                'group_number' => $group->group_number,
                'level' => $group->academicLevel ? $group->academicLevel->level : '',
                'speciality_name' => $group->academicLevel && $group->academicLevel->speciality ? $group->academicLevel->speciality->speciality_name : '',
            ];
        });
        $teachers = Teacher::with('user')->get()->map(function($teacher) {
            return [
                'id' => $teacher->id,
                'first_name' => $teacher->user ? $teacher->user->first_name : '',
                'last_name' => $teacher->user ? $teacher->user->last_name : '',
            ];
        });
        $classRooms = Resource::whereIn('resource_type', ['Sale', 'Labo'])->get();
        $settings = SchedulerSetting::first();

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
        $groupConflict = Schedule::where('group_id', $request->group_id)
            ->where('class_index', $request->class_index)
            ->where('day_of_week', $request->day_of_week)
            ->exists();
        if ($groupConflict) {
            return redirect()->back()->withErrors(['error' => 'This group already has another class at that time.']);
        }
        // Check for teacher conflict
        $teacherConflict = Schedule::where('teacher_id', $request->teacher_id)
            ->where('class_index', $request->class_index)
            ->where('day_of_week', $request->day_of_week)
            ->exists();
        if ($teacherConflict) {
            return redirect()->back()->withErrors(['error' => 'This teacher already has another class at that time.']);
        }
        // Check for class room conflict
        $roomConflict = Schedule::where('class_room_id', $request->class_room_id)
            ->where('class_index', $request->class_index)
            ->where('day_of_week', $request->day_of_week)
            ->exists();
        if ($roomConflict) {
            return redirect()->back()->withErrors(['error' => 'The class room is already reserved at that time.']);
        }
        // Prevent duplicate schedule
        $exists = Schedule::where('class_room_id', $request->class_room_id)
            ->where('group_id', $request->group_id)
            ->where('teacher_id', $request->teacher_id)
            ->where('subject_id', $request->subject_id)
            ->where('day_of_week', $request->day_of_week)
            ->where('class_index', $request->class_index)
            ->exists();
        if ($exists) {
            return redirect()->back()->withErrors(['error' => 'Schedule already exists.']);
        }
        // Create schedule
        Schedule::create([
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
        $settings = SchedulerSetting::first();
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
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        return redirect()->back()->with('success', 'Schedule deleted successfully');
    }
} 