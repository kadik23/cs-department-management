<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExamsSchedule;
use App\Models\Resource;
use App\Models\Subject;
use App\Models\Group;
use Carbon\Carbon;

class ExamsScheduleSeeder extends Seeder
{
    public function run()
    {
        $rooms = Resource::all();
        $subjects = Subject::all();
        $groups = Group::all();

        if ($rooms->isEmpty() || $subjects->isEmpty() || $groups->isEmpty()) {
            return;
        }

        $now = Carbon::now();

        // Seed exams for Group 1 (student's group) and other groups
        $examPlan = [
            // Group 1 exams (next 10-25 days)
            ['group_idx' => 0, 'subj_idx' => 0, 'room_idx' => 0, 'days_ahead' => 7, 'period' => 1],  // Algo - Amphi 1
            ['group_idx' => 0, 'subj_idx' => 1, 'room_idx' => 1, 'days_ahead' => 10, 'period' => 2], // OOP - Amphi 2
            ['group_idx' => 0, 'subj_idx' => 2, 'room_idx' => 0, 'days_ahead' => 14, 'period' => 1], // DBMS - Amphi 1
            ['group_idx' => 0, 'subj_idx' => 4, 'room_idx' => 2, 'days_ahead' => 17, 'period' => 2], // OS - Amphi 3
            ['group_idx' => 0, 'subj_idx' => 3, 'room_idx' => 1, 'days_ahead' => 21, 'period' => 1], // Networks - Amphi 2
            ['group_idx' => 0, 'subj_idx' => 7, 'room_idx' => 6, 'days_ahead' => 24, 'period' => 2], // SE - Room 201

            // Group 2 exams
            ['group_idx' => 1, 'subj_idx' => 0, 'room_idx' => 1, 'days_ahead' => 8, 'period' => 1],
            ['group_idx' => 1, 'subj_idx' => 1, 'room_idx' => 2, 'days_ahead' => 11, 'period' => 2],
            ['group_idx' => 1, 'subj_idx' => 3, 'room_idx' => 0, 'days_ahead' => 15, 'period' => 1],
            ['group_idx' => 1, 'subj_idx' => 5, 'room_idx' => 7, 'days_ahead' => 18, 'period' => 2],

            // Group 3 exams
            ['group_idx' => 2, 'subj_idx' => 6, 'room_idx' => 0, 'days_ahead' => 9, 'period' => 1],
            ['group_idx' => 2, 'subj_idx' => 8, 'room_idx' => 1, 'days_ahead' => 12, 'period' => 2],
            ['group_idx' => 2, 'subj_idx' => 10, 'room_idx' => 2, 'days_ahead' => 16, 'period' => 1],
        ];

        foreach ($examPlan as $e) {
            $grp = $groups[$e['group_idx'] % $groups->count()];
            $rm = $rooms[$e['room_idx'] % $rooms->count()];
            $sbj = $subjects[$e['subj_idx'] % $subjects->count()];
            $date = $now->copy()->addDays($e['days_ahead'])->toDateString();

            ExamsSchedule::updateOrCreate(
                [
                    'group_id' => $grp->id,
                    'subject_id' => $sbj->id,
                    'date' => $date,
                ],
                [
                    'class_room_id' => $rm->id,
                    'class_index' => $e['period'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
} 