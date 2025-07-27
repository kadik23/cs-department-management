<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\BaseRepository;
use App\Repositories\StudentRepository;
use App\Repositories\GroupRepository;
use App\Repositories\SpecialityRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\LectureRepository;
use App\Repositories\UserRepository;
use App\Repositories\ResourceRepository;
use App\Repositories\ExamsScheduleRepository;
use App\Repositories\ScheduleRepository;
use App\Repositories\TeacherRepository;
use App\Models\Student;
use App\Models\Group;
use App\Models\Speciality;
use App\Models\Subject;
use App\Models\Lecture;
use App\Models\User;
use App\Models\Resource;
use App\Models\ExamsSchedule;
use App\Models\Schedule;
use App\Models\Teacher;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(StudentRepository::class, function ($app) {
            return new StudentRepository(new Student());
        });

        $this->app->bind(GroupRepository::class, function ($app) {
            return new GroupRepository(new Group());
        });

        $this->app->bind(SpecialityRepository::class, function ($app) {
            return new SpecialityRepository(new Speciality());
        });

        $this->app->bind(SubjectRepository::class, function ($app) {
            return new SubjectRepository(new Subject());
        });

        $this->app->bind(LectureRepository::class, function ($app) {
            return new LectureRepository(new Lecture());
        });

        $this->app->bind(UserRepository::class, function ($app) {
            return new UserRepository(new User());
        });

        $this->app->bind(ResourceRepository::class, function ($app) {
            return new ResourceRepository(new Resource());
        });

        $this->app->bind(ExamsScheduleRepository::class, function ($app) {
            return new ExamsScheduleRepository(new ExamsSchedule());
        });

        $this->app->bind(ScheduleRepository::class, function ($app) {
            return new ScheduleRepository(new Schedule());
        });

        $this->app->bind(TeacherRepository::class, function ($app) {
            return new TeacherRepository(new Teacher());
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
} 