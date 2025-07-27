<?php

namespace App\Repositories;

use App\Models\Schedule;
use App\Models\Subject;
use App\Models\Group;
use App\Models\Teacher;
use App\Models\Resource;
use App\Models\SchedulerSetting;
use Illuminate\Database\Eloquent\Collection;

class ScheduleRepository extends BaseRepository
{
    public function __construct(Schedule $model)
    {
        parent::__construct($model);
    }

    /**
     * Get schedules with relationships
     */
    public function getSchedulesWithRelations(string $search = null, int $filterGroupId = null): Collection
    {
        $query = $this->model->with(['subject', 'group', 'teacher', 'classRoom']);
        
        if ($filterGroupId) {
            $query->where('group_id', $filterGroupId);
        }
        
        if ($search) {
            $query->whereHas('subject', function($q) use ($search) {
                $q->where('subject_name', 'like', "%{$search}%");
            })->orWhereHas('group', function($q) use ($search) {
                $q->where('group_number', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    /**
     * Get schedules with formatted data
     */
    public function getSchedulesWithData(string $search = null, int $filterGroupId = null): array
    {
        $schedules = $this->getSchedulesWithRelations($search, $filterGroupId);
        
        return $schedules->map(function($schedule) {
            return [
                'id' => $schedule->id,
                'class_room' => $schedule->classRoom ? $schedule->classRoom->resource_type : 'Not assigned',
                'class_room_number' => $schedule->classRoom ? $schedule->classRoom->resource_number : '',
                'subject_name' => $schedule->subject ? $schedule->subject->subject_name : 'Not assigned',
                'teacher_first_name' => $schedule->teacher && $schedule->teacher->user ? $schedule->teacher->user->first_name : '',
                'teacher_last_name' => $schedule->teacher && $schedule->teacher->user ? $schedule->teacher->user->last_name : '',
                'group_number' => $schedule->group ? $schedule->group->group_number : 'Not assigned',
                'level' => $schedule->group && $schedule->group->academicLevel ? $schedule->group->academicLevel->level : '',
                'speciality_name' => $schedule->group && $schedule->group->academicLevel && $schedule->group->academicLevel->speciality ? $schedule->group->academicLevel->speciality->speciality_name : '',
                'day_of_week' => $schedule->day_of_week,
                'class_index' => $schedule->class_index,
                'subject_id' => $schedule->subject_id,
                'group_id' => $schedule->group_id,
                'teacher_id' => $schedule->teacher_id,
                'class_room_id' => $schedule->class_room_id,
            ];
        })->toArray();
    }

    /**
     * Get schedules by group
     */
    public function getSchedulesByGroup(int $groupId): Collection
    {
        return $this->model->with(['subject', 'teacher.user', 'classRoom'])
            ->where('group_id', $groupId)
            ->orderBy('day_of_week')
            ->orderBy('class_index')
            ->get();
    }

    /**
     * Get schedules by teacher
     */
    public function getSchedulesByTeacher(int $teacherId): Collection
    {
        return $this->model->with(['subject', 'group.academicLevel.speciality', 'classRoom'])
            ->where('teacher_id', $teacherId)
            ->orderBy('day_of_week')
            ->orderBy('class_index')
            ->get();
    }

    /**
     * Get schedules by day of week
     */
    public function getSchedulesByDay(int $dayOfWeek): Collection
    {
        return $this->model->with(['subject', 'group.academicLevel.speciality', 'teacher.user', 'classRoom'])
            ->where('day_of_week', $dayOfWeek)
            ->orderBy('class_index')
            ->get();
    }

    /**
     * Check for group conflict
     */
    public function checkGroupConflict(int $groupId, int $classIndex, int $dayOfWeek, int $excludeId = null): bool
    {
        $query = $this->model->where('group_id', $groupId)
            ->where('class_index', $classIndex)
            ->where('day_of_week', $dayOfWeek);
            
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }

    /**
     * Check for teacher conflict
     */
    public function checkTeacherConflict(int $teacherId, int $classIndex, int $dayOfWeek, int $excludeId = null): bool
    {
        $query = $this->model->where('teacher_id', $teacherId)
            ->where('class_index', $classIndex)
            ->where('day_of_week', $dayOfWeek);
            
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }

    /**
     * Check for classroom conflict
     */
    public function checkClassroomConflict(int $classroomId, int $classIndex, int $dayOfWeek, int $excludeId = null): bool
    {
        $query = $this->model->where('class_room_id', $classroomId)
            ->where('class_index', $classIndex)
            ->where('day_of_week', $dayOfWeek);
            
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }

    /**
     * Get subjects for selection
     */
    public function getSubjectsForSelection(): array
    {
        $subjects = Subject::all(['id', 'subject_name']);
        
        return $subjects->map(function($subject) {
            return [
                'id' => $subject->id,
                'name' => $subject->subject_name
            ];
        })->toArray();
    }

    /**
     * Get groups with academic levels for selection
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
     * Get classrooms for selection
     */
    public function getClassroomsForSelection(): Collection
    {
        return Resource::get();
    }

    /**
     * Get scheduler settings
     */
    public function getSchedulerSettings()
    {
        return SchedulerSetting::first();
    }

    /**
     * Get schedules count by day
     */
    public function getSchedulesCountByDay(): array
    {
        return $this->model->selectRaw('day_of_week, count(*) as count')
            ->groupBy('day_of_week')
            ->pluck('count', 'day_of_week')
            ->toArray();
    }
} 