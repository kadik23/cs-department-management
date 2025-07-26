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
        
        $query = Resource::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('resource_type', 'like', "%{$search}%")
                  ->orWhere('resource_number', 'like', "%{$search}%");
            });
        }

        $resources = $query->get()->map(function($resource) {
            return [
                'id' => $resource->id,
                'resource_type' => $resource->resource_type,
                'resource_number' => $resource->resource_number,
            ];
        });

        return Inertia::render('admin/Resources', [
            'resources' => $resources,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'resource_type' => 'required|string',
            'resource_number' => 'required|string',
        ]);

        Resource::create([
            'resource_type' => $request->resource_type,
            'resource_number' => $request->resource_number,
        ]);

        return redirect()->back()->with('success', 'Resource created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'resource_type' => 'required|string',
            'resource_number' => 'required|string',
        ]);

        $resource = Resource::findOrFail($id);
        $resource->update([
            'resource_type' => $request->resource_type,
            'resource_number' => $request->resource_number,
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