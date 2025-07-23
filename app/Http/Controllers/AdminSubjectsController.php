<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSubjectsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = Subject::with(['teacher']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $subjects = $query->get()->map(function($subject) {
            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code,
                'credits' => $subject->credits,
                'teacher_name' => $subject->teacher ? $subject->teacher->first_name . ' ' . $subject->teacher->last_name : 'Not assigned',
                'teacher_id' => $subject->teacher_id
            ];
        });

        $teachers = Teacher::all()->map(function($teacher) {
            return [
                'id' => $teacher->id,
                'name' => $teacher->first_name . ' ' . $teacher->last_name
            ];
        });

        return Inertia::render('admin/Subjects', [
            'subjects' => $subjects,
            'teachers' => $teachers,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:subjects,code',
            'credits' => 'required|integer',
            'teacher_id' => 'nullable|exists:teachers,id'
        ]);

        Subject::create([
            'name' => $request->name,
            'code' => $request->code,
            'credits' => $request->credits,
            'teacher_id' => $request->teacher_id
        ]);

        return redirect()->back()->with('success', 'Subject created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:subjects,code,' . $id,
            'credits' => 'required|integer',
            'teacher_id' => 'nullable|exists:teachers,id'
        ]);

        $subject = Subject::findOrFail($id);
        $subject->update([
            'name' => $request->name,
            'code' => $request->code,
            'credits' => $request->credits,
            'teacher_id' => $request->teacher_id
        ]);

        return redirect()->back()->with('success', 'Subject updated successfully');
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return redirect()->back()->with('success', 'Subject deleted successfully');
    }
} 