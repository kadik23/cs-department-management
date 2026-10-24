<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $totalStudents = Student::count();
        $totalTeachers = Teacher::count();
        $totalUsers = User::count();
        $collegeYear = Semester::getActiveCollegeYear();
        $recentAnnouncements = \App\Models\Announcement::with(['author', 'academicLevel.speciality'])
            ->pinnedFirst()
            ->take(5)
            ->get();

        return Inertia::render('admin/AdminHome', [
            'stats' => [
                'totalStudents' => $totalStudents,
                'totalTeachers' => $totalTeachers,
                'totalUsers' => $totalUsers,
                'collegeYear' => $collegeYear,
            ],
            'recentAnnouncements' => $recentAnnouncements,
        ]);
    }
} 