<?php

namespace App\Repositories;

use App\Models\Lecture;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Teacher;
use App\Models\Resource;
use App\Models\AcademicLevel;
use App\Models\SchedulerSetting;
use Illuminate\Database\Eloquent\Collection;

class LectureRepository extends BaseRepository
{
    public function __construct(Lecture $model)
    {
        parent::__construct($model);
    }

    /**
     * Get lectures with relationships
     */
    public function getLecturesWithRelations(string $search = null): Collection
    {
        $query = $this->model->with(['subject', 'teacher', 'classRoom', 'academicLevel.speciality']);

        if ($search) {
            $query->whereHas('subject', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('teacher', function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    /**
     * Get lectures with formatted data
     */
    public function getLecturesWithData(string $search = null): array
    {
        $settings = SchedulerSetting::first();
        $class_duration = $settings ? $settings->class_duration : 60;
        $first_class_start_at = $settings ? $settings->first_class_start_at : '08:00';

        $lectures = $this->getLecturesWithRelations($search);
        
        return $lectures->map(function($lecture) use ($class_duration, $first_class_start_at) {
            return [
                'id' => $lecture->id,
                'class_room' => $lecture->classRoom ? $lecture->classRoom->resource_type : '',
                'class_room_number' => $lecture->classRoom ? $lecture->classRoom->resource_number : '',
                'subject_name' => $lecture->subject ? $lecture->subject->subject_name : '',
                'first_name' => $lecture->teacher && $lecture->teacher->user ? $lecture->teacher->user->first_name : '',
                'last_name' => $lecture->teacher && $lecture->teacher->user ? $lecture->teacher->user->last_name : '',
                'level' => $lecture->academicLevel ? $lecture->academicLevel->level : '',
                'speciality_name' => $lecture->academicLevel && $lecture->academicLevel->speciality ? $lecture->academicLevel->speciality->speciality_name : '',
                'day_of_week' => $lecture->day_of_week,
                'class_index' => $lecture->class_index,
                'start_time' => $this->calcTime($lecture->class_index, $class_duration, $first_class_start_at),
                'end_time' => $this->calcTime($lecture->class_index + 1, $class_duration, $first_class_start_at),
                'academic_level' => $lecture->academicLevel ? 'L' . $lecture->academicLevel->level . ' ' . ($lecture->academicLevel->speciality ? $lecture->academicLevel->speciality->speciality_name : '') : '',
                'academic_level_id' => $lecture->academic_level_id,
                'teacher_id' => $lecture->teacher_id,
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
     * Get lectures by teacher
     */
    public function getLecturesByTeacher(int $teacherId): Collection
    {
        return $this->model->with(['subject', 'classRoom', 'academicLevel.speciality'])
            ->where('teacher_id', $teacherId)
            ->get();
    }

    /**
     * Get lectures by academic level
     */
    public function getLecturesByAcademicLevel(int $academicLevelId): Collection
    {
        return $this->model->with(['subject', 'teacher.user', 'classRoom'])
            ->where('academic_level_id', $academicLevelId)
            ->get();
    }

    /**
     * Get lectures by day of week
     */
    public function getLecturesByDay(int $dayOfWeek): Collection
    {
        return $this->model->with(['subject', 'teacher.user', 'classRoom', 'academicLevel.speciality'])
            ->where('day_of_week', $dayOfWeek)
            ->orderBy('class_index')
            ->get();
    }

    /**
     * Get academic levels with specialities
     */
    public function getAcademicLevelsWithSpecialities(): array
    {
        $levels = AcademicLevel::with('speciality')->get();
        
        return $levels->map(function($level) {
            return [
                'id' => $level->id,
                'level' => $level->level,
                'speciality_name' => $level->speciality ? $level->speciality->speciality_name : '',
            ];
        })->toArray();
    }

    /**
     * Get groups with academic levels
     */
    public function getGroupsWithAcademicLevels(): array
    {
        $groups = Group::with('academicLevel.speciality')->get();
        
        return $groups->map(function($group) {
            return [
                'id' => $group->id,
                'group_number' => $group->group_number,
                'level' => $group->academicLevel ? $group->academicLevel->level : '',
                'speciality_name' => $group->academicLevel && $group->academicLevel->speciality ? $group->academicLevel->speciality->speciality_name : '',
            ];
        })->toArray();
    }

    /**
     * Get classroom resources
     */
    public function getClassroomResources(): array
    {
        $rooms = Resource::get();
        
        return $rooms->map(function($room) {
            return [
                'id' => $room->id,
                'resource_type' => $room->resource_type,
                'resource_number' => $room->resource_number
            ];
        })->toArray();
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
                'subject_name' => $subject->subject_name
            ];
        })->toArray();
    }

    /**
     * Get teachers for selection
     */
    public function getTeachersForSelection(): array
    {
        $teachers = Teacher::with('user')->get();
        
        return $teachers->map(function($teacher) {
            return [
                'id' => $teacher->id,
                'first_name' => $teacher->user ? $teacher->user->first_name : '',
                'last_name' => $teacher->user ? $teacher->user->last_name : '',
            ];
        })->toArray();
    }

    /**
     * Get scheduler settings
     */
} 