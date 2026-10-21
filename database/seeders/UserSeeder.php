<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $password = Hash::make('password');
        $now = now();

        $users = [
            // Admin
            [
                'username' => 'admin',
                'email' => 'admin@example.com',
                'first_name' => 'System',
                'last_name' => 'Administrator',
                'phone_number' => '+213-555-0100',
                'location' => 'Medea, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // Teachers
            [
                'username' => 'teacher',
                'email' => 'teacher@example.com',
                'first_name' => 'Robert',
                'last_name' => 'Martin',
                'phone_number' => '+213-555-0201',
                'location' => 'Algiers, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'teacher1',
                'email' => 'teacher1@example.com',
                'first_name' => 'Grace',
                'last_name' => 'Hopper',
                'phone_number' => '+213-555-0202',
                'location' => 'Medea, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'teacher2',
                'email' => 'teacher2@example.com',
                'first_name' => 'Alan',
                'last_name' => 'Turing',
                'phone_number' => '+213-555-0203',
                'location' => 'Blida, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'teacher3',
                'email' => 'teacher3@example.com',
                'first_name' => 'Ada',
                'last_name' => 'Lovelace',
                'phone_number' => '+213-555-0204',
                'location' => 'Algiers, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'teacher4',
                'email' => 'teacher4@example.com',
                'first_name' => 'Donald',
                'last_name' => 'Knuth',
                'phone_number' => '+213-555-0205',
                'location' => 'Medea, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // Students
            [
                'username' => 'student',
                'email' => 'student@example.com',
                'first_name' => 'Student',
                'last_name' => 'One',
                'phone_number' => '+213-555-0301',
                'location' => 'Medea, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student1',
                'email' => 'student1@example.com',
                'first_name' => 'Karim',
                'last_name' => 'Benali',
                'phone_number' => '+213-555-0302',
                'location' => 'Medea, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student2',
                'email' => 'student2@example.com',
                'first_name' => 'Amina',
                'last_name' => 'Mansouri',
                'phone_number' => '+213-555-0303',
                'location' => 'Blida, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student3',
                'email' => 'student3@example.com',
                'first_name' => 'Yacine',
                'last_name' => 'Brahimi',
                'phone_number' => '+213-555-0304',
                'location' => 'Algiers, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student4',
                'email' => 'student4@example.com',
                'first_name' => 'Sarah',
                'last_name' => 'Bouzid',
                'phone_number' => '+213-555-0305',
                'location' => 'Medea, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student5',
                'email' => 'student5@example.com',
                'first_name' => 'Mehdi',
                'last_name' => 'Belkacem',
                'phone_number' => '+213-555-0306',
                'location' => 'Medea, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student6',
                'email' => 'student6@example.com',
                'first_name' => 'Lina',
                'last_name' => 'Haddad',
                'phone_number' => '+213-555-0307',
                'location' => 'Tipaza, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student7',
                'email' => 'student7@example.com',
                'first_name' => 'Sofiane',
                'last_name' => 'Dahmani',
                'phone_number' => '+213-555-0308',
                'location' => 'Blida, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student8',
                'email' => 'student8@example.com',
                'first_name' => 'Nour',
                'last_name' => 'Saidi',
                'phone_number' => '+213-555-0309',
                'location' => 'Algiers, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student9',
                'email' => 'student9@example.com',
                'first_name' => 'Walid',
                'last_name' => 'Khelil',
                'phone_number' => '+213-555-0310',
                'location' => 'Medea, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student10',
                'email' => 'student10@example.com',
                'first_name' => 'Rania',
                'last_name' => 'Amrani',
                'phone_number' => '+213-555-0311',
                'location' => 'Medea, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student11',
                'email' => 'student11@example.com',
                'first_name' => 'Anis',
                'last_name' => 'Hamidi',
                'phone_number' => '+213-555-0312',
                'location' => 'Boumerdes, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'username' => 'student12',
                'email' => 'student12@example.com',
                'first_name' => 'Meriem',
                'last_name' => 'Zerrouki',
                'phone_number' => '+213-555-0313',
                'location' => 'Algiers, Algeria',
                'password' => $password,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['username' => $userData['username']],
                $userData
            );
        }
    }
}