<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\AcademicLevel;
use App\Models\Speciality;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminGroupsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = Group::with(['academicLevel.speciality']);

        if ($search) {
            $query->whereHas('academicLevel.speciality', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhere('group_number', 'like', "%{$search}%");
        }

        $groups = $query->get()->map(function($group) {
            return [
                'id' => $group->id,
                'group_number' => $group->group_number,
                'level' => $group->academicLevel->level,
                'speciality_name' => $group->academicLevel->speciality->name,
                'academic_level_id' => $group->academic_level_id
            ];
        });

        $academicLevels = AcademicLevel::with('speciality')->get();

        return Inertia::render('admin/Groups', [
            'groups' => $groups,
            'academicLevels' => $academicLevels,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'group_number' => 'required|integer',
            'academic_level_id' => 'required|exists:academic_levels,id'
        ]);

        Group::create([
            'group_number' => $request->group_number,
            'academic_level_id' => $request->academic_level_id
        ]);

        return redirect()->back()->with('success', 'Group created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'group_number' => 'required|integer',
            'academic_level_id' => 'required|exists:academic_levels,id'
        ]);

        $group = Group::findOrFail($id);
        $group->update([
            'group_number' => $request->group_number,
            'academic_level_id' => $request->academic_level_id
        ]);

        return redirect()->back()->with('success', 'Group updated successfully');
    }

    public function destroy($id)
    {
        $group = Group::findOrFail($id);
        $group->delete();

        return redirect()->back()->with('success', 'Group deleted successfully');
    }
} 