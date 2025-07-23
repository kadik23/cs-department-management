<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\Teacher;
use App\Models\Group;
use App\Models\Resource;
use App\Models\Subject;
class ScheduleSeeder extends Seeder {
    public function run() {
        $teachers = Teacher::pluck('id')->all();
        $groups = Group::pluck('id')->all();
        $rooms = Resource::pluck('id')->all();
        $subjects = Subject::pluck('id')->all();
        Schedule::insert([
            [
                'class_room_id' => $rooms[0] ?? 1,
                'subject_id' => $subjects[0] ?? 1,
                'teacher_id' => $teachers[0] ?? 1,
                'group_id' => $groups[0] ?? 1,
                'day_of_week' => 1,
                'class_index' => 1,
            ],
            [
                'class_room_id' => $rooms[1] ?? $rooms[0] ?? 1,
                'subject_id' => $subjects[1] ?? $subjects[0] ?? 1,
                'teacher_id' => $teachers[1] ?? $teachers[0] ?? 1,
                'group_id' => $groups[1] ?? $groups[0] ?? 1,
                'day_of_week' => 2,
                'class_index' => 2,
            ],
            [
                'class_room_id' => $rooms[2] ?? $rooms[0] ?? 1,
                'subject_id' => $subjects[2] ?? $subjects[0] ?? 1,
                'teacher_id' => $teachers[2] ?? $teachers[0] ?? 1,
                'group_id' => $groups[2] ?? $groups[0] ?? 1,
                'day_of_week' => 3,
                'class_index' => 3,
            ],
        ]);
    }
} 