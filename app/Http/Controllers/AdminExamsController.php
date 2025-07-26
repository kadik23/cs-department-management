<?php

namespace App\Http\Controllers;

use App\Models\ExamsSchedule;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Resource;
use App\Models\ExamSchedulerSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminExamsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = ExamsSchedule::with(['subject', 'group', 'classRoom']);

        if ($search) {
            $query->whereHas('subject', function($q) use ($search) {
                $q->where('subject_name', 'like', "%{$search}%");
            });
        }

        $settings = ExamSchedulerSetting::first();
        $exam_duration = $settings ? $settings->exam_duration : 60;
        $first_exam_start_at = $settings ? $settings->first_exam_start_at : '08:00';

        function calcTime($class_index, $duration, $first_start) {
            [$h, $m] = explode(':', $first_start);
            $total = ((int)$h) * 60 + ((int)$m) + $class_index * $duration;
            $hours = floor($total / 60);
            $minutes = $total % 60;
            return sprintf('%02d:%02d', $hours, $minutes);
        }

        $exams = $query->get()->map(function($exam) use ($exam_duration, $first_exam_start_at) {
            return [
                'id' => $exam->id,
                'date' => $exam->date,
                'class_index' => $exam->class_index,
                'start_time' => calcTime($exam->class_index, $exam_duration, $first_exam_start_at),
                'end_time' => calcTime($exam->class_index + 1, $exam_duration, $first_exam_start_at),
                'subject_name' => $exam->subject ? $exam->subject->subject_name : 'Not assigned',
                'group_number' => $exam->group ? $exam->group->group_number : 'Not assigned',
                'class_room' => $exam->classRoom ? $exam->classRoom->resource_type . ' ' . $exam->classRoom->resource_number : 'Not assigned',
                'subject_id' => $exam->subject_id,
                'group_id' => $exam->group_id,
                'class_room_id' => $exam->class_room_id,
                'exam_type' => null, // Not in schema
            ];
        });

        $subjects = Subject::all()->map(function($subject) {
            return [
                'id' => $subject->id,
                'name' => $subject->subject_name
            ];
        });

        $groups = Group::all()->map(function($group) {
            return [
                'id' => $group->id,
                'group_number' => $group->group_number
            ];
        });

        $classRooms = Resource::all()->map(function($room) {
            return [
                'id' => $room->id,
                'resource_type' => $room->resource_type,
                'resource_number' => $room->resource_number,
            ];
        });

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

        $exam = ExamsSchedule::create([
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

        $exam = ExamsSchedule::findOrFail($id);
        $exam->update([
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
        $exam = ExamsSchedule::findOrFail($id);
        $exam->delete();

        return redirect()->back()->with('success', 'Exam schedule deleted successfully');
    }
} 