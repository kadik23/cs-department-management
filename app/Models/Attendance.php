<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'student_state',
        'date',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    // Student state constants
    const STATE_PRESENT = 'present';
    const STATE_ABSENT = 'absent';
    const STATE_LATE = 'late';
    const STATE_EXCUSED = 'excused';

    public static function getStudentStates()
    {
        return [
            self::STATE_PRESENT,
            self::STATE_ABSENT,
            self::STATE_LATE,
            self::STATE_EXCUSED,
        ];
    }
}
