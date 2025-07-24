<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function lectures()
    {
        return $this->hasMany(Lecture::class);
    }

    public function subjects()
    {
        return $this->hasManyThrough(
            Subject::class,
            Schedule::class,
            'teacher_id',
            'id',
            'id',
            'subject_id'
        );
    }
}
