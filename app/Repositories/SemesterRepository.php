<?php

namespace App\Repositories;

use App\Models\Semester;
use Carbon\Carbon;

class SemesterRepository extends BaseRepository
{
    public function __construct(Semester $model)
    {
        parent::__construct($model);
    }

    /**
     * Get semesters with formatted data
     */
    public function getSemestersWithData(string $search = null): array
    {
        $query = $this->model->withCount('grades');

        if ($search) {
            $query->where('semester_name', 'like', "%{$search}%");
        }

        $today = Carbon::today()->toDateString();
        $semesters = $query->orderBy('start_at', 'desc')->get();

        return $semesters->map(function ($semester) use ($today) {
            $start = $semester->start_at ? Carbon::parse($semester->start_at)->toDateString() : null;
            $end = $semester->end_at ? Carbon::parse($semester->end_at)->toDateString() : null;

            $isActive = false;
            $status = 'Upcoming';

            if ($start && $end) {
                if ($today >= $start && $today <= $end) {
                    $isActive = true;
                    $status = 'Active';
                } elseif ($today > $end) {
                    $status = 'Past';
                } else {
                    $status = 'Upcoming';
                }
            }

            return [
                'id' => $semester->id,
                'semester_name' => $semester->semester_name,
                'start_at' => $start,
                'end_at' => $end,
                'is_active' => $isActive,
                'status' => $status,
                'grades_count' => $semester->grades_count ?? 0,
                'created_at' => $semester->created_at ? $semester->created_at->format('Y-m-d') : null,
            ];
        })->toArray();
    }
}
