<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Get users by role
     */
    public function getUsersByRole(string $role): Collection
    {
        return $this->model->whereHas($role)->get();
    }

    /**
     * Get users with role relationships
     */
    public function getUsersWithRoles(): Collection
    {
        return $this->model->with(['student', 'teacher', 'administrator'])->get();
    }

    /**
     * Get students (users with student role)
     */
    public function getStudents(): Collection
    {
        return $this->model->whereHas('student')->get();
    }

    /**
     * Get teachers (users with teacher role)
     */
    public function getTeachers(): Collection
    {
        return $this->model->whereHas('teacher')->get();
    }

    /**
     * Get administrators (users with administrator role)
     */
    public function getAdministrators(): Collection
    {
        return $this->model->whereHas('administrator')->get();
    }

    /**
     * Get users for selection (with formatted names)
     */
    public function getUsersForSelection(): array
    {
        $users = $this->model->get();
        
        return $users->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name . ' (' . $user->username . ')',
            ];
        })->toArray();
    }

    /**
     * Get students for selection
     */
    public function getStudentsForSelection(): array
    {
        $students = $this->model->whereHas('student')->get();
        
        return $students->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name . ' (' . $user->username . ')',
            ];
        })->toArray();
    }

    /**
     * Get user with full profile
     */
    public function getUserWithProfile(int $userId)
    {
        return $this->model->with([
            'student.group.academicLevel.speciality',
            'student.academicLevel.speciality',
            'teacher.subjects',
            'administrator'
        ])->find($userId);
    }

    /**
     * Search users by name or username
     */
    public function searchUsers(string $search): Collection
    {
        return $this->model->where('first_name', 'like', "%{$search}%")
            ->orWhere('last_name', 'like', "%{$search}%")
            ->orWhere('username', 'like', "%{$search}%")
            ->get();
    }

    /**
     * Get users count by role
     */
    public function getUsersCountByRole(): array
    {
        return [
            'students' => $this->model->whereHas('student')->count(),
            'teachers' => $this->model->whereHas('teacher')->count(),
            'administrators' => $this->model->whereHas('administrator')->count(),
            'total' => $this->model->count()
        ];
    }
} 