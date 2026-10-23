<?php

namespace App\Http\Controllers;

use App\Models\AcademicLevel;
use App\Models\Speciality;
use App\Repositories\AcademicLevelRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAcademicLevelsController extends Controller
{
    protected $academicLevelRepository;

    public function __construct(AcademicLevelRepository $academicLevelRepository)
    {
        $this->academicLevelRepository = $academicLevelRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $academicLevels = $this->academicLevelRepository->getAcademicLevelsWithData($search);
        $specialities = Speciality::orderBy('speciality_name')->get(['id', 'speciality_name']);

        return Inertia::render('admin/AcademicLevels', [
            'academicLevels' => $academicLevels,
            'specialities' => $specialities,
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'speciality_id' => 'required|exists:specialities,id',
            'level' => 'required|integer|min:1|max:10',
        ]);

        $exists = AcademicLevel::where('speciality_id', $request->speciality_id)
            ->where('level', $request->level)
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors([
                'level' => 'This academic level already exists for the selected speciality.'
            ]);
        }

        $this->academicLevelRepository->create([
            'speciality_id' => $request->speciality_id,
            'level' => $request->level,
        ]);

        return redirect()->back()->with('success', 'Academic level created successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'speciality_id' => 'required|exists:specialities,id',
            'level' => 'required|integer|min:1|max:10',
        ]);

        $exists = AcademicLevel::where('speciality_id', $request->speciality_id)
            ->where('level', $request->level)
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors([
                'level' => 'This academic level already exists for the selected speciality.'
            ]);
        }

        $this->academicLevelRepository->update($id, [
            'speciality_id' => $request->speciality_id,
            'level' => $request->level,
        ]);

        return redirect()->back()->with('success', 'Academic level updated successfully.');
    }

    public function destroy($id)
    {
        $level = AcademicLevel::findOrFail($id);

        if ($level->groups()->exists() || $level->students()->exists() || $level->lectures()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete academic level: Groups, students, or lectures are linked to it.');
        }

        $this->academicLevelRepository->delete($id);

        return redirect()->back()->with('success', 'Academic level deleted successfully.');
    }
}
