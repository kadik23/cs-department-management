<?php

namespace App\Http\Controllers;

use App\Models\ExamsSchedule;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Resource;
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

        $exams = $query->get()->map(function($exam) {
            return [
                'id' => $exam->id,
                'date' => $exam->date,
                'class_index' => $exam->class_index,
                'subject_name' => $exam->subject ? $exam->subject->subject_name : 'Not assigned',
                'group_number' => $exam->group ? $exam->group->group_number : 'Not assigned',
                'class_room' => $exam->classRoom ? $exam->classRoom->resource_type . ' ' . $exam->classRoom->resource_number : 'Not assigned',
                'subject_id' => $exam->subject_id,
                'group_id' => $exam->group_id,
                'class_room_id' => $exam->class_room_id,
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
                'name' => $room->resource_type . ' ' . $room->resource_number
            ];
        });

        return Inertia::render('admin/Exams', [
            'exams' => $exams,
            'subjects' => $subjects,
            'groups' => $groups,
            'classRooms' => $classRooms,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_room_id' => 'required|exists:resources,id',
            'subject_id' => 'required|exists:subjects,id',
            'group_id' => 'required|exists:groups,id',
            'date' => 'required|date',
            'class_index' => 'required|integer|min:0'
        ]);

        ExamsSchedule::create([
            'class_room_id' => $request->class_room_id,
            'subject_id' => $request->subject_id,
            'group_id' => $request->group_id,
            'date' => $request->date,
            'class_index' => $request->class_index
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