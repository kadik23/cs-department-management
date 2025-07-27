<?php

namespace App\Repositories;

use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Collection;

class SubjectRepository extends BaseRepository
{
    public function __construct(Subject $model)
    {
        parent::__construct($model);
    }

    /**
     * Get subjects with formatted data
     */
    public function getSubjectsWithData(string $search = null): array
    {
        $query = $this->model->query();

        if ($search) {
            $query->where('subject_name', 'like', "%{$search}%");
        }

        $subjects = $query->get();
        
        return $subjects->map(function($subject) {
            return [
                'id' => $subject->id,
                'subject_name' => $subject->subject_name,
                'coefficient' => $subject->coefficient,
                'credit' => $subject->credit,
            ];
        })->toArray();
    }

    /**
     * Get subjects with teachers
     */
    public function getSubjectsWithTeachers(): Collection
    {
        return $this->model->with('teachers')->get();
    }

    /**
     * Get subjects by teacher
     */
    public function getSubjectsByTeacher(int $teacherId): Collection
    {
        return $this->model->whereHas('teachers', function($query) use ($teacherId) {
            $query->where('teachers.id', $teacherId);
        })->get();
    }

    /**
     * Get subjects with academic levels
     */
    public function getSubjectsWithAcademicLevels(): Collection
    {
        return $this->model->with('academicLevels')->get();
    }

    /**
     * Get subject with full details
     */
    public function getSubjectWithDetails(int $subjectId)
    {
        return $this->model->with([
            'teachers.user',
            'academicLevels.groups',
            'lectures',
            'grades'
        ])->find($subjectId);
    }

    /**
     * Get subjects count
     */
    public function getSubjectsCount(): int
    {
        return $this->model->count();
    }

    /**
     * Get subjects with teacher count
     */
    public function getSubjectsWithTeacherCount(): array
    {
        $subjects = $this->model->with('teachers')->get();
        
        return $subjects->map(function($subject) {
            return [
                'id' => $subject->id,
                'subject_name' => $subject->subject_name,
                'coefficient' => $subject->coefficient,
                'credit' => $subject->credit,
                'teacher_count' => $subject->teachers->count()
            ];
        })->toArray();
    }

    /**
     * Get subjects by academic level
     */
    public function getSubjectsByAcademicLevel(int $academicLevelId): Collection
    {
        return $this->model->whereHas('academicLevels', function($query) use ($academicLevelId) {
            $query->where('academic_levels.id', $academicLevelId);
        })->get();
    }
} 