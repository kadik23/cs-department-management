<?php

namespace App\Repositories;

use App\Models\AcademicLevel;

class AcademicLevelRepository extends BaseRepository
{
    public function __construct(AcademicLevel $model)
    {
        parent::__construct($model);
    }

    /**
     * Get academic levels with formatted data
     */
    public function getAcademicLevelsWithData(string $search = null): array
    {
        $query = $this->model->with('speciality')
            ->withCount(['groups', 'students', 'lectures']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('level', 'like', "%{$search}%")
                  ->orWhereHas('speciality', function ($sq) use ($search) {
                      $sq->where('speciality_name', 'like', "%{$search}%");
                  });
            });
        }

        $levels = $query->orderBy('level', 'asc')->get();

        return $levels->map(function ($level) {
            $specialityName = $level->speciality ? $level->speciality->speciality_name : 'N/A';
            return [
                'id' => $level->id,
                'level' => $level->level,
                'level_label' => 'Level ' . $level->level . ' (' . $specialityName . ')',
                'short_label' => 'L' . $level->level . ' - ' . $specialityName,
                'speciality_id' => $level->speciality_id,
                'speciality_name' => $specialityName,
                'groups_count' => $level->groups_count ?? 0,
                'students_count' => $level->students_count ?? 0,
                'lectures_count' => $level->lectures_count ?? 0,
                'created_at' => $level->created_at ? $level->created_at->format('Y-m-d') : null,
            ];
        })->toArray();
    }
}
