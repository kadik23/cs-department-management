<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Announcement;
use App\Models\User;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();
        if (!$admin) {
            return;
        }

        Announcement::updateOrCreate(
            ['title' => 'End of Semester 1 Exam Schedule & Deliberation Guidelines'],
            [
                'author_id' => $admin->id,
                'content' => "Dear Students and Faculty members,\n\nThe definitive exam schedule for Semester 1 (2026/2027) has been published on the portal. Please ensure you check your respective amphitheaters and exam timings at least 30 minutes prior to session commencement.\n\nStudents must bring their student card and adhere strictly to department examination regulations.",
                'priority' => 'urgent',
                'category' => 'exam',
                'target_audience' => 'all',
                'academic_level_id' => null,
                'is_pinned' => true,
                'published_at' => now(),
            ]
        );

        Announcement::updateOrCreate(
            ['title' => 'Practical Labs (TP) Rescheduling for Week 8'],
            [
                'author_id' => $admin->id,
                'content' => "Due to scheduled network maintenance in Computing Lab 3, all Practical Work sessions (TP) scheduled for Tuesday afternoon will be relocated to Lab 1 and Lab 2.\n\nPlease refer to the updated timetable or contact your respective lab instructors for any clarification.",
                'priority' => 'high',
                'category' => 'schedule',
                'target_audience' => 'students',
                'academic_level_id' => null,
                'is_pinned' => false,
                'published_at' => now()->subDay(),
            ]
        );

        Announcement::updateOrCreate(
            ['title' => 'Faculty Council Meeting: Course Evaluation & Grade Deadlines'],
            [
                'author_id' => $admin->id,
                'content' => "Dear Professors and Instructors,\n\nA department council meeting is scheduled for this Thursday at 10:00 AM in Conference Room A. The agenda will cover continuous evaluation deadlines, attendance reports verification, and exam paper submissions.",
                'priority' => 'normal',
                'category' => 'academic',
                'target_audience' => 'teachers',
                'academic_level_id' => null,
                'is_pinned' => false,
                'published_at' => now()->subDays(2),
            ]
        );
    }
}
