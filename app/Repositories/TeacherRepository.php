<?php

namespace App\Repositories;

use App\Models\Teacher;
use App\Models\Schedule;
use App\Models\Lecture;
use App\Models\Grade;
use App\Models\Attendance;
use Illuminate\Database\Eloquent\Collection;

class TeacherRepository extends BaseRepository
{
    public function __construct(Teacher $model)
    {
        parent::__construct($model);
    }

    /**
     * Get teacher with user profile
     */
    public function getTeacherWithProfile(int $userId)
    {
        return $this->model->with(['user'])->where('user_id', $userId)->first();
    }

    /**
     * Get teacher with full details
     */
    public function getTeacherWithDetails(int $teacherId)
    {
        return $this->model->with([
            'user',
            'subjects',
            'lectures.subject',
            'lectures.academicLevel.speciality',
            'lectures.classRoom'
        ])->find($teacherId);
    }

    /**
     * Get teacher's schedules
     */
    public function getTeacherSchedules(int $teacherId): Collection
    {
        return Schedule::with(['subject', 'group.academicLevel.speciality', 'classRoom'])
            ->where('teacher_id', $teacherId)
            ->orderBy('day_of_week')
            ->orderBy('class_index')
            ->get();
    }

    /**
     * Get teacher's lectures
     */
    public function getTeacherLectures(int $teacherId): Collection
    {
        return Lecture::with(['subject', 'academicLevel.speciality', 'classRoom'])
            ->where('teacher_id', $teacherId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get teacher's schedules count
     */
    public function getTeacherSchedulesCount(int $teacherId): int
    {
        return Schedule::where('teacher_id', $teacherId)->count();
    }

    /**
     * Get teacher's lectures count
     */
    public function getTeacherLecturesCount(int $teacherId): int
    {
        return Lecture::where('teacher_id', $teacherId)->count();
    }

    /**
     * Get teacher's grades
     */
    public function getTeacherGrades(int $teacherId, int $semesterId = null): Collection
    {
        $query = Grade::with(['student.user', 'subject'])
            ->whereHas('subject', function($q) use ($teacherId) {
                $q->whereHas('teachers', function($subQ) use ($teacherId) {
                    $subQ->where('teachers.id', $teacherId);
                });
            });

        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }

        return $query->get();
    }

    /**
     * Get teacher's attendance records
     */
    public function getTeacherAttendance(int $teacherId): Collection
    {
        return Attendance::with(['student.user', 'subject'])
            ->whereHas('subject', function($q) use ($teacherId) {
                $q->whereHas('teachers', function($subQ) use ($teacherId) {
                    $subQ->where('teachers.id', $teacherId);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get teachers with user data
     */
    public function getTeachersWithUsers(): Collection
    {
        return $this->model->with('user')->get();
    }

    /**
     * Get teachers for selection
     */
    public function getTeachersForSelection(): array
    {
        $teachers = $this->model->with('user')->get();
        
        return $teachers->map(function($teacher) {
            return [
                'id' => $teacher->id,
                'name' => $teacher->user ? $teacher->user->first_name . ' ' . $teacher->user->last_name : '',
                'user_id' => $teacher->user_id
            ];
        })->toArray();
    }

    /**
     * Get teacher by user ID
     */
    public function getTeacherByUserId(int $userId)
    {
        return $this->model->with('user')->where('user_id', $userId)->first();
    }

    /**
     * Get teachers count
     */
    public function getTeachersCount(): int
    {
        return $this->model->count();
    }
} 