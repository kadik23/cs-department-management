<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Teacher;
use App\Repositories\SubjectRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSubjectsController extends Controller
{
    protected $subjectRepository;

    public function __construct(SubjectRepository $subjectRepository)
    {
        $this->subjectRepository = $subjectRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $subjects = $this->subjectRepository->getSubjectsWithData($search);

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

        $this->subjectRepository->create([
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

        $this->subjectRepository->update($id, [
            'subject_name' => $request->subject_name,
            'coefficient' => $request->coefficient,
            'credit' => $request->credit,
        ]);

        return redirect()->back()->with('success', 'Subject updated successfully');
    }

    public function destroy($id)
    {
        $this->subjectRepository->delete($id);

        return redirect()->back()->with('success', 'Subject deleted successfully');
    }
} 