<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\AcademicLevel;
class GroupSeeder extends Seeder {
    public function run() {
        $levels = AcademicLevel::pluck('id', 'level');
        Group::insert([
            ['group_number' => 1, 'responsible' => 1, 'academic_level_id' => $levels[1] ?? $levels->first()],
            ['group_number' => 2, 'responsible' => 1, 'academic_level_id' => $levels[2] ?? $levels->skip(1)->first()],
            ['group_number' => 3, 'responsible' => 1, 'academic_level_id' => $levels[3] ?? $levels->skip(2)->first()],
        ]);
    }
} 