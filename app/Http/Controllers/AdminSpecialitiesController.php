<?php

namespace App\Http\Controllers;

use App\Models\Speciality;
use App\Repositories\SpecialityRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSpecialitiesController extends Controller
{
    protected $specialityRepository;

    public function __construct(SpecialityRepository $specialityRepository)
    {
        $this->specialityRepository = $specialityRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $specialities = $this->specialityRepository->getSpecialitiesWithData($search);

        return Inertia::render('admin/Specialities', [
            'specialities' => $specialities,
            'search' => $search
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'speciality_name' => 'required|string|unique:specialities,speciality_name',
        ]);

        $this->specialityRepository->create([
            'speciality_name' => $request->speciality_name,
        ]);

        return redirect()->back()->with('success', 'Speciality created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'speciality_name' => 'required|string|unique:specialities,speciality_name,' . $id,
        ]);

        $this->specialityRepository->update($id, [
            'speciality_name' => $request->speciality_name,
        ]);

        return redirect()->back()->with('success', 'Speciality updated successfully');
    }

    public function destroy($id)
    {
        $this->specialityRepository->delete($id);

        return redirect()->back()->with('success', 'Speciality deleted successfully');
    }
} 