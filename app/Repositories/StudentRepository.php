<?php

namespace App\Repositories;

use App\Models\Student;
use App\Models\Attendance;
use App\Models\Grade;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class StudentRepository extends BaseRepository
{
    public function __construct(Student $model)
    {
        parent::__construct($model);
    }

    /**
     * Get students with user, group, and academic level relationships
     */
    public function getStudentsWithRelations(string $search = null): Collection
    {
        $query = $this->model->with(['user', 'group', 'academicLevel'])
            ->select('students.*')
            ->join('users', 'users.id', '=', 'students.user_id')
            ->leftJoin('groups', 'group_id', '=', 'groups.id')
            ->leftJoin('attendances', function($join) {
                $join->on('students.id', '=', 'attendances.student_id')
                     ->where('attendances.student_state', '=', 'absence');
            })
            ->groupBy('students.id');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('users.username', 'like', "%{$search}%")
                  ->orWhere('students.first_name', 'like', "%{$search}%")
                  ->orWhere('students.last_name', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    /**
     * Get students with additional data (absence count and latest grade)
     */
    public function getStudentsWithData(string $search = null): array
    {
        $students = $this->getStudentsWithRelations($search);
        
        return $students->map(function($student) {
            $absenceCount = Attendance::where('student_id', $student->id)
                                    ->where('student_state', 'absence')
                                    ->count();
            
            $grade = Grade::where('student_id', $student->id)
                ->orderByDesc('id')
                ->first();
            
            $gradeValue = $grade ? ($grade->control_note . ' / ' . $grade->exam_note) : 'Grade not yet';
            
            return [
                'id' => $student->id,
                'academic_level_id' => $student->academic_level_id,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'group_number' => $student->group ? $student->group->group_number : null,
                'absence' => $absenceCount,
                'current_grade' => $gradeValue
            ];
        })->toArray();
    }

    /**
     * Get students by group
     */
    public function getStudentsByGroup(int $groupId): Collection
    {
        return $this->model->with(['user', 'group', 'academicLevel'])
            ->where('group_id', $groupId)
            ->get();
    }

    /**
     * Get students by academic level
     */
    public function getStudentsByAcademicLevel(int $academicLevelId): Collection
    {
        return $this->model->with(['user', 'group', 'academicLevel'])
            ->where('academic_level_id', $academicLevelId)
            ->get();
    }

    /**
     * Get student with full profile data
     */
    public function getStudentProfile(int $studentId)
    {
        return $this->model->with([
            'user', 
            'group.academicLevel.speciality', 
            'academicLevel.speciality',
            'grades',
            'attendances'
        ])->find($studentId);
    }

    /**
     * Get student attendance statistics
     */
    public function getStudentAttendanceStats(int $studentId): array
    {
        $totalAbsences = Attendance::where('student_id', $studentId)
            ->where('student_state', 'absence')
            ->count();
            
        $totalPresences = Attendance::where('student_id', $studentId)
            ->where('student_state', 'presence')
            ->count();
            
        return [
            'absences' => $totalAbsences,
            'presences' => $totalPresences,
            'total' => $totalAbsences + $totalPresences
        ];
    }
} 