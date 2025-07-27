<?php

namespace App\Repositories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GroupRepository extends BaseRepository
{
    public function __construct(Group $model)
    {
        parent::__construct($model);
    }

    /**
     * Get groups with academic level and speciality relationships
     */
    public function getGroupsWithRelations(string $search = null): Collection
    {
        $query = $this->model->with(['academicLevel.speciality', 'responsibleUser', 'students']);

        if ($search) {
            $query->whereHas('academicLevel.speciality', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhere('group_number', 'like', "%{$search}%");
        }

        return $query->get();
    }

    /**
     * Get groups with formatted data
     */
    public function getGroupsWithData(string $search = null): array
    {
        $groups = $this->getGroupsWithRelations($search);
        
        return $groups->map(function($group) {
            return [
                'id' => $group->id,
                'group_number' => $group->group_number,
                'speciality_name' => $group->academicLevel && $group->academicLevel->speciality ? $group->academicLevel->speciality->speciality_name : '',
                'responsable' => $group->responsibleUser ? ($group->responsibleUser->first_name . ' ' . $group->responsibleUser->last_name) : '',
                'total_students' => $group->students ? $group->students->count() : 0,
            ];
        })->toArray();
    }

    /**
     * Get groups by academic level
     */
    public function getGroupsByAcademicLevel(int $academicLevelId): Collection
    {
        return $this->model->with(['academicLevel.speciality'])
            ->where('academic_level_id', $academicLevelId)
            ->get();
    }

    /**
     * Get groups by academic level with formatted data
     */
    public function getGroupsByAcademicLevelWithData(int $academicLevelId): array
    {
        $groups = $this->getGroupsByAcademicLevel($academicLevelId);
        
        return $groups->map(function($group) {
            return [
                'id' => $group->id,
                'group_number' => $group->group_number,
                'level' => $group->academicLevel->level,
                'speciality_name' => $group->academicLevel->speciality->speciality_name
            ];
        })->toArray();
    }

    /**
     * Get available responsible users (students)
     */
    public function getAvailableResponsibles(): array
    {
        $responsibles = User::whereHas('student')->get();
        
        return $responsibles->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name . ' (' . $user->username . ')',
            ];
        })->toArray();
    }

    /**
     * Get group with full details
     */
    public function getGroupWithDetails(int $groupId)
    {
        return $this->model->with([
            'academicLevel.speciality',
            'responsibleUser',
            'students.user',
            'students.academicLevel'
        ])->find($groupId);
    }

    /**
     * Get groups count by academic level
     */
    public function getGroupsCountByAcademicLevel(): array
    {
        return $this->model->with('academicLevel')
            ->get()
            ->groupBy('academic_level_id')
            ->map(function($groups, $academicLevelId) {
                return [
                    'academic_level_id' => $academicLevelId,
                    'count' => $groups->count()
                ];
            })
            ->values()
            ->toArray();
    }
} 