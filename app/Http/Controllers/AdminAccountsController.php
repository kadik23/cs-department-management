<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Administrator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use App\Models\Group;

class AdminAccountsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $query = User::with(['student', 'teacher', 'administrator']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->get()->map(function($user) {
            $role = 'Student';
            if ($user->teacher) $role = 'Teacher';
            if ($user->administrator) $role = 'Administrator';
            
            return [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $role,
                'created_at' => $user->created_at->format('Y-m-d')
            ];
        });

        $groups = Group::with('academicLevel.speciality')->get()->map(function($g) {
            return [
                'id' => $g->id,
                'academic_level_id' => $g->academic_level_id,
                'level' => $g->academicLevel ? $g->academicLevel->level : '',
                'speciality_name' => $g->academicLevel && $g->academicLevel->speciality ? $g->academicLevel->speciality->speciality_name : '',
                'group_number' => $g->group_number,
            ];
        });

        return Inertia::render('admin/Accounts', [
            'users' => $users,
            'search' => $search,
            'groups' => $groups,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:student,teacher,administrator',
            'first_name' => 'required',
            'last_name' => 'required',
            'academic_level_id' => $request->role === 'student' ? 'required|exists:academic_levels,id' : '',
            'group_id' => $request->role === 'student' ? 'required|exists:groups,id' : '',
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
        ]);

        switch ($request->role) {
            case 'student':
                logger('Creating student', [
                    'user_id' => $user->id,
                    'academic_level_id' => $request->academic_level_id,
                    'group_id' => $request->group_id
                ]);
                Student::create([
                    'user_id' => $user->id,
                    'academic_level_id' => $request->academic_level_id,
                    'group_id' => $request->group_id
                ]);
                break;
            case 'teacher':
                Teacher::create([
                    'user_id' => $user->id,               
                ]);
                break;
            case 'administrator':
                Administrator::create([
                    'user_id' => $user->id,
                ]);
                break;
        }

        return redirect()->back()->with('success', 'Account created successfully');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'Account deleted successfully');
    }
} 