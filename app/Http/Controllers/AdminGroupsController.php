<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\AcademicLevel;
use App\Models\Speciality;
use App\Repositories\GroupRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminGroupsController extends Controller
{
    protected $groupRepository;
    protected $userRepository;

    public function __construct(GroupRepository $groupRepository, UserRepository $userRepository)
    {
        $this->groupRepository = $groupRepository;
        $this->userRepository = $userRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $groups = $this->groupRepository->getGroupsWithData($search);
        $academicLevels = AcademicLevel::with('speciality')->get();
        $responsibles = $this->userRepository->getStudentsForSelection();

        return Inertia::render('admin/Groups', [
            'groups' => $groups,
            'academicLevels' => $academicLevels,
            'responsibles' => $responsibles,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'group_number' => 'required|integer',
            'academic_level_id' => 'required|exists:academic_levels,id',
            'responsible' => 'required|exists:users,id',
        ]);

        $this->groupRepository->create([
            'group_number' => $request->group_number,
            'academic_level_id' => $request->academic_level_id,
            'responsible' => $request->responsible,
        ]);

        return redirect()->back()->with('success', 'Group created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'group_number' => 'required|integer',
            'academic_level_id' => 'required|exists:academic_levels,id'
        ]);

        $this->groupRepository->update($id, [
            'group_number' => $request->group_number,
            'academic_level_id' => $request->academic_level_id
        ]);

        return redirect()->back()->with('success', 'Group updated successfully');
    }

    public function destroy($id)
    {
        $this->groupRepository->delete($id);

        return redirect()->back()->with('success', 'Group deleted successfully');
    }
} 