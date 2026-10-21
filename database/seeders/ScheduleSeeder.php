<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\Teacher;
use App\Models\Group;
use App\Models\Resource;
use App\Models\Subject;

class ScheduleSeeder extends Seeder
{
    public function run()
    {
        $teachers = Teacher::all();
        $groups = Group::all();
        $rooms = Resource::all();
        $subjects = Subject::all();

        if ($teachers->isEmpty() || $groups->isEmpty() || $rooms->isEmpty() || $subjects->isEmpty()) {
            return;
        }

        // Days: 0 (Sunday) to 4 (Thursday) - Algerian academic week
        // Periods: 1 (08:00), 2 (09:30), 3 (11:00), 4 (13:00), 5 (14:30)
        $scheduleData = [
            // Group 1 (L1 Software Engineering) - Student One's group!
            ['group_idx' => 0, 'day' => 0, 'period' => 1, 'subj_idx' => 0, 'teacher_idx' => 0, 'room_idx' => 0], // Algo - Dr. Martin - Amphi 1
            ['group_idx' => 0, 'day' => 0, 'period' => 2, 'subj_idx' => 1, 'teacher_idx' => 1, 'room_idx' => 3], // OOP - Dr. Hopper - Lab 101
            ['group_idx' => 0, 'day' => 1, 'period' => 1, 'subj_idx' => 2, 'teacher_idx' => 2, 'room_idx' => 6], // DBMS - Dr. Turing - Room 201
            ['group_idx' => 0, 'day' => 1, 'period' => 3, 'subj_idx' => 4, 'teacher_idx' => 3, 'room_idx' => 7], // OS - Dr. Lovelace - Room 202
            ['group_idx' => 0, 'day' => 2, 'period' => 1, 'subj_idx' => 3, 'teacher_idx' => 4, 'room_idx' => 4], // Networks - Dr. Knuth - Lab 102
            ['group_idx' => 0, 'day' => 2, 'period' => 2, 'subj_idx' => 5, 'teacher_idx' => 0, 'room_idx' => 8], // Web - Dr. Martin - Room 203
            ['group_idx' => 0, 'day' => 3, 'period' => 2, 'subj_idx' => 9, 'teacher_idx' => 1, 'room_idx' => 0], // Math - Dr. Hopper - Amphi 1
            ['group_idx' => 0, 'day' => 3, 'period' => 4, 'subj_idx' => 7, 'teacher_idx' => 2, 'room_idx' => 6], // SE & UML - Dr. Turing - Room 201
            ['group_idx' => 0, 'day' => 4, 'period' => 1, 'subj_idx' => 0, 'teacher_idx' => 3, 'room_idx' => 3], // Algo Lab - Dr. Lovelace - Lab 101
            ['group_idx' => 0, 'day' => 4, 'period' => 3, 'subj_idx' => 6, 'teacher_idx' => 4, 'room_idx' => 1], // AI - Dr. Knuth - Amphi 2

            // Group 2
            ['group_idx' => 1, 'day' => 0, 'period' => 3, 'subj_idx' => 0, 'teacher_idx' => 1, 'room_idx' => 1],
            ['group_idx' => 1, 'day' => 0, 'period' => 4, 'subj_idx' => 2, 'teacher_idx' => 3, 'room_idx' => 7],
            ['group_idx' => 1, 'day' => 1, 'period' => 2, 'subj_idx' => 1, 'teacher_idx' => 0, 'room_idx' => 3],
            ['group_idx' => 1, 'day' => 2, 'period' => 3, 'subj_idx' => 4, 'teacher_idx' => 2, 'room_idx' => 6],
            ['group_idx' => 1, 'day' => 3, 'period' => 1, 'subj_idx' => 3, 'teacher_idx' => 4, 'room_idx' => 4],
            ['group_idx' => 1, 'day' => 4, 'period' => 2, 'subj_idx' => 5, 'teacher_idx' => 0, 'room_idx' => 8],

            // Group 3
            ['group_idx' => 2, 'day' => 0, 'period' => 2, 'subj_idx' => 6, 'teacher_idx' => 2, 'room_idx' => 2],
            ['group_idx' => 2, 'day' => 1, 'period' => 4, 'subj_idx' => 8, 'teacher_idx' => 4, 'room_idx' => 9],
            ['group_idx' => 2, 'day' => 2, 'period' => 2, 'subj_idx' => 10, 'teacher_idx' => 1, 'room_idx' => 5],
            ['group_idx' => 2, 'day' => 3, 'period' => 3, 'subj_idx' => 11, 'teacher_idx' => 3, 'room_idx' => 3],
        ];

        foreach ($scheduleData as $s) {
            $grp = $groups[$s['group_idx'] % $groups->count()];
            $tchr = $teachers[$s['teacher_idx'] % $teachers->count()];
            $rm = $rooms[$s['room_idx'] % $rooms->count()];
            $sbj = $subjects[$s['subj_idx'] % $subjects->count()];

            Schedule::updateOrCreate(
                [
                    'group_id' => $grp->id,
                    'day_of_week' => $s['day'],
                    'class_index' => $s['period'],
                ],
                [
                    'class_room_id' => $rm->id,
                    'subject_id' => $sbj->id,
                    'teacher_id' => $tchr->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
} 