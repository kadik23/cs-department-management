<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\ExamsSchedule;
use App\Models\Resource;
use App\Models\Subject;
use App\Models\Group;
class ExamsScheduleSeeder extends Seeder {
    public function run() {
        $rooms = Resource::pluck('id')->all();
        $subjects = Subject::pluck('id')->all();
        $groups = Group::pluck('id')->all();
        ExamsSchedule::insert([
            [
                'class_room_id' => $rooms[0] ?? 1,
                'subject_id' => $subjects[0] ?? 1,
                'group_id' => $groups[0] ?? 1,
                'date' => '2024-07-01',
                'class_index' => 1,
            ],
            [
                'class_room_id' => $rooms[1] ?? $rooms[0] ?? 1,
                'subject_id' => $subjects[1] ?? $subjects[0] ?? 1,
                'group_id' => $groups[1] ?? $groups[0] ?? 1,
                'date' => '2024-07-10',
                'class_index' => 2,
            ],
            [
                'class_room_id' => $rooms[2] ?? $rooms[0] ?? 1,
                'subject_id' => $subjects[2] ?? $subjects[0] ?? 1,
                'group_id' => $groups[2] ?? $groups[0] ?? 1,
                'date' => '2024-07-15',
                'class_index' => 3,
            ],
        ]);
    }
} 