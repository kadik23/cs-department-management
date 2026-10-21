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
        'date' => 'date:Y-m-d',
    ];

    protected $appends = [
        'status',
        'notes',
    ];

    public function getStatusAttribute(): string
    {
        $state = strtolower($this->student_state ?? '');
        if ($state === 'absence' || $state === 'absent') {
            return self::STATE_ABSENT;
        }
        if ($state === 'presence' || $state === 'present') {
            return self::STATE_PRESENT;
        }
        if ($state === 'late' || $state === 'retard') {
            return self::STATE_LATE;
        }
        if ($state === 'excused' || $state === 'justifie') {
            return self::STATE_EXCUSED;
        }
        return $state ?: self::STATE_PRESENT;
    }

    public function getNotesAttribute(): string
    {
        return match ($this->status) {
            self::STATE_PRESENT => 'Attended class',
            self::STATE_LATE => 'Arrived 15m late',
            self::STATE_EXCUSED => 'Medical certificate',
            self::STATE_ABSENT => 'Unjustified absence',
            default => 'Regular session',
        };
    }

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
