<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lecture;
use App\Models\Teacher;
use App\Models\AcademicLevel;
use App\Models\Resource;
use App\Models\Subject;

class LectureSeeder extends Seeder
{
    public function run()
    {
        $teachers = Teacher::all();
        $levels = AcademicLevel::all();
        $amphis = Resource::where('resource_type', 'Amphi')->get();
        if ($amphis->isEmpty()) {
            $amphis = Resource::all();
        }
        $subjects = Subject::all();

        if ($teachers->isEmpty() || $levels->isEmpty() || $amphis->isEmpty() || $subjects->isEmpty()) {
            return;
        }

        $lectureData = [
            // Level 0 (L1 Software Eng)
            ['lvl_idx' => 0, 'day' => 0, 'period' => 1, 'subj_idx' => 0, 'teacher_idx' => 0, 'room_idx' => 0], // Algo - Dr. Martin - Amphi 1
            ['lvl_idx' => 0, 'day' => 1, 'period' => 2, 'subj_idx' => 4, 'teacher_idx' => 3, 'room_idx' => 1], // OS - Dr. Lovelace - Amphi 2
            ['lvl_idx' => 0, 'day' => 2, 'period' => 1, 'subj_idx' => 9, 'teacher_idx' => 1, 'room_idx' => 0], // Math - Dr. Hopper - Amphi 1
            ['lvl_idx' => 0, 'day' => 3, 'period' => 3, 'subj_idx' => 2, 'teacher_idx' => 2, 'room_idx' => 2], // DBMS - Dr. Turing - Amphi 3

            // Level 1 (L2 Software Eng)
            ['lvl_idx' => 1, 'day' => 0, 'period' => 2, 'subj_idx' => 1, 'teacher_idx' => 1, 'room_idx' => 1],
            ['lvl_idx' => 1, 'day' => 2, 'period' => 3, 'subj_idx' => 3, 'teacher_idx' => 4, 'room_idx' => 2],
            ['lvl_idx' => 1, 'day' => 4, 'period' => 1, 'subj_idx' => 7, 'teacher_idx' => 2, 'room_idx' => 0],

            // Level 2 (L3 Software Eng)
            ['lvl_idx' => 2, 'day' => 1, 'period' => 1, 'subj_idx' => 6, 'teacher_idx' => 4, 'room_idx' => 0],
            ['lvl_idx' => 2, 'day' => 3, 'period' => 2, 'subj_idx' => 8, 'teacher_idx' => 3, 'room_idx' => 1],
        ];

        foreach ($lectureData as $l) {
            $lvl = $levels[$l['lvl_idx'] % $levels->count()];
            $tchr = $teachers[$l['teacher_idx'] % $teachers->count()];
            $rm = $amphis[$l['room_idx'] % $amphis->count()];
            $sbj = $subjects[$l['subj_idx'] % $subjects->count()];

            Lecture::updateOrCreate(
                [
                    'academic_level_id' => $lvl->id,
                    'day_of_week' => $l['day'],
                    'class_index' => $l['period'],
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