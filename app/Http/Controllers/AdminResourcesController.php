<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminResourcesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = Resource::with(['subject']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $resources = $query->get()->map(function($resource) {
            return [
                'id' => $resource->id,
                'title' => $resource->title,
                'description' => $resource->description,
                'file_path' => $resource->file_path,
                'subject_name' => $resource->subject ? $resource->subject->name : 'Not assigned',
                'subject_id' => $resource->subject_id,
                'created_at' => $resource->created_at->format('Y-m-d')
            ];
        });

        $subjects = Subject::all()->map(function($subject) {
            return [
                'id' => $subject->id,
                'name' => $subject->name
            ];
        });

        return Inertia::render('admin/Resources', [
            'resources' => $resources,
            'subjects' => $subjects,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'file_path' => 'required|string',
            'subject_id' => 'nullable|exists:subjects,id'
        ]);

        Resource::create([
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => $request->file_path,
            'subject_id' => $request->subject_id
        ]);

        return redirect()->back()->with('success', 'Resource created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'file_path' => 'required|string',
            'subject_id' => 'nullable|exists:subjects,id'
        ]);

        $resource = Resource::findOrFail($id);
        $resource->update([
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => $request->file_path,
            'subject_id' => $request->subject_id
        ]);

        return redirect()->back()->with('success', 'Resource updated successfully');
    }

    public function destroy($id)
    {
        $resource = Resource::findOrFail($id);
        $resource->delete();

        return redirect()->back()->with('success', 'Resource deleted successfully');
    }
} 