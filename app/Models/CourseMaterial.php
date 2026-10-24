<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseMaterial extends Model
{
    use HasFactory;

    const TYPE_COURS = 'cours';
    const TYPE_TD = 'td';
    const TYPE_TP = 'tp';
    const TYPE_EXAM = 'exam';

    protected $fillable = [
        'subject_id',
        'teacher_id',
        'academic_level_id',
        'group_id',
        'type',
        'chapter_title',
        'description',
        'file_path',
        'file_name',
        'file_size',
        'file_mime',
        'download_count',
    ];

    protected $appends = [
        'formatted_size',
        'file_extension',
    ];

    // Relationships
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function academicLevel()
    {
        return $this->belongsTo(AcademicLevel::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // Accessors
    public function getFormattedSizeAttribute()
    {
        $bytes = (int) $this->file_size;
        if ($bytes <= 0) return '0 B';
        $units = ['B', 'KB', 'MB', 'GB'];
        $power = floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);
        $size = $bytes / pow(1024, $power);
        return round($size, 1) . ' ' . $units[$power];
    }

    public function getFileExtensionAttribute()
    {
        return strtolower(pathinfo($this->file_name, PATHINFO_EXTENSION));
    }

    // Scopes
    public function scopeForStudent($query, $student)
    {
        return $query->where(function ($q) use ($student) {
            $q->whereNull('academic_level_id')
              ->orWhere('academic_level_id', $student->academic_level_id);
        })->where(function ($q) use ($student) {
            $q->whereNull('group_id')
              ->orWhere('group_id', $student->group_id);
        });
    }
}
