<?php

namespace App\Http\Controllers;

use App\Models\Lecture;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        $lectures = $query->get()->map(function($lecture) {
            return [
                'id' => $lecture->id,
                'subject_name' => $lecture->subject ? $lecture->subject->name : 'Not assigned',
                'teacher_name' => $lecture->teacher ? $lecture->teacher->first_name . ' ' . $lecture->teacher->last_name : 'Not assigned',
                'class_room' => $lecture->classRoom ? $lecture->classRoom->resource_type . ' ' . $lecture->classRoom->resource_number : 'Not assigned',
                'academic_level' => $lecture->academicLevel ? 'L' . $lecture->academicLevel->level . ' ' . $lecture->academicLevel->speciality->name : 'Not assigned',
                'day_of_week' => $lecture->day_of_week,
                'class_index' => $lecture->class_index,
                'subject_id' => $lecture->subject_id,
                'teacher_id' => $lecture->teacher_id,
                'class_room_id' => $lecture->class_room_id,
                'academic_level_id' => $lecture->academic_level_id
            ];
        });

        $subjects = Subject::all()->map(function($subject) {
            return [
                'id' => $subject->id,
                'name' => $subject->name
            ];
        })->values();

        $academicLevels = \App\Models\AcademicLevel::with('speciality')->get()->map(function($level) {
            return [
                'id' => $level->id,
                'name' => 'L' . $level->level . ' ' . $level->speciality->name
            ];
        })->values();

        $classRooms = \App\Models\Resource::where('resource_type', 'Amphi')->get()->map(function($room) {
            return [
                'id' => $room->id,
                'name' => $room->resource_type . ' ' . $room->resource_number
            ];
        })->values();

        $teachers = Teacher::all()->map(function($teacher) {
            return [
                'id' => $teacher->id,
                'name' => $teacher->first_name . ' ' . $teacher->last_name
            ];
        })->values();

        return Inertia::render('admin/Lectures', [
            'lectures' => $lectures,
            'subjects' => $subjects,
            'academicLevels' => $academicLevels,
            'classRooms' => $classRooms,
            'teachers' => $teachers,
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