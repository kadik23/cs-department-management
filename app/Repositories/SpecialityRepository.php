<?php

namespace App\Repositories;

use App\Models\Speciality;
use Illuminate\Database\Eloquent\Collection;

class SpecialityRepository extends BaseRepository
{
    public function __construct(Speciality $model)
    {
        parent::__construct($model);
    }

    /**
     * Get specialities with formatted data
     */
    public function getSpecialitiesWithData(string $search = null): array
    {
        $query = $this->model->query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $specialities = $query->get();
        
        return $specialities->map(function($speciality) {
            return [
                'id' => $speciality->id,
                'name' => $speciality->speciality_name,
                'description' => $speciality->description,
                'created_at' => $speciality->created_at->format('Y-m-d')
            ];
        })->toArray();
    }

    /**
     * Get specialities with academic levels
     */
    public function getSpecialitiesWithAcademicLevels(): Collection
    {
        return $this->model->with('academicLevels')->get();
    }

    /**
     * Get speciality with full details
     */
    public function getSpecialityWithDetails(int $specialityId)
    {
        return $this->model->with([
            'academicLevels.groups.students',
            'academicLevels.subjects'
        ])->find($specialityId);
    }

    /**
     * Get specialities count
     */
    public function getSpecialitiesCount(): int
    {
        return $this->model->count();
    }

    /**
     * Get specialities with student count
     */
    public function getSpecialitiesWithStudentCount(): array
    {
        $specialities = $this->model->with(['academicLevels.groups.students'])->get();
        
        return $specialities->map(function($speciality) {
            $studentCount = 0;
            foreach ($speciality->academicLevels as $academicLevel) {
                foreach ($academicLevel->groups as $group) {
                    $studentCount += $group->students->count();
                }
            }
            
            return [
                'id' => $speciality->id,
                'name' => $speciality->speciality_name,
                'description' => $speciality->description,
                'student_count' => $studentCount
            ];
        })->toArray();
    }
} 