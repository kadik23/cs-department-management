<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\Subject;
use App\Repositories\ResourceRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminResourcesController extends Controller
{
    protected $resourceRepository;

    public function __construct(ResourceRepository $resourceRepository)
    {
        $this->resourceRepository = $resourceRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $resources = $this->resourceRepository->getResourcesWithData($search);

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

        $this->resourceRepository->create([
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

        $this->resourceRepository->update($id, [
            'resource_type' => $request->resource_type,
            'resource_number' => $request->resource_number,
        ]);

        return redirect()->back()->with('success', 'Resource updated successfully');
    }

    public function destroy($id)
    {
        $this->resourceRepository->delete($id);

        return redirect()->back()->with('success', 'Resource deleted successfully');
    }
} 