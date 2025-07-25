<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'resource_type',
        'resource_number',
    ];

    // Relationships
    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'class_room_id');
    }

    public function lectures()
    {
        return $this->hasMany(Lecture::class, 'class_room_id');
    }

    public function examSchedules()
    {
        return $this->hasMany(ExamSschedule::class, 'class_room_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    // Resource type constants
    const TYPE_ROOM = 'room';
    const TYPE_LAB = 'lab';
    const TYPE_LECTURE_HALL = 'lecture_hall';
    const TYPE_COMPUTER = 'computer';

    public static function getResourceTypes()
    {
        return [
            self::TYPE_ROOM,
            self::TYPE_LAB,
            self::TYPE_LECTURE_HALL,
            self::TYPE_COMPUTER,
        ];
    }
}
