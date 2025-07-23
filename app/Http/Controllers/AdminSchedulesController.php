<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSchedulesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = Schedule::with(['subject', 'group', 'teacher']);

        if ($search) {
            $query->whereHas('subject', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('group', function($q) use ($search) {
                $q->where('group_number', 'like', "%{$search}%");
            });
        }

        $schedules = $query->get()->map(function($schedule) {
            return [
                'id' => $schedule->id,
                'day' => $schedule->day,
                'start_time' => $schedule->start_time,
                'end_time' => $schedule->end_time,
                'subject_name' => $schedule->subject ? $schedule->subject->name : 'Not assigned',
                'group_number' => $schedule->group ? $schedule->group->group_number : 'Not assigned',
                'teacher_name' => $schedule->teacher ? $schedule->teacher->first_name . ' ' . $schedule->teacher->last_name : 'Not assigned',
                'subject_id' => $schedule->subject_id,
                'group_id' => $schedule->group_id,
                'teacher_id' => $schedule->teacher_id
            ];
        });

        $subjects = Subject::all()->map(function($subject) {
            return [
                'id' => $subject->id,
                'name' => $subject->name
            ];
        });

        $groups = Group::all()->map(function($group) {
            return [
                'id' => $group->id,
                'group_number' => $group->group_number
            ];
        });

        $teachers = Teacher::all()->map(function($teacher) {
            return [
                'id' => $teacher->id,
                'name' => $teacher->first_name . ' ' . $teacher->last_name
            ];
        });

        return Inertia::render('admin/Schedules', [
            'schedules' => $schedules,
            'subjects' => $subjects,
            'groups' => $groups,
            'teachers' => $teachers,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'day' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'subject_id' => 'required|exists:subjects,id',
            'group_id' => 'required|exists:groups,id',
            'teacher_id' => 'required|exists:teachers,id'
        ]);

        Schedule::create([
            'day' => $request->day,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'subject_id' => $request->subject_id,
            'group_id' => $request->group_id,
            'teacher_id' => $request->teacher_id
        ]);

        return redirect()->back()->with('success', 'Schedule created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'day' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'subject_id' => 'required|exists:subjects,id',
            'group_id' => 'required|exists:groups,id',
            'teacher_id' => 'required|exists:teachers,id'
        ]);

        $schedule = Schedule::findOrFail($id);
        $schedule->update([
            'day' => $request->day,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'subject_id' => $request->subject_id,
            'group_id' => $request->group_id,
            'teacher_id' => $request->teacher_id
        ]);

        return redirect()->back()->with('success', 'Schedule updated successfully');
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        return redirect()->back()->with('success', 'Schedule deleted successfully');
    }
} 