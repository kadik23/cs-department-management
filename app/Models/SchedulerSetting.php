<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchedulerSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_duration',
        'first_class_start_at',
    ];

    protected $casts = [
        'first_class_start_at' => 'datetime:H:i',
    ];
}
