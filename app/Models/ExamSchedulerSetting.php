<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamSchedulerSetting extends Model
{
    use HasFactory;

    protected $table = 'exams_scheduler_settings';

    protected $fillable = [
        'exam_duration',
        'first_exam_start_at',
    ];

    protected $casts = [
        'first_exam_start_at' => 'datetime:H:i',
    ];
}
