<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('About');
});

Route::get('/counter', function () {
    return Inertia::render('Counter');
});


Route::prefix('admin')->middleware(['auth'])->group(function () { 
    Route::get('/', [App\Http\Controllers\AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/accounts', [App\Http\Controllers\AdminAccountsController::class, 'index'])->name('admin.accounts');
    Route::post('/accounts', [App\Http\Controllers\AdminAccountsController::class, 'store'])->name('admin.accounts.store');
    Route::delete('/accounts/{id}', [App\Http\Controllers\AdminAccountsController::class, 'destroy'])->name('admin.accounts.destroy');
    
    Route::get('/students', [App\Http\Controllers\AdminStudentsController::class, 'index'])->name('admin.students');
    Route::get('/students/groups', [App\Http\Controllers\AdminStudentsController::class, 'getGroups'])->name('admin.students.groups');
    Route::post('/students/assign-group', [App\Http\Controllers\AdminStudentsController::class, 'assignGroup'])->name('admin.students.assign-group');
    
    Route::get('/groups', [App\Http\Controllers\AdminGroupsController::class, 'index'])->name('admin.groups');
    Route::post('/groups', [App\Http\Controllers\AdminGroupsController::class, 'store'])->name('admin.groups.store');
    Route::put('/groups/{id}', [App\Http\Controllers\AdminGroupsController::class, 'update'])->name('admin.groups.update');
    Route::delete('/groups/{id}', [App\Http\Controllers\AdminGroupsController::class, 'destroy'])->name('admin.groups.destroy');
    
    Route::get('/subjects', [App\Http\Controllers\AdminSubjectsController::class, 'index'])->name('admin.subjects');
    Route::post('/subjects', [App\Http\Controllers\AdminSubjectsController::class, 'store'])->name('admin.subjects.store');
    Route::put('/subjects/{id}', [App\Http\Controllers\AdminSubjectsController::class, 'update'])->name('admin.subjects.update');
    Route::delete('/subjects/{id}', [App\Http\Controllers\AdminSubjectsController::class, 'destroy'])->name('admin.subjects.destroy');
    
    Route::get('/specialities', [App\Http\Controllers\AdminSpecialitiesController::class, 'index'])->name('admin.specialities');
    Route::post('/specialities', [App\Http\Controllers\AdminSpecialitiesController::class, 'store'])->name('admin.specialities.store');
    Route::put('/specialities/{id}', [App\Http\Controllers\AdminSpecialitiesController::class, 'update'])->name('admin.specialities.update');
    Route::delete('/specialities/{id}', [App\Http\Controllers\AdminSpecialitiesController::class, 'destroy'])->name('admin.specialities.destroy');
    
    Route::get('/resources', [App\Http\Controllers\AdminResourcesController::class, 'index'])->name('admin.resources');
    Route::post('/resources', [App\Http\Controllers\AdminResourcesController::class, 'store'])->name('admin.resources.store');
    Route::put('/resources/{id}', [App\Http\Controllers\AdminResourcesController::class, 'update'])->name('admin.resources.update');
    Route::delete('/resources/{id}', [App\Http\Controllers\AdminResourcesController::class, 'destroy'])->name('admin.resources.destroy');
    
    Route::get('/schedules', [App\Http\Controllers\AdminSchedulesController::class, 'index'])->name('admin.schedules');
    Route::post('/schedules', [App\Http\Controllers\AdminSchedulesController::class, 'store'])->name('admin.schedules.store');
    Route::put('/schedules/{id}', [App\Http\Controllers\AdminSchedulesController::class, 'update'])->name('admin.schedules.update');
    Route::delete('/schedules/{id}', [App\Http\Controllers\AdminSchedulesController::class, 'destroy'])->name('admin.schedules.destroy');
    
    Route::get('/lectures', [App\Http\Controllers\AdminLecturesController::class, 'index'])->name('admin.lectures');
    Route::post('/lectures', [App\Http\Controllers\AdminLecturesController::class, 'store'])->name('admin.lectures.store');
    Route::put('/lectures/{id}', [App\Http\Controllers\AdminLecturesController::class, 'update'])->name('admin.lectures.update');
    Route::delete('/lectures/{id}', [App\Http\Controllers\AdminLecturesController::class, 'destroy'])->name('admin.lectures.destroy');
    
    Route::get('/exams', [App\Http\Controllers\AdminExamsController::class, 'index'])->name('admin.exams');
    Route::post('/exams', [App\Http\Controllers\AdminExamsController::class, 'store'])->name('admin.exams.store');
    Route::put('/exams/{id}', [App\Http\Controllers\AdminExamsController::class, 'update'])->name('admin.exams.update');
    Route::delete('/exams/{id}', [App\Http\Controllers\AdminExamsController::class, 'destroy'])->name('admin.exams.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/student', [StudentController::class, 'dashboard'])->name('student.dashboard');
    Route::get('/student/schedule', [StudentController::class, 'schedule'])->name('student.schedule');
    Route::get('/student/notes', [StudentController::class, 'notes'])->name('student.notes');
    Route::get('/student/exams', [StudentController::class, 'exams'])->name('student.exams');
});

// Auth routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');
Route::get('/me', [AuthController::class, 'me'])->middleware('auth')->name('me');

Route::get('/flash', function () {
    return redirect()->route('home')->with('message', 'This is a success flash message!');
});

