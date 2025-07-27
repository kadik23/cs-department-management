<?php

namespace App\Repositories;

use App\Models\ExamsSchedule;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Resource;
use App\Models\ExamSchedulerSetting;
use Illuminate\Database\Eloquent\Collection;

class ExamsScheduleRepository extends BaseRepository
{
    public function __construct(ExamsSchedule $model)
    {
        parent::__construct($model);
    }

    /**
     * Get exams with relationships
     */
    public function getExamsWithRelations(string $search = null): Collection
    {
        $query = $this->model->with(['subject', 'group', 'classRoom']);

        if ($search) {
            $query->whereHas('subject', function($q) use ($search) {
                $q->where('subject_name', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    /**
     * Get exams with formatted data
     */
    public function getExamsWithData(string $search = null): array
    {
        $settings = ExamSchedulerSetting::first();
        $exam_duration = $settings ? $settings->exam_duration : 60;
        $first_exam_start_at = $settings ? $settings->first_exam_start_at : '08:00';

        $exams = $this->getExamsWithRelations($search);
        
        return $exams->map(function($exam) use ($exam_duration, $first_exam_start_at) {
            return [
                'id' => $exam->id,
                'date' => $exam->date,
                'class_index' => $exam->class_index,
                'start_time' => $this->calcTime($exam->class_index, $exam_duration, $first_exam_start_at),
                'end_time' => $this->calcTime($exam->class_index + 1, $exam_duration, $first_exam_start_at),
                'subject_name' => $exam->subject ? $exam->subject->subject_name : 'Not assigned',
                'group_number' => $exam->group ? $exam->group->group_number : 'Not assigned',
                'class_room' => $exam->classRoom ? $exam->classRoom->resource_type . ' ' . $exam->classRoom->resource_number : 'Not assigned',
                'subject_id' => $exam->subject_id,
                'group_id' => $exam->group_id,
                'class_room_id' => $exam->class_room_id,
                'exam_type' => null, // Not in schema
            ];
        })->toArray();
    }

    /**
     * Calculate time based on class index
     */
    private function calcTime($class_index, $duration, $first_start): string
    {
        [$h, $m] = explode(':', $first_start);
        $total = ((int)$h) * 60 + ((int)$m) + $class_index * $duration;
        $hours = floor($total / 60);
        $minutes = $total % 60;
        return sprintf('%02d:%02d', $hours, $minutes);
    }

    /**
     * Get exams by date
     */
    public function getExamsByDate(string $date): Collection
    {
        return $this->model->with(['subject', 'group', 'classRoom'])
            ->where('date', $date)
            ->orderBy('class_index')
            ->get();
    }

    /**
     * Get exams by group
     */
    public function getExamsByGroup(int $groupId): Collection
    {
        return $this->model->with(['subject', 'classRoom'])
            ->where('group_id', $groupId)
            ->orderBy('date')
            ->orderBy('class_index')
            ->get();
    }

    /**
     * Get exams by subject
     */
    public function getExamsBySubject(int $subjectId): Collection
    {
        return $this->model->with(['group', 'classRoom'])
            ->where('subject_id', $subjectId)
            ->orderBy('date')
            ->orderBy('class_index')
            ->get();
    }

    /**
     * Get subjects for selection
     */
    public function getSubjectsForSelection(): array
    {
        $subjects = Subject::all();
        
        return $subjects->map(function($subject) {
            return [
                'id' => $subject->id,
                'name' => $subject->subject_name
            ];
        })->toArray();
    }

    /**
     * Get groups for selection
     */
    public function getGroupsForSelection(): array
    {
        $groups = Group::all();
        
        return $groups->map(function($group) {
            return [
                'id' => $group->id,
                'group_number' => $group->group_number
            ];
        })->toArray();
    }

    /**
     * Get classrooms for selection
     */
    public function getClassroomsForSelection(): array
    {
        $classrooms = Resource::all();
        
        return $classrooms->map(function($room) {
            return [
                'id' => $room->id,
                'resource_type' => $room->resource_type,
                'resource_number' => $room->resource_number,
            ];
        })->toArray();
    }

    /**
     * Get exam scheduler settings
     */
    public function getExamSchedulerSettings()
    {
        return ExamSchedulerSetting::first();
    }

    /**
     * Get exams count by date
     */
    public function getExamsCountByDate(): array
    {
        return $this->model->selectRaw('date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();
    }
} 