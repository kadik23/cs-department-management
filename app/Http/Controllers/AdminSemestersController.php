<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use App\Repositories\SemesterRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSemestersController extends Controller
{
    protected $semesterRepository;

    public function __construct(SemesterRepository $semesterRepository)
    {
        $this->semesterRepository = $semesterRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $semesters = $this->semesterRepository->getSemestersWithData($search);

        return Inertia::render('admin/Semesters', [
            'semesters' => $semesters,
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'semester_name' => 'required|string|max:100',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after_or_equal:start_at',
        ]);

        $this->semesterRepository->create([
            'semester_name' => $request->semester_name,
            'start_at' => $request->start_at,
            'end_at' => $request->end_at,
        ]);

        return redirect()->back()->with('success', 'Semester created successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'semester_name' => 'required|string|max:100',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after_or_equal:start_at',
        ]);

        $this->semesterRepository->update($id, [
            'semester_name' => $request->semester_name,
            'start_at' => $request->start_at,
            'end_at' => $request->end_at,
        ]);

        return redirect()->back()->with('success', 'Semester updated successfully.');
    }

    public function destroy($id)
    {
        $semester = Semester::findOrFail($id);

        if ($semester->grades()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete semester: Student grades are currently linked to this semester.');
        }

        $this->semesterRepository->delete($id);

        return redirect()->back()->with('success', 'Semester deleted successfully.');
    }
}
