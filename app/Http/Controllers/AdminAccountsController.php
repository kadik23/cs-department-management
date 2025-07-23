<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Administrator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

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

        return Inertia::render('admin/Accounts', [
            'users' => $users,
            'search' => $search
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
            'last_name' => 'required'
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        switch ($request->role) {
            case 'student':
                Student::create([
                    'user_id' => $user->id,
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'academic_level_id' => $request->academic_level_id
                ]);
                break;
            case 'teacher':
                Teacher::create([
                    'user_id' => $user->id,
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name
                ]);
                break;
            case 'administrator':
                Administrator::create([
                    'user_id' => $user->id,
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name
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