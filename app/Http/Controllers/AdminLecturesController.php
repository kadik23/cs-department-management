<?php

namespace App\Http\Controllers;

use App\Models\Lecture;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SchedulerSetting;

class AdminLecturesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = Lecture::with(['subject', 'teacher', 'classRoom', 'academicLevel.speciality']);

        if ($search) {
            $query->whereHas('subject', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('teacher', function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        $academicLevels = \App\Models\AcademicLevel::with('speciality')->get()->map(function($level) {
            return [
                'id' => $level->id,
                'level' => $level->level,
                'speciality_name' => $level->speciality ? $level->speciality->speciality_name : '',
            ];
        })->values();

        $groups = Group::with('academicLevel.speciality')->get()->map(function($group) {
            return [
                'id' => $group->id,
                'group_number' => $group->group_number,
                'level' => $group->academicLevel ? $group->academicLevel->level : '',
                'speciality_name' => $group->academicLevel && $group->academicLevel->speciality ? $group->academicLevel->speciality->speciality_name : '',
            ];
        });

        $classRooms = \App\Models\Resource::where('resource_type', 'Amphi')->get()->map(function($room) {
            return [
                'id' => $room->id,
                'resource_type' => $room->resource_type,
                'resource_number' => $room->resource_number
            ];
        })->values();

        $subjects = Subject::all()->map(function($subject) {
            return [
                'id' => $subject->id,
                'subject_name' => $subject->subject_name
            ];
        })->values();

        $teachers = Teacher::with('user')->get()->map(function($teacher) {
            return [
                'id' => $teacher->id,
                'first_name' => $teacher->user ? $teacher->user->first_name : '',
                'last_name' => $teacher->user ? $teacher->user->last_name : '',
            ];
        })->values();

        $settings = SchedulerSetting::first();
        $class_duration = $settings ? $settings->class_duration : 60;
        $first_class_start_at = $settings ? $settings->first_class_start_at : '08:00';

        function calcTime($class_index, $duration, $first_start) {
            [$h, $m] = explode(':', $first_start);
            $total = ((int)$h) * 60 + ((int)$m) + $class_index * $duration;
            $hours = floor($total / 60);
            $minutes = $total % 60;
            return sprintf('%02d:%02d', $hours, $minutes);
        }

        $lectures = Lecture::with(['subject', 'teacher.user', 'classRoom', 'academicLevel.speciality'])
            ->get()
            ->map(function($lecture) use ($class_duration, $first_class_start_at) {
                return [
                    'id' => $lecture->id,
                    'class_room' => $lecture->classRoom ? $lecture->classRoom->resource_type : '',
                    'class_room_number' => $lecture->classRoom ? $lecture->classRoom->resource_number : '',
                    'subject_name' => $lecture->subject ? $lecture->subject->subject_name : '',
                    'first_name' => $lecture->teacher && $lecture->teacher->user ? $lecture->teacher->user->first_name : '',
                    'last_name' => $lecture->teacher && $lecture->teacher->user ? $lecture->teacher->user->last_name : '',
                    'level' => $lecture->academicLevel ? $lecture->academicLevel->level : '',
                    'speciality_name' => $lecture->academicLevel && $lecture->academicLevel->speciality ? $lecture->academicLevel->speciality->speciality_name : '',
                    'day_of_week' => $lecture->day_of_week,
                    'class_index' => $lecture->class_index,
                    'start_time' => calcTime($lecture->class_index, $class_duration, $first_class_start_at),
                    'end_time' => calcTime($lecture->class_index + 1, $class_duration, $first_class_start_at),
                    'academic_level' => $lecture->academicLevel ? 'L' . $lecture->academicLevel->level . ' ' . ($lecture->academicLevel->speciality ? $lecture->academicLevel->speciality->speciality_name : '') : '',
                    'academic_level_id' => $lecture->academic_level_id,
                    'teacher_id' => $lecture->teacher_id,
                    'subject_id' => $lecture->subject_id,
                    'class_room_id' => $lecture->class_room_id,
                ];
            });

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

        Lecture::create([
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

        $lecture = Lecture::findOrFail($id);
        $lecture->update([
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
        $lecture = Lecture::findOrFail($id);
        $lecture->delete();

        return redirect()->back()->with('success', 'Lecture deleted successfully');
    }
} 