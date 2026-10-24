<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id',
        'title',
        'content',
        'priority',
        'category',
        'target_audience',
        'academic_level_id',
        'is_pinned',
        'published_at',
        'expires_at',
        'attachment_path',
        'attachment_name',
        'attachment_size',
        'attachment_mime',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_size',
        'file_extension',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function academicLevel()
    {
        return $this->belongsTo(AcademicLevel::class, 'academic_level_id');
    }

    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

    public function scopePinnedFirst($query)
    {
        return $query->orderByDesc('is_pinned')->orderByDesc('published_at');
    }

    public function scopeForStudent($query, $student)
    {
        return $query->where(function ($q) use ($student) {
            $q->where('target_audience', 'all')
              ->orWhere(function ($sq) use ($student) {
                  $sq->where('target_audience', 'students');
                  if ($student && $student->academic_level_id) {
                      $sq->where(function ($ssq) use ($student) {
                          $ssq->whereNull('academic_level_id')
                              ->orWhere('academic_level_id', $student->academic_level_id);
                      });
                  }
              });
        });
    }

    public function scopeForTeacher($query)
    {
        return $query->whereIn('target_audience', ['all', 'teachers']);
    }

    public function getFormattedSizeAttribute()
    {
        if (!$this->attachment_size) {
            return null;
        }

        $bytes = $this->attachment_size;
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . ' MB';
        }
        if ($bytes >= 1024) {
            return round($bytes / 1024, 1) . ' KB';
        }
        return $bytes . ' B';
    }

    public function getFileExtensionAttribute()
    {
        if (!$this->attachment_name) {
            return null;
        }
        return strtolower(pathinfo($this->attachment_name, PATHINFO_EXTENSION));
    }
}
