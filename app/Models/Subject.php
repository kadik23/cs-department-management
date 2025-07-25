<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_name',
        'coefficient',
        'credit',
    ];

    // Relationships
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function lectures()
    {
        return $this->hasMany(Lecture::class);
    }

    public function examSchedules()
    {
        return $this->hasMany(ExamsSchedule::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function teachers()
    {
        return $this->hasManyThrough(
            Teacher::class,
            Schedule::class,
            'subject_id', // Foreign key on schedules table...
            'id',         // Foreign key on teachers table...
            'id',         // Local key on subjects table...
            'teacher_id'  // Local key on schedules table...
        );
    }

    // Add this only if subjects table has a teacher_id column
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
