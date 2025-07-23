<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'speciality_id',
        'level',
    ];

    // Relationships
    public function speciality()
    {
        return $this->belongsTo(Speciality::class);
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function lectures()
    {
        return $this->hasMany(Lecture::class);
    }
}
