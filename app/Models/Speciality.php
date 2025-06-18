<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Speciality extends Model
{
    use HasFactory;

    protected $fillable = [
        'speciality_name',
    ];

    // Relationships
    public function academicLevels()
    {
        return $this->hasMany(AcademicLevel::class);
    }
}
