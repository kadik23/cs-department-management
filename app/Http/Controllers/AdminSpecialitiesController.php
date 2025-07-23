<?php

namespace App\Http\Controllers;

use App\Models\Speciality;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSpecialitiesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = Speciality::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $specialities = $query->get()->map(function($speciality) {
            return [
                'id' => $speciality->id,
                'name' => $speciality->speciality_name,
                'description' => $speciality->description,
                'created_at' => $speciality->created_at->format('Y-m-d')
            ];
        });

        return Inertia::render('admin/Specialities', [
            'specialities' => $specialities,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:specialities,name',
            'description' => 'nullable|string'
        ]);

        Speciality::create([
            'speciality_name' => $request->name,
            'description' => $request->description
        ]);

        return redirect()->back()->with('success', 'Speciality created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|unique:specialities,name,' . $id,
            'description' => 'nullable|string'
        ]);

        $speciality = Speciality::findOrFail($id);
        $speciality->update([
            'speciality_name' => $request->name,
            'description' => $request->description
        ]);

        return redirect()->back()->with('success', 'Speciality updated successfully');
    }

    public function destroy($id)
    {
        $speciality = Speciality::findOrFail($id);
        $speciality->delete();

        return redirect()->back()->with('success', 'Speciality deleted successfully');
    }
} 