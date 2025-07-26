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
        
        $query = Subject::query();

        if ($search) {
            $query->where('subject_name', 'like', "%{$search}%");
        }

        $subjects = $query->get()->map(function($subject) {
            return [
                'id' => $subject->id,
                'subject_name' => $subject->subject_name,
                'coefficient' => $subject->coefficient,
                'credit' => $subject->credit,
            ];
        });

        return Inertia::render('admin/Subjects', [
            'subjects' => $subjects,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject_name' => 'required|string',
            'coefficient' => 'required|integer',
            'credit' => 'required|integer',
        ]);

        Subject::create([
            'subject_name' => $request->subject_name,
            'coefficient' => $request->coefficient,
            'credit' => $request->credit,
        ]);

        return redirect()->back()->with('success', 'Subject created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'subject_name' => 'required|string',
            'coefficient' => 'required|integer',
            'credit' => 'required|integer',
        ]);

        $subject = Subject::findOrFail($id);
        $subject->update([
            'subject_name' => $request->subject_name,
            'coefficient' => $request->coefficient,
            'credit' => $request->credit,
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