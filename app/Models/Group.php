<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_number',
        'responsible',
        'academic_level_id',
    ];

    // Relationships
    public function responsibleUser()
    {
        return $this->belongsTo(User::class, 'responsible');
    }

    public function academicLevel()
    {
        return $this->belongsTo(AcademicLevel::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function examSchedules()
    {
        return $this->hasMany(ExamsSchedule::class);
    }
}
