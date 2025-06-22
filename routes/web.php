<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('About');
});

Route::get('/flash', function () {
    return redirect()->route('home')->with('message', 'This is a success flash message!');
});

