<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\User;
use App\Models\AcademicLevel;
use App\Models\Group;
class UserSeeder extends Seeder {
    public function run() {
        $users = User::pluck('id', 'username');
        $levels = AcademicLevel::pluck('id', 'level');
        $groups = Group::pluck('id', 'group_number');
        User::insert([
            [
                'username' => 'admin',
                'email' => 'admin@example.com',
                'first_name' => 'Admin',
                'last_name' => 'User',
                'phone_number' => '123-456-7890',
                'location' => 'Location 1',
                'password' => bcrypt('password'),
            ],
            [
                'username' => 'student',
                'email' => 'student@example.com',
                'first_name' => 'Student',
                'last_name' => 'One',
                'phone_number' => '123-456-7890',
                'location' => 'Location 1',
                'password' => bcrypt('password'),
            ],
            [
                'username' => 'student1',
                'email' => 'student1@example.com',
                'first_name' => 'Student',
                'last_name' => 'One',
                'phone_number' => '123-456-7890',
                'location' => 'Location 1',
                'password' => bcrypt('password'),
            ],
            [
                'username' => 'student2',
                'email' => 'student2@example.com',
                'first_name' => 'Student',
                'last_name' => 'Two',
                'phone_number' => '123-456-7890',
                'location' => 'Location 2',
                'password' => bcrypt('password'),
            ],
            [
                'username' => 'student3',
                'email' => 'student3@example.com',
                'first_name' => 'Student',
                'last_name' => 'Three',
                'phone_number' => '123-456-7890',
                'location' => 'Location 3',
                'password' => bcrypt('password'),
            ],
             [
                'username' => 'teacher1',
                'email' => 'teacher1@example.com',
                'first_name' => 'Teacher',
                'last_name' => 'One',
                'phone_number' => '123-456-7890',
                'location' => 'Location 1',
                'password' => bcrypt('password'),
            ], 
            [
                'username' => 'teacher2',
                'email' => 'teacher2@example.com',
                'first_name' => 'Teacher',
                'last_name' => 'Two',
                'phone_number' => '123-456-7890',
                'location' => 'Location 2',
                'password' => bcrypt('password'),
            ],
            [
                'username' => 'teacher3',
                'email' => 'teacher3@example.com',
                'first_name' => 'Teacher',
                'last_name' => 'Three',
                'phone_number' => '123-456-7890',
                'location' => 'Location 3',
                'password' => bcrypt('password'),
            ],
        ]);
    }
}